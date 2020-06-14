# let, const
var을 대체하는 let,const가 나온 이유
2020.01.17

## var의 문제점

### 함수 스코프
var은 정의된 변수가 함수 스코프를 가진다  
var로 정의된 변수는 함수 스코프이기 대문에 함수를 벗어난 영역에서 사용하면 에러가 발생
```javascript
function example() {
  var i = 1;
}
console.log(i); // 참조에러
```
가장 바깥에 정의하면 전역 변수가 됨(전역객체의 프로퍼티로 선언되기 때문에, 다른 함수 실행 컨텍스트에서 참조하게 됨)  
var 안쓰고 정의해도 전역변수가 됨(???? - 이건 그냥 특이한 사항인가)  
```javascript
function example1() {
  i = 1;
}
function example2() {
  console.log(i);
}
example1();
example2(); //1이 출력됨, use strict하면 에러발생
```
var은 또 함수 scope라서 for문에서 정의된 변수가 반복문이 끝나도 계속 남아있음
```javascript
for (var i = 0;i < 10;i++){
  console.log(i)
}
console.log(i); //10
```

### 호이스팅
var로 정의된 변수는 그 변수가 속한 스코프의 최상단으로 끌어올려짐  
변수의 정의만 끌어올려지고 값은 원래 정의했던 위치에서 할당됨  
직관적이지 않은 코드
```javascript
//이래도 돌아간다
console.log(myVar);
var myVar = 1;

// 호이스팅 되기 때문
var myVar = undefined;
console.log(myVar); //undefined
my Var = 1;

// 그래서 이것마저 돌아간다 - 변수가 정의된 곳 위에서 값을 할당하는 경우
console.log(myVar);
myVar = 2;
console.log(myVar);
var myVar = 1;
```

### 이외
var은 한번 정의된 변수를 재정의할 수 있음  
재할당 가능한 변수로밖에 못만듬(상수는?)

### var문제점 짧게 정리

**1. 함수 레벨 스코프**  
함수의 코드 블록만을 스코프로 인정함, 전역함수 외부에서 생성한 변수는 모두 전역변수. 전역변수를 남발할 가능성이 높아짐.  
그리고 for문 안에서 선언한 변수도 코드 블록 외부에서 참조 가능  

**2. var 키워드 생략 허용**  
이러면 어디에서 선언했든 키워드가 없으면 무조건 전역변수가 되는데, 역시 전역변수를 남발하게 됨  

**3. 변수 중복 선언 허용**  
의도치 않은 변수값의 변경이 일어남  

**4. 변수 호이스팅**  
변수를 선언하기 이전에 참조할 수 있어버림  


## const와 let

### 블록 스코프
var은 함수 스코프였으나 const,let은 블록 스코프임  
많은 언어에서 지원하는 방식
```javascript
if (true) {
  const i = 0;
}
console.log(i); //참조에러
// var을 사용하는 경우에는 if문 안에서 생성된 변수가 if문을 벗어나도 계속 살아있음

// 블록 스코프에서 같은 이름의 변수를 정의하는 경우
let foo = 'bar1';
console.log(foo); //bar1
if (true) {
  let foo = 'bar2';
  console.log(foo); //bar2
}
console.log(foo);
```

### 호이스팅은 되지만
변수가 정의된 시점보다 먼저 변수를 사용할 수 없음  
임시적 사각지대
```javascript
console.log(foo);
const foo = 1;
``` 
**왜그러냐면**  
변수는 `선언->초기화->할당`의 3단계를 거치게 됨  
1. 선언 : 변수를 실행 컨텍스트의 변수 객체에 등록(렉시컬 환경), 이 변수 객체는 스코프가 참조하는 대상이 됨
2. 초기화 : 변수 객체에 등록된 변수를 위한 공간을 메모리에 확보, undefined로 초기화됨
3. 할당 : undefined로 초기화된 변수에 실제 값을 할당  

var 키워드로 선언된 변수는 선언과 초기화단계가 한번에 이루어짐(호이스팅 var a = undefined;) 따라서 변수 선언문 이전에 변수에 접근하여도 **스코프에 변수가 존재하기는 하기 때문에** 에러가 발생하지 않고, 다만 undefined를 반환함  

let키워드로 선언된 변수는 선언 단계와 초기화 단계가 분리되어 진행. 스코프에 변수를 등록하기는 하지만 초기화 단계는 변수 선언문에 도달했을 때 이루어짐. 초기화 이전에 변수에 접근하려고 하면 참조 에러 발생(변수를 위한 메모리 공간이 확보되지 않았기 때문) 스코프의 시작 지점부터 초기화 시작 지점까지의 구간을 **일시적 사각지대**라고 부른다
```javascript
let foo = 1; // 전역 변수

{
  console.log(foo); // ReferenceError: foo is not defined
  let foo = 2; // 지역 변수
}
// 호이스팅 되긴 하는데 일시적 사각지대 안에서는 참조 못하는거임
```

### 전역객체와 let
let 키워드로 선언된 변수를 전역 변수로 사용하는 경우, let 전역 변수는 전역 객체의 프로퍼티가 아니다.  
즉, window.foo와 같이 접근할 수 없다. let 전역 변수는 보이지 않는 개념적인 블록 내에 존재하게 된다.  
(이게 주는 효과는??)

### 상수 const
const로 정의된 변수는 재할당이 불가능함  
되도록이면 const 사용하는게 좋음  
**그러나 const로 정의된 객체의 내부 속성값은 수정 가능함**
```javascript
const bar = {prop1:'a'};
bar.prop1 = 'b';
bar.prop2 = 123;
console.log(bar);

const arr = [10,20];
arr[0] = 100;
arr.push(300);
console.log(arr);
// const로 선언한 객체의 주소값은 상수값으로 재할당이 불가능하지만, 프로퍼티는 mutable함
// 객체의 내부 속성값도 수정 불가능하게 하려면 -> immutable.js같은거 써야함 - 기존 객체를
// 변경하지 않고 새로운 객체를 생성(불변객체화)
```
const는 선언과 동시에 할당이 이루어져야 함!

## Reference
- [실전 리액트 프로그래밍 - const, let](http://www.yes24.com/Product/Goods/74223605)
- [poiemaweb-let, const와 블록 레벨 스코프](https://poiemaweb.com/es6-block-scope)


