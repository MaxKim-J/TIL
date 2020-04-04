# 2. 타입스크립트 - Object & Types
2020.04.04

## 타입스크립트 변수 선언
기본적으로 자바스크립트에서 제공하는 타입(Number, Boolean, String, Object)을 모두 지원하는데  
첫글자가 소문자임(number, boolean, string, object)

### 타입 주석(type annotation)
타입스크립트는 자바스크립트 변수 선언문을 확장해 다음과 같은 형태로 타입을 명시할 수 있다  
`let`으로 선언한 변수는 **타입 주석으로 명시된 타입에 해당하는 값으로만** 바꿀 수 있다.
```typescript
// let/const 변수이름 : 타입 = 초기값

let n : number = 1
let b : boolean = true
const s: string = "hello"

n = "맥스" //타입 불일치 오류 발생
```
### 타입 추론(type inference)
타스는 자스와의 호환성을 위해 타입 주석 부분을 생략할 수 있음.  
타스 트랜스파일러는 다음과 같은 코드를 만나면 대입 연산자 오른쪽에 값에 따라 변수의 타입을 지정  
```typescript
let n = 1 // n 타입을 number로 판단
let b = true // 불리언으로 판단
```
### any 타입
이것 역시 자바스크립트와의 호환을 위해 제공하는 자료형. 값의 타입과 무관하게 어떤 종류의 값도 저장할 수 있게 된다
```ts
let a: any = 0
a = 'hello'
```
### undefined 타입
자스에서 `undefined`는 값임. 변수를 초기화하지 않으면 해당 변수는 `undefined`를 가질 것.  
그러나 타입스크립트에서 `undefined`는 타입인 동시에 값
```ts
// undefined 타입으로 선언되었으므로 오직 undefined값만 가질 수 있다
let u : undefined = undefined
u = 1   //  Type '1' is not assignable to type undefined
```
계층으로 표현해 보면, `undefined`는 모든 타입의 최하위이며, `any`는 최상위임을 알 수 있음.


## 객체와 인터페이스

### 타스의 객체
`object`타입은 인터페이스와 클래스의 상위 타입으로, 객체 타입으로 선언된 변수는 number, boolean, string 타입의 값을 가질수는 없지만 속성 이름이 다른 객체를 모두 자유롭게 담을 수 있다.
```ts
let o:object = {name:'Jack', age:32}
o = {first:1, second:2}
```
### 인터페이스 선언
객체 프로퍼티의 타입을 정의할 수 있게 하는 `interface`라는 키워드를 제공. 인터페이스는 객체의 타입을 정하는 것이 목적이므로 객체를 의미하는 중괄호로 속성과 타입 주석을 나열하는 형태로 사용 
```ts
// proptypes 같이 생겼넹
// 설계도를 지닌 객체를 + 새로운 타입을 선언

interface IPerson{
    name: string,
    age: number
    etc?:boolean
}

// 인터페이스를 토대로 새로운 변수 선언
let good: IPerson = {name:'Jack', age:32}

// 인터페이스에서는 선택 속성을 선언할 수 있음 (key에다가 ?붙이기)
// 있어도 되고 없어도 된다
let good2: IPerson = {age:32, etc:true}

// 인터페이스의 조건을 벗어나면 무조건 오류
let bad1: IPerson = {age:32}
let bad2: IPerson = {name:'jane'}
let bad3: IPerson = {}
```

### 익명 인터페이스
키워드도 사용하지 않고 인터페이스의 이름도 없는 인터페이스 만들 수 있음
```ts
let ai: {
    name:string,
    age:number,
    etc?:boolean
} = {name:'jack', age:32}

// 함수 구현할 때 사용됨 주로 
// 익명 인터페이스로 생성된 객체를 인자로 받는다
function printMe(me:{name:String, age:number, etc?:boolean}){
    console.log(
        me.etc ? `${me.name} ${me.age} ${me.etc}` : `${me.name} ${me.age}`
    )
}
printMe(ai);
```

## 객체와 클래스

### 클래스
자스보다 훨씬 객체지향 언어에서 볼 수 있을 법한 클래스문법을 제공한다
```ts
class Person1 {
    name:string,
    age?:number
}

// 오 이거 자바같아
let jack1 : Person1 = new Person1()
jack1.name = 'jack'; jack1.age=32
console.log(jack1)
```
### 접근제한자
`public`, `private`, `protect`와 같은 접근 제한자를 이름 앞에 붙일 수 있다.  
생성자의 매개변수에 `public`을 붙이면 해당 매개변수의 이름을 가진 속성이 클래스에 선언된 것 처럼 동작한다.
```ts
class Person2 {
    constructor(public name:string, public age:number){}
}

/*
이걸 축약해놓은거임

class Person3 {
    name : string
    age? :number
    constructor(name:string, age?:number) {
        this.name = name; this.age=age
    }
}
*/

let jack2:Person2 = new Person2('jack', 32)
```
### 클래스의 인터페이스 구현
클래스가 인터페이스를 구현할 때는 다음처럼 implements키워드를 사용함
```ts
interface IPerson4 {
    name:string
    age?:number
}

class Person4 implements IPerson4 {
    constructor(public name:string, public age?:number){}
}
let jack4 : IPerson4 = new Person4('Jack', 32)
```

### abstract & static
추상 클래스 : 자신의 속성이나 메서드 앞에 abstract를 붙여 나를 상속하는 다른 클래스에서 이 속성이나 메서드를 구현하게 한다  
정적 속성 : 인스턴스가 아닌 클래스 자체에서 참조할 수 있는 속성  

```ts
abstract class A {
    abstract name: string 
    static.initValue = 1
}

let initVal = A.initValue // 1
```

## 객체 형변환

### 타입 단언이 필요한 이유
**이거에 대해서 포스팅해봐도 좋을 거 같음**
**????이유를 알아내자 -  왜 자스의 객체와 타스의 정적타입 객체는 프로퍼티 구조가 다른가?** 
```ts
let personTyped: object = {name:"jack", age:33}
let personNonTyped = {name:"jack", age:33}

personTyped.name //안댐
personNonTyped.name //댐
```
- 오브젝트에 네임이 없는 이유 : **프로퍼티는 타입 객체에서 프로퍼티를 찾는다!!!!!!!**
- 타입 객체는 오로지 한개이며 타입스크립트의 경우에는 수정되지 않음 요런 방법으로 수정을 방지하게 되는듯? (더욱 객체지향적임)

![d](/img/property.png)
- name에 나타나는 에러 참조 : 오브젝트에는 그런 프로퍼티 업다
- 오브젝트라는 타입에는 네임이나 에이지 프로퍼티가 없는 거다
- 인터페이스에는 이씀

### 타입 단언(type assertion)
- 프로퍼티를 찾을 수 있는 다른 객체에 빗대어 프로퍼티를 찾아내는 건가? 
- 형변환이 일어나긴 하지만 캐스팅이라고 부르긴 힘들다 => 런타임에 영향을 미치지 않는다 : 타입 단언은 오직 컴파일 과정에서만 타입을 변경시킨다
```ts
let obj: object = {name:'Jack'}

// 두가지 문법
let name1 = (<INameable>obj).name
let name2 = (obj as INameable).name

console.log(name1, name2)
```

## 정적 타이핑
- c-family언어는 변수를 선언할 때 변수에 할당할 값의 타입에 따라 사전에 타입을 명시적으로 선언해야 하며 선언한 타입에 맞는 값을 할당해야함 => 정적 타이핑
- 자스는 원래 동적 타입 언어, 혹은 느슨한 타입 언어인데 변수의 타입 선언 없이 값이 할당되는 과정에서 동적으로 타입을 추론한다는 의미
- 동적 타입 언어는 타입 추론에 의해 변수의 타입이 결정된 후에도 같은 변수에 여러 타입의 값을 교차하여 할당할 수 있음 => 동적 타이핑
- 동적 타이핑은 사용하기 편하지만 코드를 예측하기가 힘들어 예상치 못한 버그를 발생시킬 수 있음. 
- 타입스크립트는 정적 타이핑을 지원하는데, 타입이 맨 처음에 한번 결정된 후에는 타입을 변경할 수 없다.

## reference
- [doit 타입스크립트]()
- [포이마웹- 타입스크립트](https://poiemaweb.com/typescript-interface)
- [타입 추론과 타입 단언](https://poiemaweb.com/typescript-interface)
