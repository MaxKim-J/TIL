# 3. 타입스크립트 - function
2020.04.05

## 함수 선언문

`1)매개변수들의 타입`과 `2)리턴값의 타입` 정보가 필요하다  
타입 주석을 매개변수에 관해서도 생략할 수 있지만, 변수 생략하는것보다 더 헷갈릴 수 있다  

```ts
function add(a:number, b:number):number {
    return a+b
}

// 리턴값이 없는 함수 - void
function printMe(name:string, age:number):void{
    console.log(`name:${name}, age:${age}`)
}
```

### 함수 시그니처
변수에 타입이 있듯이 함수도 타입이 있는데, 함수의 타입을 함수 시그니처라고 함  
매개변수 없고 리턴값 없을때의 함수 시그니처 : `() => void`  
꼭 넣어야함? 필수인가?
> (매개변수 1타입, 매개변수 2타입, ...) => 반환 타입

```ts
//? 쓰임새를 잘 모르겠음 시그니처를 따로 변수에 할당할 수 있고 계속 돌려쓰나
let printMe : (string, number) => void = function(name:string, age:number):void{}
```

### type키워드
기존에 존재하는 타입을 이름만 바꿔서 사용할 수 있게 해주는 키워드, 타입 별칭  
함수 시그니처에 타입 별칭을 만들어 타입 주석을 수월하게 붙일 수 있다  
함수 타입, 함수 시그니처를 명시하면 매개변수의 개수나 타입, 반환 타입이 다른 함수를 선언하는 잘못을 미연에 방지할 수 있음
```ts
//굳이 두번 써야되는거 같은데,,,
// 코딩 작성 과정에서 헷갈리는걸 방지할 수는 있을 것 같음

type stringNumberFunc = (string, number) => void
let f: stringNumberFunc = function(a:string, b:number):void{}
let g: stringNumberFunc = function(c:string, d:number):void{}
```

### 선택적 매개변수
오 이건 좀 쩌는듯;;  인터페이스처럼 함수의 매개변수에도 다음처럼 물음표를 붙일 수 있으며  
선택적 매개변수라고 한다
```ts
function fn(arg1:string, arg?:number):void{console.log(`arg:${arg}`)}

// 선택적 매개변수가 있는 함수의 시그니처는 다음처럼 타입 뒤에 물음표를 붙인다
type OptionalArgFunc = (string, number?) => void
```

### 자스의 함수형 언어적 특성(함수표현식)
1. 자스 함수 : 자바스크립트의 함수는 `Function`객체의 인스턴스  
2. 함수 표현식 : 함수형 언어의 핵심 기능  
3. **일등 함수** : 함수형 언어의 판단 기준. 함수와 변수를 구분하지 않는다는 컨셉
```js
// 심벌 f가 변수인지 함수인지 구분을 할 수 없다. 변수와 함수를 차별하지 않는다
let f = function(a,b) {return a+b};
f = function(a,b) {return a-b};
```
4. **표현식** : 리터럴, 연산자, 변수, 함수 호출 등이 복합적으로 구성된 코드 형태
5. `evaluation` : 연산자를 만나면 eager evaluation을 적용하여 빨리 계산하고, 표현식을 만나면 일단 변수를 알 수 없는 경우에 lazy evaluation을 적용

## 화살표 함수, 표현식 문

### 화살표 함수
도 타스에서 사용 가능한데  
```ts
const arrow1 = (a:number, b:number):number => {return a+b}
const arrow2 = (a:number, b:number):number => a+b
```
흥미로운게 중괄호 사용 여부에 따라서 문법이 동작하는 방식이 `실행문 방식(execution statement)`과 `표현식 문 방식(expression statement)`으로 달라짐

### 실행문 vs 표현식 문
실행문 : cpu에서 구문이 실행될 뿐 결과를 알려줄 의무는 없음, 결과를 반환하려면 return을 명시해야함  
표현식 문 : return을 명시하지 않아도 실행된 결과를 알려줌  

### 세미콜론
es5까지는 세미콜론 있어야 하고 next에서는 생략 가능, 타입스크립트에서는 관습적으로 표현식 문에 세미콜론 붙이지 않음

## 용례

### 콜백함수
함수 시그니처로 인자로 받을 함수의 타입을 명시하게 된다
```ts
// 콜백함수는 인자는 인자 없고 리턴값 없는 함수 시그니처를 가지며
// 그 콜백함수를 인자로 받는 함수도 리턴값이 없다 ==> 는 뜻
export const init = (callback: () => void):void => {
    console.log('init')
    callback()
    console.log('exit')
}
```
### 중첩
```ts
const calc = (value:number, cb:(number)=>void):void => {
    let add = (a,b) => a+b
    function multiply(a,b) {return a*b}
    let result = multiply(add(1,2), value)
    cb(result)
}

// 함수에 콜백으로 익명함수 전달
calc(30, (result:number) => console.log(`result : ${result}`))
```

### 커링
함수형 언어에서 함수는 단순히 함수 표현식이라는 값이므로 다른 함수를 반환할 수 있음  
함수형 프로그래밍의 알파이자 오메가  
```ts
// 타스
const add2 = (a:number) => (b:number) => a+b
// 반환 타입형까지 정의하면
const add2 = (a: number): ((number) => number) => (b: number): number => a + b;

// 자스 
const add2 = a => b => a+b

// 이렇게까지 해야하나????????

// 시그니처 사용한 고차함수
type NumberToNumberFunc = (number) => number
const add = (a:number):NumberToNumberFunc => {
    // 저 타입의 함수를 반환
    const _add : NumberToNumberFunc = (b:number) => {
        // number 타입의 값 반환
        return a+b //! 이때 요건 클로저가 된다
    }
    return _add
}

// add는 넘버투넘버 타입의 함수를 반환하므로 변수할당시
// 이렇게 차례로 할당하면 값이 아니라 함수일때가 있는데
// 이 시점에서의 반환 함수를 부분적용함수라고 한단다.
let fn : NumberToNumberFunc = add(1)
let result : number = fn(2)

// 최종 반환값은 넘버
let realResult:number = add(1)(2)
```

## 함수 구현 기법

### 매개변수 기본값
```ts
type Person = {name:string, age:number}

const makePerson = (name:string, age:number = 10):Person => {
    const person = {name:name, age:age}
    return person
}

console.log(makePerson('Jack'))
console.log(makePerson('Jane', 33))
```

### 매개변수 객체화
타입스크립트는 다음처럼 매개변수의 이름과 똑같은 이름의 속성을 가진 객체를 만들 수 있다.  
속성값 부분을 생략할 수 있는 단축구문을 제공  
쵸큼 간결해짐
```ts
const makePerson = (name:string, age:number) => {
    const person = {name, age} // {name:name, age:age}의 단축 표현
    return person
}
```

### 객체반환 화살표함수
```ts
// 중괄호만 쓰면 안된다 객체로 해석하게 하려면 소괄호 안에 객체 넣어줘야
// 이건그냥 화살표함수 문법이 이렇다
const makePerson = (name:string, age:number=10):Person => ({name,age})
```

### 매개변수에 비구조화 할당 사용
```ts
// 매개변수의 타입 정의 
type Person = {name:string, age:number}
// 비구조화 할당

//? 타입을 적용해야만 비구조화 할당을 사용할수 있나?
const printPerson = ({name,age}:Person): void => console.log(`name:${name}, age:${age}`)
```

### 색인 키와 값으로 객체 만들기
```ts
// js
const makeObject = (key,value) => ({[key]:value})

//ts : 색인 가능 타입 키밸류형태의 타입
type KeyValueType = {
    [key:string] : string
}

const makeObject = (key:string, value:string) :keyValueType => ({[key]:value})
console.log(makeObject('name','jack'))
```

## 클래스 메서드

### this
객체지향 언어에서는 인스턴스는 this 키워드를 사용할 수 있음  
타스에서는 function키워드로 만든 함수에 this사용 가능, 화살표 함수에서는 this키워드를 사용할 수 없음.

### 타입스크립트 클래스
클래스 속성 중 함수표현식을 담는 속성은 function 키워드를 생략할 수 있게 하는 단축 구문을 제공  
```ts
class B {
    constructor(public value:number = 1){}
    // 원래는 method: () => void = function():void
    method(): void{
        console.log(`value : ${this.value}`)
    }
}
```

## Refernce
- [doit 타입스크립트]()

