# 클로저
2020.05.14 덧붙임  
아 어려워;

## 정의를 내려보자
1. 클로저는 함수와 그 함수가 선언될 당시의 lexical environment의 상호관계에 따른 현상  
2. 어떤 컨텍스트 a에서 선언한 내부함수 b의 실행 컨텍스트가 활성화된 시점에는  
b의 outerEnvironmentReference가 참조하는 대상인 a의 lexicalenvironment에도 접근이 가능 
내부함수에서 외부 변수를 참조하는 경우 - combination => 스코프 체인으로 가능해진 것임
3. 일단 - **어떤 함수에서 선언한 변수를 참조하는 내부함수에서만 발생하는 현상이 클로져인거 까지 이해**하고 아래 코드를 보면

```javascript
var outer = function() {
  var a = 1;
  var inner = function() {
    // inner에서 a를 찾을 때 => 스코프 체이닝으로 찾음, 위로 올라감
    return ++a;
  };
  // inner함수 자체를 반환시키기
  return inner;
  // inner함수 실행된 시점에는 outer 함수가 이미 실행이 종료된 상태
};

// 결과적으로 이 변수에는 inner함수가 담긴다
var outer2 = outer();

// inner함수가 여기서 호출되고, 실행
console.log(outer2()); // 2
console.log(outer2()); // 3
```
4. 이 코드에서 호출이 지금 outer 실행 컨텍스트 생성 => inner 실행 컨텍스트 생성 => inner 실행 컨텍스트 종료(실행 컨텍스트가 종료되면 LE에 저장된 식별자들에 대한 참조를 지움) => outer 실행 컨텍스트 종료 식으로 진행될 것인데,,
5. outer 함수의 실행 컨텍스트가 종료된 시점에서는 outer 컨텍스트가 가진 변수 참조 정보가 사라지게 됨 => gc
6. **이상한점** : inner함수는 상위 스코프인 outer함수의 lexicalEnvironment를 참조할 것인데(내부에서 선언되었으므로) outer2가 호출되는 시점에서 outer의 실행 컨텍스트는 **이미 종료된 시점**이 아닌가?(outer함수는 실행 종료 시점에 inner함수를 반환하고, outer는 다시 호출되지 않는다)
7. 하지만 inner가 잘 불리고 outer에서 선언한 a도 잘만 증가가 됨. 이 현상은 가비지 컬렉터가 어떤 값을 참조하는 변수가 하나라도 있다면 그 값은 수집 대상에 포함시키지 않기 때문임
    - outer 함수는 실행 종료 시점에 inner 함수를 반환함
    - outer 실행이 종료되서 실행 컨텍스트가 폐기되더라도 내부함수인 inner은 outer2를 통해 호출될 수 있는 가능성이 있음
    - 언젠가 호출하면 외부 스코프를 참조해야하므로(정확히 말하면 inner 함수 실행 컨텍스트의 OuterEnvironmentReference가 outer의 LexicalEnvironment를 필요로 할 것이므로 gc대상에서 제외된다.)

8. 함수의 실행 컨텍스트가 종료된 이후에도 LexicalEnvironment에 속하는 변수가 모두 가비지 컬렉팅 대상에서 제외되는 경우는 **지역변수를 참조하는 내부함수가 외부로 전달된 경우에만** 발생.

9. 그래서 **결론** : 클로저란 어떤 함수 A에서 선언한 변수 a를 참조하는 내부함수 B를 외부로 전달할 경우 A의 실행 컨텍스트가 종료된 이후에도 변수 a가 사라지지(gc되지) 않는 현상

10. 리턴만이 외부로 전달하는건 아님 => 지역변수를 참조하는 내부함수를 외부에 전달하면 무조건 클로저 => 그럼 그 함수의 실행 컨텍스트가 끝났더래도, 외부 함수가 참조하는 변수는 gc되지 않는다
```js
// #1 셋인터벌
(function(){
  var a = 0;
  var intervalId = null;
  // gc안댐
  var inner = function() {
    if(++a>=10){
        clearInterval(intervalId);
    }
  };
  // window.setInterval을 설정하는 것 => 다른 실행 컨텍스트로 지역변수를 옮겨버림
  // 외부에서 다른 함수 스코프에 해당하는 변수를 참조
  interValid = setInterval(inner,1000);
})();

// #2 이벤트리스너
(function() {
  // gc안댐
  var count = 0;
  var button = document.createElement('button');
  button.innerText = 'click';
  button.addEventListner('click',function(){
    console.log(++count, 'times clicked')
  })
  document.body.appendChild(button);
})
```

## 클로저와 메모리 관리
1. 클로저도 일종의 메모리 누수? => 라고 말하기엔 의도적으로 변수값을 메모리에 남겨놓은 것이므로 막 나쁜건 아님
2. 물론 최적화를 위해서 클로저의 필요성이 사라지면 더는 메모리를 소모하지 않게끔 해주면 됨
3. 밑에 이런 식으로 다 호출 했으면 함수 참조를 끊는 방식으로 진행해도 됨
```javascript
// ()() : 함수를 선언한 뒤 바로 실행
var outer = (function() {
  var a = 1;
  var inner = function() {
    return ++a;
  };
  return inner;
})();
console.log(outer()); // 2
console.log(outer()); // 3
// 참조형인 함수 대신에 null을 할당, 그 다음 컨텍스트에서는 outer을 갖다 쓰지 않으므로 gc의 대상이 됨
outer = null;
```  

## 어떨때 쓰이나?

### 콜백에서 외부 데이터 사용
- 이벤트 리스너, 셋인터벌 등 부수효과 만들어내는 함수들
```js
var fruits = ['apple','banana','peach'];
var $ul = document.createElenent('ul');

// forEach문 컨텍스트의 변수 fruit
fruits.forEach(function(fruit) {
  var $li = document.createElement('li');
  $li.innerText = fruit;
  // 이벤트리스너가 fruits 안의 fruit를 계속 참조 => 클로져
  // 이게 addEventListner가 반복되서 계속 실행되고 있을때는 fruit라는 외부 변수를 참조 
  //* 이벤트 리스너가 forEach문의 lexical을 참조해야함

  // 익명 함수를 만들어서 넘겨줬음
  $li.addEventListner('click',function() {
    alert('your choice is ' + fruit);
  })
  $ul.appendChild($li);
});
document.body.appendChild($ul);
```
- 여기서 addEventListner의 콜백을 따로 분리해줄 수도 있음
- addEventListenr는 콜백함수를 호출할 때 첫번째 인자에 이벤트 객체를 주입하기 때문에 bind로 첫번째 인자를 씹어버리거나(이때는 this와 함께 인자를 바인딩해주니 클로저를 사용하지 않는 셈이 된다), 화살표 함수로 만들어 전달해야함
- addEventListner 콜백은 함수에 첫번째 인자로 이벤트 객체인 e를 넣어 전달 => 화살표 함수로 선언하면 반환된 함수가 글루 들어감
- 이벤트 리스너 콜백은 무조건 function()으로 들어가며, 이때 this는 해당 element에 바인딩
```js
var fruits = ['apple','banana','peach'];
var $ul = document.createElenent('ul');

var alertFruitBuilder = function(fruit){
  return function() {
   alert('your choice is ' + fruit);
  }
}

// forEach문 컨텍스트의 변수 fruit
fruits.forEach(function(fruit) {
  var $li = document.createElement('li');
  $li.innerText = fruit;
  $li.addEventListner('click', alertFruitBuilder)
  $ul.appendChild($li);
});
document.body.appendChild($ul);
```

### 커링함수
- 커링함수 : 여러개의 인자를 받는 함수를 하나의 인자만 받는 함수로 나눠서 순차적으로 호출될 수 있게 체인 형태로 구성한 것 
- 커링은 한번에 하나의 인자만 전달하는 것을 원칙으로 함. 중간 과정상의 함수를 실행한 결과는 가 다음 인자를 받기 위해 대기만 할 뿐 + 마지막 인자가 전달되기 전까지는 원본 함수가 실행되지 않음
- 실행 결과를 재실행할때 원본 함수가 무조건 실행된다
```js
// 중간 과정상에서 대기만 할 뿐 마지막 인자가 전달되기 전까지는 원본함수가 실행되지 않음
// 좀 더 목표에 가까운 함수를 리턴값으로 가질 뿐임
var curry3 = function(func) {
    return function(a) {
      return function(b) {
        return func(a,b)
      };
    };
}

// 아직 덜 실행된 상태
// curry3가 인자를 함수로 받고, 그 다음 인자도 받은 상태인데
// 이 상태는 curry3의 실행 컨텍스트 + 그 아래 함수의 실행 컨텍스트가 만들어지고
// 지역변수를 참조할 수 있게 된다
var getMaxWith = curry3(Math.max)(10);

// 다 실행되서 값을 리턴하는 상태
// 마지막 인자를 받는 상태인데, 이때는 이미 실행 컨텍스트가 없지만
// 지역변수를 참조할 가능성이 있는 함수가 변수에 선언되었으므로 GC되지 않았음
console.log(getMaxWith(8));
console.log(getMaxWith(25));

// 화살표함수 이용
var curry5 = func => a => b => c => d => e => func(a,b,c,d,e);

```
- 매우 직관적으로 클로저가 쓰이는 예시라고 할 수 있겠다. 각 단계에서 받은 인자들을 모두 마지막 단계에서 참조할 것이므로 **각 단계의 인자들은 커링의 중간 결과물이 리턴되고 상위의 실행 컨텍스트가 종료되었다고 해서 GC되지 않고 메모리에 차곡차곡 쌓였다가 마지막 호출로 마지막 실행 컨텍스트가 종료된 이후에 GC됨**
- 함수형 프로그래밍의 지연 실행 : 원하는 시점까지 실행을 지연시켰다가 실행하는 것이 요긴한 상황이라면 커링을 쓰기에 적합한 상황, 프로젝트에서 자주 쓰이는 매개변수가 항상 비슷하고 일부만 바뀌는 경우에도
```js
var getInformation = baseUrl => path => id => fetch(baseUrl + path + '/' + id );
```
- 리덕스 미들웨어도 커링을 이런식으로 활용한다 

## Reference
- [코어 자바스크립트 - 클로저](http://www.yes24.com/Product/Goods/78586788?scode=032&OzSrank=1)
