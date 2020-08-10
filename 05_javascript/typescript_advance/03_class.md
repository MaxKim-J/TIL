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

- **생성자 메소드에서 인수 타입 선언과 동시에 접근 제어자를 사용하면 바로 속성 멤버로 정의 가능(갱장한 단축 문법,,)**
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

```ts
abstract class Animal {
  abstract name: string; // 파생된 클래스에서 구현해야 합니다.
  abstract getName(): string; // 파생된 클래스에서 구현해야 합니다.
}

class Cat extends Animal {
  constructor(public name: string) {
    super();
  }
  getName() {
    return this.name;
  }
}
new Animal(); // Error : 추상 클래스 만으로는 인스턴스를 만들 수 없다
const cat = new Cat('Lucy');
console.log(cat.getName()); // Lucy

// Interface
interface IAnimal {
  name: string;
  getName(): string;
}

// 클래스의 인터페이스
class Dog implements IAnimal {
  constructor(public name: string) {}
  getName() {
    return this.name;
  }
}
```

- 다른 클래스가 파생될 수 있는 기본 클래스, 인터페이스와 상당히 유사
- 인터페이스는 모든 메소드가 추상 메소드이지만(구현을 기다리는 메소드랄까) 추상 클래스는 하나 이상의 추상 메소드와 일반 메소드를 포함할 수 있다.(구현을 해야하는 메소드와 이미 구현되어 있는 매소드가 섞여있어도 됨)
- 추상 클래스는 직접 인스턴스를 생성할 수 없기 때문에 파생된 후손 클래스에서 인스턴스를 생성해야 함
- 추상 클래스가 인터페이스와 다른 점은 속성이나 메소드 멤버에 대한 세부 구현이 가능하다는 점임

## 데코레이터

- 모든 데코레이터는 그냥 function이구 함수 이름 가져다 불러쓰면 된다
- 클래스, 메소드, 프로퍼티, 파라미터에 적용할 수 있다
- 실험적인 기능, tsconfig에서 추가할 수 있음

### 이미 만들어진 클래스 프로퍼티에 "붙이는 거"

```ts
function fistDecorator(target, name) {
  console.log('fistDecorator');
}

class Person {
  @fistDecorator
  job = 'programmer';
}

const p = new Person();
console.log(p.job); // 콘솔 로그도 같이 실행됨
```

### 팩토리 패턴 데코레이터

- 다양한 상황에서 사용할 수 있도록 파라미터를 전달해야 하는 데코레이터
- 데코레이터는 클래스를 인스턴스화하기 위해 클래스를 호출하기 전에 (미리) 실행된다

### 이외 특징

- 데코레이터는 d.ts나 declare안에서는 사용할 수 없음 == 즉 전역으로 선언할 수 없음
- 데코레이터 표현식은 런타임에 함수로서 호출됨

### 클래스 데코레이터

```ts
function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
  return class extends constructor {
      newProperty = "new property";
      hello = "override";
  }
}

@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
      this.hello = m;
  }
}

```

- 기존의 클래스 정의를 확장하는 용도
- 클래스 데코레이터 함수의 인자로는 클래스가 전달됨. 클래스 데코레이터 함수에서는 새로운 클래스만을 반환하며 함수 이외의 값은 무시됨
- **자신이 적용되는 클래스를 자체로 extends해서 새로운 프로퍼티를 추가하거나 기존의 프로퍼티에 오버라이드함**
- 클래스에 필요한 의존성을 클래스의 constructor을 통해 주입하는 기능도 수행 가능

```ts

// 난해...

const dependencyPool = {
  dep1: {name: 'dep1'},
  dep2: {name: 'dep2'},
  dep3: {name: 'dep3'},
  dep4: {name: 'dep4'},
};

function inject(...depNames) {
  return function<T extends {new(...args: any[]): {}}> (constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        const deps = depNames.reduce((deps, name) => ({
          ...deps,
          [name]: dependencyPool[name],
        }), {});
        super(deps);
      }
    }
  }
}
```