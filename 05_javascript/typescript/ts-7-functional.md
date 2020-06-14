# 7. 타입스크립트 - 함수형 프로그래밍
2020.04.11  
약간 맛보기.. 나중에 좀 더 열심히 공부해보자  

## 함수형 프로그래밍
순수함수와 선언형 프로그래밍의 토대 위에 **함수 조합**과 **모나드 조합**으로 코드를 설계하고 구현하는 기법  

### 복습
#### 선언형 vs 명령형
- 명령형 : for문 순회, 약간 저수준, 시스템 자원의 효율을 최우선으로 생각
- 선언형 : 일관된 문제 해결, for문 쓰지 않고 배열 메소드 등으로 문제가 해결될 때까지 새로운 배열에 결과값을 담는 방식, 범용으로 구현되었거나 언어가 제공하는 함수를 재사용하면서 문제를 해결. 인터페이스적, 고수준. **함수형 프로그래밍은 선언형 프로그래밍의 superset**

#### 일등 함수
함수형 언어의 판단 기준. 함수와 변수를 구분하지 않는다는 컨셉
```js
// 심벌 f가 변수인지 함수인지 구분을 할 수 없다. 변수와 함수를 차별하지 않는다
let f = function(a,b) {return a+b};
f = function(a,b) {return a-b};
```

### 함수 프로그래밍의 토대 
1. 람다 수학 : 조합 논리와 카테고리 이론의 토대가 되는 논리 수학
2. 조합 논리 : 함수 조합의 이론적 배경
3. 카테고리 이론 : 모나드 조합과 고차 타입의 이론적 배경
4. 정적 타입, 자동 메모리 관리, evaluation, 타입 추론, 일등 함수, 대수 데이터 타입, 패턴 매칭, 모나드, 고차 타입 등의 기능을 제공
5. LISP => 메타언어 => 하스켈, 스칼라
6. 타입스크립트는 스칼라의 구문을 좀더 자바스크립트 친화적으로 발전시켰다

### 제네릭 함수
`number[]`, `boolean[]`, `string[]`과 같은 배열을 `T[]`이렇게 표현할 수 있었는데, 타입 변수 T로 표기할 때 이것을 **제네릭 타입**이라고 함. 타입스크립트의 함수는 매개변수와 반환값에 타입이 존재하므로, 함수 조합을 구현할 때는 제네릭 함수 구문을 사용해야 함.  

뭔가 `any`를 쓰거나 아무것도 안쓰는 것 보다 코드에 책임을 지는 느낌을 낼 수 있다

```ts
function g1<T>(a:T): void {}
function g2<T, Q>(a:T, b:Q): void{}

// 화살표 함수
const g3 = <T>(a:T):void => {}
const g4 = <T,Q>(a:T, b:Q):void => {}

// 타입 별칭 : 정확히 말하면 제네릭을 쓴 함수 시그니처
type Type1Func<T> = (T) => void
type Type2Func<T, Q> = (T, Q) => void

// 사용하는 타입을 인자로 미리 정해줄 수 있는 느낌
type Type3Func<T,Q,R> = (T,Q) => R

// 일대일 관계 표현(맵함수)
type MapFunc<T,R> = (T) => R

// 아이덴티티 함수(특정 입력값을 가공 없이 반환)
type MapFunc<T,R> = (T) => R
type IdentityFunc(T) = MapFunc<T,T>

// 이렇게 선언한 제네릭타입들의 활용
const numberIdentity: IdentityFunc<number> = (x:number): number => x
const stringIdentity: IdentityFunc<string> = (x:string): string => x
const objectIdentity: IdentityFunc<object> = (x:object): object => x
const arrayIdentity: IdentityFunc<any[]> = (x:any[]): any[] => x
```

제네릭 타입으로 함수를 정의하면 어떤 타입에도 대응할 수 있음. g1함수는 a 매개변수가 제네릭 타입으로 지정되었고, g2 함수는 각각 다른 제네릭 타입으로 지정된 것

## 고차함수와 커링

함수안에 함수의 리턴값을 넣을 때, 흔히 프로그래밍 언어로는 아래와 같이 표현하며, 받는 매개변수의 개수가 모두 동일해야 한다  
```ts
y = h(f(g(x)))
```

### 고차함수
- 타입스크립트에서의 함수는 변수에 담긴 표현식
- 이때 함수 표현식이란 일종의 값으로, 일등함수 개념에 따라 함수의 반환값으로 함수를 사용할 수 있음
- 함수를 반환하는 함수를 **고차함수**라고 함
- 함수 시그니처로 표현한 고차함수
```ts
type FirstOrderFunc<T,R> = (T) => R
type SecondOrderFunc<T,R> = (T) => FirstOrderFunc<T,R>
type ThirdOrderFunc<T,R> = (T) => SecondOrderFunc<T,R>

const inc: FirstOrderFunc<number, number> = (x:number): number => x+1

const add: SecondOrderFunc<number, number> = 
    (x:number): FirstOrderFunc<number, number> =>
    (y:number): number => x+y
```

### 커링
부분 적용 함수 : 자신의 차수보다 함수 호출 연산자를 덜 사용하면 부분 적용 함수, 짧게 말하면 부분 함수라고 함.  
고차함수가 자신이 사용할 수 있는 인자보다 적게 받고 받아야할 인자를 뒤로 미룰때   
정확한 커링의 정의 : 함수를 호출하는데 호출 연산자를 두번 이상 사용하는걸 커링이라고 함 
```ts
// 함수 나눠버리기
// 아 좀 난해함

const add: SecondOrderFunc<number, number> = 
    (x:number): FirstOrderFunc<number, number> =>
    (y:number): number => x+y

const add1: FirstOrderFunc<number,number> = add(1)

// add(1)이 한 인자로 들어감
// 그럼 add함수는 인자를 두개를 받으니 하나더 넣어주면 된다
// 난해;;

add1(2)
add(1)(2)
```

```ts
const add2: SecondOrderFunc<number, number> = add3(1)
const add1: FirstOrderFunc<number, number> = add2(2)

// add1은 타입에 따라 인자를 하나받고 add2(2)를 호출해버림
add1(3)

add2(2)(3)
add3(1)(2)(3)
```

### 클로저
고차 함수의 몸통에서 선언되는 변수들은 클로저라는 유효 범위를 가짐  
클로저는 지속되는 유효 범위를 의미  
```ts

// x라는 인자를 받아서 number을 받아 number을 반환하는 함수를 반환
function add(x:number):(number) => number => {
    return function(y:number): number => {
        return x+y
    }
}

// 3이 들어가는 시점에서도 2에 접근할 수 있음
// result값이 들어가는 상황에서 변수가 메모리에서 해제됨
const result = add(2)(3)
```
add가 반환하는 함수의 입장에서는 x는 이해할 수 없는 변수. 범위 안에서 그의미를 알 수 없는 변수를 **자유변수**라고 함.  
타입스크립트는 이처럼 자유변수가 있으면 그 변수의 바깥쪽 유효 범위에서 자유 변수의 의미를 찾는데, 바깥쪽 유효 범위에서 x의 의미를 알 수 있으므로 코드를 정상적으로 컴파일  

클로저를 지속되는 유효범위라고 하는 이유는 다음처럼 add함수를 호출하더라도 변수 x가 메모리에서 해제되지 않기 때문에(다음 리턴 함수에서도 변수를 참조할 수 있게 됨)  

고차함수가 부분함수가 아닌 값을 발생해야 비로소 자유변수의 메모리가 해제되는 유효 범위를 클로저라고 함.  

클로저는 메모리가 해제되지 않고 프로그램이 끝날 때까지 지속될 수도 있음  
'
```ts

// 함수명 = (인수):아무인수 없이 문자열을 뱉는 함수를 리턴할 것이라는 익명 시그니처 => {함수몸통}
// 복잡해;;;;
const makeNames = () : (() => string) => {
    const names = ['john','jack','jane']
    let index = 0
    // 요 함수 자체가 인수 아무것도 안받고 문자열 반환하는 함수
    // 그 함수는 리턴값으로 문자열을 반환할 것
    return () :string => {
        if (index == names.length) {
            index = 0
        }
        return names[index++]
    }
}
```

## 함수조합
작은 기능을 구현한 함수를 여러번 조합해 더 의미있는 함수를 만들어내는 프로그램 설계 기법  

### compose
compose함수는 가변 인수 스타일로 함수들의 배열을 입력받음  
그다음 함수들을 조합해 매개변수 x를 입력받는 1차함수를 반환  
리액트 공부할때도 봤던 내용인데 컴포즈 함수를 사용하면  
왼쪽에서 오른쪽으로 함수를 적용시킬 수 있다는게 장점이었던거가틈  
```ts
// compose 함수는 함수로 된 배열을 받고, 함수를 리턴함

// const 함수명 = <제네릭>(인수):함수 반환값 => 리턴함수의 인자 : 그 반환 함수의 시그니처 => 함수

// x를 넣으면 값을 반환하는 1차함수를 반환하는 함수가 된다
const compose = <T, R>(...functions: readonly Function[]): Function => 
    (x:T) : (T) => R => {
        // 리드온리라 깊은 복사한다
        const deepCopiedFunctions = [...functions]

        // 리듀스 함수로 함수를 겹치면서 동작시키고
        // 그 누적값을 저장해서 리턴한다

        // 복사한 배열 뒤집고, 리듀스 적용
        // 누산값이 계속 함수에 들어가는 형국이 됨
        // x => f(x) => g(f(x)) => h(g(f(x)))
        return deepCopiedFunctions.reverse().reduce((value, func) => func(value), x)
}
```

### pipe
compose와 매개변수들을 해석하는 순서가 반대, reverse 필요 없구  
각 함수의 시그니처가 다르면 이들을 모두 포함할 수 있는 제네릭 타입을 적용하기 힘들다  
그래서 배열에다 함수를 넣어주는 방법으로 인자를 넘김
```ts

// 생긴게 좀 극혐이긴 한데
const 파이프함수 = <제네릭, 제네릭>(인수:인수타입):반환값 함수 =>  반환되는 함수 : 반환값 또 함수(시그니처) => {함수 몸통}

const pipe = <T,R>(...functions:Function[]):Function => (x:T) : ((T) => R) => {
    return functions.reduce((value, func) => func(value), x)
}
``` 

## 함수 조합에 사용되는 부분함수
인자를 나중에 넣을 수 있다는게 좋은점임  
부품을 완성해나가듯 프로그래밍이 가능하다  
마지막엔 그 부품들을 모아서 조립해주는 메소드가 pipe나 compose

```ts
const add = x => y => x+y
const inc = add(1)

// pipe가 뱉은 함수는 인자를 하나받는 함수...
const add3 = pipe(inc, add(2))
console.log(add3(1))

// 함수조합 map 함수
const map = f => a => a.map(f)

// 포인트가 없는 함수
const square = value => value * value
const squareMap = map(square)


// 포인트가 있는 함수 
const squareMap = a => map(square)(a)

// reduce를 사용하는 pointless 함수
const reduce = (f, initValue) => a => a.reduce(f, initValue)
const sum = (result, value) => result + value
const sumArray = reduce(sum,0)

const pitagoras = pipe(
    squaredMap,
    sumArray,
    Math.sqrt
)
pitagoras([3,4])
```
