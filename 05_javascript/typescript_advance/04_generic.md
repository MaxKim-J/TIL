# 타입스크립트 심화 04_제네릭


## 설명

- 타입을 인수로 받아서 사용한다고 이해하면 좋을듯
- 함수나 클래스의 선언 시점이 아닌 사용시점에 타입 선언할 수 있는 방법을 제공

```ts
function makeArray<T>(a: T, b: T): T[] {
  return [a, b];
}

// 다이아몬드 연산자
makeArray<number>(1, 2);
makeArray<string>('1', '2');
makeArray<string | number>(1, '2');
makeArray<number>(1, '2'); // Error

// 이것도 타입추론 되긴함
function toArray<T>(a: T, b: T): T[] {
  return [a, b];
}

toArray(1, 2);
toArray('1', '2');
toArray(1, '2'); // Error
```

## 제약 조건

- 인터페이스나 타입 별칭을 사용하는 제네릭을 작성할 수 있음
- 타입 변수에서 특정 경우만 허용하려면 extends키워드를 사용하는 제약조건을 추가할 수 있음

```ts
// 프로퍼티에 내포된 인자는 요거다 하는 느낌
interface MyType<T extends string | number> {
  name: string,
  value: T
}

const dataA: MyType<string> = {.
  name: 'Data A',
  value: 'Hello world'
};
const dataB: MyType<number> = {
  name: 'Data B',
  value: 1234
};

// 중에 하나
const dataC: MyType<boolean> = { // error
  name: 'Data C',
  value: true
};
const dataD: MyType<number[]> = { // error
  name: 'Data D',
  value: [1, 2, 3, 4]
};
```

## 타입 별칭 vs 인터페이스

- type : = 사용, 타입 별칭, 하나 이상의 타입을 조합해 이름을 부여하고 정확히는 조합한 각 타입들을 참조하는 별칭을 만듬. 유니온을 많이 사용함
- interface : 객체를 정의하는 규칙이자 구조, extends나 implement를 사용할 수 있다
- 객체 타입은 인터페이스로 만들고, 타입은 유니온등을 이용해 쓰깔때 사용하면 될듯(구분 확실하게)
- 근데 사실 거의 비슷하게 작동하기는 한다 :뒤에서는

## 조건부 타입

```ts
interface IUser<T extends boolean> {
  name: string,
  age: T extends true ? string : number, // `T`의 타입이 `true`인 경우 `string` 반환, 아닌 경우 `number` 반환.
  // 인자로 받는 타입에 따라서 프로퍼티에다가 다른 타입을 지정해주기
  isString: T
}

// 이런식으로 괴랄한 사용도 가능함
type MyType<T> =
  T extends string ? 'Str' :
  T extends number ? 'Num' :
  T extends boolean ? 'Boo' :
  T extends undefined ? 'Und' :
  T extends null ? 'Nul' :
  'Obj';
```

- 제약 조건과 다르게 타입 구현 영역에서는 삼항 연산자를 사용할 수 있다

## infer

- 타입 변수의 타입 추론 여부를 확인할 수 있는 키워드
- infer type => 타입추론이 가능한지 불리언으로 리턴
- infer는 제약조건 extends가 아닌 조건부 타입 extends에서만 사용 가능 
- infer 키워드는 타입 변수를 여러 위치에서 사용 가능

```ts
// 넘버는 타입추론이 가능하므로
type MyType<T> = T extends infer R ? R : null;
const a: MyType<number> = 123;

// 함수의 반환값이 어떤 타입인지를 반환
// 리턴타입이라는 타입은 어떤 타입이 몇개나 와도 괜찮음 
// 근데 그 타입이 추론 가능할 경우 그 추론 가능한 타입을 내뱉음
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

// 추론: 반환 타입은 string
function fn(num: number) {
  return num.toString();
}

// a의 타입도 string이 됨
const a: ReturnType<typeof fn> = 'Hello';
```
