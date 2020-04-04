# 1. 타입스크립트 - init
2020.04.04

## node.js에 설치하기

### 라이브러리 설치

```bash
# -D 옵션임
npm i -D typescript ts-node @types/node
```

- 타입스크립트는 기본적으로 ESNext 자바스크립트 문법을 포함하고 있으나 자바스크립트와는 완전히 다른 언어임
- 타입스크립트 컴파일러는 타입이 명시적으로 설정되어있어야만 코드가 문법에 맞게 작성되었는지를 검증해 코드 동작
- 라이브러리 앞에는 `@types/`가 붙어야 함 : `index.d.ts`를 포함하여 명시적 타입을 검사하고 함수들이 올바르게 사용되었는지 파악
- 웹 브라우저나 node가 기본적으로 제공하는 타입들의 존재도 그냥은 알지 못하므로 `@types/node`설치 필요

### tsconfig.json
```bash
tsc --init
```
- tsconfig.json을 설정해줘야 함 + 필요한 옵션만 설정해서 간략하게
- 설정 중에 `include`라는 항목 : 프로젝트의 타입스크립트 소스 파일 위치 지정, 기본적으로 `./src`와 `.src/utils`에 다 넣는다.
- tsc 트랜스파일러는 컴파일 옵션과 대상 파일 목록 두 가지를 입력받는다 (`compilerOptions`와 `include`)

#### 옵션 자세히
- `module` : 웹 브라우저에서는 amd, 웹 브라우저 아닌 환경에서는 commmonJS. 대상 플랫폼이 웹 브라우저인지 노드인지를 구분해 그에 맞는 모듈 방식으로 컴파일
- `moduleResolution` : commonJS-node/amd-classic
- `baseUrl`, `outDir` : 트랜스파일된 es5 자바스크립트 파일을 저장하는 디렉터리를 설정. tsc는 `tsconfig.json`이 있는 디렉터리에서 실행되므로 `.`이 있는 위치에서 baseUrl 키값을 설정하는게 보통임.
- `target` : 트랜스파일할 대상 자바스크립트의 버전을 설정
- `paths` : 소스 파일의 import문에서 from부분을 해석할 때 찾아야 하는 디렉터리 설정(`node_modules`)
- `esModuleInterop` : 브라우저에서 동작하는 amd라이브러리를 commonjs에서도 잘 동작하게 만드는 옵션
`sourceMap` : 키값이 true이면 트랜스파일 디렉터리에는 `.js`파일 이외에도 `.js.map` 파일이 만들어짐. 이 소스맵 파일은 자바스크립트 코드가 타입스크립트 코드의 어디에 해당하는지를 알려준다고.
`downLevelIteration` : 생성기라는 타입스크립트 구문이 정상적으로 동작하려면 옵션을 트루로 해줘야 함
`noImplicitAny` : 매개변수에 타입을 명시하지 않은 코드의 경우 암시적으로 `any`타입을 설정한 것으로 간주. => 경고가 뜬다, 이 옵션을 `false`로 설정하면 이 경고가 안뜸
### package.json
```json
// ts가 아니군
"main" : "src/index.js",
"scripts" : {
    "dev" : "ts-node src",
    "build" : "tsc && node dist"
}
```
- `npm run dev` : 개발 중 `index.ts` 실행하는 명령어
- `npm run build` : 개발이 완료된 후 프로젝트를 배포하기 위해 dist 디렉토리에 자스 파일을 만들때