# 이터레이션과 for...of

2020.03.09

## 이터레이션 프로토콜

데이터 컬렉션을 순회하기 위한 프로토콜. 이터레이션 프로토콜을 준수한 객체는  
for..of로 순환할 수 있고, spread문법의 피연산자가 될 수 있음  
이 객체가 이터러블하냐 마냐를 판단하는 것 => 객체 안에 [symobol.iterator]유무  
이 심볼은 이터러블의 요소를 탐색하기 위한 포인터를 제공함

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
