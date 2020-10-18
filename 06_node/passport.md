# passport.js

## passport + 서버 세션 로그인 구현

### 동작

- 서버: 로그인해서 접속한 브라우저 정보를 세션에 저장, 세션 아이디를 브라우져에게 **쿠키로 전달**
- 브라우져 : 쿠키에 담긴 세션 아이디를 저장, 다음 요청부터는 헤더에 세션 아이디를 담아 서버로 전송
- 서버 : 이 세션 아이디 값을 가지고 이전에 접속한 브라우저임을 식별 가능

### express-session

- 세션 미들웨어를 선언하면 req.session으로 세션에 접근할 수 있다.
- 세션에 정보를 넣고싶으면 객체처럼 프로퍼티로 넣어줄 수 있다.
- 여기서 주체가 req이라 좀 헷갈리는데, req.session을 업뎃하면 서버에도 정보가 저장되는 거시다
- session store의 default는 memory store => 메모리는 서버나 클라이언트를 껏다키면 사라지는 휘발성
- 앱을 재가동하여도 세션이 사라지게 하고 싶지 않으면 Redis같은 인메모리 DB를 사용해야한다. 세션을 디비에 넣는게 좋을 때는 세션의 정보를 공유해야할때, MSA 라면 복수 서버 환경에서 세션 정보 공유를 가능하게 하는게 맞기때무네
- 세션 자체가 일단 쿠키를 이용하는 거시다
- 저장하는데 몽고디비, redis 같은거 쓸수도 있다
- 로그인시 - 세션 생성/로그아웃시 - 세션 파괴
- 쿠키에는 세션 ID만을 저장하는 방식 - 쿠키에 정보를 많이 남기는게 별로라서

```js
import session from "express-session"

app.use(
  session({
    name: "mysession", // 쿠키에 저장될 세션키 이름
    secret: "qwer1234", // 세션 암호화를 위한 시크릿
    resave: true, // 세션을 항상 저장할지 여부를 정하는 값
    saveUninitialize: true, // 초기화되지 않은채 스토어에 저장되는 세션
    store: new RedisStore({}) // 스토어의 종류 - redis
  })
)
```

## passport 모듈같은 클래스를 만들어보기

### 로그인 기능(authenticate)

```js
class MyPassport {
  // 세션에 저장할 인증정보 키
  readonly key = "userId"

  // 로그인
  authenticate() {
    // 미들웨어 함수를 반환한다
    return (req, res, next) => {
      try {
        // username, password로 디비에서 유저를 찾는다
        const { username, password } = req.body
        const user = users.filter(u => u.identify(username, password))[0]

        // 유저가 없으면 401 Unauthorized 를 응답한다
        if (!user) return res.sendStatus(401)

        //! 유저를 찾으면 세션에 userId를 저장한다
        // req에 저장
        // 세션에 인증정보 저장 + 아이디만 저장
        req.session[this.key] = user.id

        // 다음 미들웨어를 실행한다
        next()
      } catch (err) {
        // 로그인 과정중 에러가 발생하면 에러 미들웨어를 실행한다
        return next(err)
      }
    }
  }
}

// 싱글톤 => 곧장 인스턴스 만들기
export default new MyPassport()
```

로그인 컨트롤러에 적용하면

```js
app.post(
  "/login",
  // 인증 미들웨어를 추가 => 세션 처리하거나 or 에러뿜뿜
  mypassport.authenticate(),
  (req, res) => res.send("로그인 성공")
)
```

### 세션에서 로그인 상태 복구

컨트롤러에서 req에 session안에 유저 접근 정보가 있을 경우 req.user에 할당해서 관리하게끔 하는 로직

```js
class MyPassport {
  // 세션의 로그인 정보를 복구한다
  session() {
    return (req, res, next) => {
      try {
        // 세션을 먼저 파싱한후 다음 미들웨어에서 req.user로 유저 정보에 접근할 수 있게 해주는 미들웨어
        // 세션에 로그인 정보가 있으면
        if (req.session[this.key]) {
          // 유저 식별자로 디비에서 유저를 찾기 시도
          const user = users.filter(u => u.equal(req.session![this.key]))[0]

          // 유저를 찾으면 req.user 에 유저 객체 할당
          if (user) req.user = user
        }

        // 다음 미들웨어 실행
        next()
      } catch (err) {
        // 예외가 발생하면 오류 미들웨어가 처리한다
        next(err)
      }
    }
  }
}

app.use(mypassport.session())
```

### 접근 제한

로그인에 성공한 유저만 접근할 수 있는 엔드포인트 만들기

```js
app.get("/profile", (req, res, next) => {
  // 인증된 유저가 아닐 경우 403
  // session 미들웨어를 거치고 내려와서 req.user로 접근 가능함
  if (!req.user) {
    // 403 Forbidden을 응답한다
    return res.sendStatus(403)
  }

  // req.user 로 프로필을 조회한다
  res.json(ure.user)
})
```

isAutenticated 미들웨어 만들기

```js
// 세션 미들웨어 아래에 위치시켜야 한다
const isAuthenticated = () => (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(403)
  }

  // req.user 가 있을 경우에만 다음 미들웨어를 실행한다
  next()
}

// 아 이런식으로 특정 미들웨어 컨트롤러에 끼워넣는거구나
app.get("/profile", isAuthenticated(), (req, res, next) => {
  res.json(req.user)
})
```

### 로그아웃

세션 데이터를 삭제한다.

```js
class MyPassport {
  // 초기화 메소드 - 초기화 단계에서 req의 메소드로 작성한다
  // 이러면 컨트롤러 로직에서 req만으로 로그아웃 시킬 수 이씀
  initialize() {
    // 미들웨어를 반환
    return (req, res, next) => {
      // 로그아웃 메소드를 req 객체에 추가한다
      req.logout = () => {
        // 세션에 저장된 로그인 데이터를 제거
        delete req.session[this.key]
      }

      // 다음 미들웨어를 수행
      next()
    }
  }
}

app.post("/logout", (req, res, next) => {
  // 세션에서 로그인 정보를 삭제한다.
  req.logout()
})
```

## passport 사용하기 

passport의 initialize, session 메소드는 위에서 코딩했던 것과 똑같이 작동한다.

- initialize: 초기화 작업
- session : 세션 정보를 req._passport에 넣는다

### 전략

- 공통의 인증 로직은 passport가 담당하고 구체적인 방법은 전략이라는 개념으로 분리해 놓았음.
- 유저네임/비밀번호 인증 - passport local/jwt는 passport jwt 등등

### 로컬 전략

```js
// lib/passport.ts

// 로컬 전략을 사용한다
import { Strategy } from "passport-local"

// passport에게 로컬 전략을 사용하라고 한다
// 요청 본문에서 username, password가 넘어온다
passport.use(
  new Strategy({ session: true }, (username, password, done) => {
    try {
      // 데이터베이스에서 일치하는 사용자를 찾는다
      const user = users.filter(u => u.identify(username, password))[0]

      // 콜백함수로 결과를 전달한다. 사용자가 없으면 false를 전달
      done(null, user ? user : false)
    } catch (err) {
      // 예외가 발생하면 콜백함수에 오류를 전달한다
      done(err)
    }
  })
)
```

- strategy 생성자 함수는 옵션 객체와 인증 정보로 사용자를 찾는 콜백을 받는다.
- 세션 사용을 알리는 옵션 객체를 전달했다.
- 콜백함수에서는 요청 바디에서 넘어온 username/password와 일치하는 사용자를 데이터베이스에서 찾는다.
- 사용자를 찾으면 user객체를 넘기고, 그렇지 않으면 false를 전달하여 로그인 실패를 처리한다.
- Strategy 객체를 passport.use()로 등록하면 req._strategies에 등록된 데이터를 기록한다.

### serializeUser/deserializeUser

- serializeUser : 로그인한 뒤 세션에 데이터를 저장할 때 어떤 정보를 저장할지 결정하는 함수
- deserializeUser : 반대로 세션에 저장한 데이터로 로그인한 유저 정보를 복구하는데 이걸 결정하는 함수

### JWT strategy


## reference

- [김정환 - 패스포트 동작 원리와 인증 구현](https://jeonghwan-kim.github.io/dev/2020/06/20/passport.html)