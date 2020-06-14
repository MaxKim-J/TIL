# Redux

2020.01.22  
드디어 배우는 리덕스  
![리덕스](../img/redux.jpeg)

## (말해 뭐하겠는) 장점
- 상태 관리 코드 분리
- 서버사이드 렌더링시 장점
- **같은 상태값을 다수의 컴포넌트에서 필요로 할 때**
- 부모 컴포넌트에서 깊은 곳에 있는 자식 컴넌에 상태값 전달
- 페이지가 전환되어도 데이터는 살아있어야 할 때

## 원칙
- 전체 상태값을 하나의 객체에 저장한다
- 상태값은 불변 객체다
- 상태값은 순수 함수에 의해서만 변경된다

리덕스를 사용하면 하나의 객체를 직렬화해서 서버와 클라이언트가 프로그램의 전체 상태값을 서로 주고받을 수 있다.  
최근의 상태값을 버리지 않고 저장해 놓으면 실행 취소와 다시 실행 기능을 쉽게 구현할 수 있다  

### 원칙 자세히
1. 하나의 앱 안에는 하나의 스토어
2. 상태는 **읽기전용**
리덕스에서 불변성을 유지해야 하는 이유는 데이터가 변경되는 것을 감지하기 위한 검사를 하기 때문. 이를 통해 객체의 변화를 감지할 때 객체의 깊숙한 안쪽까지 비교를 하는 것이 아니라, 겉핥기 식으로 비교하여 좋은 성능 유지가 목적
3. 리듀서는 순수함수여야 함
- 리듀서는 함수의 이전 상태와 액션 객체를 파라미터로 받는다
- 이전의 상태는 건들이지 말고, 변화를 일으킨 새로운 상태 객체를 만들어서 반환
- 똑같은 파라미터로 호출된 리듀서 함수는 언제나 똑같은 결과물을 반환(!)
순수하지 않은 작업은 리듀서 바깥에서 처리해줘야 하며, 리덕스 미들웨어를 이용하기도 한다

## 유의점
### 상태값 불변객체로 관리
```javascript
const incrementAction = {
  type = 'INCREMENT',
  amount: 123,
}
store.dispatch(incrementAction)
```
상태값은 오직 액션 객체에 의해서만 변경된다  
type 속성값을 제외한 나머지는 상태값을 수정하기 위해 사용되는 정보임  
액션 객체와 함께 dispatch 메서드를 호출하면 상태값이 변경(상태값을 수정하는 유일한 방법 => 이전 상태값과 이후 상태값을 비교해서 변경여부를 파악할 때는 불변객체가 훨씬 유리)

### 순수 함수에 의한 상태값 변경
`!!왜써야 하는지 보충설명 필요!!`

리덕스에서 상태값 변경하는 람수 = 리듀서  
```javascript
(state, action) => nextState
```
리듀서는 이전 상태값과 액션 객체를 입력으로 받아서 새로운 상태값을 만드는 순수 함수임  
순수 함수는 side effect를 발생시키지 않아야 함. 또한 순수 함수는 같은 인수에 대해 항상 같은 값을 반환해야 함.  
순수함수는 테스트에 용이하다(하나의 입력-하나의 출력)  
같은 상태값과 액션 객체를 입력하면 항상 똑같은 다음 상태값을 반환함
```javascript
expect(sayHello2('홍길동', '11:30')).toBe(
  '홍길동님 안녕하세요, 지금은 11시 30분입니다'
)
```

### 리덕스 주요 개념
```shell
# 상태값이 변경되는 과정
액션 => 미들웨어 => 리듀서 => 스토어 => 뷰
```
#### 액션
액션은 type 속성값을 지닌 자바스트립트 객체. 액션 객체를 dispatch 메서드에 넣어서 호출하면 리덕스는 상태값을 변경하기 위해 과정 수행  
주로 액션 생성자 함수로 정의한다  
이유
1. 액션 객체를 만들때 속성값이 들어있도록 강제해야 한다
2. 접두사를 붙인 카멜케이스로 함수명을 관리해야 중복을 피할 수 있다
```javascript
function addTodo({title, property}){
  return {type : 'todo/ADD', title, property};
}
function removeTodo({id}) {
  return {type:'todo/REMOVE', id};
}

store.dispatch(removeTodo({id:123}))
```
액션 타입은 변수로 만들어 따로 관리하는 것도 좋다  
왜?) 변수는 리듀서에서도 필요하기 때무네 export 키워드를 이용해서 외부에 노출
```javascript
export const ADD = 'todo/ADD';
export function addTodo({title, property}) {
  return {type: ADD, title, priority}
}
```
액션 생성자 함수에서는 부수 효과를 발생시켜도 ㄱㅊ(api호출 같은거)

#### 미들웨어
리듀서가 액션을 처리하기 전에 실행되는 함수  
디버깅 목적으로 상태값 변경 시 로그를 출력, 리듀서에서 발생한 예외를 서버로 전송하는 등의 목적으로 활용 가능
```javascript
const myMiddleWare = store => next => action => next(action)

// 뭐야이게 싶은데, 화살표 함수 안쓰면 요로코럼 된다
// 스토어와 액션 객체를 기반으로 필요한 작업을 수행함
// next함수를 호출하면 다른 미들웨어 함수가 호출되면서 최종적으로 리듀서가 호출됨
const myMiddleware = function(store) {
  return function(next){
    return function(action){
      return next(action)
    }
  }
}
```
흐름을 보자, 대충의 로직이 다 있는 리덕스 스토어  
```javascript
import {createStore, applyMiddleware} from 'redux';
// 미들웨어
const middleware1 = store => next => action => {
  console.log('middleware1 start');
  const result = next(action);
  // 다음 미들웨어를 호출하거나 disaptch로 넘어간다
  // 마지막 미들웨어가 디스패치를 호출하게됨
  console.log('middleware end);
  // 전후 작업을 이런식으로 입력해준다
  return result
}

//리듀서
const myReducer = (state, action) => {
  console.log('myReducer')
}

//스토어
const store = createStore(myReducer, applyMiddleware(middleware1));
store.dispatch({type:'someAction'})
```
사용자가 dispatch 호출하면 첫번째 미들웨어부터 실행되고, 마지막 미들웨어가 찐 store.dispatch를 호출하게 됨 - 함수 체이닝  

디버깅에 활용하면 좋다. 이전 상태값과 이후 상태값에 모두 접근 가능  
그외 활용은 한번 보고 넘어가쟈   
```javascript
const printLog = store => next => action => {
  // 전 상태값
  console.log(`prev state = ${store.getState()}`);
  const result = next(action);
  // 마지막 미들웨어가 여기서 디스패치를 호출하기 때문에
  console.log(`next state = ${store.getState()}`);
  // 후 상태값
  return result
}
```
#### 리듀서
액션이 발생했을 때 새로운 상태값을 만드는 함수.
```javascript
(state, action) => nextState
```
리듀서 호출할때는 각 액션에 맞게 데이터를 수정할 것인데...  
이 리듀서 함수는 state 프로퍼티 하나당 그냥 **데이터에 접근해서 수정하기 위해서는 무조건 써야하는 것** 으로 이해하면 편하겠다  
state를 수정하는 경우는 여러가지가 있을 것이고, 이것을 리듀서 함수 하나에 switch문으로 구현하여 액션타입에 따라 다른 상태값 수정을 하게 한다  
```javascript
function reducer(state = INITIAL_STATE, action) {
  // 액션 객체에서 액션타입과 상태값 수정할 프로퍼티 받는다
  switch (action.type){
    // 각 액션별로 타입 case문으로 작성
    case REMOVE_ALL:
    // 상태값은 *불변 객체*로 관리해야 하므로 수정할때마다 새로운 객체 생성
    // 거의 다 전개연산자를 안쓰면 안 될거같음 concat 쓰지 않는 이상...
      return {
        ...state,
        todos:[],
      };
    case REMOVE:
      return {
        ...state,
        todos:state.todos.filter(todo => todo.id !== action.id),
      };
    // 처리할 액션이 없으면 상태값을 변경하지 않는다
    case ADD:
    // 상태값 객체 안의 또다른 중첩된 객체의 state를 수정할 때
    // 가독성 똥망
      return {
        ...state,
        todos: [
          ...state.todos,
          {id:getNewId(), title:action.title, priority:action.priority},
        ],
      }
    default:
      return state;
  }
}
const INITIAL_STATE = {todos:[]};
```
이머라는 라이브러리를 쓰면 불변 객체 관리를 쉽게 할 수 있음(흠....)  

```javascript
import produce from 'immer';

function reducer(state = INITIAL_STATE, action) {
  // 프로듀스 객체를 반환하도록 한번 더 감싸준다
  // 뭔가 프로미스 리졸브랑 비슷하게 생겻긔
  return produce(state, draft => {
    // 이머를 사용하면 produce안에서는 배열 메소드를 써도
    // 기존 상태값은 직접 수정되지 않고 새로운 객체가 생성된다(룸룸)
    switch(action.type){
      case ADD:
        draft.todos.push(action.todo);
        break;
      case REMOVE_ALL:
        draft.todos = [];
        break;
      case REMOVE:
        draft.todos = draft.todos.filter(todo => todo.id !== action.id);
        break;
      default:
        break;
    }
  })
}
```

createReducer라는걸 쓰면 더쉽게 할 수 있음(흠...)
```javascript
const reducer = createReducer(INITIAL_STATE, {
  [ADD]: (state, action) => state.todos.push(action.todo),
  [REMOVE_ALL] : state => (state.todos = []),
  [REMOVE]: (state, action) => (state.todos = state.todos.filter(todo=>todo.id !== action.id))
})
```

**유의점**
1. **id참조** : 리덕스의 상태값은 불변 객체이므로 언제든지 객체의 레퍼런스가 변경될 수 있음 따라서 객체를 참조할 때는 객체의 레퍼런스가 아니라 고유한 ID값을 이용하는게 좋음
2. **순수함수** : 리듀서 함수는 순수함수여야만 함
    - 랜덤함수를 사용하면 같은 인수로 호출해도 다른값 반환. 안된다
    - api호출은 사이드이펙트를 불러일으키므로 안된다. 미들웨어나 액션 생성자에서 해라 

#### 스토어
스토어는 리덕스의 상태값을 갖는 객체  
```shell
액션의 발생은 스토어의 디스패치 메서드로 시작함. => 
스토어는 액션이 발생하면 미들웨어를 실행하고, =>
리듀서를 실행해서 상태값을 새로운 값으로 변경한다 =>  
그리고 사전에 등록된 모든 이벤트 처리 함수에게 액션의 처리가 끝났음을 알린다 
```
스토어에 이벤트 처리 함수를 등록해서 상태값 변경 여부를 알 수 있게 하는 방법도 있음(store.subscribe 메서드)
```javascript
//store에 추가한다
let prevState;
store.subscribe(() => {
  const state = store.getState();
  if (state === prevState) {
    console.log('상태값 같음')
  } else {
    console.log('상태값 변경됨')
  }
  prevState = state;
})
```
## reference
- [실전 리액트 프로그래밍 - 리덕스](http://www.yes24.com/Product/Goods/74223605)
- [리덕스를 리액트와 함께 사용하기-벨로퍼트](https://velog.io/@velopert/Redux-3-%EB%A6%AC%EB%8D%95%EC%8A%A4%EB%A5%BC-%EB%A6%AC%EC%95%A1%ED%8A%B8%EC%99%80-%ED%95%A8%EA%BB%98-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-nvjltahf5e)
