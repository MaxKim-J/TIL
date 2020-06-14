# REST API

REpresentational State Transfer  
URI를 이용해 자원을 표시하고, HTTP METHOD를 이용하여 자원의 행위를 정하며 그 결과를 받는 것

## 특징

1. Uniform Interface (유니폼 인터페이스)
HTTP 표준만 따른다면 어떤 언어 혹은 어떤 플랫폼에서 사용하여도 사용이 가능한 인터페이스 스타일이다. 안드로이드 플랫폼, IOS 플랫폼 등 특정 언어나 플랫폼에 종속되지 않고 사용이 가능하다.

2. Stateless (상태 정보 유지 안함)
Rest는 상태 정보를 유지하지 않는다. 서버는 각각의 요청을 완전히 다른 것으로 인식하고 처리를 한다. 이전 요청이 다음 요청 처리에 연관이 되면 안된다.

3. Cacheable (캐시 가능)
HTTP의 기존 웹 표준을 그대로 사용하기 때문에 HTTP가 가진 캐싱 기능 적용이 가능하다.

4. Self-descriptiveness (자체 표현 구조)
Rest API 메시지만 보고도 쉽게 이해할 수 있는 자체 표현 구조로 되어있다.

5. Client-Server
Rest 서버는 API 제공을 하고 클라이언트는 사용자 인증에 관련된 일들을 직접 관리한다. 자원이 있는 쪽을 Server라고 하고 자원을 요청하는 쪽이 Client가 된다. 서로간의 의존성이 줄어들기 때문에 역할이 확실하게 구분되어 개발해야할 내용들이 명확해진다. 서버는 자원관리만 하면 되고 클라이언트는 유저와의 인터렉션만 관리하면 됨

6. Layerd System (계층화)
클라이언트는 Rest API 서버만 호출한다. Rest 서버는 다중 계층으로 구성될수 있으면 로드 밸런싱, 암호화, 사용자 인증 등을 추가하여 구조상의 유연성을 둘 수 있다.

## 기본 규칙

### 1. URI는 자원을 표현하는데 집중한다.

리소스명은 동사보다는 명사를 사용해서 표현한다. 행위와 같은 표현이 들어가서는 안된다.

```plain text
# bad
GET /getTodos/1
GET /todos/show/1

# good
GET /todos/1
```

### 2. 자원에 대한 행위는 HTTP METHOD로 표현한다
행위표현은 HTTP 메소드로 한다.

```plain text
# bad
GET /todos/delete/1

# good
DELETE /todos/1
```

## +설계 규칙

3. 슬래시는 계층 관계를 나타내는데 사용한다
4. 마지막엔 슬래시를 쓰지 않는다
5. 하이픈(-)은 URI의 가독성을 높이는데 사용한다 - 불가피하게 긴 URI를 사용하게 될 경우 하이픈을 이용하여 가독성을 높인다
6. 언더바, 밑줄은 URI에 사용하지 않는다
7. URI 경로는 소문자가 적합하다 - 대소문자에 따라 리소스가 구별되기 때문에 다 소문자로 하는게 낫다
8. 파일 확장자는 URI에 포함하지 않는다 - Accept Header을 이용한다

## HTTP Request

CRUD 구현하는데 필요한 주요 메소드

1. GET : 모든, 특정 리소스를 조회
2. POST : 리소스를 생성
3. PUT : 리소스의 전체를 교체
4. PATCH : 리소스의 일부를 수정
5. DELETE : 모든 특정 리소스를 삭제

## REST API의 구성

1. Resource : 자원, URI
2. Verb : 자원에 대한 행위, HTTP Method
3. Representations : 자원의 행위에 대한 내용, HTTP Message Pay Load

## RESTful
- 상기한 규칙을 잘 지켰을 때
- RESTFUL 하지 않은 API : CRUD기능을 전부 POST로만 처리하는 API(동작 표현 못함), URI에 자원과 id외의 정보가 들어가는 경우

## 예시

### GET

todos 리소스에서 모든 todo 조회

```bash
$ curl -X GET http://localhost:5000/todos
```

todos 리소스에서 id를 사용하여 특정 todo를 조회

```bash
$ curl -X GET http://localhost:5000/todos/1
```
### POST
todos 리소스에 새로운 todo 생성
```bash
$ curl -X POST http://localhost:5000/todos -H "Content-Type: application/json" -d '{"id": 4, "content": "Angular", "completed": true}'
```

### PUT
todos 리소스에서 id를 사용하여 todo를 특정하여 id를 제외한 리소스 전체를 갱신
```bash
$ curl -X PUT http://localhost:5000/todos/4 -H "Content-Type: application/json" -d '{"id": 4, "content": "React", "completed": false}'
```

### DELETE
```bash
curl -X DELETE http://localhost:5000/todos/4
```

