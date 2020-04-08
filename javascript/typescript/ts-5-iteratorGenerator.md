# 4. 타입스크립트 - Iterator & Generator
2020.04.08  
사실 이건 타입스크립트 공부는 아닌거같지만,,

## 이터레이터(반복기)

### 설정파일 수정
`tsconfig.json`에서 `downlevelIteration` 항목을 `true`로 설정해야 함    
타입스크립트의 이터레이터 구문을 정상적으로 동작시키기 위한 설정임  

### 이터레이터
다른 프로그래밍 언어에서도 볼 수 있는 이터레이터 특성  
1. next라는 메소드가 있음
2. next라는 메소드는 value와 done이라는 두개의 속성을 가진 객체를 뱉음

```ts
// 이터레이터를 얻을 수 있는 함수
const createRandeIterable = (from:number, to:number) => {
    let currentValue = from
    return {
        next() {
            const value = currentValue < to ? currentValue++ : undefined
            const done = value == undefined
            return {value, done}
        }
    }
}

// while에서 done을 트루로 뱉을 때까지 next를 계속 호출
// 그러면서 value를 얻음
const iterator = createRangeIterable(1, 3+1)
while (true) {
    const {value, done} = iterator.next()
    if (done) {
        break
    }
    console.log(value)
}
```
반복기 제공자는 어떤 범위의 값을 한꺼번에 생성해서 배열에 담지 않고 값이 필요할 때 생성  
값이 필요한 시점에 비로소 생성해서 넘겨줌 => 시스템 메모리를 좀 덜 잡아먹는다

### `Symbol.iterator` 메서드
자스 객체 중에서 이것이 이터레이터요! 임을 보여주는 객체의 메서드  
이게 있어야만 + next메서드가 있어야만 for in이나 of로 순회가 가능해짐  
```ts
// 가공의 이터러블 객체 만들기
class RangeIterable {
    constructor(public from:number, public to:number){}
    [Symbol.iterator]() {
        // 메소드의 this는 클래스인데 여기서는 그 클래스의 맥락에 this를 붙이려는 것 
        // next도 메소드이므로 next 안의 this가 next를 참조하지 않게 해야함
        const that = this
        let currentValue = that.from
        return {
            // 얘는 넥스트 메서드를 가지고 있다
            // 어디서 가져와서 쓰는게 아니라 리터럴리 만들어줘야댐
            next() {
                // 이 안에서는 that을 참조하게 됨
                const value = currentValue < that.to ? currentValue++ :undefined
                const done = value == undefined
                return {value, done}
            }
        }
    }
}

const iterator = new RangeIterable(1, 4)
for(let value of iterator) {
    console.log(value)
}
```
### 이터레이터 제공자 + 제네릭 인터페이스
타스에서 가능한 문법  
클래스를 사용하여 이터러블 객체를 정의할 때 제너릭 인터페이스를 사용하여 `Iterable<T>`는 자신을 구현하는 클래스가 `[Symbol.iterator]` 메서드를 제공한다는 것을 명확하게 알려주는 역할을 함. **클래스만 보고도 이것은 이터레이터요! 이야기하는 것**  
```ts
// Iterable<T> : 이 클래스는 string을 생성하는 이터레이터이올시다
class StringIterable implements Iterable Iterable<string> {
    ...
    // Iterator<T> : 반복기는 string을 생성할 것임니다 => 명확하게 해줌
    [Symbol.iterator]():Iterator<string> {
        ...
        next(): {
        ...
        return value
        }

    }
}
```

## 제너레이터(생성기)
제너레이터는 이터레이터를 쉽게 생성해주는 구문  

### 그게 뭐져
return 키워드처럼 값을 반환. yield는 반드시 `fucntion*`이라는 키워드를 사용한 함수에서만 호출할 수 있음. 이렇게 `function*`키워드로 만든 함수를 생성기 라고 함.  
for...of와 같은 출력이랄까~  
```ts
function* generator() {
    console.log("제너레이터 시작!")
    let value = 1
    while (value < 4){
        yield value++
    }
    console.log("제너레이터 끗!")
}
```

### 코루틴 vs 세미코루틴  
**?정확힌 잘 모르겠음**  

코루틴 : 어플리케이션 레벨의 스레드, 일정 주기에 따라 자동으로 반복해서 실행됨  
세미 코루틴 : 생성기가 동작하는 방식, 단일 스레드로 동작하는 프로그래밍 언어가 마치 다중스레드로 동작하는 것처럼 보이게 하는 기능. 반복해서 실행될수는 있지만 자동으로 실행되지 못하는 코루틴임  

생성기는 사용하는 쪽 코드에서 생성기가 만들어준 반복자의 next 메서드가 호출될때 한번 실행됨 

### `function*`과 `yield`

#### `function`

화살표 함수로는 제너레이터를 만들 수 없음(저거 자체가 키워드이기 때문에)  
제너레이터는 이터레이터를 제공하는 반복기 제공자로서 동작  

#### `yield`

yield는 함수 몸통 안에 존재, yield는 연산자 형태로 동작함  
이터레이터를 자동으로 만들어주고 + 반복기 제공자 역할도 수행함  
yield의 반환값은 반복기의 next메소드 호출 때 **value 매개변수에 저장하는 값**임 == 순회할 값  

```ts
// 이렇게 하면 굳이 객체나 클래스 안에 [Symobol.iterator]안에 next 메서드까지 일일히 구현 안해도 댐 
// 약간 제너레이터 생성자
function* rangeGenerator(from:number, to:number) {
    let value = from
    while(value<to) {
        yield value++
    }
}

// 생성자 new로 동작하지 않음
let iterator = rangeGenerator(1,4)

while(1) {
    // next를 호출할 수 이씀
    const {value, done} = iterator.next()
    if (done) {
        break
    }
    console.log(value)
}

// 위의 while문이랑 똑같은 결과
for (let value of rangeGenerator(4, 6+1)) {
    console.log(value);
}
```

#### `yield*`
타입스크립트에서 제공하는 키워드인데, yield는 단순히 값을 대상으로 동작하지만  
yield*는 다른 생성기나 배열을 대상으로 동작함  

```ts
//타입스크립트 문법을 활용한 제너레이터 

function* gen12() {
    yield 1
    yield 2
}

function* gen12345() {
    // 다른 생성기가 yield하는 값을
    yield* gen12()
    // 배열의 든 값을
    yield* [3,4]
    // 그냥 값을
    yield* 5
}
```

## reference
- [doit 타입스크립트]()