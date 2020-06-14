# npm 해설서
2020.02.10  
npm에 대한 정리  
node package manager  

## npm 명령어들
꼭 알아야 할것들만 일단 정리  

### `npm init`
`package.json`을 만들어주는 명령어, 프로젝트 폴더의 모듈 의존성 관리하는 파일  
>**알면 좋은 속성**
entry point : 자스 실행 파일 진입점. 보통 마지막으로 module.export한 파일을 지정, main속성
scripts : npm 명령어를 저장해두는 부분, 콘솔에서 해당 명령어를 입력하면 해당 스크립트가 실행됨. 가능한 명령어들은 예약어로 지정되어 있음.


### `npm install 모듈명`
`node_modules`에 모듈 설치  
`--save`가 원래 `dependencies`에 패키지 이름을 추가하는 옵션이었지만  
npm@5부터는 기본값으로 설정되어 따로 붙이지 않아도 됨  

### `npm install --save-dev 모듈명 (-D)`
`devDependencies`에서 따로 관리하는 개발용 모듈들 설치  
배포할 때는 상관 없는, 개발용 패키지들만 이곳에서 따로 관리  

### `npm install -global 모듈명 (-g)`
모듈 전역 설치, 전역 모듈은 package.json에 등록되지 않는다!!  
아래 이런식으로 하면 devDependencies에 기록하고, npx붙여 실행 => 전역 설치와 같은 효과
```shell
npm install --save-dev rimraf
npx rimraf node_modules
```

### `npm outdated`
업데이트 가능한 패키지가 있는지 살펴보기  
current와 wanted가 다르다면 업데이트가 가능 => npm update

### `npm uninstall 모듈명`
해당 모듈을 `node_modules`와 `package.json`에서 제거

## 패키지 시맨틱 버전과 버전 기호
### 시맨틱 버전
1.2.3 뭐 이렇게 버전 번호 매기는 것  
>**의미**
major : 첫번쨰 자리, 하위 호환이 안 될 정도로 패키지의 내용이 수정되었을 때 올림. 문제가 있어야 함  
minor : 두번째 자리, 하휘 호환이 되는 기능 업데이트 시. 문제가 없어야 함  
patch : 간단한 버그 수정, 새로운 기능이 문제가 있어 수정. 문제가 없어야 함

버전을 배포한 이후에는 이를 수정하지 않고, 수정사항이 있을 때는  
patch든 minor든 major든 업데이트를 진행해야 하기 때문에 패키지 버전의 안정성, 신뢰성이 올라감  

### 버전 기호
**^(캐럿)** : minor 버전까지만 설치 또는 업데이트 허용
```javascript
npm i express@^1.1.1 // 1.1.1버전부터 2.0.0까지 설치
```
**~(틸드)** : patch 버전까지만 설치 또는 업데이트 허용
```javascript
npm i express@~1.1.1 // 1.1.0버전부터 1.2.0까지 설치
```
~보다는 ^가 많이 쓰이는데, minor까지는 하위 호환이 보장되기 때문  

**>, <, >=, <=, =**
알기 쉽게 초과, 미만, 이상, 이하, 동일을 뜻함  
```javascript
npm i express@>1.1.1 // 1.1.1보다 높은 버전이 설치
```

**latest**
항상 최신 버전의 패키지를 설치 == x
```javascript
npm i express@latest // express최신버전 설치
npm i express@x // express최신버전 설치
```
그리고 뭐 상식이지만 패키지가 최신 버전이라고 무조건 좋은건 아님  
의존성 깨질수도 있고 그러므로 조심해야함  

## package.json vs package-lock.json
이상적인 패키지 설치 과정 : `package.json`이 항상 동일한 `node_modules`를 생성하는 것  
하지만 이는 가끔 의도적으로 동작하지 않음 그 이유는  
- npm 버전이 다르거나 다른 종류의 패키지 매니저 사용
- 이미 설치된 패키지의 새 버전 출시, 이미 설치된 버전과 다른 버전을 사용하는 경우 등등

이기 때문  

의존성을 가지고 있는 다른 패키지가 업데이트 되었을 경우, 오류를 내는 상황이 생길 수 있는데  
`package-lock`은 의존성 트리에 대한 정보를 가지고, **그 파일이 작성된 시점의 의존성 트리**가 다시 생성될 수 있도록 보장하는 역할을 한다  

그리고 다른 모듈에 의존하는 모듈을 개발할 때, 모듈 a가 b에 의존하고, b가 c에 의존하는 상황일 때, c의 업그레이드가 있을 경우  
새 버전이 b의 의존성을 수정하지 않는다고 하면, a의 작성자는 b와 동일한 사람이 아닐 경우 **새로 게시된 버전의 c를 가져오지 않겠다고** 이야기할 수 없게 됨=>골아파짐  

내 모듈의 의존성이 다른 모듈의 의존성 갱신에 달려있는 이상한 꼴이 된다는 것  
`package-lock`은 의존성을 바꿨을 때의 **`node_modules` 폴더의 스냅샷을 저장하는 방식**으로 이를 방지함.  
의존성 변화를 계속 trace하고, 그 결과 `package-lock`은 적당한 버전의 의존성을 가진 모듈들을 명시하게 됨.   
```JSON
{
  // A의 모듈의 빌드 스냅샷
  "name": "A",
  "version": "0.1.0",
  ...metadata fields...
  // 모듈 트리를 이런식으로 만들어줌 객체안의 프로퍼티
  "dependencies": {
    "B": {
      "version": "0.0.1",
      // 버전을 ^~>< 없이 명시해서 적어놓음
      // 패키지를 설치할 때마다 의존성을 일일이 계산하지 않고
      // 명시된 버전을 바로 설치하게 됨
      "resolved": "https://registry.npmjs.org/B/-/B-0.0.1.tgz",
      "integrity": "sha512-DeAdb33F+"
      "dependencies": {
        "C": {
          "version": "git://github.com/org/C.git#5c380ae319fc4efe9e7f2d9c78b0faa588fd99b4"
        }
      }
    }
  }
}
```
`package-lock`이 있는 상황에서의 `npm install`은  
1. `package-lock.json` 파일에 명시된 대로 모듈 트리가 생성됨. 파일에 명시된 모듈이 존재하면 해당 파일을 사용하고, 존재하지 않은 경우 version에 맞는 파일을 사용함
2. 누락된 의존성 라이브러리가 있으면 일반적인 방식으로 설치  

프로젝트 소스 형상 관리 차원에서 `package-lock`은 정말 필요함 => 이렇게 하면 코드를 만지는 사람 모두 똑같은 의존성 구조를 가진 파일이 설치됨

## npm vs yarn
>**yarn**
페이스북에서 만든 패키지 매니저  
npm과 마찬가지로 `package.json`을 통해 의존 패키지를 구분하고  
프로젝트에서 무슨일 해야할지 결정

### 왜나옴?
1. npm한계 : 패키지가 많아짐에 따라 빌드 성능이 좋지 않다
2. npm보다 빠르다
3. 모든 패키지를 유저 디렉토리에 저장해 캐싱한다

## Reference
- [Node.js 교과서 - 패키지 관리하기]()
- [개발새발 - package-lock.json은 왜 필요할까?](https://hyunjun19.github.io/2018/03/23/package-lock-why-need/)
- [package-lock.json에 대해 알아보기](https://medium.com/@trustyoo86/package-lock-json%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-57ba51bdc365)
- [yarn 톺아보기](https://www.holaxprogramming.com/2017/12/21/node-yarn-tutorials/)