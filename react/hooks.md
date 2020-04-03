# React hooks
2020.04.03  
리액트 훅에 대한 몇가지 유용한 정보들  

## 훅을 내놓은 리액트 팀의 입장
- 리액트에서 클래스 컴포넌트를 제거하진 않는다
- 클래스 뒤집어엎으면서 훅 적용하려 하지 말고 점진적으로 훅을 적용하라
- 왜 훅을 만들었나?
    - **컴포넌트 사이에서 상태와 관련된 로직을 재사용하기 어려움** : 리액트는 컴포넌트에 재사용 가능한 행동을 붙이는 방법을 제공하지 않음(render props, 하이어오더 컴포넌트), 훅은 계층 변화 없이 상태 관련 로직을 재사용할 수 있도록 도와줌
    - **컴포넌트들 너무 복잡함** : 생명주기 메서드를 기반으로 쪼개는 데 초점을 맞추지 말고, 훅을 통해 로직에 기반을 둔 작은 함수로 컴포넌트를 나누자 + 리듀서
    - **클래스 사람 혼동시킴** : 클래스가 코드의 재사용성과 코드 구성을 어렵게 만들고, 리액트를 배우는데 큰 진입장벽이었다. 다른언어들과 다르게 작동하는 클래스 + this 바인딩의 이상한 작동까지.. 

## 당최 훅이 뭐죠
훅은 함수 컴포넌트에서 react state와 생명주기 기능을 **연동(hook into)**할 수 있게 해주는 함수. hook은 클래스 안에서 동작하지 않으며, 클래스 없이 리액트를 사용할 수 있게 해준다. 

## 생명주기 메소드와 훅의 대응
- constructor : 함수형 컴포넌트는 일단 컨스트럭터가 필요업따.. state는 useState쓰셈
- getDerivedStateFromProps : 렌더링할때 처리하셈 return 전에 업데이트 하지말지 확인해보기
```js
function ScrollView({row}) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevRow, setPrevRow] = useState(null);

// 훨씬 자연스럽게 렌더링 여부를 확인할 수 있다
//* 최초 렌더링이었다면 null, update되는 상황이었으면 prevRow정보가 남아있을 것 
  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```
- shouldComponentUpdate : React.memo를 쓰세요
- render : 함수 컴포넌트의 몸체 그 자체와 같습니당. 함수가 호출되는 것이 클래스의 render가 실행되는 것과 같다는 것이지요..
- componentDidmount, componentDidUpdate, componentWillMount : useEffect는 저거 다 짬뽕한것임
- 에러따리 에러따 getSnapshotBeforeUpdate, componentDidCatch, getDerivedStateFromError : 얘네랑은 상응하는 훅이 없지만 곧 추가될 것임니다..
- 비동기는 요러케 접근해보세요
```js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';

function SearchResults() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('react');

  useEffect(() => {
    let ignore = false;

    // 클래스 메소드를 정의하듯 useEffect안에 함수를 정의 
    async function fetchData() {
      const result = await axios('https://hn.algolia.com/api/v1/search?query=' + query);
      if (!ignore) setData(result.data);
    }

    fetchData();
    return () => { ignore = true; }
  }, [query]);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
```

## 안 쓸수 없는 내장훅 2개
### useState
```js
 const [count, setCount] = useState(0);
```
- state 변수를 선언할 수 있게 해준다
- 일반적으로 일반 변수는 함수가 끝날 때 사라지지만 state는 react에 의해 사라지지 않음
- 인자로 넘겨주는 값은 초기값임
- useState는 두 쌍을 반환 - state 변수 자체와 해당 변수를 갱신할 수 있는 함수 두 가지 쌍을 반환
- state변수를 리렌더링할때 기억하고, 가장 최근에 갱신된 값을 제공함
- 컴포넌트가 다음 렌더링을 하는 동안 useState는 현재 state를 제공
- this를 안써도 된다는게 좋은 점 (직접 사용 가능, 클래스는 state가 멤버변수였기 때문에 클래스에서 접근하는건 this가 필요)
- **어떻게 한 함수를 통해 무수한 컴포넌트들이 독립된 상태값을 갖는가** : 리액트 계속해서 현재 렌더링되는 컴포넌트를 트랙킹함. 메모리 셀이라고 부르고 각각의 컴포넌트를 대표하는 자바스크립트 객체가 존재. useState를 호출하면 현재의 셀을 읽고 포인터를 움직여 스테이트 정보를 확보. 그래서 각 컴포넌트에서 불리는 useState는 모두 독립적인 값을 가질 수 있음
- **state 묶어버리기** : useState 초기값에다가 객체로다가 여러가지 변수들을 하나로 묶어줄 수가 있다. 그런데 결국 state도 불변객체로 관리가 되야하기 때무네(state값을 계속 변형시키는게 아니라 새로운 값을 받아 대체(replace)한다 - *merge가 되었던 this.setstate와는 좀 다른 지점*) 이 한 스테이트 값을 바꿀 때마다 펼침연산자나 새로운 객체를 넣는게 귀찮을수는 있다.
```js
 const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
 // 뭐 이런식이란거지
 function handleWindowMouseMove(e) {
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }

// 그렇지만 리액트 측에서는 용이하게 바꾸려면 그냥 useState 여러번 쓰는 방법을 추천
// 연관있는 state끼리
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
```

### useEffect
```js
  const [count, setCount] = useState(0);

  // componentDidMount, componentDidUpdate와 같은 방식으로
  useEffect(() => {
    // 브라우저 API를 이용하여 문서 타이틀을 업데이트합니다.
    document.title = `You clicked ${count} times`;
  });
```
- **부수효과(side Ehhects)** : 데이터 가져오기, 구독 설정하기(관찰자 패턴에서), 수동으로 리액트 컴포넌트의 돔을 수정하는 것까지 모두 부수효과이다. 리액트 컴포넌트에서는 일반적으로 두 종류의 side effects가 있는데 **정리가 필요한것과 그렇지 않은 것** 두가지로 나눌 수 있다.

- **부수효과라는게 정확히 뭘까** : 외부의 상태를 변경하는 것 또는 함수로 들어온 인자의 상태를 직접 변경하는 것. 원래의 목적과 다르게 다른 효과 또는 부작용이 나는 상태. 순수하지 않은 함수는 부수효과를 일으킨다. 

- **정리를 안하는 부수효과** : 클래스 컴포넌트에서는 돔을 업데이트한 뒤에 추가로 코드를 실행해야하는 경우가 있었다. 네트워크 리퀘스트, 돔 수동 조작, 로깅 등은 정리가 필요없는 경우 => 실행 이후 신경쓸 것이 없음
- 클래스에서 : render메소드 그 자체는 부수 효과를 발생시키지 않고, 부수효과가 발생하는 지점은 리액트가 돔을 업데이트하고 난 이후 => CDM과 CDP
- 훅에서 : useEffect 사용 : 컴포넌트가 렌더링 이후에 어떤 일을 수행해야하는지 말하기. 리액트는 useEffect에 넘긴 함수를 기억해뒀다가 dom업데이트 수행한 이후에 불러낸다. 
- 컴포넌트 내부에 둠으로써 effect를 통해 state에 접근할수 있음. 훅은 자바스크립트의 클로저를 이용하여 리액트에 한정된 api를 고안하는 것보다 자바스크립트가 이미 가지고 있는 방법 이용해 문제 해결
- **useEffect**는 랜더링 이후에 매번 수행된다 : 첫번째 렌더링과 이후의 모든 업데이트에서 수행됨. **마운트 업데이트 컴포넌트 렌더링시의 일련의 단계들은 잊고 그냥 useEffect는 그저 렌더링 이후에 발생하는 것으로 생각해보자** 리액트는 effect가 수행되는 시점에 이미 돔이 업데이트 되었음을 보장한다 
- 정리하는 부수효과 : 구독을 설정한 뒤 정리해서 메모리 누수를 방지해야 하는 효과. 훅에서는 반환하는 함수가 이를 수행한다. 이펙트가 반환하는 함수는 정리를 위한 함수! - 컴포넌트가 마운트 해제되는 시점에 정리를 실행하게 됨 => 메모리 누수되면 리액트에서 경고창뜨는 그것...
```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // effect 이후에 어떻게 정리(clean-up)할 것인지 표시합니다.
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

- 딱 3개만 기억하면 될듯 : 1. 부수효과 관련한 모든 로직은 다 useEffect에서, 2. 이 훅이 함수를 리턴할 경우 부수효과를 정리하는 용도, 3. 최적화를 위해 함수 말고 다른 인자로 배열을 넘겨줄 수 있다.

## 훅의 규칙
1. 최상위 레벨에서만 훅을 호출해야 한다(블락 안에서 호출 금지) :  컴포넌트가 렌더링 될 때마다 항상 동일한 순서로 훅이 호출되는것을 보장하기 위해
2. 오직 리액트 함수 내에서 훅을 호출해야 한다. 일반적인 자바스크립트 함수에서 호출 불가능. 다만 커스텀 훅에서 다른 훅을 호출하는것 자체는 가능
3. 훅은 호출되는 순서에 의존하기 때문에 예시가 항상 똑같이 실행된다. 그러니까 최상위 레벨에만 훅이 존재해야함.(조건문이나 블락 안에서 맥락이 바뀌면 무결성을 잃을 수 있음) 정 조건문을 써야 할 때는 훅 내부에 조건문을 쓰던지 해야한다.