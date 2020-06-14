# 프론트엔드의 상태관리
개념적인 부분들을 좀 정리하고 싶어서

## 애초에 상태가 무엇?
- 상태는 사실 뭐 데이터
- 객체가 가지고 있는 데이터 => 상태들을 통해 객체를 표현하게 된다, 상태에 따라서 객체는 달라진다

## 상태관리
- 데이터에 맞춰 적절하게 UI, UX를 설계하고 구현
- 인스타 팔로워수가 100명이하일때, 1000명일때, 억명일때 => 달라지는 UI

## Redux
리액트의 전역 상태관리 라이브러리(react-redux)  

### 써야하는 이유
- 상태관리에 필요한 코드 분리
- 서버사이드 렌더링시 장점(이건 잘 모르겟네 뭐지)
- 같은 상태값을 다수의 컴포넌트에서 필요로 할때
- 부모 컴넌 깊은 곳에 있는 자식 컴넌에 상태값 전달
- 페이지가 전환되어도 데이터는 살아있어야 할 때

### 쓰는 법(대충)
- 클래스 컴포넌트에서는 mapStateToProps로 하고 prop에서 사용
```js
function mapStateToProps(state) {
  return { user: state.user }
}

export default connect(mapStateToProps)(Login);
```
- 함수형 컴포넌트에서는 useReducer
### 리덕스 패턴
flux와 유사한점이 많은데, 살짝 변형한 것
![](https://cdn.filepicker.io/api/file/eHSa386Q2qz4PUCDNmPA)
액션 => (미들웨어) => 리듀서 => 스토어 => (state에 반영) => 뷰 변경

- state: 리덕스의 state은 웹앱 전체의 상태를 관리
- actions : 액션은 type 속성값을 지닌 자바스크립트 객체, 액션 객체를 dispatch메서드에 넣어 호출하면 리덕스는 상태값을 변경하기 위해 과정 수행, 주로 액션 생성자 함수로 정의(타입 프로퍼티와 state 변경에 필요한 파라미터)
- middleware : 리듀서가 액션을 처리하기 전에 실행하는 함수, 커링이 쓰이구, createstore함수에 인자로 같이 넣어준다, 이전 상태값과 이후 상태값에 모두 접근이 가능
- **reducer** : 액션이 발생했을 때 새로운 상태값을 만드는 함수, 인자로 들어온 action값에 따라 분기할 수 있도록 만든다, 여기까지 오면 store가 업데이트 됨
- store은 컨테이너 컴포넌트와 연결되있고 store에 있는 데이터를 참조하거나 dispatch 메서드에서 액션 이름 인자로 넣어 호출하여 store을 변경시킴 


### 원칙
1. store은 하나만 써라
    - 전체 애플리케이션 상태가 하나의 객체로 표현될 수 있게
    - 만들수는 있다
    - 뭐 개발 관련 도구를 잘 쓰지 못한다고 하는데 잘 모르겠다 두개 이상을 써본적이 없어서....
2. store의 state는 오직 action을 통해서만 변경한다(상태는 읽기전용)
    - 막 컨테이너 컴넌에서 store값을 직접 참조해 값 막 변경하고 할 수 없다. 전역값은 보호되고 action에 정의한 로직으로만 store값을 바꿀 수 있음
    - 불변성에 대한 멘션 : 내부적으로 데이터가 변경되는것을 감지하기 위해 shallow eqality 검사를 하기 때문 => 객체의 깊숙한 안쪽까지 비교하지 않고 겉핥기 식으로 비교하여 좋은 성능 유지
3. reducer은 순수함수
    - action과 이전 state를 입력으로 받아 새로운 state를 리턴하는 역할을 수행함.
    - 같은 action과 state를 입력으로 주면 항상 같은 state를 리턴해야함
    - 테스트나 디버깅할때 편하고 이것 역시 store 값을 보호하기위한 노력의 일환인듯
    - 순수하지 않은 작업은 미들웨어에서 수행하면 된다(api호출이나 랜덤값, 리덕스 사가 쓰던지...)

### 덕스패턴 리덕스
1. 액션 정의
2. 액션 생성자 함수 정의
3. state 초기값 정의
3. 리듀서 함수 정의
4. export default reducer => index.js에서 받아 createReducer해주고 createElement 그거 함수 있는데 끼워넣어준다

## Vuex
뷰의 전역 상태관리 라이브러리  
- 리덕스랑 거의 비슷한데 좀 더 간결한 느낌이다 특히 컴포넌트 연결이 무지 단순하다(this로 store에 접근이 된다는게 충격적인 부분)
- 난리 부르스를 칠 수 있는 자유로운 리덕스 구조(덕스패턴 쓰면 좀 정리가 잘 되지만)에 비해 vuex는 단순하게 객체 하나 주고 거기다가 프로퍼티 채우는 느낌임

### 구조(vuex 객체의 프로퍼티)
- state : 전역 state의 초기 상태 정의
- getters : 굳이 따지자면 redux의 미들웨어 같은 역할을 하고, 컴포넌트에서 가공하지 않아도 스토어에서 가공해서 컴포넌트에 데이터를 보냄
- mutation: 리덕스의 리듀서 함수, state를 어캐 바꿀지 정의
- actions : dipatch의 대상, mutation을 커밋하여 store 업데이투 반영 (context.commit, payload는 인자)

### 스무스한 비동기처리
- 비동기처리는 mutation이 아니고 actions에서 해야 맞다
- commit을 호출한 것이 데브툴에 남는데, 변이에서 비동기 로직 만들면 실패할 수도 있고, 불순한 효과를 불러일으키기 때문에 비동기 요청이 성공했을 때 commit을 남기는게 좋더라

### modules
- 뷰엑스 객체 여러개 선언 가능 => 스토어를 여러개 선언할 수있음
- 참조도 무척 쉽게 가능함
```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA'의 상태
store.state.b // -> moduleB'의 상태
```


### 리덕스와의 단편적인 다른점
- 컴포넌트 연결하는게 넘넘넘넘넘넘넘편함 걍 this.$store 개꿀
- action 함수에 불순 동작이 끼워져있어도 무방(순수함수일 필요가 없음)
- 상태 읽기전용인건 똑같음(컴넌에서 참조한들 못바꿈)
- 스토어를 여러개 스무스하게 가질 수 있음(modules)
- action 함수에서 스토어 업데이트할때 리액트마냥 불변값 바꾸는 로직으로 안바꿔도 됨


