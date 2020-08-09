# 타입스크립트 심화 3) 클래스

...ㄹㅇ 너무 헷갈림

## 타입 선언

```ts
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
// 클래스 오버라이딩
// 보니까 extends는 같은 친구들 사이에서 되는듯
class Cat extends Animal {
  getName(): string {
    return `Cat name is ${this.name}.`;
  }
}
```

- 클래스의 속성은 클래스 바디에 별도로 타입을 선언하거나
- interface를 implement하는 방식으로 구현된다.

## 클래스 수식어

### 수식어

수식어는 접근 제어자와 함게 사용할 수 있음

- static : 정적으로 사용, 자스에서는 정적 메소드만 생성 가능했지만 타입스크립트에서는 정적 속성도 생성 가능 
- 정적 속성은 클래스 바디에서 속성의 타입 선언과 같이 사용하며, 정적 메소드와는 다르게 클래스 바디에서 값을 초기화할 수 없어서 constructor안에서 초기화하거나 메소드에서 초기화해야함
- 정적 변수 or 메소드 : 인스턴스가 생성될 때마다 독립적으로 생기는 멤버변수와는 달리 해당 클래스에 하나만 생성되고 모든 인스턴스에서 공동으로 접근할 수 있는 변수이다. (클래스당 하나만 생기고 this가 아니라 클래스를 통해 참조된다)
```ts
class Cat {
  static legs: number;
  constructor() {
    // 이렇게 클래스 이름과 같이 참조
    Cat.legs = 4; // Init static property.
  }
}
console.log(Cat.legs); // undefined
new Cat();
console.log(Cat.legs); // 4
```
- readonly : 속성에만 적용 가능하며 읽기 전용으로 사용. 값을 걍 수정할 수 없고 constructor에서 초기화된 값만 조회 가능
```ts
class Animal {
  readonly name: string;
  constructor(n: string) {
    this.name = n;
  }
}
let dog = new Animal('Charlie');
console.log(dog.name); // Charlie
dog.name = 'Tiger'; // Error 읽을수만 있음 수정 불가능잼
```


### 접근 제어자

속성, 메소드에 모두 적용 가능

- public : 어디서나 자유롭게 접근 가능, 수식어 없으면 그냥 이거
- protected: 파생된 후손 클래스 내에서 접근 가능(외부에선 접근 못함)
```ts
class Animal {
  // protected 수식어 사용
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}
class Cat extends Animal {
  getName(): string {
    return `Cat name is ${this.name}.`;
  }
}
let cat = new Cat('Lucy');
console.log(cat.getName()); // Cat name is Lucy.
console.log(cat.name); // error: 외부에선 접근 못함
```
- private: 내 클래스에서만 접근 가능(클래스 외부나 상속된 클래스에서도 접근 못함)
```ts
class Animal {
  // private 수식어 사용
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
}
class Cat extends Animal {
  getName(): string {
    return `Cat name is ${this.name}.`; // Error: 상속된 클래스에서 접근 못함
  }
}
let cat = new Cat('Lucy');
console.log(cat.getName());
console.log(cat.name); // Error : 외부에서 접근 못함, 메서드를 통해서만 접근
```

- 생성자 메소드에서 인수 타입 선언과 동시에 접근 제어자를 사용하면 바로 속성 멤버로 정의 가능(갱장한 단축 문법,,)
```ts
class Cat {
  constructor(public name: string, protected age: number) {}
  getName() {
    return this.name;
  }
  getAge() {
    return this.age;
  }
}
```

## 추상 클래스

타입스크립트에도 이따,,,

- 다른 클래스가 파생될 수 있는 기본 클래스, 인터페이스와 상당히 유사
- 인터페이스는 모든 메소드가 추상 메소드이지만 추상 클래스는 하나 이상의 추상 메소드와 일반 메소드를 포함할 수 있다. 

- 클래스를 타입선언에 사용하는건 머지