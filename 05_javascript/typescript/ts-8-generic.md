# 7. 타입스크립트 - 제네릭 타입
2020.04.13  
다는 아니고 살짝 정리  

## 제네릭 
(뜬금없)왜 이름이 제네릭이지  

### 제네릭 타입
인터페이스, 함수, 클래스, 타입 별칭 등에 사용할 수 있는 기능  
해당 심벌의 타입을 미리 지정하지 않고 다양한 타입에 대응할때 사용  
```ts
interface IValuable<T>{
    value: T
}

function identity<T>(arg:T):T {return arg}

type IValueable<T> = {
    value = T
}

class Valuable<T> {
    constructor(public value:T){
    }
}
```

### 제네릭 함수
제네릭 타입을 사용하는 제네릭 함수  
```ts
// 이렇게 타입을 제네릭으로 정의해놓고 
// 함수의 타입 변수 T를 제네릭 인터페이스의 타입 변수 쪽으로 넘겨서 사용하는 형태로 구현
type IValueable<T> = {
    value = T
}

class Valuable<T> implements IValuable<T> {
    constructor(public value: T){}
}

const printValue = <T>(o:IValuable): void => console.log(o.value)

printValue(new Valuable<number>(1)) // 넘버타입 + 새로운 인스턴스
printValue(new Valuable<string>("max")) //스트링 + 새로운 인스턴스
```

## 제네릭 타입 제약
타입 변수에 적용할 수 있는 타임의 범위를 한정하는 기능  
```ts
// 이 함수에서 타입의 제네릭을 받고, 함수의 제네릭도 선언
const printValueT = <Q,T extends Ivaluable<Q>>(o:T) => console.log(o.value)
printValueT(new Valuable(1))

// new연산자의 인자에다가 타입 제약하는 방법도 쓸 수 있음
const create = <T>(type:{new(...args):T}, ...args): T => new type(...args)

// 인덱스 타입 제약 - 객체 키 참조의 intergrity 보장
<T,K extends key of T>

// K가 T객체의 키값임을 보장
const pick = <T,K extends keyof T>(obj:T, keys:K[]) => 
    keys.map(key => ({[key]:obj[key]})).reduce((result,value) => ({...result, ...value}),{})

```

## 대수 데이터 타입
상속에만 의존하면 불리언같은 타입을 만들기가 어려움 

### 합집합 타입
타입을 만들때 단락평가를 적용하는 건가봄
```ts
// 둘다 담을 수 있는 여지를 줌

type NumberOrString = number | string
let ns:NumberOrString = 1
ns = "hello"
```

### 교집합 타입
```ts
// 객체 만드는데 프로퍼티 타입이 짬뽕일 때 유용
const mergeObjects = <T,U>(a:T, b:U):T & U => ({...a, ...b})

type INameable = {name:string}
type IAgeable = {age:number}

const nameAndAge: INameable & IAgeable = mergeObjects({name:"Jack"}, {age:32})
```

### 합집합 타입 단락평가
```ts
interface ISquare {size:number}
interface IRectangle {width:number, height:number}
interface ISquare {radius:number}

type IShape = ISquare|IRectangle|ICircle
const calcArea = (shape:IShape) : number => {
    // 뭐 타입은 다 들어오게 할 수 있는데 뭐가 들어올지 모르니 계산은 못함
    return 0
}
```

### 식별 합집합 구문 
인터페이스들이 모두 똑같은 이름의 속성을 가지고 있어야함  
근데 공통 속성이 없으면 각각의 타입을 구분할 수가 없음
```ts
const calcArea = (shape:IShape):number => {
    switch(shape.tag) { 
        case 'square': return ~~~
        case ~~~ : return ~~~~
        case ~~~ : return ~~~~
    }
    return 0
}
```

## 타입 가드

### `instanceof`
`instanceof` 연산자가 자바스크립트 버전과는 다르게 타입 가드란게 존재하나봄  
타입 가드는 타입을 변화하지 않은 코드 때문에 프로그램이 비정상적으로 종료되는 상황을 보호  
```ts
const flyOrSwim = (o:Bird|Fish):void => {
    if (o instanceof Bird) {
        o.fly()
    } else if(o instanceof Fish) {
        o.swim()
    }
}
```
### is 연산자
instanceof 처럼 동작하는 함수를 구현 가능  
타입 가드 기능을 하는 함수 쉽게 구현  
```ts

// 변수 is 타입

// 둘중에 인자 하나 받아서 그 함수의 is연산자에 해당하는 인스턴스를 리턴 => 타입 가드 함수
// 뭔가 조건문을 쓸 필요가 없게 해주긴 하는건데
const isFlyable = (o:Bird | Fish):o is Bird => {
    return o instanceof Bird
}

const isSwimmable = (o:Bird|Fish):o is Fish => {
    return o instanceof Fish
}

// 타입 가드 함수를 거쳐 타입에 맞는 메소드를 수행
// 근데 꼭 이렇게까지 해야대나 걍 instance of가 더 나은듯
const swimOrFly = (o:Fish|Bird) => {
    if(isSwimmable(o)) {
        o.swim()
    } else if(isFlyable(o)) {
        o.fly()
    }
}
```