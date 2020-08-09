# 타입스크립트 심화 : 1) 타입 추론/단언/가드

쓰면 쓸수록 모르겠는 타입스크립트,,,,  
- 아 요즘 느끼는건데 타입스크립트는 그냥 타입을 명시해주는 타스라는 기술에 그냥 맞춰 따르는게 아니라 필요한 부분은 단언하고 필요하지 않는 부분은 넘어가는 그런 개발자의 역량이 중요하다는 느낌이 듬..  
- 타입스크립트는 사람보다 멍청하다는걸 기억하자,,, 저 멍청한 얘가 하라는데로 하지 말자;

## 타입 추론

타입 추론이 엄격하지 않은 타입 선언을 의미하는 것은 아님  
따라서 이를 활용해 **모든 곳에 타입을 명시할 필요는 없다.** => 먼가 다 타입을 명시해야될 것 같은 강박을 버리자

### 타입스크립트가 타입을 추론하는 경우

- 초기화된 변수
- 기본값이 설정된 매개변수
- 반환 값이 있는 함수

### let과 const의 차이

```ts
let hello = 'world'   // string으로 추론
const hello = 'world'   // 'word'로 추론
let hello as const = 'world'

const obj = {
  hello: 'world' as const,
  foo: 'bar'
};
```

- let은 초기화된 값을 보고 타입을 추론한다
- const는 그렇진 않고 그 값을 타입으로 삼아 추론한다
- as const를 쓰면 let에서도 값을 타입으로 삼아 추론하도록 할 수 있다.
- 주로 객체 프로퍼티의 타입 추론 범위를 좁혀주기 위해 const assertion을 사용한다
- 리덕스 액션 타이핑에 쓰인다고 하는데 써본거 같은데 다시한번 복습해야할듯

## 타입 단언

### <>, as

- 타입스크립트가 타입 추론을 통해 판단할 수 있는 범주를 넘는 경우, 더이상 추론하지 않도록 지시할 수 있음(날 믿으라구)  
- **프로그래머가 타입스크립트보다 타입에 대해 더 잘 이해하고 있는 상황**  
- 타입스크립트는 변수 이름만으로는 타입이 뭔지 추론 불가능. 관련 메서드 쓸때 단언해줘야

```ts
function someFunc(val: string | number, isNumber: boolean) {
  // some logics
  if (isNumber) {
    // 1. 변수 as 타입
    (val as number).toFixed(2);
    // Or
    // 2. <타입>변수
    // (<number>val).toFixed(2);
  }
}
```

### Non-null 단언 연산자

- null이나 undefined일 수 있을 때 타입스크립트는 경기를 일으키지만 `!`를 붙여 써줘서 단언하면 괜찮다.
- DOM에 쓰면 좋음

```ts
// Non-null assertion operator
document.querySelector('.menu-item')!.innerHTML;
```

## 타입 가드

- 단언을 여러번 쓰지 말고 이거 쓰면 댐
- 추론 가능한 특정 스코프에서의 타입을 보장하는 방법
- 별도의 추상화 없이 instanceOf나 in등을 사용해서 가딩해도 된다.
```ts
// 일종의 다형성 구현
function isNumber(val: string | number): val is number {
  return typeof val === 'number';
}

function someFunc(val: string | number) {
  if (isNumber(val)) {
    val.toFixed(2);
    isNaN(val);
  } else {
    val.split('');
    val.toUpperCase();
    val.length;
  }
}

class Cat {
  meow() {}
}
class Dog {
  woof() {}
}
function sounds(ani: Cat | Dog) {
  if (ani instanceof Cat) {
    ani.meow();
  } else {
    ani.woof();
  }
}
```