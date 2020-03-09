# 이터레이션과 for...of

2020.03.09

## 이터레이션 프로토콜

데이터 컬렉션을 순회하기 위한 프로토콜. 이터레이션 프로토콜을 준수한 객체는  
for..of로 순환할 수 있고, spread문법의 피연산자가 될 수 있음  
이 객체가 이터러블하냐 마냐를 판단하는 것 => **객체 안에 [Symbol.iterator]유무**
이 심볼은 이터러블의 요소를 탐색하기 위한 포인터를 제공함 => 심볼 이터레이터 안에는 메소드가 없고, 포인터로 연결되어있는듯? [#심볼]()

## 이터러블

이터러블 프로토콜을 준수한 객체 == 이터러블한 객체  
이터러블은 **Symbol.iterator 메소드를 구현하거나 프로토타입 체인에 의해 상속한 객체를 말한다.** Symbol.iterator 메소드는 이터레이터를 반환한다  
일반 객체는 이터레이션 프로토콜을 준수하지 않기 때문에 이터러블이 아니지만, 프로토콜을 준수하도록 구현하면 이터러블이 된다

## 이터레이터

이터레이터 프로토콜은 next 메소드를 소유하며 next 메소드를 호출하면 이터러블을 순회하며 value, done 프로퍼티를 갖는 이터레이터 리절트 객체를 반환하는 것이다. 이 규약을 준수한 객체가 이터레이터이다.

이터러블 프로토콜을 준수한 이터러블은 Symbol.iterator 메소드를 소유한다. 이 메소드를 호출하면 이터레이터를 반환한다. 이터레이터 프로토콜을 준수한 이터레이터는 next 메소드를 갖는다.

```javascript
// 배열은 이터러블 프로토콜을 준수한 이터러블이다.
const array = [1, 2, 3];

// Symbol.iterator 메소드는 이터레이터를 반환한다.
const iterator = array[Symbol.iterator]();

// 이터레이터 프로토콜을 준수한 이터레이터는 next 메소드를 갖는다.
console.log("next" in iterator); // true

// 이터레이터의 next 메소드를 호출하면 value, done 프로퍼티를 갖는 이터레이터 리절트 객체를 반환한다.
let iteratorResult = iterator.next();
console.log(iteratorResult); // {value: 1, done: false}
```

이터레이터의 next 메소드는 이터러블의 각 요소를 순회하기 위한 포인터의 역할을 한다. next 메소드를 호출하면 이터러블을 순차적으로 한 단계씩 순회하며 이터레이터 리절트 객체를 반환한다

```javascript
// 배열은 이터러블 프로토콜을 준수한 이터러블이다.
const array = [1, 2, 3];

// Symbol.iterator 메소드는 이터레이터를 반환한다.
const iterator = array.Symbol.iterator;

// 이터레이터 프로토콜을 준수한 이터레이터는 next 메소드를 갖는다.
console.log("next" in iterator); // true

// 이터레이터의 next 메소드를 호출하면 value, done 프로퍼티를 갖는 이터레이터 리절트 객체를 반환한다.
// next 메소드를 호출할 때 마다 이터러블을 순회하며 이터레이터 result 객체를 반환한다.
console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

## 빌트인 이터러블

자스가 제공하는 순회가능한 이터러블은 요것들

> **Array, String,** Map, Set, TypedArray(Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), **DOM data structure(NodeList, HTMLCollection)**, Arguments

## 왜 이런식으로 순회를 구현했나

이터레이션 프로토콜을 준수하는 이터러블들은 되게 다양한데, 다양한 데이터 소스들이 각자의 순회 방식을 가진다면 데이터 소비자는 다양한 데이터 소스의 순회 방식을 모두 지원해야 한다.  
이는 매우 비효율적이기 때문에, 이터레이션 프로토콜이라는 걸 만들고, 이를 준수하도록 규정하면 소비자는 이터레이션 프로토콜만을 지원하도록 하면 된다. 일종의 인터페이스가 되는 샘.

이터러블을 지원하는 데이터 소비자는 내부에서 Symbol.iterator메소드를 호출해 이터레이터 생성하고 이터레이터의 next메소드를 호출하여 이터러블을 순회한다. next 메소드가 반환한 이터레이터 리절트 객체의 value프로퍼티 값을 취득한다.

## for...of

내부적으로 이터레이터의 next메소드를 호출하여 이터러블을 순회하며 next가 반환한 이터레이터 리절트 객체의 value프로퍼티 값을 for...of문의 변수에 할당한다. 이터레이터의 리절트 객체의 done프로퍼티 값이 false이면 순회 계속, true이면 순회 중단

```javascript
// 배열
for (const item of ["a", "b", "c"]) {
  console.log(item);
}

// 문자열
for (const letter of "abc") {
  console.log(letter);
}

// Map
for (const [key, value] of new Map([
  ["a", "1"],
  ["b", "2"],
  ["c", "3"]
])) {
  console.log(`key : ${key} value : ${value}`); // key : a value : 1 ...
}

// Set
for (const val of new Set([1, 2, 3])) {
  console.log(val);
}

// 내부동작은 요런 식이다

// 이터러블
const iterable = [1, 2, 3];

// 이터레이터
const iterator = iterable[Symbol.iterator]();

for (;;) {
  // 이터레이터의 next 메소드를 호출하여 이터러블을 순회한다.
  const res = iterator.next();

  // next 메소드가 반환하는 이터레이터 리절트 객체의 done 프로퍼티가 true가 될 때까지 반복한다.
  if (res.done) break;

  console.log(res);
}
```

## 이터러블 아닌 걸 이터러블로

일반 객체는 빌트인 이터러블이 아니므로, Symbol.iterator메소드를 소유하지 않는다. 즉, 일반 객체는 이터러블 프로토콜을 준수하지 않으므로 for of로 순회할 수 없다.  
하지만 이렇게 한다면 순회 가능

```javascript
const fibonacci = {
  // Symbol.iterator 메소드를 구현하여 이터러블 프로토콜을 준수
  [Symbol.iterator]() {
    let [pre, cur] = [0, 1];
    // 최대값
    const max = 10;

    // Symbol.iterator 메소드는 next 메소드를 소유한 이터레이터를 반환해야 한다.
    // next 메소드는 이터레이터 리절트 객체를 반환
    return {
      // fibonacci 객체를 순회할 때마다 next 메소드가 호출된다.
      next() {
        [pre, cur] = [cur, pre + cur];
        // 리절트 객체는 value와 done여부를 객체로 반환
        //done이 false면 계속 진행, true면 멈춤
        return {
          value: cur,
          done: cur >= max
        };
      }
    };
  }
};

// 이터러블의 최대값을 외부에서 전달할 수 없다.
for (const num of fibonacci) {
  // for...of 내부에서 break는 가능하다.
  // if (num >= 10) break;
  console.log(num); // 1 2 3 5 8
}
```

Symbol.iterator 메소드는 next 메소드를 갖는 이터레이터를 반환하여야 한다. 그리고 next 메소드는 done과 value 프로퍼티를 가지는 이터레이터 리절트 객체를 반환한다. for…of 문은 done 프로퍼티가 true가 될 때까지 반복하며 done 프로퍼티가 true가 되면 반복을 중지한다.

이터러블은 for…of 문뿐만 아니라 spread 문법, 디스트럭쳐링 할당, Map과 Set의 생성자에도 사용된다. 그리고 done프로퍼티가 없으면 무한으로 반복한다.

그리고 이터러블이라면 가능한 것들 => 디스트럭쳐링 할당, 생성자, spread

```javascript
// spread 문법
const arr = [...fibonacci];
console.log(arr); // [ 1, 2, 3, 5, 8 ]

// 디스트럭처링
const [first, second, ...rest] = fibonacci;
console.log(first, second, rest); // 1 2 [ 3, 5, 8 ]
```

## 이터러블 생성 함수

외부에서 값을 받을 수 있도록 수정

```javascript
const fibonacciFunc = function(max) {
  let [pre, cur] = [0, 1];

  return {
    // Symbol.iterator 메소드를 구현하여 이터러블 프로토콜을 준수
    [Symbol.iterator]() {
      // Symbol.iterator 메소드는 next 메소드를 소유한 이터레이터를 반환해야 한다.
      // next 메소드는 이터레이터 리절트 객체를 반환
      return {
        // fibonacci 객체를 순회할 때마다 next 메소드가 호출된다.
        next() {
          [pre, cur] = [cur, pre + cur];
          return {
            value: cur,
            done: cur >= max
          };
        }
      };
    }
  };
};

// 이터러블을 반환하는 함수에 이터러블의 최대값을 전달한다.
for (const num of fibonacciFunc(10)) {
  console.log(num); // 1 2 3 5 8
}

const fibonacciFunc = function(max) {
  let [pre, cur] = [0, 1];

  // Symbol.iterator 메소드와 next 메소드를 소유한
  // 이터러블이면서 이터레이터인 객체를 반환
  return {
    // Symbol.iterator 메소드
    [Symbol.iterator]() {
      return this;
    },
    // next 메소드는 이터레이터 리절트 객체를 반환
    next() {
      [pre, cur] = [cur, pre + cur];
      return {
        value: cur,
        done: cur >= max
      };
    }
  };
};
```

## Lazy evaluation

문자열, Map, Set 등의 빌트인 이터러블은 데이터를 모두 메모리에 확보한 다음 동작한다. 하지만 이터러블은 Lazy evaluation(지연 평가)를 통해 값을 생성한다. Lazy evaluation은 평가 결과가 필요할 때까지 평가를 늦추는 기법이다.

위 예제의 fibonacciFunc 함수는 무한 이터러블을 생성한다. 하지만 fibonacciFunc 함수가 생성한 무한 이터러블은 데이터를 공급하는 메커니즘을 구현한 것으로 데이터 소비자인 for…of 문이나 디스트럭처링 할당이 실행되기 이전까지 **데이터를 생성하지는 않는다.** for…of 문의 경우, 이터러블을 순회할 때 내부에서 **이터레이터의 next 메소드를 호출하는데 바로 이때 데이터가 생성된다.** next 메소드가 호출되기 이전까지는 데이터를 생성하지 않는다. 즉, 데이터가 필요할 때까지 데이터의 생성을 지연하다가 데이터가 필요한 순간 데이터를 생성한다.

## Referance

- [poiemaweb - 이터레이터와 for..of](https://poiemaweb.com/es6-iteration-for-of)
