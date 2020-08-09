# 타입스크립트 심화 2) 인터페이스

- 타입스크립트 열 객체를 정의하는 일종의 규칙이며 구조
- interface 키워드와 함께 사용

## 기능

```ts
interface IUser {
  readonly name: string
  age?: number
}

interface IUser {
  readonly name: string,
  readonly age: number
}
let user: IUser = {
  name: 'Neo',
  age: 36
};
user.age = 85; // Error
user.name = 'Evan'; // Error

let user: Readonly<IUser> = {
  name: 'Neo',
  age: 36
};

// 타입단언 
let user = {
  name: 'Neo',
  age: 36
} as const;
```

- ,나 ; 를 사용하지 않아도 선언 가능
- ?를 사용해 선택적 속성으로 정의
- readonly를 사용하면 초기화된 값을 유지하는 읽기 전용 속성 정의 가능(한번 assign되면 바꿀 수 없다)
- 모든 속성이 readonly라면 단언 타입 사용 가능

## 인터페이스로 함수 타입, 클래스 타입

### 함수타입

호출 시그니처

```ts
interface IName {
  (PARAMETER: PARAM_TYPE): RETURN_TYPE // Call signature
}

const getUser: IGetUser = function (n) { // n is name: string
  // Find user logic..
  // ...
  return user;
};
```

### 클래스타입

#### implements 사용하기

```ts
interface IUser {
  name: string,
  getName(): string
}

class User implements IUser {
  // 일종의 오버라이딩이 된다
  // 오버라이딩을 안하면 안된다 이거 추상클래스 이런거 자바 문법에 있을텐데
  constructor(public name: string) {}
  getName() {
    return this.name;
  }
}

const neo = new User('Neo');
neo.getName(); // Neo
```

#### 구성 시그니처

```ts
interface ICat {
  name: string
}

class Cat implements ICat {
  constructor(public name: string) {}
}

function makeKitten(c: ICat, n: string) {
  return new c(n); // Error 
}
```

- 정의한 클래스를 인수로 사용하는 경우, 인터페이스에는 new 연산자를 사용할 수 없기 때문에 다른 시그니처가 필요하다 요렇게
- 함수 시그니처 앞에 new 써주면 됨

```ts
interface IName {
  new (PARAMETER: PARAM_TYPE): RETURN_TYPE // Construct signature
}
```

## 인덱싱 가능 타입

- 단일하지 않고 여러개의 속성을 가지거나 단언할 수 없는 임의의 속성이 포함되는 구조에서는 기존의 방식만으로는 한계
- 인덱싱 가능 타입들을 정의하는 인터페이스, 인덱스 시그니처를 사용할 수 있다.
- 인덱싱에 사용할 인덱서의 이름과 타입 그리고 인덱싱 결과의 반환값을 지정
- 인덱서의 타입은 string과 number만 지정할 수 있습니다.

```ts
interface IItem {
  //넘버로 인덱싱 할거고 반환값은 문자열임
  [itemIndex: number]: string // Index signature
}
let item: IItem = ['a', 'b', 'c']; // Indexable type
console.log(item[0]); // 'a' is string.
console.log(item[1]); // 'b' is string.
console.log(item['0']);

interface IUser {
  // 같이 프로퍼티로 끼워넣기
  [userProp: string]: string | number
  name: string,
  age: number
}
let user: IUser = {
  name: 'Neo',
  age: 123,
  email: 'thesecon@gmail.com',
  isAdult: true // Error - TS2322: Type 'true' is not assignable to type 'string | number'.
};
```

### keyof**

- 인덱싱 가능 타입에서 keyof를 사용하면 **속성 이름을 타입으로** 사용할 수 있음
- 인덱싱 가능 타입의 속성 이름들이 유니온 타입으로 적용됨

```ts
interface ICountries {
  // 인터페이스에 value를???
  KR: '대한민국',
  US: '미국',
  CP: '중국'
}
let country: keyof ICountries; // 'KR' | 'US' | 'CP'
country = 'KR'; // ok
country = 'RU'; // Error - TS2322: Type '"RU"' is not assignable to type '"KR" | "US" | "CP"'.
```

## extends

- interface끼리의 확장 => extends : 추가!
- class는 interface 통해 => implements : 오버라이딩, 구현 안되면 오류
- 같은 이름의 인터페이스 여러개 만들기 가능 => 추가