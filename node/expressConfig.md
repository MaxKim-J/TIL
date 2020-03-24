# express 서버 초기 세팅

2020.03.24

## 초기설정

```js
// 0. 모듈들 불러오기
const express = require("express");
const expressErrorHandler = require("express-error-handler");
const expressSession = require("express-session");

const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const static = require("serve-static");

// 1. 익스프레스 객체
const app = express();

// 2. 기본 포트 속성 설정
app.set("port", process.env.PORT || 3000);

// 3. body-parser은 post요청이 들어왔을 때의 본문을 파싱할 수 있게 해줌
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 4. public 폴더를 static으로 오픈
app.use("/public", static(path.join(__dirname, "public")));

// 5. cookie-parser 설정
app.use(cookieParser());

// 6. 세션 설정
app.use(
  expressSession({
    secret: "3@#!$4234#@4234",
    resave: true,
    saveUninitialized: true
  })
);

// 7. 라우터 객체
const router = express.Router();

router.route("/process/login").post(function(req, res) {
  console.log("/process/login 호출됨");
});

router.route("/process/login").get(function(req, res) {
  console.log("로그인 하는 페이지");
});

// 8. 라우터 객체 등록
app.use("/", router);

// 9. 오류 페이지 처리
const errorHandler = expressErrorHandler({
  static: {
    "404": "./public/404.html"
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// 10. 설정한 포트에서 서버시작
http.createServer(app).listen(app.get("port"), function() {
  console.log("서버가 시작되었습니다. 포트 : " + app.get("port"));
});
```

## 서버 처리 과정

웹 브라우저(클라이언트) => 포트 => 미들웨어 => 응답

### 미들웨어

- 익스프레스의 핵심, 요청과 응답의 중간에 위치하여 미들웨어라 부름
- 라우터와 에러 핸들러 또한 미들웨어의 일종이므로 미들웨어가 익스프레스의 거의 전부
- 미들웨어는 요청과 응답을 조작하여 기능을 추가하기도 하고 나쁜 요청을 걸러내기도 함

```js
app.use(function(req, res, next) {
  console.log(req.url, "커스텀 미들웨어는 이렇게");
  // 다음 미들웨어로 넘어감
  next();
});
```

### next 함수

- next() : 다음 미들웨어로
- next('route') : 다음 라우터로
- next(error) : 에러 핸들러로

### 주요 미들웨어들

1. morgan : 요청에 대한 정보를 콘솔에 기록해주는 미들웨어
2. body-parser : 요청의 본문을 해석해주는 미들웨어. 폼데이터나 ajax요청의 데이터를 처리한다, 익스프레스에는 url-encoded와 JSON의 바디파싱 기능이 내장되긴 했지만 JSON, URL-encoded, Raw, Text를 모두 처리할 수 있는건 바디파서뿐. `req.body`로 조회 가능
3. cookie-parser : 요청에 동봉된 쿠키를 해석해준다. `req.cookies`로 조회한다
4. static : 정적 파일을 제공하는 미들웨어, 따로 설치할 필요는 없음. fs모듈을 사용할 필요가 없게 해줌. 폴더 디렉토리들을 브라우저에서 조회할 수 있게 해줌. 정적파일 요청은 따로 미들웨어가 필요 없으니 최대한 위쪽에 배치하는 게 좋다.
5. express-session : 세션 관리 미들웨어. `app.js`에서는 인자로 세션에 대한 설정을 받음

```js
app.use(cookieParser("secret code"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret code",
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);
```

- resave : 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지
- saveUnintialized : 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정
- secret : 필수 항목, express-session은 세션 관리 시 클라이언트에 쿠키를 보내는데 이를 세션 쿠키라고 함. 안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는데 이 값이 필요함. cookie-parser의 비밀키와 같게 설정해야함.
- cookie 객체 : 일반적인 쿠키 옵션이 모두 제공, httpOnly는 클라이언트에서 쿠키를 확인하지 못하도록 하는 옵션, secure은 false로 하면 https가 아닌 환경에서도 사용할 수 잇음
