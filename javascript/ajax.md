# AJAX
2020.02.09  

## 정의
Asynchronous Javascript And XML  
비동기적 웹 서비스를 개발하기 위한 기법.  
페이지 이동 없이 서버에 요청을 보내고 응답을 받는 기술.  
웹 사이트 중 페이지 전환 없이 새로운 데이터를 불러오는 사이트들은 대부분 AJAX적용하고 있음  
보통 AJAX 요청은 제이쿼리나 axios같은 라이브러리를 이용해서 보냄  

## 쌩 AJAX
지금까지 쫌 써온 axios 이런거 없이 비동기 요청 코드를 짜보자  

### GET
```javascript
var xhr = new XMLHttpRequest();
// xhr 객체 생성
// onload, onerror쓸수도 이씀
xhr.onreadystatechange = fucntion() {
  // 요청에 대한 콜백, 이 메서드는 이벤트 리스너로 요청한 후 서버로부터 응답이 올때 응답을 받을 수 있음
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
## reference
- [node.js교과서](http://www.yes24.com/Product/Goods/62597864)