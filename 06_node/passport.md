# passport.js

## passport + 서버 세션 로그인 구현

### 동작

- 서버: 로그인해서 접속한 브라우저 정보를 세션에 저장, 세션 아이디를 브라우져에게 **쿠키로 전달**
- 브라우져 : 쿠키에 담긴 세션 아이디를 저장, 다음 요청부터는 헤더에 세션 아이디를 담아 서버로 전송
- 서버 : 이 세션 아이디 값을 가지고 이전에 접속한 브라우저임을 식별 가능

### express-session

- 세션 미들웨어를 선언하면 req.session으로 세션에 접근할 수 있다.
- 세션에 정보를 넣고싶으면 객체처럼 프로퍼티로 넣어줄 수 있다.

```js
import session from "express-session"

app.use(
  session({
    name: "mysession", // 쿠키에 저장될 세션키 이름
    secret: "qwer1234", // 세션 암호화를 위한 시크릿
    resave: true, // 옵션 참고
    saveUninitialize: true, // 옵션 참고
  })
)
```

## passport 모듈

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
```

## JWT