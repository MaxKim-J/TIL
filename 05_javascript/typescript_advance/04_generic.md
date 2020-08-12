# 타입스크립트 심화 04_제네릭


## 설명

- 타입을 인수로 받아서 사용한다고 이해하면 좋을듯
- 함수나 클래스의 선언 시점이 아닌 사용시점에 타입 선언할 수 있는 방법을 제공

```ts
function makeArray<T>(a: T, b: T): T[] {
  return [a, b];
}

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
interface MyType<T extends string | number> {
  name: string,
  value: T
}

const dataA: MyType<string> = {
  name: 'Data A',
  value: 'Hello world'
};
const dataB: MyType<number> = {
  name: 'Data B',
  value: 1234
};
const dataC: MyType<boolean> = { // error
  name: 'Data C',
  value: true
};
const dataD: MyType<number[]> = { // error
  name: 'Data D',
  value: [1, 2, 3, 4]
};
```