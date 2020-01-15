# 화살표 함수
그래도 한번은 정리해야겠다는 마음에...

## 화살표 함수 선언
function 키워드 대신에 =>를 사용하여 간략한 방법으로 함수선언
```javascript
// 매개변수 지정
() => {} //매개변수 없음
x => {} //매개변수 한개 - 소괄호 생략
(x,y) => {}//매개변수 여러개 - 소괄호 생략 불가

// 함수 몸체
x => { return x*x }
x => x*x // 함수 몸체가 한줄의 구문이라면 중괄호 생략 가능, 암묵적으로 리턴됨

() => {return {a : 1}; }
() => ({a: 1}) //객체 반환시 소괄호 사용(?- 뭔가 더헷갈려...)

// 멀티라인 블락
() => {
  const x = 10;
  return x*x;
}

// 매개변수 목록 내 비구조화
// 콜론????
var f = ([a, b] = [1, 2], {x: c} = {x: a + b}) => a + b + c;
f();  // 6
```

## 화살표 함수 호출
화살표 함수는 익명 함수로만 사용할 수 있으므로  
화살표 함수를 호출하기 위해서는 함수 표현식만 사용(선언식 X)

```javascript
// 그냥 함수 선언식
var pow = function(x){return x*x};
console.log(pow(10))

// 화살표 함수 표현식
const pow = x => x * x;
console.log(pow(10));

// 콜백으로 사용할 때
const arr = [1,2,3];
const pow = arr.map(x => x * x);
console.log(pow);
```
## this 차이
function 키워드로 생성한 일반 함수와 화살표 함수의 가장 큰 차이점은 this임

### 일반 함수의 this
일단 메소드 호출이 아니라 함수 그냥 호출은 무조건 this가 window에 바인딩됨

### 화살표 함수의 this
화살표 함수의 this는 언제나 **상위 스코프의 this**를 가리킨다!
일반 함수가 전역객체 계속 바라보는 거 보완하는 문법이라는 것...(**lexical this**)  
일반함수가 전역 컨택스트에서 실행될 때 this를 정의, 화살표 함수는 this를 정의하지 않음  
this를 클로저 함수처럼 바깥의 함수에 접근해서 this를 사용한다  
```javascript

//1 
function Prefixer(prefix) {
  this.prefix = prefix;
}

Prefixer.prototype.prefixArray = function (arr) {
  // this는 상위 스코프인 prefixArray 메소드 내의 this를 가리킨다.
  return arr.map(x => `${this.prefix}  ${x}`);
};

const pre = new Prefixer('Hi');
console.log(pre.prefixArray(['Lee', 'Kim']));


//2 
function Person(){
  this.age = 0;
  setInterval(() => {
    this.age++; // |this|는 Person 객체를 참조
  }, 1000);
}

var p = new Person();
```
## 화살표 함수 선언해선 안되는 경우

### 1. 메소드
[메소드는 무조건 대상 객체를 this로 바인딩하는데](this.md) 메소드를 화살표 함수로 선언하면 대상 객체가 아닌 상위 컨텍스트의 this인 **전역객체**를 가리킨다
```javascript
const person = {
  name: 'Lee',
  sayHi: () => console.log(`Hi ${this.name}`)
  // this가 window에 바인딩
};

person.sayHi(); // Hi undefined
```

### 2. 프로토타입
화살표함수로 객체 메소드 정의하였을 때와 똑같은 문제 발생  
근데 프로토타입에 왜 함수할당하지???(나중에 공부..)

### 3. 생성자함수
화살표 함수는 생성자 함수로 사용할 수 없음  
생성자함수는 prototype 프로퍼티를 가지고 prototype 프로퍼티가 가지는 프로토타입 객체의  
constructor를 사용한다. 하지만 화살표 함수는 **prototype 프로퍼티를 가지고 있지 않음**.

```javascript
const Foo = () => {};

// 화살표 함수는 prototype 프로퍼티가 없다
console.log(Foo.hasOwnProperty('prototype')); // false

const foo = new Foo(); // TypeError: Foo is not a constructor
```
### 4. addEventListner의 콜백함수
addEventListner의 콜백함수 안의 this가 이벤트 리스너에 바인딩된 요소(currentTarget)을 가리키게 하려면 화살표 함수를 쓰면 안된다  
화살표 함수로 콜백 선언하면 상위 컨택스트인 전역 객체를 가리킴
```javascript
// Bad
var button = document.getElementById('myButton');

button.addEventListener('click', () => {
  console.log(this === window); // => true
  this.innerHTML = 'Clicked button';
});
```
## Reference
[poiema web-화살표 함수](https://poiemaweb.com/es6-arrow-function)
[mdn web docs - 화살표 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98)