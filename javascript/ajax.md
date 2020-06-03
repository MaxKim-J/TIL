# AJAX + Axios

2020.02.09  
2020.06.02 수정  

## 정의

- Asynchronous Javascript And XML  
- 비동기적 웹 서비스를 개발하기 위한 기법.  
- 페이지 이동 없이 서버에 요청을 보내고 응답을 받는 기술.  
- 필요한 데이터만을 웹서버에 명시해 요청해 받은 후 데이터에 대한 처리 가능
- 웹 서버에서 전적으로 처리되던 데이터 처리의 일부분이 클라이언트 쪽에서 처리되므로 웹 브라우저와 웹 서버 사이에 교환되는 데이터량과 웹서버의 데이터 처리량도 줄어드므로 애플리케이션의 응답성 향상에 도움
- 웹 사이트 중 페이지 전환 없이 새로운 데이터를 불러오는 사이트들은 대부분 AJAX적용하고 있음  
- 보통 AJAX 요청은 제이쿼리나 axios같은 라이브러리를 이용해서 보냄  
- 자체가 하나의 기술을 말하는 것이 아니고 함께 사용하는 기술의 묶음을 지칭하는 용어
- 응답으로 제공받는 유사한 내용들을 배재하기 위해 개발

## 쌩 AJAX == XMLHttpRequest()

- 자바스크립트 내장객체
- 서버와 상호작용 하기 위해 사용
- 전체페이지 새로고침 없어도 URL로 부터 데이터 가져옴
- 사실상 프론트엔드와 백엔드를 나눌 수 있었던 이유
- 웹 페이지 사용자가 하고있는 것을 방해하지 않으며 페이지의 일부를 업뎃
- 이름으로만 봐서는 XML만 받아올 수 있을 것 같지만 모든 종류의 데이터를 받아오는데 사용할 수 있고 + HTTP이외의 프로토콜도 지원한다
- addEventListner을 통한 XMLHttpRequest 이벤트 리스닝 지원(이벤트 드리븐으로 해결)
  - 각 단계가 끝나면 이벤트가 발생하고 이거 캐치하면 됨
  - abort, error, load, loadend, loadstart, progress 등
  - 이벤트 리스너에 따라서 readyState 정수값이 달라지는듯
  - xhr.onprogress = function()... 이런식으로

### GET

```javascript
// xhr 객체 생성
var xhr = new XMLHttpRequest();

// readyState가 변경될때마다 호출되는 이벤트핸들러
// 변경될 때마다 실행되니 각 state에 대응하는 동작을 지정해줘야한다
// response가 클라이언트에게 도달하여 발생된 이벤트를 감지하고 콜백을 실행해줌, 이때 이벤트는 readystate가 변경될때 발생
xhr.onreadystatechange = fucntion() {
  // 요청에 대한 콜백, 이 메서드는 이벤트 리스너로 요청한 후 서버로부터 응답이 올때 응답을 받을 수 있음

  // 상태캐치 => readystate(unsent - 0, opened - 1, headers_reciceved - 2, loading - 3, done - 4)
  if (xhr.readyState === xhr.Done) {
    // 요청이 완료되면
    if(xhr.status === 200 || xhr.status === 201){
      // 응답 코드가 200이나 201이면
      console.log(xhr.responseText);
      // reponseText안에 성공한 내용이 담겨있음
    } else {
      console.error(xhr.responseText);
      // 실패하면 에러 메시지가 담겨 이씀
    }
  }
};

// 실질적인 요청 보내는 문장
xhr.open('GET', 'https://www.url.max.com/api/get');

// 메서드와 주소 설정, 메서드 설정하고 주소로 요청을 보내고 난 후 콜백을 실행함
xhr.send();
```

### POST

```javascript
var xhr = new XMLHttpRequest();
var data = {
  name:"kim",
  birth:1996
}

xhr.onreadystatechange = fucntion() {
  if (xhr.readyState === xhr.Done) {
    if(xhr.status === 200 || xhr.status === 201){
      console.log(xhr.responseText);
    } else {
      console.error(xhr.responseText);
    }
  }
};

xhr.open('POST', 'https://www.url.max.com/api/get');

// 리퀘스트 헤더 설정, 콘텐츠 타입을 json으로
xhr.setRequestHeader('Content-Type', 'application/JSON');
// 데이터를 동봉해서 전송
xhr.send(JSON.stringify(data));
```

## Axios

- 이벤트 드리븐이 아닌 Promise로 해결
- 인기있는 HTTP통신 자바스크립트 라이브러리
- Node.js 플랫폼과 브라우저 모두에서 사용 가능
- 최신 브라우저 지원
- Promise기반 쉬운 XHR 요청 => 자바스크립트의 비동기 처리방식 사용(이게 쌩 ajax랑은 좀 다른 부분?)
```js

// then 체이닝
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });  

// 어싱크 어웨잇
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

## 결론
- XMLHttpRequest : 일반적인 이벤트 드리븐으로 비동기 처리
- Axios : 프로미스, 어싱크어웨잇으로 비동기 처리

## reference
- [node.js교과서](http://www.yes24.com/Product/Goods/62597864)