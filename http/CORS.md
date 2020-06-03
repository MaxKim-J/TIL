# CORS 이슈
Cross Origin Resource Sharing  
교차 출처 리소스 공유  

## 이게 뭐죠
- 보안 상의 이유로 브라우저는 스크립트에서 시작한 교차 출처 HTTP 요청을 제한함
- XMLHttpRequest와 Fetch API는 동일 출처 정책을 따름. 이 API를 사용하는 웹 애플리케이션은 자신의 출처(origin)와 동일한 리소스만 불러올 수 있음. 
> **동일 출처 정책**  
불러온 문서나 스크립트가 다른 출처에서 가져온 리소스와 상호작용하는 것을 제한하는 중요한 보안 방식. 잠재적 악성 문서를 격리
- 우리 웹서비스에서만 사용하기 위해서 다른 서브 도메인을 가진 API함수를 제공하는 API 서버를 구축했는데 다른 웹서비스에서 이 API 서버에 접근하여 지 맘대로 API를 호출해여 사용한다면 문제가 될 것
- 다른 출처의 리소스를 불러오려면 그 출처에서 올바른 CORS 헤더를 포함한 응답을 반환해야
- 프론트와 백이 나누어져 있을 때 암것도 안해주면 둘은 서로 상이한 리소스이기 때문에 발생 가능함

## 어캐 감지?
오류 메시지가 이러캐 생겼음
>XMLHttpRequest cannot load http://www.ozit.co.kr.
**No 'Access-Control-Allow-Origin' header is present on the requested resource.**
(요청한 리소스에 대해서 저 헤더가 없어서 리스폰스 줄수가 없읍니다..)
Origin 'http://abc.ozit.co.kr' is therefore not allowed access.

- 리퀘스트의 Origin : 요청을 보내는 페이지의 출처(도메인)
- preflight라는 리퀘스트가 있는데(사전 전달) 이건 실제 요청이 전송하기에 안전한지 아닌지를 결정하기 위해 다른 도메인에 있는 리소스에 OPTIONS 메소드로 HTTP 요청을 전송한다 함
- 이 요청을 받은 서버는 정상적인 요청인지 확인하고, 정상적인 요청이면 (Origin을 타진해서) 리스폰스 헤더에다가 Access-Control-Allow-Origin에다가 도메인 목록을 써줌 그외에 Methods, Headers 등도 설정



## 해결 방법

### 서버측 해결 방법(정석)

프론트 백이 분리되어있는 로직에서는 서버에서 크로스 오리진 요청을 허가해줘야 됨  
서버에서 문제 해결하는게 정석이다  

#### Access-Control-Allow-Origin 응답 헤더 추가
```js
app.get('/data', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(data);
});
```
- 근데 모든 요청에 대해서 일일히 이렇게 해주기 귀찮을 수 있음  
- 그리고 그냥 모든 곳에서 들어오는 api 요청을 다 허가해주는건 보안상으로 좋지 않음  

#### 미들웨어 CORS
```js
const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // 허락하고자 하는 요청 주소를 지정
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};

app.use(cors(corsOptions)); // config 추가
```

### 클라이언트측 해결 방법

#### 프록시 설정
- 프록시 : 주로 보안의 문제로 직접 통신하지 못하는 두개의 컴퓨터 사이에서 서로 통신할 수 있도록 돕는 역할을 가리켜 프록시라 일컫는다
- 프록시에서는 서버의 응답에 대해 리스폰스 헤더에 `access-contril-allow-origin` 헤더를 추가하여 클라이언트로 응답 보낸다
- 웹팩 프록시 설정 : package.json의 프록시 설정에 요청을 보낼 url의 루트를 적어놓는다
    - 그다음 모든 요청에서 루트를 삭제
    - 이렇게 설정을 해놓으면 현재 개발서버의 주소로 요청을 먼저 보냄
    - 웹팩 개발 서버에서 해당 요청을 받아 그대로 백엔드 서버로 전달
    - 백엔드 서버에서 응답한 내용을 다시 브라우저 쪽으로 반환
