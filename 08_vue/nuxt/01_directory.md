# Nuxt.js

서버사이드렌더링 Vue.js, 도큐멘테이션 봐보기

## 디렉토리

- layouts : nuxt의 layout 프로퍼티를 통해 만든 사용자 정의 레이아웃
- middleware : nuxt의 미들웨어 프로퍼티
- pages : 라우팅하는 페이지들, Nuxt.js는 pages 디렉토리 내의 Vue 파일 구조를 기반으로 vue-router 설정을 자동으로 생성(Next랑 같다)
- plugins : 외부 모듈, 커스텀 라이브러리 사용을 위한 플러그인, axios, 뷰티파이 등등...

### 미들웨어

- 페이지나 페이지 그룹을 렌더링하기 전에 실행할 사용자 지정 함수를 정의한다
- 모든 미들웨어는 middleware/ 디렉토리에 있어야 함
- 미들웨어는 context를 첫 인자로 전달받음
- next.config.js => 매칭 레이아웃 => 매칭 페이지 순으로 실행됨

```js
import axios from 'axios'

export default function ({ route }) {
  return axios.post('http://my-stats-api.com', {
    url: route.fullPath
  })
}

// 이제 이 미들웨어는 경로가 변경될때마다 실행된다
module.exports = {
  router: {
    middleware: 'stats'
  }
}

// 또는 컴포넌트에서 넣어주면 특정 페이지가 변경될때마다 실행된다
export default {
  middleware: ['auth', 'stats']
}
```

### 레이아웃

## Nuxt.config.js

- plugins : 루트 vue 인스턴스화 하기 전에 **실행**할 플러그인을 정의할 수 있음. 엑시오스 쓸때 로딩 인스턴스 같은거... Vue.use()에 바인딩된다.
- css : 전역으로 사용할 css 파일, 모듈, 라이브러리 설정
- modules: 프로젝트 Nuxt.js 모듈을 추가할 수 있음