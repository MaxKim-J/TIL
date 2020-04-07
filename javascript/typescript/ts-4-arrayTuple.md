# 4. 타입스크립트 - Array & Tuple
2020.04.07

## 타입스크립트 배열
어레이!

### 배열은 객체다
배열은 다른 언어와는 다르게 객체임  
배열은 Array 객체의 인스턴스인데 클래스의 인스턴스는 객체이므로

### 타입스크립트에서 배열
배열의 타입은 `아이템 타입[]`임. 배열의 아이템이 number 타입이면 배열의 타입은 `number[]`  
아이템이 string이면 `string[]`임. 

```ts
// 배열에 들어갈 요소들의 타입을 정하는듯
let numArray: number[] = [1,2,3]
let strArray: string[] = ['hello', 'world']
const objectArr: object[] = [{ a: 2, b: 4 }, { a: 2, b: 4 }];

// 배열 안에 들어갈 타입을 정해주고 그 타입에 해당하는 요소로 이루어진 배열
type IPerson = {name:string, age?:number}
let personArray: IPerson[] = [{name:'Jack', age:32}]
```

### 문자열과 배열 간 변환
어떤 프로그래밍 언어는 문자열을 문자의 배열로 간주  
그러나 타입스크립트에서는 문자 타입이(string은 문자열 타입) 없고 문자열의 내용 또한 이뮤터블(메소드를 써서 반환되는 값들은 다 새 문자열임)  
문자열을 자체를 막 바꾸고 수정하고 가공하려면 배열로 전환해야 함  
자스에 `String.prototype.split()`, `Array.prototype.join()`이 존재
```ts

// str과 delim을 인자로 받아서 문자열을 배열로 바꾼 string 배열을 내놓는다
// 사용자 정의 함수로 만들어준 스플릿 함수, 조인 함수 
// 왜 굳이 이렇게 따로 정의한것이지

const split = (str:string, delim:string=''):string[] => str.split(delim)
const join = (strArray:string[], delim:string=''):string => strArray.join(delim)
split('hello') // ['h','e','l','l','o']
```

### `for...in` vs `for...of`
for in은 배열의 인덱스값을 대상으로 순회, for of는 배열의 아이템값을 대상으로 순회  
for in은 객체를 대상으로 사용하는데, 배열도 객체이므로 배열에 사용할 수도 있음   
```ts
let names = ['Jack', 'Jane', 'Steve']

for (let index in names) {
    const name = names[index]
    console.log(`[${index}: ${name}]`)
}

for (let name of names) {
    console.log(`[${name}]`)
}
```

### 제네릭 방식 타입
타입이 고정된 배열을 만드는것 보단 `T[]`처럼 배열의 아이템 타입을 한꺼번에 표현하는 것이 편리  
타입을 일종의 변수와 같이 취급하는 것을 **제네릭 타입**이라고 함  
다양한 아이템 타입을 가지는 배열에 똑같이 적용되게 하려면 다음처럼 배열의 타입주석을 저렇게 표현하면 됨  
이럴때는 근데 여기 들어가는 T가 임의의 타입 변수임을 알려야함 제네릭 타입으로 구현하면 어떤 요소타입을 가진 배열들도 **배열이라면** 균일하게 인자로 사용할 수 있음  
```ts
const arrayLength = (array) => array.length
const arrayLength = (array:T[]):number => array.length

// 제네릭 스타일
const arrayLength = <T>(array:T[]):number => array.length
```

### 제네릭 타입 추론

```ts
// 아무 타입이나 들어갈 수 있고 아무 타입이나 반환할 수 있는 함수에
// n을 넣었을 때 n을 그대로 뱉는다
const identity = <T>(n:T):T => n

console.log(
    // 제네릭 형태로 구현된 함수는 원칙적으로 타입 변수를 다음과 같은 형태로 명시해야한다
    // 뭐 생략할 수 있긴 하다. 생략하면 타입 추론을 통해 무슨 타입인지 알아낸다. 
    identity<boolean>(true),
    idetntity(true)
)
```

## 선언형 프로그래밍과 배열


### 선언 vs 명령

- 명령형 : for문 순회, 약간 저수준, 시스템 자원의 효율을 최우선으로 생각
- 선언형 : 일관된 문제 해결, for문 쓰지 않고 배열 메소드 등으로 문제가 해결될 때까지 새로운 배열에 결과값을 담는 방식, 범용으로 구현되었거나 언어가 제공하는 함수를 재사용하면서 문제를 해결. 인터페이스적, 고수준. **함수형 프로그래밍은 선언형 프로그래밍의 superset**
- 함수형 프로그래밍에서 fold 
```ts
// 배열의 모든 수를 더하는 함수 : 부채처럼 배열을 펼쳐놓고 부채를 접어서 결과를 만들어 내는 것
// 콜백함수의 타입 주석이 신기해보인다
// 인자를 3개 넣은거임

const fold = <T>(array: T[], initValue:T, callback: (result:T, val:T) => T) => {
    let result: T = initValue
    for (let i =0; i<array.length; ++i) {
        const value = array[i]
        result = callback(result,value)
    }
    return result
}

let numbers:number[] = [1,2,3,4,5,6,7,8,9,10]
let result = fold(numbers, 0, (result, value) => result+value)
```

### 타입스크립트 관점 map,reduce,filter
```ts
// filter : 콜백함수를 인자로 받고 새 배열을 반환, 조건으로 배열 거르는 함수
// 저 의미가 함수를 넣는데 인자의 타입 정보, 그리고 리턴값의 타입정보까지 정의한 것임
filter(callback:(value:T, index?:number):boolean): T[]

// map : 역시 콜백을 인자로 받고, 배열 인자에 싹다 적용해서 새로운 배열을 반환
// 연산 과정에서 타입이 바뀔 수도 있으니 최종 결과값이 T타입 아닐수도 있고 그렇다
map(callback:(value:T, index?:number):Q):Q[]

// reduce : 최강 누산기 뭐든 할 수 있음
// 리턴값 타입은 설정 안해줘도 되나봄(any), 인자는 콜백과 초기값 두개, 배열 메소드로 호출
reduce(callback: (result:T, value:T) => any, initValue:T):T

let reduceSum: number = range(1,100+1).reduce((result:number, value:number) => result+value, 0)
```

## 배열과 순수함수
함수형 프로그래밍에서 함수는 다 순수함수여야만 함  
근데 배열 메소드에는 배열을 직접 조작하는 메서드도 많아서, 메서드가 어떤 특징을 가지고 있는지 새 배열을 반환하는지 기존 배열을 반환하는지 아님 뭘 다른걸 반환하는지 알면 좋다  

### 순수함수
**?함수형 프로그래밍에서는 왜 순수함수가 그렇게 중요한걸까**

**부수효과가 없는 함수** : 부수효과란 함수가 가진 고유한 목적 이외에 다른 효과가 나타나는 것을 의미하며, 부작용이라고도 한다. 반면에 부수효과가 있는 함수는 불순 함수라고 함  
근데 사실 순수함수가 긍정적이고 불순함수가 부정적인 의미는 아니다 코딩할때는 다필요함  

함수형 프로그래밍에서 발생하는 부수효과는 함수를 순수함수 형태로 작성해야만 제거할 수 있는 것. 어떤 함수가 부수효과 없는 순수 함수려면 다음과 같은 조건을 충족해야 한다
- 함수 몸통에 입출력 관련 코드가 없어야 한다
- **함수 몸통에서 매개변수 값을 변경시키지 않는다. 매개변수는 const나 readonly. 순수함수의 핵심**
- 함수는 몸통에서 만들어진 결과를 즉시 반환한다(?이게 무슨말)
- 함수 내부에 전역변수나 정적변수를 사용하지 않는다
- 예외를 발생시키지 않는다(함수를 특정 모든 경우를 커버해야하며 그렇지 못한 경우, 예외 발생시에는 그 함수를 쓰지마라)
- 함수가 콜백 함수로 구현되었거나(??) 함수 몸통에 콜백 함수를 사용하는 코드가 없다
- 함수 몸통에 비동기로 동작하는 코드가 없다(반대로 비동기 요청이나 Promise같은게 있다면 그거는 **부수효과가 존재하는 함수** 땅땅땅)

```ts

// 순수함수
function pure(a:number, b:number): number {return a+b}

// 불순함수 - 매개변수로 들어온 배열을 수정함
function impure1(array:number[]): void {
    array.push(1)
    array.splice(0,1)
}

// 불순함수 - 전역변수나 외부 변수를 사용
function impure2(x:number) {
     return x + g
}
```

### readonly 타입 수정자
readonly타입으로 선언된 매개변숫값을 변경하는 시도가 있으면 문제가 있는 코드라고 알려줌  
불순 함수가 되지 않게 방지함. 오,,, 객체타입 매개변수 사용할때 들어올때 쓸만할 것 같은데

const가 있는데 필요한가 ? : 타스에서는 인터페이스, 클래스, 함수의 매개변수 등은 let이나 const없이 선언하기 때문에 이런 시벌에 const와 같은 효과를 주려면 readonly가 필요  

const 배열이나 객체 : 배열이나 객체의 메모리상 주소를 기억하고 있는 **참조 자료형** 이므로 배열이나 객체 안의 값을 modify하는게 가능함. 그런데 readonly는 **그런 식의 modify도 막음**

```ts
const add9 = (arr: readonly number[], age: number): number => {
    // readonly로 매개변수 객체나 배열을 선언하면 원래의 객체를 변경하는 메소드를 못쓰게된다
  arr.push(3) // Property 'push' does not exist on type 'readonly number[]'.
  arr.sort() // Property 'push' does not exist on type 'readonly number[]'.
  arr.slice(); // ㄱㅊ
  return arr.length + age;
};
```

### 깊복얕복
**참조 자료형, 불변 자료형 한번 다시 정리해야될거가틈 헷갈린다,,**

순수함수를 구현할 때는 매개변수가 불변성을 유지해야 하므로 매개변수를 가공하려 할 때 깊은 복사를 실행해 매개변수값이 변경되지 않게 해야한다. 깊은 복사는 대상 변수값이 바뀔 때 원본 변수값은 그대로인 형태로 동작
```ts
let original = 1
let copied = original
copied += 2
console.log(original, copy)
```
그런데 객체나 배열은 저런식으로 복사를 하면 얕은 복사가 됨. 책에는 얕은 복사 방식으로 동작한다는데 약간 오해의 소지가 있는 표현같구... 참조 자료형들은 변수 데이터의 메모리 주소를 참조하기 때문에, 변수에 주소를 넘긴들 어쨋든 같은 배열만 바라보고 있는 셈이기 때문이다.    

알고 있듯이 배열은 전개 연산자를 통해 깊은 복사를 쉽게 할 수 있다. 
```ts
const oArr = [1,2,3,4]
const deepCopiedArray = [...oArr]
deepCopiedArray[0] = 0
console.log(oArr, deepCopiedArray) // [1,2,3,4] [0,2,3,4]
```
이걸 이용해서 배열의 sort 메서드를 순수함수로 만들어보기. 원래 sort메소드는 원본 배열을 변경한다
```ts
const pureSort = <T>(array: readonly T[]):T[] => {
    // 매개변수로 배열 받으면 깊은복사 수행 후 소트해서 리턴
    let deepCopied = [...array]
    return deepCopied.sort()
}
```

### 가변 매개변수를 받는 순수함수
함수를 호출할 때 전달하는 인수의 개수를 제한하지 않는 것 : 가변인수  
```ts
// 1. ...arrays : 이거는 타입스크립트의 가변인수구문(ㄹㅇ?)
// 2. 매개변수 ...arrays의 타입은 배열들의 배열(?) 
// 2응용. 뭔가 배열 말고 다른거 넣어서 배열로 패킹하면 T[]가 되려나
// 3. 출력은 배열 하나라서 T[]
// 4. 순수함수니까 매개변수 변경하면 안댐 readonly

const mergeArray = <T>(...arrays:readonly T[][]):T[] => {

    // 리듀스 한방으로 해결
    const result = arrays.reduce((result:T[], current:T[]) => [...result, ...current] ,[])
    // let result:T[] = []

    // for(let index=0;index<arrays.length;index++) {
    //     const array:T[] = arrays[index]
    //     result = [...result, ...array]ㅠ
    // }
    return result
}

const mergeObject = (...objects:readonly object[]):object => {
    let result:object = {}
    for (let index in objects) {
        result[index] = objects[index]
    }
    return result
}
```
## reference
- [doit 타입스크립트]()