# Redux-Saga

제너레이터 객체의 next()로 리턴받은 객체의 done값이 true가 될때까지, value에 프로미스 객체가 들어와 해당 객체를 이용해 then을 쓸 수 있을때까지 next()를 실행시키며 돌린다.

## 쓸모

- 리액트/리덕스 애플리케이션의 사이드 이펙트, 데이터 패칭이나 브라우저 캐시에 접근하는 순수하지 않은 비동기 동작들을 더 쉽고 좋게 만드는 것을 목적으로 하는 라이브러리
- 리덕스에서 사이드 이펙트만을 담당하는 별도의 쓰레드와 같은 것을 보면 된다. 
- **리덕스의 미들웨어다.** FLUX 구조를 채택하여 **액션함수는 무족권 순수함수**여야만 한다는 극단적인 룰을 가진 리덕스, 모든 사이드 이펙트를 극혐해하고 모든 동작을 동기적으로 처리하는 상태관리앱인 리덕스에서 비동기 동작을 실현하는 방법이다.
- 제너레이터를 사용하여 비동기 동작을 제어한다. async/await랑 비슷함(사실 async await도 제너레이터로 구현했다는 점에서, saga는 async/await보다 추상화 단계가 낮다고 말할 수도 있겠다)
- 서로 다른 비동기 로직의 완결을 yield 키워드로 기다리니, 액션들을 순수하게 유지할 수 있으며 비동기를 동기적으로 프로그래밍한다는 장점이 있다. 

## 리덕스 복습

- 리덕스는 **예측 가능**한 상태 컨테이너 => 동기를 지향하며 순수함수와 불변 개념으로 state의 integrity 보호. 부수효과 배격
- state는 기본적으로 읽기 전용이고, 액션을 통해서만 상태를 갱신할 수 있다

### 리덕스 3대원칙

#### 1. 하나의 객체(store)에 프로그램의 전체 상태값을 저장한다

- 말이 좀 이상한데 그냥 store 하나에 존재하는 하나의 객체에 state를 몰빵하라는 내용이다
- 이건 리액트의 state가 뭐 그렇듯 하나의 상태 트리를 사용하기 위해서이다. 수정 여부를 빠르게 검사할 수 있고, 애플리케이션을 디버깅하거나 검사하기 쉬워진다.

#### 2. 상태는 무조건 읽기전용이며, 어떤일이 일어나는지 기술하는 action으로만 상태를 변경할 수 있다.

- state의 integrity를 보호하기 위해 리덕스가 차용하는 FLUX 아키텍쳐에 따른 방법이다. 모든 변화를 중앙에 집중시키고, 엄격한 순서에 따라 진행되기 때문에 경쟁 조건(race condition)을 없앤다.
- 액션은 state를 변화시키는 목적으로서의 표현이다. 타입명은 동작을 설명하고 payload는 동작을 실행시키는데 필요한 파라미터를 표현한다. 인자명, 인자 객체는 payload로 통일시키는게 좋은데 [FSA 규칙](https://github.com/redux-utilities/flux-standard-action)을 따르기 위함이다.

#### 3. 리듀서 동작은 무조건 순수해야한다.

- 순수함수 : 인자가 동일하면 반환값도 동일하다. 함수 내부 동작에서 인자의 상태를 바꿔서는 안되고 변경동작을 수행하고 이에 부합하는 새로운 반환값을 반환한다.
- 리듀서는 이전 상태값과 액션을 받아다 다음 상태를 반환하는 단순한 상태다. 새로운 상태 오브젝트를 리턴해야만 상태를 업데이트할 수 있다.
- 리덕스 소스를 보면 리덕스는 prevState와 nextState의 메모리 위치를 비교하여 이전 객체가 새 객체와 동일한지 멍청하지만 효율적인 시간복잡도로 단순 체크한다. 만약 리듀서 내부에서 이전 객체의 속성을 변경하면 어짜피 두 상태는 동일한 메모리에 있기 때문에 아무것도 변경되지 않았다고 판단하여 동작하지 않는다.

## 실사용

```js
// 어떤동작 => 다음동작
// worker Saga: USER_FETCH_REQUESTED 액션에 대해 호출될 것입니다
function* fetchUser(action) {
   try {
      const user = yield call(Api.fetchUser, action.payload.userId);
      yield put({type: "USER_FETCH_SUCCEEDED", user: user});
   } catch (e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}

/*
  각각의 dispatch 된 `USER_FETCH_REQUESTED` 액션에 대해 fetchUser를 실행합니다.
  동시에 user를 fetch하는 것을 허용합니다.
*/
function* mySaga() {
  yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
}

```

- 어떤 액션을 컴포넌트에서 발생시키면 사가 미들웨어가 이를 지켜다가 특정 사가함수를 수행함
- 미들웨어는 리덕스 스토어에 연결함
- 리덕스 작동 순서 : 액션(디스패치) => 미들웨어(액션 캐치해서 사가함수 실행) => 리듀서(state 수정) => 스토어 => 뷰

### 참고)기타 API들의 동작

- delay : 이 유틸 함수는 설정된 시간 이후에 resolve하는 promise객체를 리턴. 제네레이터를 정지하는데 사용한다.
- yield : 미들웨어에 yield하는 것으로 이해한다. yield된 오브젝트들은 미들웨어에 의해 해석되는 명령의 한 종류다. **Promise가 미들웨어에 yield되면 미들웨어는 Promise가 완결될때까지 Saga를 일시정지시킨다.** 그니까 yield에서 다음 yield까지는 동기로, yield는 비동기로 처리된다.
- put: 실질적인 이펙트. 미들웨어에 의해 수행되는 명령을 담고있는 액션 객체
- call이든 put이든 리턴값은 걍 뭐 객체다
- takeEvery는 모오든 action dispatch를 관찰하고, takeLatest는 마지막으로 발생된 액션 dispatch의 응답만 캐치한다. 항상 마지막 버전의 데이터만 보여주어야 할때 유용한 것이다.
- fork : 여러개의 saga들을 백그라운드에서 시작할 수 있는 이팩트. yield를 사용해 블락으로만 작성할 수 있는 로직들 사이에서 논블락으로 동작하며 호출 즉시 제어권을 잃는다. call은 블락되는데 반해 fork는 블락이 안된다. 태스크는 백그라운드에서 시작되고 이 태스크는 다음 태스크가 종료될때까지 기다리지 않고 플로우를 진행시킨다. 사가 미들웨어 run을 했을때 비로소 실행된다.
- select: 스토어에 접근할 수 있다.

## 테스트

```js
import test from 'tape';
import { put, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'

// 뭔가 사가함수
import { incrementAsync } from './sagas'

test('incrementAsync Saga test', (assert) => {
  const gen = incrementAsync()

  // 각 statemet가 같은지 되게 직관적으로 비교한다
  // 각 동작이 모두 끊겨서 진행되니 어찌보면 테스트에는 넘나넘나 좋은 꼴임
 assert.deepEqual(
    gen.next().value,
    call(delay, 1000),
    'incrementAsync Saga must call delay(1000)'
  )

  assert.deepEqual(
    gen.next().value,
    put({type: 'INCREMENT'}),
    'incrementAsync Saga must dispatch an INCREMENT action'
  )

  // 사실 종단값이 중요할듯
  assert.deepEqual(
    gen.next(),
    { done: true, value: undefined },
    'incrementAsync Saga must be done'
  )

  assert.end()
});

// 반환값
gen.next() // => { done: false, value: <result of calling delay(1000)> }
gen.next() // => { done: false, value: <result of calling put({type: 'INCREMENT'})> }
// 리턴값이 없는 사가함수
gen.next() // => { done: true, value: undefined }
```

- test 블럭 안에서 사가 함수를 불러다가 테스트를 해볼 수 있다. 사가 함수의 반환값은 이터레이터 오브젝트이기 때문에, yield로 코딩한 statement들을 next 메소드를 사용해서 진행시킬 수 있다. next()는 이터레이터의 진행 상태를 리턴한다.
- delay 유틸은 평범한 값을 리턴하지 않기 때문에 테스트가 좀 곤란한데, delay를 call로 간접적으로 호출하면 호출자가 얻게되는건 Promise가 된다.
- call은 걍 함수 호출하면 되지 무쓸모네,,,가 아니라 테스트하기 좋은 인터페이스를 제공한다. 대충 함수와 인자들을 올바르게 호출했다는 사실만 확인하는 정도라면, 좀더 효율적인 테스트케이스를 만들 수 있기 때무네.. **call은 함수를 호출하고 리턴값은 이펙트에 대한 설명이다. 그 설명값이 next().value로 리턴되기 때문에 간접 호출이 테스트를 더 쉽게 만든다.**

```js
// 종단값이 아닌 동작을 테스트한다
// 음,,, 근데 효율적인 테스트 방법일수는 있어도. 내부동작 테스트하지 말아야하는데 좋은 테스트 방법인진 모르겠다
assert.deepEqual(
  iterator.next().value,
  call(Api.fetch, '/products'),
  "fetchProducts should yield an Effect call(Api.fetch, './products')"
)
```

- 테스트 관점에서 사가 쓰는건 정말 좋은거같다,,, 부수효과 로직을 싹다 몰아다 작성했으니 싹다 몰아서 테스트하믄 댐! UI테스트와 부수효과 테스트를 분리할 수 있다는건 넘 좋은 것이네

## 철학

### 서술적 이펙트(presentational effect)

**사가의 모든 이펙트는 이펙트를 설명하는 객체를 반환하는 것이 바람직하다.**

yield 키워드는 실질적으로 value 와 done 이라는 두 개의 속성을 가진 IteratorResult 객체를 반환한다. value 속성은 yield 표현(expression)의 실행 결과를 나타내고, done 속성은 제너레이터 함수가 완전히 종료되었는지 여부를 불린(Boolean) 형태로 보여줌. 그래서 이펙트는 어쨋뜬 객체임니다

사가 로직을 표현하기 위해 제너레이터로 온 순수 자바스크립트 객체를 yield한다. 이런 오브젝트들을 이펙트라고 부름. 이펙트는 미들웨어에 해석되는 몇몇 정보들을 담고있는 간단한 객체. 어떤 기능을 수행하기 위해 미들웨어에 진행되는 명령.

call은 함수를 호출하고 리턴값은 이펙트에 대한 설명이다. 그 설명값이 next().value로 리턴되기 때문에 간접 호출이 테스트를 더 쉽게 만든다. put은 간접적으로 액션을 호출할 것을 미들웨어에 지시한다. 

제너레이터 함수를 직접적으로 호출하는 것은 테스트에 취약하다는 단점이 있기 때문에(부수효과를 일으키는 함수의 기대값을 하드코딩하거나,,, 귀찮아짐) 같은 원리로 put을 쓰지 않고 dispatch를 바로 한다면 이 동작을 테스트하기가 또 애매해진다. 그래서 액션 호출에도 서술적 해결책을 도입하기 위해 put이라는 api가 있는 거시다

### 이펙트의 추상화

앞에서 말했듯 사가 내부에서 사이드 이펙트를 일으키는 것은 항상 서술적인 이펙트인 거시다. 물론 직접 할수도 있지만 test가 어려울 것이다. 사가가 실제로 한다고 천명할 수 있는 일은, **훌륭한 제어 흐름을 구현하기 위해 (사가 함수 안에서) 이러한 모든 이펙트들을 통합하는 것이다.** yield들을 차례차례 넣음으로써 yield된 이펙트의 순서를 지키는 것처럼....이거는 함수액션을 패치하게해주는 redux thunk보다 동작의 순수성을 보장할 수 있게 한다.

## 심화개념

### 액션 풀링

**결론: 액션 take 전후에 뭔가 종단 관심사적인 로직이 필요한 경우 take를,아닌 경우에는 takeEvery나 takeLatest를 쓰는게 현명하다**

takeEvery 헬퍼 이펙트는 로우레벨의 끝에 있는 강력한 이팩트. take를 감싸고 있는건데 take 이팩트를 사용해 rootSaga에서 풀링을 구현하면, 액션 감시 프로세스의 전체적인 제어를 가능하게 할 수 있다. 약간 프록시나 미들웨어처럼

```js
// takeEvery로 구현
import { select, takeEvery } from 'redux-saga/effects'

function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    const state = yield select()

    console.log('action', action)
    console.log('state after', state)
  })
}

// 풀링과 take로 구현
import { select, take } from 'redux-saga/effects'

function* watchAndLog() {
  // 무한 next 호출이 가능한것이다
  while (true) {
    const action = yield take('*')
    const state = yield select()

    console.log('action', action)
    console.log('state after', state)
  }
}
```

- white(true)가 약간 읭스러울 수 있는데, 제너레이터 함수 안에서의 무한루프에 대해 이해해야한다. 제너레이터는 완료를 향해 달려가는 run-to-completion 함수가 아니기 때문에 미들웨어의 루트사가가 한번 반복될때마다 액션이 일어나기를 쭉 기다린다. 
- takeEvery의 경우에 실행된 태스크는 그들이 다시 실행될때의 관리 방법이 없다. 리소스가 정리되지 않은 부수효과다. 각각 매칭되는 액션에 실행되고 또 실행되지만, 언제 감시를 멈춰야 하는지 관리방법도 없고 걍 계속 감시한다.
- take의 경우에는 컨트롤의 방향이 정반대다. 핸들러에 푸시되는 액션들 대신에 사가는 스스로 액션을 풀링한다. 
- 그러니까 **얼마나 액션을 보고 있을 것인지**를 코딩할 수 있는 것이다. 제너레이터의 연속된 동작들이 계속 반복될 거라는 말.
- 이것도 머 당연하지만 제너레이터 함수는 next()로 진행시키기 때문에, 어떤 액션이 take되서 뭔가 블라킹하게 로직을 진행해서 next()가 몇번 호출되었다면 그 다음 로직을 수행하는 함수가 된다. 즉 제너레이터 로직이 다 종료될때까지 **액션이 발생할때마다 다른 함수로** 바뀐다(는 표현이 적절한지 모르겠네)

```js
import { take, put } from 'redux-saga/effects'

function* watchFirstThreeTodosCreation() {
  // 이렇게하면 action take를 딱 3번만! 반복한다. 3번만 액션을 관찰하는 것
  for (let i = 0; i < 3; i++) {
    const action = yield take('TODO_CREATED')
  }
  yield put({type: 'SHOW_CONGRATULATION'})
}

function* loginFlow() {
  while (true) {
    // 이런 식으로 어떤 동작에 대한 플로우를 계속 짜버릴 수도 있다
    yield take('LOGIN')
    // 로그인된 상태

    // 그리고 이 상태까지 진행된 상태에서 로그아웃을 하는 것
    yield take('LOGOUT')
    // ... perform the logout logic
  }
}
```

### takeEvery, fork에 대해

**결론: 일반 호출과 비교해서 call을 쓰는 이유는 반환값 때문이었고, fork를 쓰는 이유는 call이 generarator를 block하는 동작을 수행하기 때문이다.**

takeEvery는 폴링을 구현한 추상화 단계가 높은 헬퍼함수이다. fork로 논블락킹하게 호출되므로 그냥 takeEvery만 여러개 두면 여러 액션을 take할수 있는 flowSaga함수가 만들어진다. 이벤트 리스너 심는것처럼..(concurrent action to be handled)

```js
function* takeEvery(pattern, saga, ...args) {
  const task = yield fork(function* () {
    while (true) {
      const action = yield take(pattern)
      yield fork(saga, ...args.concat(action))
    }
  })
  return task
}
```

fork는 call과 달리 논블로킹하게 함수를 실행하므로, next()이후에 fork를 만났다면 백그라운드에서 그걸 실행한 뒤, 일단 쌩가버리고 그 다음 next()호출로 넘어간다. 

```js
import { fork, call, take, put } from 'redux-saga/effects'
import Api from '...'

function* authorize(user, password) {
  try {
    const token = yield call(Api.authorize, user, password)
    yield put({type: 'LOGIN_SUCCESS', token})
    yield call(Api.storeItem, {token})
  } catch(error) {
    yield put({type: 'LOGIN_ERROR', error})
  }
}

function* loginFlow() {
  while (true) {
    const {user, password} = yield take('LOGIN_REQUEST')
    yield fork(authorize, user, password) // 서브루틴까지 실행한다 next는 쌩깐다
    // 로그인 시도 중에 실행된 logout 액션도 관찰한다.
    yield take(['LOGOUT', 'LOGIN_ERROR'])
    // 얘의 호출은 멱등적이다. 저장된 토큰이 없다면 사실 아무것도 안할 것이다
    // 다음 로그인을 기다리기전에 저장된 토큰을 지워서 저장소에 아무것도 없는 것을
    // 보장해 주는것이다. 
    yield call(Api.clearItem, 'token')
    // 여기까지 수행되었다면 다시 처음으로 돌아가서 take를 진행할것임
  }
}
```

fork된 task는 cancel로 취소할 수 있다(오호)

```js
import { take, put, call, fork, cancel } from 'redux-saga/effects'

// ...

function* loginFlow() {
  while (true) {
    const {user, password} = yield take('LOGIN_REQUEST')
    // fork는 태스크 오브젝트를 리턴한다. setInterval처럼...
    const task = yield fork(authorize, user, password)
    // 블락되니까 가능한 조건문 로직
    const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
    if (action.type === 'LOGOUT')
      yield cancel(task)
    yield call(Api.clearItem, 'token')
  }
}
```

forking되는 제너레이터는 finally블락에서 cancel된 상황에 맞는 로직을 작성할 수 있다(오호오호)

```js
import { take, call, put, cancelled } from 'redux-saga/effects'
import Api from '...'

function* authorize(user, password) {
  try {
    const token = yield call(Api.authorize, user, password)
    yield put({type: 'LOGIN_SUCCESS', token})
    yield call(Api.storeItem, {token})
    return token
  } catch(error) {
    yield put({type: 'LOGIN_ERROR', error})
    // finally가 적절한 이유는 모든 종류의 완료에서 실행되는 로직이기 때문이다
    // 무조건 보장
  } finally {
    if (yield cancelled()) {
      // ... put special cancellation handling code here
    }
  }
}
```