# 넥스트와 윈도우 내장객체

2020.03.12

## 윈도우 내장객체

1. 글로벌 객체는 단 하나만 유일하게 존재하며 어떠한 컨텍스트가 실행되기 전에 먼저 생성
2. HTML돔에서의 전역 객체 => window
3. 컨텍스트 시작할 때 생성되니, 넥스트 입장에서는 서버사이드 렌더링 중에는 돔이 그려지지 않았으니 윈도우에 접근을 못함

## componentdidmount

> Next.js is universal, which means it executes code first server-side, then client-side. The window object is only present client-side, so if you absolutely need to have access to it in some React component, you should put that code in componentDidMount. This lifecycle method will only be executed on the client. You may also want to check if there isn't some alternative universal library which may suit your needs.

- 윈도우 객체는 오직 클라이언트 사이드에서만 접근 가능하다
- 그러니깐 gip이런데 넣지 말고 cdp에 넣어라
- 마운트 된 이후에 호출되는 cdp는 클라이언트에서 돌아감.

## require vs import

1.  import는 웹팩의 트리 쉐이킹으로 {}로 불러온 모듈들만 선별적으로 가져오고 나머지는 빌드에서 제외된다
2.  코드량을 줄이고 성능적으로도 더 좋다
3.  require을 사용하면 동적으로 모듈을 불러올 수 있지만 불필요한 코드들까지 불러오게 된다
