# 서버 기본 지식
세션, 쿠키, 헤더, 본문 등등
2020.02.10

## 쿠키
클라이언트에서 보내는 요청 -> 요청을 누가 보내는지 기본적으로는 모름  
요청을 보내는 IP주소나 브라우저 정보를 받아올 수는 있지만  
여러 컴퓨터가 공통으로 IP주소를 가지거나, 한 컴퓨터를 여러 사람이 사용할 수도 있음  
누구인지 기억하기 위해 서버는 요청에 대한 응답을 할 때 쿠키라는 것을 같이 보내줌  
쿠키는 키-값의 쌍으로, 서버로부터 쿠키가 오면 웹 브라우저는 쿠키를 저장해두었다가  
요청할 때마다 쿠키를 동봉해서 보내줌  
서버는 요청에 들어있는 쿠키를 읽어서 사용자가 누구인지 파악  
> 쿠키가 없을 때 : 서버에서 쿠키를 보내서 응답
쿠키가 있을 때 : 브라우저에서 쿠키와 함께 서버에 요청
쿠키는 유저가 **누구인지를** 계속 추적한다!

## 헤더와 본문
HTTP 리퀘스트와 리스폰스에서, 요청과 응답은 모두 헤더와 본문을 가지고 있음  
>**헤더** : 요청 또는 응답에 대한 정보를 가지고 있는 곳
**본문** : 서버와 클라이언트 사이에 주고받을 실제 데이터를 담아두는 곳
쿠키는 부가적인 정보이므로 헤더에 저장함

## 세션
서버에 사용자 정보를 저장하고 클라이언트와는 세션 아이디로만 소통하는 방법  
사용자의 정보를 쿠키를 통해 브라우저에 저장하면 보안상 위험이 있으니, 쿠키에서 가져오는 아이디를 통해  
세션에서 필요한 정보를 찾을 수 있게 만듬

## HTTP 상태 코드
>**2XX** : 성공(200- 성공, 201- 작성됨)
**3XX** : 리다이렉션(301-영구이동, 302-임시 이동)
**4XX** : 요청이 잘못됨(401- 권한없음, 403-금지됨, 404-낫파운드)
**5XX** : 서버 오류(500-서버 내부 오류, 502-밷게이트웨이, 503-이용할수 없음)

## REST API
REpresntational State Transfer  
네트워크 구조의 한 형식, 서버의 자원을 정의하고, 자원에 대한 주소를 지정하는 방법  
주소는 의미를 명확히 전달하기 위해 명사로 구성

## HTTP 요청 메소드
GET, POST, PUT, PATCH, DELETE  
주소 하나가 여러개의 요청 메서드를 가질 수 있음  
HTTP 프로토콜을 사용하면 클라이언트가 누구든 상관없이 서버와 소통 가능  
서버와 클라이언트의 분리 => 클라이언트에 구애 안받음  

>**GET** : 서버 자원을 가져오고자 할 때 사용, 요청 본문에 데이터 넣지 않음, 쿼리스트링 사용
**POST** : 서버에 자원을 새로 등록하고자 할 때 사용, 요청 본문에 데이터를 넣어 보낸다(FORMDATA같은거)
PUT : 서버에 자원을 요청에 들어 있는 자원으로 치환. 요청 본문에 치환할 데이터를 넣어 보냄
PATCH : 서버 자원의 일부만 수정하고자 할 때
DELETE : 서버 자원 삭제하고자 할 때

## https
HTTPS 모듈은 웹 서버에 SSL 암호화를 추가함.  
클라이언트와 서버 사이에서 오가는 데이터를 암호화해서 중간에 다른 사람이  
요청을 가로채더라도 내용을 확인할 수 없게 해줌  
로그인이나 결제가 필요한 창 등
암호화를 적용하려며 HTTPS모듈을 사용해야 하는데, 인증 필요

## http/2
노드의 http2모듈 => html,css같은 자원들을 파이프라인으로 하나씩 받고 응답하고 연결 끝내는게 아니라  
뭉탱이로 받아서 뭉탱이로 응답을 주고 연결을 지속함(효율적)  
더 공부해야 할것

## cluster.js
멀티코어 노드 서버 구축 가능하게 함

## reference
- [Node.js 교과서]()