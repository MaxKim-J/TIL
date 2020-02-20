# 익스프레스 메소드들

2020.02.18  
배우면서 정리해야 될거같아서

## 익스프레스 서버 객체 메소드
- set(name, value) : 서버 설정을 위한 속성을 지정, set으로 지정한 속성은 get으로 꺼내서 확인 가능
- get(name,value) : 서버 설정을 위해 지정한 속성을 꺼내오기
- use([path,], function[function,]) : 미들웨어 함수 사용
- get([path,], function) : 특정 패수로 요청된 정보 처리

## 익스프레스의 요청 객체와 응답 객체
- send([body]) : 클라이언트에 응답 데이터를 보냄. 전달할 수 있는 데이터는 html 문자열, buffer 객체, JSON 객체, JSON 배열
- status(code) : HTTP 상태 코드를 반환. 상태 코드는 end()나 send()같은 전송 메소드를 추가로 호출해야 전송 가능
- sendStatus(statusCode) : HTTP 상태 코드를 반환하는데 상태 코드는 상태 메시지와 함께 전송
- redirect([status,], path) : 웹 페이지 경로를 강제로 이동시킴
- render(view, [,locals][,callback]) : **뷰 엔진을 사용**해 문서를 만든 후 전송
  - 뷰 엔진 config가 필요하다

## 요청 패스를 라우터 객체에 등록할 때 
 - get, post, put, delete
 - all(callback) : 모든 요청 방식 처리, 특정 패스 요청이 발생할 때 사용할 콜백 함수를 지정 