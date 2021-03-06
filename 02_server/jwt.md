# JWT 인증방식

## 토큰기반 인증

- stateful 서버 : 클라이언트에서 요청을 받을 때마다 클라이언트의 상태를 계속해서 유지하고, 이 정보를 서비스 제공에 이용함. stateful 서버의 예제로는 세션을 유지하는 웹서버가 있음
- 세션 : 유저가 로그인을 하면 세션에 로그인이 되었다고 저장을 해두고, 서비스를 제공할때에 그 데이터를 사용함. 이 세션은 서버컴퓨터의 메모리에 담을때도 있고, 데이터베이스 시스템에 담을때도 있음
- stateless 서버 : 반대로 상태를 유지하지 않음. 상태정보를 저장하지 않으니, 서버는 클라이언트에서 들어오는 요청만으로 작업을 처리함. 상태가 없는 경우 클라이언트가 서버의 인증 데이터에 의존하지 않으니 서버의 확장성이 높아짐
- 인증 정보를 다른 어플리케이션으로 전달하기 쉬워진다(OAuth)
- 어플리케이션의 보안을 높일 수 있다.

### 인증 방식의 변화

- 기존의 인증 시스템에서는 서버에서 유저들의 정보를 기억하고 있어야 했음
- 기존 인증방식에서 세션의 문제
  - 유저 인증시 기록은 서버의 메모리에 저장되는데 로그인 중인 유저의 수가 늘어난다면 서버의 램에 미치는 부하가 크다. 이를 피하기 위해서 세션을 데이터베이스에 저장할 수도 있지만 여전히 부하
  - 세션을 사용하면 서버 확장도 어려움. 다른 서비스의 정보를 처리하기 위해 서버를 증설하거나 할때 세션 공유가 안된다면 넘 슬픈일 발생
  - CORS: 웹 어플리케이션에서 세션을 관리할때 자주 사용되는 쿠키는 단일 도메인 및 서브 도메인에서만 사용되도록 설계되어있음. 

### 토큰 기반 시스템의 작동 원리

- **상태유지를 하지 않는 인증 시스템.** 더이상 유저의 인증 정보를 서버나 세션에 담아두지 않는다.
- 서버는 유저가 클라이언트에서 로그인을 할때 verify되었다면 토큰을 발급한다. 클라이언트에서는 전달받은 토큰을 브라우저에 저장해두고 서버에 요청을 할 때마다 해당 토큰을 함께 서버에 전달함.
- 서버는 토큰을 검증하고 요청에 응답함.
- 쿠키를 전달하지 않기 때문에 쿠키에 토큰을 태워서 보냈을때 발생하는 취약점이 사라진다.
- 토큰을 사용해서 다른 서비스에도 권한을 공유할 수 있다. (소셜 미디어 로그인)
- 여러 플랫폼과 도메인에서도 토큰만 유효하다면 요청이 정상적으로 처리된다.

## JWT(Json Web Token)

### 정의

- 웹 표준 인증 토큰으로, 두 개체에서 JSON 객체를 사용하여 가볍고 자가수용적인 방식으로 정보를 안전성있게 전달한다.
- 수많은 프로그래밍 언어에서 지원한다.
- 자가 수용적(self-contained) : 필요한 모든 정보를 자체적으로 지니고 있다. JWT 시스템에서 발급된 토큰은 토큰에 대한 기본정보, 전달할 정보, 그리고 토큰이 검증되었다는 것을 증명하는 시그니처를 포함한다.
- 자가 수용적이라서 두 개체사이에서 손쉽게 전달될 수 있다. 웹서버의 경우 HTTP 헤더에 넣어서(Authorization) 전달할 수 있고 URL의 파리미터로 전달할 수도 있따.

### 쓰임새

- 인증(Authentication) :  유저가 로그인을 하면 서버는 유저의 정보에 기반한 토큰을 발급하여 유저에게 전달한다. 그후 유저가 서버에 요청을 할 때마다 JWT를 포함하여 전달. 서버가 클라이언트에게 요청을 받을 때마다 해당 토큰이 유효하고 인증되었는지 검증을 하고 유저가 요청한 작업에 권한이 있는지 확인하여 작업처리
- 정보 교류 : JWT는 두 개체 사이에서 안정성있게 정보를 교환하기 좋은 방법. 정보가 sign되어있기 때문에 정보를 보낸 이가 바뀌지는 않았는지, 중간에 조작되지는 않았는지 검증 가능.

### 구조

`.`을 구분자로 3가지 문자열로 되어있음. 앞부터 헤더(header), 내용(payload), 서명(signature)

#### header

```js
const header = {
  "typ": "JWT",
  "alg": "HS256"
};

// encode to base64
// 문자열로 바꿔서 인코딩함
const encodedPayload = new Buffer(JSON.stringify(header)).toString('base64')
.replace('=', '');
console.log('header: ',encodedPayload);

/* Result:
header: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
*/
```

- typ: 토큰의 타입을 지정. JWT
- alg : 해싱 알고리즘을 지정. 시그니처 부분에서 사용
- JSON형태의 객체가 base64로 인코딩 되는 과정에서 공백, 엔터들이 사라짐 => 문자열로 변해서 인코딩함
- 해싱 알고리즘으로는 `HMAC SHA256`또는 `RSA`가 주로 쓰인다.

#### payload

- 토큰에 담을 정보가 들어있음. 정보의 한 조각을 클레임이라고 부르고, name/value 의 한 쌍으로 이루어져 있음. 토큰에는 여러개의 클레임들을 넣을 수 있음.
- claim의 3가지 종류 : registered, public, private

##### registered claim

- 등록된 클레임들은 서버에서 필요한 정보들이 아니고 토큰에 대한 정보들을 담기 위하여 이름이 이미 정해진 클레임들. 
- 발급자, 제목, 대상자, 만료시간, 발급시간 등등의 메타데이터

##### public claim

- 공개 클레임들은 충돌이 방지된(네임스페이스) 고유한 이름을 가지고 있어야 함. 충돌을 방지하기 위해서 클레임 이름을 URI형식으로 짓는다(??)

##### private claim

- 등록된 클레임도 아니고 공개된 클레임도 아이며 양측간의(전달자와 받는자)협의하에 사용되는 클레임 이름들. 공개 클레임과는 달리 이름이 중복되어 충돌이 될 수 있음.
- 전달되는 정보 몸통들

##### 인코딩 예제

```js
const paylaod = {
  "iss": "velopert.com",
  "exp": "1485270000000",
  "https://velopert.com/jwt_claims/is_admin": true,
  "userId": "11028373727102",
  "username": "velopert"
}

// encode to base64
const encodedPayload = new Buffer(JSON.stringify(payload))
                            .toString('base64')
                            .replace('=', '');

console.log('payload: ',encodedPayload);
```

### signature

```js
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

- 서명은 header의 인코딩 값과, Payload의 인코딩값만을 합친 후 주어진 비밀키로 해쉬하여 생성
- 생성된 해쉬는 base64로 인코딩되어 토큰으로 사용됨
- 헤더와 정보의 인코딩 값 사이에 `.`를 넣고 합친 후에, 비밀키 secret으로 해싱을 하고 base64로 인코딩하면 시그니처가 나옴. 
- 지금까지 구한 값들을 `.` 중간자로 다 합쳐주면 `헤더.페이로드.시그니처` 이런식의 값이 나옴.
- 정리하면 `시그니처 = base64(hash(헤더.페이로드))`, JWT 토큰 = `base64(헤더).base64(페이로드).시그니처`

### 참고) Base64

- **이진 데이터를 문자로 바꾸는** 인코딩 방법 중에 하나(이진 데이터를 다루기 때무네 만드는데 buffer가 필요하다)
- 8비트 이진 데이터를 문자 코드에 영향을 받지 않는 공통 아스키 영역의 문자들로만 이루어진 일련의 문자열로 바꾸는 인코딩 방식
- 딱히 암호화된 방식은 아니고(디코딩하면 내용이 그대로 노출된다) 곳곳에서 다른 문자열을 아스키코드로 바꾸기 위한 인코딩.


## reference

- [velopert - [JWT] JSON Web Token 소개 및 구조](https://velopert.com/2389)
- [velopert - [JWT] 토큰(Token) 기반 인증에 대한 소개](https://velopert.com/2350)