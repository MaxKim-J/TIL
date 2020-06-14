# this

## 이상한 this
- 다른 대부분의 객체지향 언어에서 this는 클래스로 생성한 인스턴스 객체
- 그러나 자스에서는 상황에 따라 this가 바라보는 대상이 달라짐
- 함수와 객체 구분이 느슨한 자바스크립트에서 this는 실질적으로 이 둘을 구분하는 유일한 기능

## 상황에 따라 달라지는 this
- 자스에서 this는 기본적으로 **실행 컨텍스트가 생성될 때** 함께 결정됨
- 실행 컨텍스트는 함수를 호출할 때 생성되므로 바꿔 말하면 this는 함수를 호출할 때 결정된다

### 전역공간에서의 this
- 전역공간에서의 this는 전역 객체. 전역 컨텍스트를 생성하는 주체가 전역객체
- 브라우저 환경 = `window`, 노드 환경 = `global`
```javascript
// 브라우저 콘솔
console.log(this === window) // true

// node.js 콘솔
console.log(this === global) // true
```
- 전역변수를 선언하면 자스엔진은 이를 **전역객체의 프로퍼티**로 할당
- 변수이면서 객체의 프로퍼티인 경우가 됨
```javascript
var a = 1;
console.log(a); //1
console.log(window.a); //1
console.log(this.a) //1
```
**자바스크립트의 모든 변수는 특정 객체의 프로퍼티로서 동작**함. 변수를 선언하더라도 실제 엔진은 어떤 특정 객체의 프로퍼티로 인식함   
특정 객체 == 실행 컨텍스트의 `lexical environment`=>스코프 때랑 비슷하게 le의 프로퍼티로 변수를 저장, 조회에서 일치할 경우 반환  
정확한 표현 : 전역변수를 선언하면 자바스크립트 엔진은 이를 전역객체의 프로퍼티로 할당한다
- 전역공간에서는 var으로 변수를 선언하는 대신 window의 프로퍼티에 직접 할당하더라도 결과적으로 var으로 선언한 것과 똑같이 동작한다(**[let은 다르다]()**)
```javascript
var a = 1;
window.b = 2;
console.log(a, window.a, this.a); // 1 1 1
console.log(b, window.b, this.b); // 2 2 2

window.a = 3;
b = 4;
console.log(a, window.a, this.a); // 3 3 3
console.log(b, window.b, this.b); // 4 4 4
```

- 처음부터 전역객체의 프로퍼티로 할당한 경우에는 삭제가 되는 반면, 전역변수로 선언한 경우에는 삭제가 되지 않음(delete 연산자를 써서)

### 메서드 호출시 그 내부에서의 this
- 함수와 메서드를 구분하는 차이는 독립성 : 함수는 **그 자체로 독립적인 기능**을 수행하지만, 메서드는 **자신을 호출한 대상 객체에 관한 동작**을 수행함
- 함수호출이냐 메서드 호출이냐 구분 : 도트 연산자로 구분(함수 이름 앞에 대상객체가 명시되어 있는 경우)
```javascript
// 함수 - this가 window(전역 객체)
let func = function(x) {
  console.log(this,x);
};
func(1); // window... 1

// 메서드 - this가 obj(대상 객체)
let obj = {
  method : func
};
obj.method(2); // method:func 2
```
- 메서드 내부의 this : 마지막 점 앞에 명시된 객체가 곧 this가 됨
```javascript
let obj = {
  methodA: function() {console.log(this)},
  inner: {
    methodB: function() {console.log(this);}
  }
};
obj.methodA(); // this === obj
obj.inner.methodB(); // this === obj.inner
```
### 함수 호출시 그 내부에서의 this
- 함수에서 this가 전역객체를 바라보는 현상 === 명백한 설계상 오류
- 함수로서 호출한 함수는(도트 연산자가 없는) **객체 안에 있어도(사실 어디에 있든)** 무족권 this가 지정되지 않고, 스코프 체인상의 최상위 객체인 전역객체가 바인딩된다
- 실행 컨텍스트가 하는 일 : 호이스팅, 스코프 체인 수집, this 바인딩 
- 그래서 함수, 메소드 this 바인딩에 핵심은 대상 객체가 있느냐 없느냐..( . or [ ] )
```javascript
// 객체 안에 "함수 안의 함수", "함수 안의 객체 안에 함수"
let obj1 = {
  outer : function() {
    console.log(this); // obj1
    let innerFunc = function() {
      console.log(this) // window(?????)
    }
    innerFunc(); // 힘수로서 호출된 함수

    let obj2 = {
      innerMethod: innerFunc
    };
    obj2.innerMethod(); //obj2
  }
};
obj1.outer();
```
#### 메서드 내부 함수에서 this 우회
- 호출 주체가 없을 때는 자동으로 전역객체를 바인딩하지 않고, 호출 당시 주변 환경의 this를 상속받아 사용할 수 있게 하고 싶은 경우
- 스코프처럼 this역시 현재 컨텍스트에 바인딩된 대상이 없으면 직전 컨텍스트의 this를 보는 건 어떨까
```javascript
let obj = {
  outer: function() {
    console.log(this); // outer
    let innerFunc1 = function() {
      console.log(this);  // window
    };
    innterFunc1();

    // 변수를 사용하는 방법
    // this를 먼저 저장해놓고 써버리기 = 여기서 this를 부르면 outer겠져
    let self = this;
    let innerFunc2 = function() {
      // 갖다가 붙여버리기
      console.log(self); // outer 객체
    };
    innerFunc();
  }
};
obj.outer();
```

#### this 바인딩하지 않는 함수
- [화살표 함수](arrowFunction.md)를 쓰면 this를 바인딩하지 않는다 (이거 나중에 중요할거같은데...)
- 함수 내부에서 this가 전역객체를 바라보는 문제를 보완
```javascript
let obj = {
  outer : function() {
    console.log(this);   // outer : f
    let innerFunc = () => {
      console.log(this); // outer : f
    };
    innerFunc();
  }
};
obj.outer();
```

### 콜백함수 호출시 내부에서의 this
- 콜백함수도 함수이기때무네.... 기본적으로 this가 전역객체를 참조하지만, 제어권을 받은 함수에서 콜백함수에 별도로 this가 될 대상을 지정하면 그 대상을 참조
- 애매함. 무조건 이거다! 라고 정의하기 힘들지만, 콜백함수의 제어권을 가지는 함수가 콜백 함수에서의 this를 무엇으로 할지 결정, 특별히 정의하지 않은 경우에는 기본적으로 함수와 마찬가지로 전역객체를 바라본다

```javascript
// setTimeout 함수는 지연시간 가진 후 콜백함수를 실행하라는 명령, 전역객체에 바인딩
setTimeout(function() { console.log(this);} ), 300);

// 여기도 전역객체
[1,2,3,4,5].forEach(function(x) {
  console.log(this, x);
})

// addEventListner는 콜백을 호출할 때 자신의 this를 상속하도록 정의되어 있음 - .의 앞부분
document.body.innerHTML += '<button id = "a">클릭</button>'
document.body.querySelector('#a')
  .addEventListner('click', function(e){
    console.log(this, e);
    // 여기서 this는 #a 엘리먼트, 화살표 함수가 아닌 function 키워드로 만들어야 이 this가 먹는다
  });
```
### 생성자 함수 내부에서의 this

#### 생성자 함수
- 어떤 공통된 성질을 지니닌 객체들을 생성하는데 사용하는 함수
- 구체적인 인스턴스를 만들기 위한 틀
- 해당 클래스의 공통 속성이 준비되어 있고 인자를 받아서 인스턴스를 만들 수 있음
- new 명령어와 함께 함수를 호출해야 함

#### 그래서 this는 어디에...?
- 생성되는 해당 인스턴스에 바인딩됨!
- 파이썬에서의 self랑 비슷한,,

```javascript

let Cat = function(name, age) {
  this.bark = "야옹";
  this.name = name;
  this.age = age;
};

let choco = new Cat('초코', 7);
let nabi = new Cat('나비', 5);
console.log(choco, nabi)
/*
Cat {...}
Cat {...}
*/
```

## 명시적 this 바인딩
this에 별도의 대상을 바인딩하여 사용하는 방법

### call
메서드의 호출 주체인 함수를 즉시 실행하도록 하는 명령  
첫번째 인자를 this로 바인딩하고, 이후 인자들을 호출할 함수의 매개변수로 만듬  
함수를 그냥 실행하면 this는 전역객체를 참조 but call메서드 이용하면 임의의 객체 this로 지정 가능  
생성자에서 다른 생성자의 this를 바인딩해서 오버라이딩할때도 사용
```javascript
var func = function(a,b,c) {
  console.log(this,a,b,c);
} 

// 첫인자 this가 될 객체, 나머지 인자는 함수의 파라미터
func.call({x:1}, 4,5,6);

function Person(name, gender) {
  this.name = name
  this.gender = gender
}

function Student(name, gender, school) {
  //Person에 Student 생성자의 this를 바인딩
  Person.call(this, name, gender);
  this.school = school
}
```

### apply
call과 동일하나 두번째 인자들을 배열로 받아서 함수의 파라미터에 넣는다는 특징이 있음  
어떤 함수의 파라미터로 리스트를 묶어서 전달할때 사용하기도 함(es6에서는 전개연산자)
```javascript
var func = function(a,b,c) {
  console.log(this,a,b,c);
} 

func.apply({x:1}, [4,5,6]);
```

### bind
call과 비슷하지만 즉시 호출하지는 않고 넘겨받은 this와 인수들을 바탕으로 새로운 함수를 반환한다  
함수에 this를 미리 적용하는 것과 부분적용 함수를 구현하는 두가지 목적을 지님
```javascript
var func = function(a,b,c,d) {
  console.log(this,a,b,c,d);
}
func(1,2,3,4) //window 

var bindFunc1 = func.bind({x:1});
bindFunc1(5,6,7,8) // this가 바뀐 새 함수를 할당
```
bind로 새로 만든 함수에는 name 프로퍼티에 bound 수동태가 붙는다(추적 용이)  

### 상위 컨텍스트의 this 전달(let self = this 안하고)
```javascript
// call
var obj = {
  outer: function() {
    console.log(this);
    var innerFunc = function() {
      console.log(this);
    };
    innerFunc.call(this);
   }
};
obj.outer();

//bind
var obj = {
  outer: function() {
    console.log(this);
    var innerFunc = function() {
      console.log(this);
    }.bind(this);
    innerFunc();
   }
};
obj.outer();

```

### 화살표 함수 예외
실행 컨텍스트 생성 시 this를 바인딩하는 과정이 **제외된** 것이다  
this가 아예 없는 것이고, 접근하고자 하면 스코프체인상 가장 가까운 this에 접근하게 됨
```javascript
var obj = {
  outer: function() {
    console.log(this);
    var innerFunc = () => {
      console.log(this);
    };
    innerFunc();
  }
}
obj.outer();
```

## Reference
- [코어 자바스크립트 - this](http://www.yes24.com/Product/Goods/78586788?scode=032&OzSrank=1)

