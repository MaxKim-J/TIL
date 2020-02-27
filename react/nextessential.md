# next.js 겉핥기 + 브라우저 캐싱

2020.02.27

## 핵심

1. 넥스트는 리액트 모듈을 자동으로 포함시켜주므로 리액트 임포트 할필요 없음
2. next.config.js에서 웹팩 설정을 변경할 수 있다

```javascript
module.exports = {
    webpack: config => {
        test~~~
    }
}
```

3. 넥스트는 static 폴더의 정적 파일을 그대로 서비스하므로 파일을 복사할 필요 없음
4. getInitialProps : 정적 메서드, 페이지 컴포넌트로 속성값을 전달
   - 각 페이지의 이 메소드는 페이지 진입 직전에 호출됨
   - 사용자가 첫 페이지를 요청하면 요 메소드는 서버에서 호출됨
   - 클라이언트에서 페이지 전환을 하면 클라이언트에서 호출됨
   - 메서드가 반환하는 값은 페이지 컴포넌트의 속성값으로 입력됨
   - 서버에서 호출되면 반환값을 클라이언트로 전달해줌
   - 서버사이드 렌더링이니깐 클라이언트 렌더링에 쓰이는 생명주기는 쓰이지 않음
   - HTTP 요청 객체 : req 파라미터 - 요청 객체가 존재하면 서버에서 실행된 것
     -? 서버사이드 렌더링 과정에서 어떻게 실행되는지가 궁금타
5. 페이지 이동을 위해 Router 객체를 이용하는 것과 Link컴포넌트를 이용한 것 사이에 기능적인 차이는 없다 - 다만 router객체가 좀 더 동적인 코드에 적합하다(?뭐야)

```javascript
import Router from "next/router";
```

6. link 컴넌 뒤에 passhref옵션 붙이면 자식요소에 속성을 붙인다. 검색엔진 최적화에 도움됨(왜?)
7. 넥스트의 app 컴넌으로 \_app을 작성한다(리액트에서 꺼내쓰는거랑 다름?)

```javascript
import App, { Container } from "next/app";
```

8. \_app은 페이지가 전환되는 경우에도 언마운트되지 않는다(메뉴 ui를 구현하는게 자연스럽다)
9. 컴포넌트가 언마운트되지 않기 때문에 \_app컴포넌트에서 전역 상태값을 관리하는게 가능하다(루트 컴넌으로서의 역할을 수행한다)
10. 페이지 전환 시 언마운트되지는 않지만 **getInitialProps는 페이지 컴포넌트에 속성값을 전달하는 역할을 수행하므로** 페이지 전환시 호출되는게 당연
11. 웹 서버를 내장하면 더 많은 일을 수행할 수 있다(배포할 때 이렇게 해야댐)내장된 웹 서버는 서버사이드 렌더링 결과를 캐싱할 수 없지만, 직접 띄운 웹 서버에서는 캐싱을 통해 많은 트래픽을 처리할 수 있음
12. express로 약식 웹 서버를 만들어서 node server.js하면 로컬호스트에서 html들을 띄워주게 된다

```javascript
const exrpess = require("exrpess");
const next = require("next");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
// 넥스트를 실행하기 위한 객체와 함수
const app = next({ dev });
const handle = app.getRequestHandler();

// 넥스트의 준비 과정이 끝나면 입력됨 함수를 실행
app.prepare.then(() => {
  const server = exrpess();
  //express에서 처리할 url패턴을 등록한다

  //page/1으로 요청이 들어오면 해당 페이지로 리다이렉한다
  server.get("/page/:id", (req, res) => {
    res.redirect(`/page${req.params.id}`);
  });
  // 나머지 요청은 핸들 함수가 처리한다(?핸들함수)
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  // 사용자 요청을 처리하기 위해 대기한다
  server.listen(port, err => {
    if (err) throw err;
    console.log(`${port}에 웹서버 띄워져따!`);
  });
});
```

13. next export는 서버에서 next를 실행하지 않고도 정적 페이지를 서비스할 수 있게 한다
14. 동적 페이지와 정적 페이지를 동시에 서비스할 수도 있다(!!)

## 용어정리

### 정적 페이지 vs 동적 페이지

#### 정적 페이지

- 서버에 미리 저장된 파일들이 그대로 전달되는 웹 페이지
- 서버는 사용자가 요청에 해당하는 저장된 웹 페이지를 보냄
- 사용자는 서버에 저장된 데이터가 변경되지 않는 한 고정된 웹 페이지를 보게 됨

#### 동적 페이지

- 서버에 있는 데이터들을 스크립트에 의해 가공처리한 후 생성되어 전달되는 웹 페이지
- 서버는 사용자의 요청을 해석하여 데이터를 가공된 후 생성되는 웹 페이지를 보냄
- 사용자는 상황, 시간, 요청 등에 따라 달라지는 웹 페이지를 보게 됨

#### 스크립트가 있으면 무조건 동적 페이지인건가 그럼?

- 디비랑 실시간으로 연동하는 것을 기준으로 가르는 포스트도 있다. 정적 페이지는 그냥 제공자가 이미 다 만들어놓은 것, 동적 페이지는 인터렉션에 반응하는 것
- 그런 의미에서 보면 스크립트가 서버와 통신하며 비동기 처리를 하냐마냐가 더 프랙티컬한 기준일 수 있다
- 뭐 쿼리셀렉터 써서 호버하면 막 일케되고 이런걸 가지고 동적페이지라고 하기에는 좀 그렇다 스크립트도 미리 다 써놓을 수 있는거고(아마...)

#### 쓰까먹기

자주 변경되지 않는 페이지의 경우는 굳이 동적 웹페이지로 만들 필요가 없다  
넥스트에서의 서버 설정으로 정적, 동적 웹페이지를 쓰까서 서비스할 수 있다(미리 렌더링)  
(그러면 배포할 때 서버는 컴퓨터에다가 두고, 정적 자원 걍 꺼내쓰는 방식으로 배포되는건가 그러면 ec2에서도 가능하지 않나 아리송...)

### 브라우저 캐싱

- 클라이언트와 서버 사이에서 브라우저를 통해 이루어지는 캐싱을 뜻하는 말
- 브라우저가 웹 서버의 일부 컨텐츠를 요청하면, 컨텐츠가 브라우저 캐시에 없다면 웹 서버에서 직접 검색하고, 컨텐츠가 이전에 캐시되었다면 브라우저는 서버를 우회하여 캐시에서 직접 콘텐츠를 로드
- 넥스트 자체 서버에서 서버사이드 렌더링 결과를 캐싱하면, 렌더링 성능을 올릴 수 있을 것으로 보임...

```javascript
const exrpess = require("exrpess");
const next = require("next");
const url = require("url");
// 서버사이드 렌더링 결과를 캐싱하기 위한 패키지
const lruCache = require("lru-cache");

// 캐시 객체로 설정을 하게 됨
// 최대 100개의 항목을 저장하고, 각 항목은 60초 동안 저장한다
const ssrCache = new lruCache({
    max:100,
    maxAge:1000*60
});

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare.then(() => {
  const server = exrpess();
  server.get("/page/:id", (req, res) => {
    res.redirect(`/page${req.params.id}`);
  });

  // 들어오는 요청에 대해서, 렌더링을 하고 캐싱을 해라!
  server.get(/^\/page[1-9]/. (req,res) => {
      return renderAndCache(req, res);
  })

  server.get("*", (req, res) => {
    return handle(req, res);
  });

// 아까 써먹었던 캐시 함수 - 함수 선언식
// 캐싱 기능을 구현함
  async function renderAndCache(req, res) {
      const parsedUrl = url.parse(req.url, true);
      const cacheKey = parsedUrl.path;
      // 캐시가 존재하면 캐시에 저장된 값을 사용한다
      if (ssrCache.has(cacheKey)){
          console.log('캐시 사용');
          res.send(ssrCache.get(cacheKey));
          return
      }
      // 캐시가 없으면 넥스트의 renderToHTML을 호출해서 await키워드를 사용해서 처리가 끝날때까지 기다린다
      try {
          const {query, pathname} = parsedUrl;
          // html렌더를 기다린다
          const html = await app.renderToHTML(req,res,pathname,query);
          // req가 알맞다면 그 결과를 캐싱한다
          if (res.statusCode === 200){
              ssrCache.set(cacheKey, html);
          }
          res.send(html);
      } catch(err) {
          app.renderError(err, req, res, pathname, query);
      }
  }

  server.listen(port, err => {
    if (err) throw err;
    console.log(`${port}에 웹서버 띄워져따!`);
  });
  // 요런 코드를 세팅해주면 반복적으로 같은 페이지로 접속할 때
  // 서버측 콘솔에 캐시 사용 문구가 출력되는 것을 확인할 수 이씀
});
```

## 궁금증

1. next에서 리액트 코드가 정적 html로 빌드되고 서버에서 나오는 전체 과정
2. router vs link
3. passhref가 수행하는 역할
