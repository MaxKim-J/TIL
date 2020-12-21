# mobX

리덕스와 쌍벽을 이루는 리액트 상태관리 라이브러리   
기본적으로 객체지향 느낌이 강하며, component와 state를 연결하는 리덕스와 달리 데코레이터 제공으로 해결함  
*mobX 5부터는 proxy를 사용하기 때문에 IE에서 사용할 수 없다!!  
**전체적으로 context랑 유사한 지점이 많은데 굳이 store로 분리하지 않아도 사용할 수 있는 지점이 더욱 그렇고..

## flow

1. state: 어플리케이션의 데이터 상태, 스프레드시트의 data cell 처럼 object, array, primitive, reference의 그래프 형태로 어플리케이션을 구성한다.
2. derivations: 파생값. 어플리케이션으로부터 자동으로 계산되는 모든 값을 뜻한다. 이 값들을 간단한 값에서부터 복잡한 시각적 html 표현까지 다양한 값이 될 수 있다. 일종의 computed나 getters
3. reaction : derivation과 유사하지만 값을 생성하지 않는 함수. 대신 자동으로 특정 작업들을 수행시켜 주고, 대체로 I/O와 관련된 작업들을 수행한다. reaction은 적당할때에 자동으로 DOM을 업데이트하게 해주고 네트워크 요청을 하도록 해준다. 
4. action : state를 변경하는 앱 내부의 요청. 액션들을 리덕스와 똑같이 모두 동기적으로 처리된다. 

## 빠른 예제

### decorator

```
yarn add babel-preset-mobx
yarn add mobx mobx-react
```

데코레이터를 사용해야 한다: 데코레이터는 현재 자바스크립트의 정식 문법이 아니고, 아직 TC39에 머무르는 문법이다. 그래서 바벨 사용이 필수적이다. `babel-preset-mobx`를 깔아주고 babel의 프리셋 배열에 같이 넘겨줘야 한다. CRA를 사용한다면 eject를 하거나 craco같은거 써야된다.

### observable/observer

컴포넌트에 옵저버 데코레이터를 명시해주는 식으로 컴포넌트와 store을 연결하게 된다. observer는 mobx.autorun이라는 함수를 가지고 컴포넌트 render함수를 감싸게 되면서 observable한 데이터가 변경될 때 마다 observer가 선언된 컴포넌트는 재랜더링해준다. 

mobx를 사용하면 더이상 setState를 사용하지 않고 observable한 데이터를 직접 조작할 수 있게 된다. 

```jsx

import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

@observer
class Login extends Component {
  @observable email = ''
  @observable passwords = ''

  return (<></>)

  @action.bound
  onChange(event) {
    const {name, value} = event.target;
    this[name] = value;
  }
}

```

action 데코레이터 : mobx에서 데이터를 조작할 때는 action 데코레이터를 선언해야 함. observable로 선언한 상태값들의 this를 바인딩해준단다.

### store

중앙 집중식 저장소를 만들어보쟈  

```jsx

import { observable, action } from 'mobx'

class TestStore {
  @observable userList

  constructor() {
    this.userList = []
  }

  // 이거 순수 안해도 되나보넹
  @action.bound
  addUser(newUser) {
    this.userList.push(newUser)
  }
}

export default TestStore

```

스토어를 만들었으면 src/index.js에서 프로바이더를 만들어준다

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'; // MobX 에서 사용하는 Provider
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import CounterStore from './stores/counter'; // 방금 만든 스토어 불러와줍니다.

const counter = new CounterStore(); // 스토어 인스턴스를 만들고

ReactDOM.render(
  <Provider counter={counter}>
    {/* Provider 에 props 로 넣어줍니다. */}
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
```

기본적으로 class 형태로 작성한다. store에 저장할 데이터를 선언하고, constructor 안에서 초기화한다. 컴포넌트와의 연결은 이런식으로 한다

```jsx
import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

@inject("testStore")
@observer
class Login extends Component {
  @observable email = ''
  @observable passwords = ''

  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {return <></>}

  @action.bound(event) {
    const {name, value} = event.target;
    this[name] = value;
  }

  onSubmit() {
    const {email, password} = this
    this.props.testStore.({email, password})
  }
}

export default Login
```

inject를 사용하면 provider을 통해 연결된 store을 특별한 구문 없이 사용할 수 있게 된다(흑마법...). props를 통해 메소드에 접근할 수 있다.

## 면면

### 함수형 컴포넌트랑 같이 쓰기

mobx-react가 제공하는 observer로 래핑된 함수형 컴포넌트에서 useState같은 훅 API를 사용하려고 하면 훅은 함수형 컴넌에서만 쓰셈 하는 에러가 발생하는데, mobx-react의 observer API는 클래스 컴포넌트를 리턴하는 hoc이기 때문이다. 훅을 사용하면서 mobx-react의 store에서 데이터를 가져오려면 mobx-react v6, 혹은 mobx-react-lite를 사용해야 한다. 

#### inject => useStore

훅을 사용하는 함수형 컴포넌트를 위한 inject hoc는 별도로 제공하지 않으므로 store을 가져오기 위해서는 커스텀 훅이 필요하다. 원래도 provider로 store을 제공하니깐, useContext로 context를 넣어주는 방식으로 사용한다. 이거 보면 스토어는 무족권 하나여야 덜불편할거같은데..?

```jsx
import React from 'react';
import { MobXProviderContext } from 'mobx-react';

/**
 * React hooks를 사용하는 컴포넌트에서 store를 가져올 때 사용한다.
 * 참조) https://mobx-react.js.org/recipes-migration#hooks-for-the-rescue
 */
function useStores() {
  return React.useContext(MobXProviderContext);
}

export default useStores;
```

React.useContext는 파라미터로 전달된 Context의 현재값을 반환한다. 거기에 mobXProviderContext를 사용하면 mobx-react의 Provider가 제공하는 store 객체를 가져올 수 있다.

```jsx
import { observer } from 'mobx-react'
import { useStores } from '../useStores'

const UserInfo = observer(() => {
  const { user } = useStores()
  return (
    <div>
      name: {user.name}
    </div>
  )
})
```

훅으로 특정 데이터를 가져오는 식의 커스텀 훅도 가능하다

```jsx

import { useObserver } from 'mobx-react'

function useUserData() {
  const { user, login } = useStores()
  return useObserver(() => ({ // useObserver를 사용해서 리턴하는 값의 업데이트를 계속 반영한다
    userName: user.name,
    isLoggedIn: login.isLoggedIn,
  }))
}

// 렌더링 잘댄다
const UserInfo = () => { 
  const { username, isLoggedIn } = useUserData()
  return (
    <div>
      {username} is {isLoggedIn ? 'on' : 'off'}
    </div>
  )
}
```

- store은 클래스니까 데코레이터 써서 만들어도 무방하다

### API 좀 더 자세히

1. Observable State : mobx를 사용하고 있는 앱의 상태는 옵저버블한다. 상태는 관찰할 수 있는, 관찰 받는 상태. 앱에서 사용하고 있는 상태는 변할 수 있으며 만약에 특정 부분이 바뀌면, 몹엑스에서는 정확히 어떤 부분이 바뀌었는지 알 수 있다. 
2. Computed Value : 기존의 상태값과 다른 연산된 값에 기반하여 만들어질 수 있는 값. 성능 최적화를 위하여 많이 사용된다. 연산에 기반되는 값이 바뀔때만 연산하게 하고 바뀌지 않았다면 그냥 기존의 값을 사용할 수 있게 해줌
3. Reactions :  값이 바뀜에 따라 해야 하는 일을 정하는 것을 의미. 아무것도 안하는데 뭔가 로그같은거 남기는 미들웨어 같은 느낌. 
4. Actions : 상태에 변화를 일으키는 것. Observable State에 변화를 일으키는 코드를 호출한다면 하나의 액션임

#### 리액트 없이 쓰기

사실 리액트 종속적인 라이브러리는 아니라서 Vue나 다른데도 쓸 수 있다함  
예제를 뜯어보니 거의 무슨 프록시의 쌉상위호환정도 되는 라이브러리인듯 함  

```js
import { observable, reaction, computed, autorun } from 'mobx';

// Observable State 만들기
const calculator = observable({
  a: 1,
  b: 2
});

// **** 특정 값이 바뀔 때 특정 작업 하기!
reaction(
  () => calculator.a,
  (value, reaction) => {
    console.log(`a 값이 ${value} 로 바뀌었네요!`);
  }
);

reaction(
  () => calculator.b,
  value => {
    console.log(`b 값이 ${value} 로 바뀌었네요!`);
  }
);

// **** computed 로 특정 값 캐싱
// 이 값에서 의존하는 값이 바뀔때마다 미리 값을 계산해놓고 조회할때는 캐싱된 데이터를 사용한다
const sum = computed(() => {
  console.log('계산중이예요!');
  return calculator.a + calculator.b;
});

// **** autorun 은 함수 내에서 조회하는 값을 자동으로 주시함
autorun(() => console.log(`a 값이 ${calculator.a} 로 바뀌었네요!`));
autorun(() => console.log(`b 값이 ${calculator.b} 로 바뀌었네요!`));
autorun(() => sum.get()); // su

sum.observe(() => calculator.a); // a 값을 주시
sum.observe(() => calculator.b); // b 값을 주시

calculator.a = 10;
calculator.b = 20;

//**** 여러번 조회해도 computed 안의 함수를 다시 호출하지 않지만..
console.log(sum.value);
console.log(sum.value);

// 내부의 값이 바뀌면 다시 호출 함
calculator.a = 20;
console.log(sum.value);
```

#### 클래스 사용하기

```js
import { decorate, observable, computed, autorun } from 'mobx';

class GS25 {
  basket = [];
  
  get total() {
    console.log('계산중입니다..!');
    // Reduce 함수로 배열 내부의 객체의 price 총합 계산
    // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    return this.basket.reduce((prev, curr) => prev + curr.price, 0);
  }

  select(name, price) {
    this.basket.push({ name, price });
  }
}

// decorate 를 통해서 각 값에 MobX 함수 적용
// 데코레이터 폴리필 없어도 됨
decorate(GS25, {
  basket: observable,
  total: computed,
  select: action
});

const gs25 = new GS25();

// 말그대로 트랜잭션, 모든 작업이 끝날때 까지 스코프 밖의 실행문은 무시
transaction(() => {
  gs25.select('물', 800);
  gs25.select('물', 800);
  gs25.select('포카칩', 1500);
})

```

### 비동기???

리덕스의 액션과 달리 부수효과를 일으킬 수 있다는 충격적인 사실  
비동기 액션이 있을 수 있는데, 비동기 동작과 이에대한 상태 변화는 또다른 액션 안에서 이루어져야 한다. 비동기 작업은 맘대로 해도 되는데 상태변화는 격리된 블럭에서 시키자  
runInActions 콜백, action안의 action  

## 성능이 망가지지 않으려면 지켜져야 하는 규칙

사실 몹엑스를 쓸 때뿐은 아니고... 지키면 좋을듯

1. 리스트를 렌더링 할때는 컴포넌트에 리스트 관련 데이터만 props로 넣는다 : 다른 prop이나 state이 바뀌었을 때 리스트 전체가 통틀어서 재랜더링 될 필요는 없기 때문에
2. 세부참조는 최대한 늦게하자 => 최대한 세트로 들고가자, 세부참조는 안에서 한다, prop여러개인거보다 그게 더 성능이 좋음
3. 함수는 미리 컴포넌트에 바인딩하고(컴포넌트 내부에서 스토어의 액션이나 이런것들을 가져와서), 파라미터는 호출되는 시점이 아니라 바인딩한 함수의 내부에서 넣어주기

## 프로젝트에 도입

0. 크게는 **스토어 만들어서 useStore로 접근시키기** 랑 **useContext로 store객체를 같이 내려주기** 가 있는 것 같은데... 전자가 좀 더 익숙한 개발이 가능하고, context사이에 provider 햄버거와 시도때도 없이 useContext안에 context를 넣어야 하는....게 싫기때문에 전자로 갈 것이다..
1. 음..... CRA일때 데코레이터는 쓰지말자
2. 객체가 클래스로 작성하는 것 보다 익숙하니까 + 데코레이터 안 쓸거니까 store을 객체 형태로 메소드와 작성하고 observable로 감싸준다 => 사실 클래스로 써도 무방할거같긴 하다 데코레이터 안써도 객체로 뭐가 뭔지 표기가 가능해서
3. useStore 훅 만든다
4. 데코레이터를 사용하면 observer로 컴포넌트를 감싸는 클래스형 컴포넌트를 반환하는 것이었으므로 useObserver을 이용하여 jsx를 감싸서 리턴한다
5. mobX-react-devtool : 사용한다