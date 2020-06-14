# 리액트 이벤트 핸들링에는 왜 화살표 함수를 쓸까

2020.02.02  
[#클로저](../javascript/closure.md) 정리하다가 갑자기 생각났음  

## 의문
```javascript
render(){
  return(
    <button onClick={() => {() => {this.handleClick()}}>더하기</button>
  )
}
```
뭐 이런식으로 해야되는데 왜 메소드를 바로 전달하지 않고 리턴값으로 전달하는지 궁금했었음  

## 해답

그냥 `onClick = {this.handleClick}`요런 식으로 바인딩하면, 이때의 this는 클래스를 가리키는 것이 맞지만, `handleClick()`함수가 호출될 때의 this는 클래스가 아니라 전역 객체를 의미한다(이벤트 리스너의 콜백 함수로 선언된 함수가 들어가나보지) 

### 왜그럼?
함수가 실행되는 환경을 생각해보면 되는데  
this.handleClick이 실행되는 순간 `(function() { console.log(this)})();`가 실행이 되는건데, 이때의 this는 **전역객체**임. 함수 자체만 놓고 보면 자스엔진은 this가 뭔지 모르기 때문에 그냥 전역객체랑 연결시켜버림. 그래서 요 함수의 this를 명시적으로 표현해줘야 함.

### 근데 window 아닌 undefined가 나오는 이유는?  
strict mode라서 그렇다고는 하는데 추가 공부 필요

### addEventListner와의 연관성은??
모르겠음 추가 공부 필요.. 일단 addEventListner의 콜백함수는 화살표 함수로 쓰면 이벤트 객체가 아니라 전역객체에 this가 바인딩되니까 쓰면 안된다고는 알고 있었음

### 해결책

1. bind 메소드 사용
```javascript
class BindTest extends React.Component {
  handleClick() {
    console.log(this)
  }
  render() {
    return (
      <button type="button" onClick={this.handleClick.bind(this)}>
        Goodbye bind
      </button>
    )
  }
```
bind메소드 사용하여 클래스 안의 상황에서의 this를 handleClick에 바인딩 해주거나(뭐 constructor에 써도 되겠다)

2. 화살표 함수 사용
```javascript
class BindTest extends React.Component {
  handleClick() {
    console.log(this)
  }
  render() {
    return (
      <button type="button" onClick={() => {this.handleClick}}>
        Goodbye bind
      </button>
    )
  }
```
화살표 함수를 이용하여 이벤트 바인딩을 해주면 화살표함수의 this는 무조건 상위 컨텍스트의 this를 가리키므로 언제나 class를 가리키게 된다

3. 리액트가 권장하는 방법 : 화살표 함수로 선언하고 바인딩

```javascript
// 바로 이벤트 바인드에 화살표 함수를 때리면, 랜더링 될 때마다 새로운 함수를 생성하게 됨
// 콜백 함수 내에서 재랜더링을 굳이 발생시키는 경우 성능문제가 있으므로
// 젤 깔끔하긴 하다
class LoggingButton extends React.Component {

  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

## Reference
- [제로초 블로그 - 컴포넌트 이벤트 연결(바인딩)](https://www.zerocho.com/category/React/post/578232e7a479306028f43393)
- [React Documentation](https://ko.reactjs.org/docs/handling-events.html)