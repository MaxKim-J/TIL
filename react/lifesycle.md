# 리액트 컴포넌트 생명주기

리액트에서는 컴포넌트가 실행되거나 업데이트되거나 제거될 때 특정한 이벤트 발생하게 설정 가능  
리액트에서는 각 컴포넌트의 여러 시점에 event handling 할 수 있도록 api를 제공함 


## 시점

컴포넌트 생명주기는 크게 3가지의 시점으로 나뉨  
1. mounted(마운트)
2. update(갱신)
3. unmounted

## 마운팅 생애주기

- 컴포넌트가 마운트되거나 언마운트되면 호출되는 메소드
- render() 메소드 자체도 컴포넌트 생애주기의 일부
- 클래스 생성자 constructor은 생애주기 메서드가 아니지만, 컴포넌트 초기화에 클래스 생성자를 사용하므로 순서상 존재. 항상 최초로 호출되는 함수
- get~으로 시작되는 메소드들은 리액트 16에서 추가된 라이프사이클. 리액트 17부터는 componentWillMount, componentWillUpdate,componentWillReceiveProps 라이프 사이클이 deprecated됨
- 메소드 실행 순서 
`constructor(props) -> componentWillMount() -> render() ->
componentDidMount() -> componentWillUnmount()`

### conponentWillMount()(v16.3 이전)

  1. 프로퍼티를 얻고 상태를 초기화하면 `componentWillMount()` 호출 - **dom이 렌더링 되기 전에 호출**, setState 호출해서 컴포넌트가 렌더링 되기 직전에 컴포넌트 상태 바꿈
  2. `componentWillMount` 메서드 안에서 정의한 비동기 콜백 내부에서 setState를 호출한다면 실행 시 실제 setState 호출이 발생하는 시점은 컴포넌트가 렌더링된 이후가 될 것 => setState를 사용해도 render가 호출되지 않는다.

### componentDidMount()

  1. 컴포넌트가 렌더링된 직후에 호출됨
  2. 이 메서드에서 setState쓰면 갱신 생애주기 메서드가 호출되고 컴포넌트가 다시 렌더링된다 
  3. Dom을 사용하는 라이브러리 같은게 있을 때 사용

### componentWillUnmount()

  1. 컴포넌트가 파괴되기 직전에 수행
  2. didMount나 WillMount에서 시작한 백그라운드 프로세스를 componentWillUnmount에서 종료시킬 수 있음
  3. 쓸모없는 백그라운드 프로세스 종료

## 갱신 생애주기 메소드

- 컴포넌트의 상태가 바귀거나 부모로부터 새로운 프로퍼티가 도착한 경우 호출  
- 컴포넌트가 갱신되기 전에 자바스크립트를 처리하거나 갱신된 후에 dom에 대한 작업 가능    
- setState 호출될 때마다 갱신 생애주기 메서드가 호출됨 무한 재귀루프가 발생할 수 있음
- 따라서 `componentWillReceiveProps`안에서 바뀐 프로퍼티 값에 따라 상태를 갱신해야 할 때만 setState호출함

### props 업데이트 할때

- componentWillReceiveProps(nextProps)(getDerivedStateFromProps)
- shouldComponentUpdate(nextProps, nextState)
- componentWillUpdate(nextProps, nextState)
- render()
- componentDidUpdate(prevProps, prevState)

### state 업데이트 할때

- shouldComponentUpdate(nextProps, nextState)
- componentWillUpdate(nextProps, nextState)
- render()
- componentDidUpdate(prevProps, prevState)

### componentWillReceiveProps()

- 새 프로퍼티가 컴포넌트에 전달된 경우에 호출. setState를 호출할 수 있는 유일한 갱신 생애주기 메소드
- props 업데이트 할때만 호출됨

### shouldComponentUpdate()

- 새 프로퍼티와 이전 프로퍼티 값을 비교 새 프로퍼티는 인자 기존 프로퍼티는 this.props로 접근
- prop이나 state의 전후값을 비교하여 `componentWillUpdate()`를 적용하는 조건을 return으로 달아줌
- 메서드가 true를 반환하면 나머지 갱신 생애주기가 발생. 

### componentWillUpdate()

- 컴포넌트가 갱신되기 직전에 호출 

### componentDidUpdate()

- 컴포넌트가 갱신 된 후의 DOM과 상호작용

## v16.3 이후 

![reactLifesycle](../img/lifesycle.jpeg)
- 초기 렌더링을 제어하는 방법이 많아져서 헷갈림
- 오류 처리 인터럽트 동작시에 메모리 누수 발생 가능
- 가장 혼란을 야기하는 라이프 사이클이란다

### getDerivedStateFromProps()

- componentWillReceiveProps(nextProps)와 componentWillMount()를 대체
- 메서드로 컴포넌트가 인스턴스화 된 후, 새 props를 받았을때 호출(mount상황이든 props update 상황이든)
- state를 갱신하는 객체를 반환하거나, props가 state 갱신을 필요로 하지 않음을 나타내기 위해 null 반환할 수 있음(setStatus를 사용하지 않음)
- static 키워드를 붙여서 인스턴스 메서드로 선언해야 함

```jsx
static getDerivedStateFromProps(nextProps, prevState) {
if (prevState.name !== nextProps.name) {
  return { name: nextProps.name };
}

return null;
}
```

### getSnapShotBeforeUpdate()

-  componentWillUpdate의 대체 역할로 작성된 메소드, Dom 업데이트 직전에 호출


# Reference
 - [리액트 교과서 - 컴포넌트와 라이프사이클 이벤트](https://velog.io/@kyusung/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B5%90%EA%B3%BC%EC%84%9C-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EC%99%80-%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4-%EC%9D%B4%EB%B2%A4%ED%8A%B8)
 - [리액트의 생명 주기 함수](https://www.zerocho.com/category/React/post/579b5ec26958781500ed9955)