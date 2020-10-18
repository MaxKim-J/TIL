# 사용자 인증

## 인증이 필요한 이유

- 유저마다 자신의 정보에 따라 서버에 가지고 있는 정보가 다르기 때문에 누군지 서버에서는 식별이 필요함
- HTTP 통신의 stateless함, 누가 보냈는지 모르고 통신이 끝나면 연결을 끊음. 매번 클라이언트에서 요청을 보낼 때 마다 자신을 밝혀야할 필요 생김

## 인증 방식

### 1. 계정 정보를 요청 헤더에 넣는 방식

- 에바 방식, HTTP 요청에 비밀번호를 넣는건데 이건 너무 최악...
- 데이터를 요청할 때마다 사용자의 프라이빗한 정보를 계속해서 보낸다는 건 상당히 보안에 좋지 않음.
- 해커가 요청을 도청할 수 있기 때문에 좋지 않음

### 2. 세션 ID를 쿠키에 넣기

- 사용자가 로그인을 하면, 서버에서는 계정 정보를 읽어 사용자를 확인하고, 사용자의 고유한 ID를 부여하여 세션 저장소에 저장한 후 세션 ID를 발행
- 사용자는 서버에서 해당 세션 ID를 받아 쿠키에 저장한 후 인증이 필요한 쿠키를 헤더에 실어 보냄
- 서버에서 쿠키를 받아 세션 저장소에서 대조를 한 후 대응되는 정보를 가져옴
- 인증이 완료되고 서버는 데이터를 보내줌
- 결과적으로 인증의 책임을 서버가 지게하기 위해 세션을 사용하게 되는 것 
- 세션 id값이 유의미하지 않기 때문에(서버에서나 유의미함) 정보를 그대로 보내는 것 보다는 나음
- 서버에서는 세션 id는 고유하기 때문에 누군지 바로 식별 가능
- 세션id를 탈취했을 때 서버에 그걸로 요청을 보내면 정보를 잘 못 뿌려줄 수 있음(세션 하이재킹) : HTTPS를 사용해 암호화하거나 세션에 유효시간을 넣어준다

### 3. JWT 토큰 사용하기

- Json Web Token의 약자로 인증에 필요한 정보들을 암호화시킨 토큰을 뜻함. Access Token을 HTTP 헤더에 실어 서버로 보내게 됨
- JWT는 Header + Payload + Verify Signature 이렇게 세가지로 구성됨. 여기서 헤더랑 페이로드는 단순히 인코딩될 뿐이라서 무슨 값인지 확인할 수 있음.
- 마지막 verify signature은 SECRET KEY를 모르면 복호화할 수 없음. SECRET KEY를 알지 못하는 이상 토큰을 조작할 수 없음
- 유저는 클라이언트에서 인증에 필요한 정보를 얻어야 할때 토큰을 실어 보내고, 서버에서 SECRET KEY로 복호화 후에 조작 여부, 유효기간을 확인하게 됨
- 이미 발급된 JWT토큰은 만료시때까지 무조건 유효하다. 악의적으로 사용된다면 유효기간이 끝날때까지 계속해서 사용이 가능하므로, 그때까지 신나게 털릴 수 있음

#### 일반적인 토큰인증 전략

1. accessToken을 로그인할때만 발급하기

- 장점 : 짧은 시간 만료 설정하면 탈취되더라도 빠르게 만료됨. 긴시간 설정하면 로그인을 자주 안해도 됨
- 단점 : 짧은 시간 만료 설정하면 사용자가 로그인을 여러번 해야함. 긴시간 설정하면 탈취 한번 되면 신나게 털림

2. sliding sessions 전략

- 세션을 지속적으로 이용하는 유저에게는 자동으로 만료 기한을 늘려줌
- 장점 : 사용자가 로그인을 자주 할 필요가 없고, 세션 유지가 필요한 순간에 세션이 만료되는 문제를 방지할 수 있음
- 단점 : 접속이 주로 단발성이라면 효과가 크지 않음. 긴 만료 시간을 갖는 accesstoken을 사용하면 로그인을 전혀 하지 않아도 될것

3. AccessToken + RefreshToken

- 사용자가 로그인을 할때 AccessToken과 함께 그에 비해 긴 만료시간을 갖는 RefreshToken을 클라이언트에게 함께 발급.
- 클라이언트는 AccessToken이 만료된 상황에서 RefreshToken을 이용해 AccessToken의 재발급 요청.
- 여기서 서버에서 토큰을 발급해줄때 refreshToken과 accessToken은 확실히 구별되야함. refreshToken을 accessToken처럼 쓸 수 있다면 refreshToken이 의미가 없음. accessToken을 재발급 할때만 쓸 수 있어야 함. 
- refreshToken이 털리면 어떡하지 - 안전한 곳에 저장 필요
- RefreshToken이 만료되었다면 오류를 반환해 로그인을 요구
- 장점 : 짧은 만료 기간을 사용할 수 있으므로 AccessToken이 탈취되더라도 제한된 기간만 접근이 가능, 사용자가 로그인을 자주 할 필요가 없음. 만료를 강제로 설정할 수 있음
- 단점 : 클라이언트는 AccessToken의 만료에 대한 연장 요청 구현 필요. 인증 만료 기간의 자동 연장이 불가능함. 

4. sliding session + AcessToken + RefreshToken

- accessToken 자체의 만료 기간을 늘려주는게 아니라 특정 시점에 refreshToken의 만료 기간을 늘려주기
- 빈번하게 만료 연장을 해줄 필요가 없음

#### 토큰 탈취 피해 최소화 : Refresh Token

- 만일 토큰 자체가 탈취당하면 보안에 취약해진다. 유효기간이 짧으면 로그인을 계속 해야 하니 귀찮고, 그렇다고 유효기간을 너무 길게 하면 보안에 취약해질 수 있다. 
- 로그인 시 AccessToken과 함께 Access Token보다 유효기간이 긴 RefreshToken을 발급하여 클라이언트에서 가지고 있게 하고, AccessToken이 만료되면 Refresh Token을 이용하여 유효기간이 짧은 AccessToken을 새로 발급받을 수 있게 한다.
- AccessToken이 털리면 정보가 유출되는건 동일한데, 다만 유효기간이 짧기 때문에 비교적 안전함
- RefreshToken도 유효기간이 만료되었을때는 새로 로그인해야함
- 로그인시 두 토큰을 발행하고, RefreshToken의 경우 클라이언트, 서버 사용자 DB에 같이 저장
- 클라이언트는 Access Token이 만료될때까지 헤더에 실어 요청을 보내고, 만료되었을 때는 서버에서 권한 없다고 말함
- 혹은 Access TOken Payload를 통해 유효기간을 알 수 있음 따라서 프론트엔드 단에서 API요청 전에 토큰이 만료되거나 없음을 알아차릴 수 있음
- AccessToken이 만료되었을 경우 클라이언트는 RefreshToken을 보내고, 그게 사용자 DB에 저장되있는 값과 같은 경우 새로운 AccessToken을 발급해줄 수 있게 해줌
- HTTP 요청이 늘어나기 때문에 서버의 자원 낭비로 귀결될 수 있음

#### 클라이언트에서 JWT 토큰은 어디에 저장해야 하는가?

- Access Token : 리소스에 직접 접근할 수 있는 정보, 짧은 수명
- Refresh Token : 새로운 AccessToken을 발급하기 위한 정보, 긴 수명
- localStorage에 저장 : 쉽게 값을 넣고 뺄 수 있지만 XSS 공격에 취약하다.
- Cookie에 저장 : HTTP Only 옵션을 줘서 자바스크립트로 접근 할 수 없게 설정하고, Secure 옵션을 주면 HTTPS로만 전송이 가능해진다. 다만 CSRF에는 취약할 수 있다. (나중에 또 따로 정리)

#### 로그인 세션 유지 전략

##### 대충의 과정

1. 클라이언트에서 accessToken으로 요청함 => 만료되지 않은 토큰이라면 응답 정상적으로 전송
2. 만료된 토큰일 경우, 401이나 403반환(이때 요청한 엔드포인트를 기억하게끔 함) 
3. 토큰 만료가 res에서 감지되었다면 클라이언트에서 쿠키 등에 저장된 refreshToken을 바탕으로 refresh 요청
4. 서버에서 refresh 토큰 검증, 만료되었다면 refreshToken이 만료되었다는 에러응답을 발생(클라이언트에서는 로그인페이지로 리다이렉하도록 에러 핸들링)
5. 성공적으로 재발급되었다면 새로운 accessToken을 브라우저에 저장한 후 아까 요청에서 저장해놨던 엔드포인트로 새로운 accessToken과 함께 재요청  
6. 정상적으로 응답을 받음

##### 구현에 사용할 수 있는 것들

어딘가로 라우팅 하기 전에 내비게이션 가드로 쿠키에 있는 토큰을 가져오고 서버로 refreshToken 엔드포인트로 먼저 전송해서 만료 여부를 먼저 검증하여 새 토큰을 받아놓거나 현상 유지할 수 있음.(회사에서 쓰는 방법)

```js
export default async function ({ store, redirect }) {
  const { isAuthenticated, token } = store.state.auth
  let result
  if (!isAuthenticated) {
    try {
      result = await store.dispatch('auth/refreshToken', token)
    } catch (err) {
      redirect('/auth/login')
    }
    if (!result) { redirect('/auth/login') }
  }
}

```

회사에서는 따로 refreshToken은 없고, accessToken만 뷰엑스 저장소에 저장해놔서 Nuxt 클라이언트 미들웨어를 통해 auth여부를 판단해야하는 라우팅 전에 먼저 accessToken을 가지고 refreshToken 엔드포인트로 보내서 유효한지 검증하고, 토큰과 관련된 유저 정보까지 받아서 뷰엑스 저장소에 갱신하고, 새로운 토큰은 쿠키에 저장함. 

아마 refreshToken 엔드포인트 api요청으로 받는 토큰은 아직 유효하다면 그냥 토큰이 그대로 오고, 유효하지 않다면 갱신된 토큰을 받는..건 아니고 에러를 뿜는데 클라이언트에서는 핸들링을 통해 로그인으로 리다이렉 시켜서 다시 토큰을 받게하는 로직일듯 싶음. 이런 상황에서 토큰 발급은 로그인에서만 일어남.

클라이언트단에서는 토큰 들어있는 쿠키의 만료시간을 설정해서 만료시간이 지나면 쿠키가 없으니까 로그인 페이지로 이동함. 확실히 교통정리가 안되있는거 같긴 하네 이래서 refreshToken도 필요한건가봄. 

그러니까 이 방법은 클라이언트단에서 토큰 만료를 쿠키로 제어하고, refresh 요청은 (정확히는 모르겠지만 - 물어보자) 토큰을 기반으로 유저 정보를 가져오는데 의의가 있고, 이미 expire된 토큰에서는 작동하지 않고 에러를 뿜으니까 사실 진정한 의미에서 refreshToken을 하는 endpoint라고 보기는 힘들듯? getUserStatus정도지... RESTful하지 않ㄷ ㅏ.. 

게다가 토큰이 이미 만료가 되었는데 클라이언트에서 가지고있어서 굳이 그거갖고 refresh해서 로그인 페이지로 리다이렉 하거나 토큰이 만료가 안되었는데도 클라이언트에서 없애버리는 상황이 발생할 수 있어 사실 일관이 있는 시스템은 아닌 거시다

서버 컨트롤러에서는 같이 보낸 accessToken이 만료되었을 경우 refreshToken을 바탕으로 새로운 토큰을 발급하거나, refreshToken도 만료되었을 경우 로그인을 하도록 하는 에러를 뿜을 수 있음. 이때는 토큰 검증 로직에 토큰을 두개 태워서 보내는게 맞겟네

- 구현이 가능하게 하는 것들
  - **Vue 네비게이션 가드, 혹은 클라이언트 미들웨어** : 해당 라우터에 접속하기 전에 토큰 검증하여 재발급을 시키거나, refreshToken도 만료되었을때는 로그인 페이지로 보냄
  - **React Router prop** : 라우트 컴포넌트에다가 auth 프롭을 달아두고, app.js 단이나 redux의 state를 이용해 현재 토큰을 보내서 토큰을 검증한 후 auth state를 초기화하여 prop으로 보내주고 그 값 기반으로 auth가 안되었다면 로그인으로 보내던지 함
  - **아예 axios intercept 사용하기** : 라우팅 가드보다 좀더 low level한 방법으로, 그 페이지 가만히 있다가 토큰이 만료되는 경우를 방지하기 위해, 이렇게 만료되는 경우에 Access Token을 자동으로 갱신하여 통신 요청을 넣어줘야 한다. => 사용자가 통신이 끊기는지 모르게 하게끔

```js
mport axios from 'axios';
import VueCookies from 'vue-cookies';
import { refreshToken } from '../service/login'

axios.defaults.baseURL = 'http://localhost:3000';

// Add a request interceptor
axios.interceptors.request.use(async function (config) {
    // Do something before request is sent
    config.headers.token = VueCookies.get('token');
    config.headers.refresh_token = VueCookies.get('refresh_token');
  
    console.log(config);
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log('에러일 경우', error.config);
    const errorAPI = error.config;
    // 토큰이 만료된 경우에는 401또는 403에러 정도가 올텐데
    // 그럴때 자동으로 refresh 토큰을 하고 해당 api를 재요청한다.
    if(error.response.data.status===401 && errorAPI.retry===undefined){
      errorAPI.retry = true;
      console.log('토큰이 이상한 오류일 경우');
      await refreshToken();
      return await axios(errorAPI);
    }
    return Promise.reject(error);
  });


export default axios;
```

### 4. OAuth 2.0

- 외부 서비스의 인증 및 권한부여를 관리하는 범용적인 프로토콜
- 소셜 로그인등에 사용됨
- 모바일 어플리케이션에서도 사용 가능, 반드시 HTTPS를 사용해야함, AccessToken의 만료기간

#### 동작 방식 

refresh/access랑 비슷  
클라이언트가 여기서는 서버, 사용자가 클라이언트  
리소스 서버 : 인증 정보를 가지고 있는 서버  
인증 서버 : 토큰 발급해주는 서버  

1. 사용자(Resource Owner)가 서버(client)에게 인증요청을 함
2. 서버는 Authorization Request를 통해 Resource Owner에게 인증할 수단을 보냄(구글, 페이스북 등등...)
3. 사용자는 해당 req을 통해 인증을 진행하고 인증을 완료했다는 신호로 Authorization Grant라는거를 url에 실어 Client에게 보냄
4. 서버는 해당 권한 증서를 Authorization Server에게 보내고, 그게 맞다면 토큰을 발급(access, refresh)
5. 이 토큰가지고 서버에서 뭔가 처리, 클라이언트에 보내서 저장할 수도 있음
6. 그 토큰을 바탕으로 resource server(페북, 구글에 있는 정보)에 자원을 요청할 수도 있음=

#### SNS 로그인 프로세스

![프로세스](https://t1.daumcdn.net/cfile/tistory/99115C3F5B6EECBF37)

1. 사용자가 서버에게 로그인을 요청
2. 서버는 사용자에게 특정 쿼리들을 붙인 페이스북 로그인 URL을 사용자에게 보냄
3. 사용자는 해당 URL로 접근하여 로그인 수행 후 권한증서를 담아 서버에게 보냄
4. 서버는 해당 권한 증서를 **Facebook의** Authorization Server로 요청
5. Authorization 서버는 권한 증서를 확인하고 토큰들+계정 정보등을 돌려줌
6. 받은 고유 id를 key값으로 하여 DB에 유저가 있다면 로그인, 없다면 회원가입을 진행
7. 로그인이 완료되었다면 인증 처리하면 됨


## reference

- [쉽게 알아보는 서버 인증 1,2,3편](https://tansfil.tistory.com/60?category=255594)
- [Vue - Login 세션 유지하기](https://kdinner.tistory.com/60)
