# 초반 세팅 

## 프로젝트 시작
```shell
npx create-react-app my-app --template typescrip
```
- create-react-app-typescript는 deprecated 됐음
- @types/react 랑 @types/react-dom을 대신 사용해야함

## 함수 컴넌
```ts
// 임포트 => 프롭 => 컴넌 => 익스포트

// 인터페이스, 타입 뭐든 사용해도 무방, 대신 일관성 있어야
// propTypes의 역할이 내장되어 있달까
type AppProps = {message:string}
const App = ({message} : AppProps) => <div>{message}</div>

export App

// React.FC로 선언하는 방법도 존재

const App: React.FunctionComponent<{message:string}> = ({message}) => (<div>{message}</div>)
```
- React.FC로 선언하면 타입이나 인터페이스 쓰지 않고 제네릭으로 컴포넌트 안에다가 타입을 선언
- children은 따로 선언해주지 않아도 내포되어 있음(근데 명시적이진 않아서 좀 그럼)

## hooks

### useState
```ts
const [user, setUser] = React.useState<IUser | null>(null);
```
- 필수는 아니지만 제네릭으로 타입으르 명시적으로 지정해준다

### useRef
```ts
const ref1 = useRef<HTMLElement>(null!);
const ref2 = useRef<HTMLElement | null>(null);
```

- useRef로 찝하는 DOM의 타입은 HTMLElement
- 2번째처럼 하면 탄력적으로 바꿀 수 있음(그런 dom이 안찝혔을때는 null로 표시되고 에러가 안남)

### useEffect
```ts
useEffect(()=> setTimeout(()=>{/*do stuff*/}), 5000),[timer]);
```

- 리턴값이 아예 없거나, function만 가능하다(이때 function은 클리어하는 함수, 외부효과 해제 함수)

### 커스텀 훅
```ts
export function useLoading() {
  const [isLoading, setState] = React.useState(false);
  // 프로미스에 담길 것 제네릭으로 지정
  const load = (aPromise: Promise<any>) => {
    setState(true);
    return aPromise.finally(() => setState(false));
  };
  // const assertion 한번 공부 해봐야될거같음
  // 걔의 타입이 아니라 식별자 그자체를 가리키는거라 그랬나?
  return [isLoading, load] as const; 
  // infers [boolean, typeof load] instead of (boolean | typeof load)[]
}
```
## default props 사용
```ts
type Props = { age: number } & typeof defaultProps;
const defaultProps = {
  who: "Johny Five",
};

const Greet = (props: Props) => {
  /*...*/
};

Greet.defaultProps = defaultProps;
```

## 인터페이스 vs 타입
- 인터페이스 : 여러곳에서 사용되는 새로운 이름을 만듬, extend, implement가능(확장에 용이)
- 타입 : 새로운 이름을 만들지 않음, extend되거나 implement될 수 없음, 인터페이스로 표현할 수 없는 형태이고, union이나 튜플을 사용해야 한다면 type을 사용하면 됨
>declare function aliased(arg: Alias): Alias;  
declare function interfaced(arg: Interface): Interface;  

![특징](https://pbs.twimg.com/media/DwV-oOsXcAIct2q.jpg)

### 컨벤션 
- 인터페이스는 모듈 불러올 때 사용해라 => 필요한 모듈만 선언하고 필요한 것만 가져와서 사용할 수 있게
- 타입은 프롭 정의할 때 써라, more constrained하기 때무네 + union/intersection 타입 쓰기에도 좋음

## 프롭타입 컨벤션

```ts
type AppProps = {
  message: string;
  count: number;
  disabled: boolean;
  /** array of a type! */
  names: string[];
  /** string literals to specify exact string values, with a union type to join them together */
  status: "waiting" | "success";
  /** any object as long as you dont use its properties (not common) */
  obj: object;
  obj2: {}; // almost the same as `object`, exactly the same as `Object`
  /** an object with defined properties (preferred) */
  obj3: {
    id: string;
    title: string;
  };
  /** array of objects! (common) */
  // ㄷㄷ 이게 되는구나
  objArr: {
    id: string;
    title: string;
  }[];
  /** any function as long as you don't invoke it (not recommended) */
  onSomething: Function;
  /** function that doesn't take or return anything (VERY COMMON) */
  onClick: () => void;
  /** function with named prop (VERY COMMON) */
  onChange: (id: number) => void;
  /** alternative function type syntax that takes an event (VERY COMMON) */
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  /** an optional prop (VERY COMMON!) */
  optional?: OptionalType;
};

export declare interface AppProps {
  children1: JSX.Element; // bad, doesnt account for arrays
  children2: JSX.Element | JSX.Element[]; // meh, doesn't accept strings
  children3: React.ReactChildren; // despite the name, not at all an appropriate type; it is a utility
  children4: React.ReactChild[]; // better
  children: React.ReactNode; // best, accepts everything
  functionChildren: (name: string) => React.ReactNode; // recommended function as a child render prop type
  style?: React.CSSProperties; // to pass through style props
  onChange?: React.FormEventHandler<HTMLInputElement>; // form events! the generic parameter is the type of event.target
  props: Props & React.PropsWithoutRef<JSX.IntrinsicElements["button"]>; // to impersonate all the props of a button element without its ref
}
```

## 이벤트
```ts

// 함수 시그니처 사용
const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
  this.setState({ text: e.currentTarget.value });
};

// 반환값의 타입을 지정
const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  this.setState({text: e.currentTarget.value})
}
```

## context 훅
```ts
interface ContextState {
  // set the type of state you want to handle with context e.g.
  name: string | null;
}
//set an empty object as default state
const Context = React.createContext({} as ContextState);
// set up context provider as you normally would in JavaScript 

///////////////////////////////////////////////////////////////

import * as React from "react";

// 제네릭 사용
const currentUserContext = React.createContext<string | undefined>(undefined);

function EnthusasticGreeting() {
  const currentUser = React.useContext(currentUserContext);
  return <div>HELLO {currentUser!.toUpperCase()}!</div>;
}

function App() {
  return (
    <currentUserContext.Provider value="Anders">
      <EnthusasticGreeting />
    </currentUserContext.Provider>
  );
}
```

- [createCtx](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context)헬퍼 함수를 사용할 수도 있는데 뭔가 당장은 안쓸거같아서 패스

## portals
와 이건 존나 첨보는데  
부모 컴포넌트의 dom계층 구조 바깥에 있는 dom노드로 자식을 렌더링하는 방법 
타입으로는 HTMLElement 사용
```js
// 리액트 엘리먼트, 돔 앨리먼트
ReactDOM.createPortal(child, container)

render() {
  // React는 새로운 div를 생성하지 *않고* `domNode` 안에 자식을 렌더링합니다.
  // `domNode`는 DOM 노드라면 어떠한 것이든 유효하고, 그것은 DOM 내부의 어디에 있든지 상관없습니다.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```
## 자주 발생하는 에러 해결

### 유니온 타입
```ts
  {
    count: number | null; // like this
  }

  // null 일때도 동작 가능
  {
  state = {
    count: null,
  };
  render() {
    return <div onClick={() => this.increment(1)}>{this.state.count}</div>;
  }
  increment = (amt: number) => {
    this.setState((state) => ({
      count: (state.count || 0) + amt,
    }));
  };
```
### 타입 가드
```ts
interface Admin {
  role: string;
}
interface User {
  email: string;
}

// Method 1: use `in` keyword => 인터페이스 두개의 유니온 타입
function redirect(user: Admin | User) {
  // 인터페이스의 프로퍼티 검사(in)
  if ("role" in user) {
    // use the `in` operator for typeguards since TS 2.7+
    routeToAdminPage(user.role);
  } else {
    routeToHomePage(user.email);
  }
}

// Method 2: custom type guard, does the same thing in older TS versions 
// or where `in` isnt enough
// 함수 시그니처에 is 키워드로 조건 타이핑하기
function isAdmin(user: Admin | User): user is Admin {
  return (user as any).role !== undefined;
}
```

### 타입 단언
- 타입스크립트의 타입 추론보다 개발자가 이게 뭔타입인지 지정해주는게 나을 때도 있음 
- union 타입의 경우 단언해서 더 구체적으로 만들 필요도 생김
- 컴파일러보다 니가 더 잘 알고 있다는 이야기이기도 함
- as 쓰는거 타입 캐스팅이랑 다르다(정의 vs 형변환)
```ts
class MyComponent extends React.Component<{
  message: string;
}> {
  render() {
    const { message } = this.props;
    return (
      <Component2 message={message as SpecialMessageType}>{message}</Component2>
    );
  }
}
```

### 타입으로 하는 함수 오버로딩
```ts
type pickCard = {
  (x: { suit: string; card: number }[]): number;
  (x: number): { suit: string; card: number };
  // 이렇게 여러개를 만들어줄 수 있음
};
```

### 추론으로 퉁치기 
- 이거 redux쓸때 어떤 인스턴스의 타입 같이 리턴하는 함수 쓰는 것처럼
- any보다는 성의있게 동적으로 타입을 추론할 수 있따
```ts
const [state, setState] = React.useState({
  foo: 1,
  bar: 2,
}); // state's type inferred to be {foo: number, bar: number}

const someMethod = (obj: typeof state) => {
  // grabbing the type of state even though it was inferred
  // some code using obj
  setState(obj); // this works
};
```
- partial 제네릭 타입을 이용하면 굳이 타입 선언해서 계속 타이핑 해줄필요 없어짐
```ts
const [state, setState] = React.useState({
  foo: 1,
  bar: 2,
}); // state's type inferred to be {foo: number, bar: number}

// we are just demonstrating how to use Partial here
const partialStateUpdate = (obj: Partial<typeof state>) =>
  setState({ ...state, ...obj });

// later on...
partialStateUpdate({ foo: 2 }); // this works
```

### 컴포넌트 프롭 가져오기(??)
- 컴넌에서 타입을 선언하지 않아도 컴포넌트를 보고 타입을 추론할수 있다
- 타입으로 프롭 비구조화할당 할거면 굳이 필요있나 싶기도 함

```ts
import { Button } from "library"; // but doesn't export ButtonProps! oh no!
type ButtonProps = React.ComponentProps<typeof Button>; // no problem! grab your own!
type AlertButtonProps = Omit<ButtonProps, "onClick">; // modify

const AlertButton: React.FC<AlertButtonProps> = (props) => (
  <Button onClick={() => alert("hello")} {...props} />
);
```

## 타입스크립트 연산자
- `typeof` and `instanceof`: type query used for refinement
- `keyof`: get keys of an object
- `O[K]`: property lookup(???)
- `[K in O]`: mapped types(???)
- `+` or `-` or `readonly` or `?`: addition and subtraction and readonly and optional modifiers(타입 modify)
- `x ? Y : Z`: Conditional types for generic types, type aliases, function parameter types
- `!`: Nonnull assertion for nullable types
- `=`: Generic type parameter default for generic types
- `as`: type assertion
- `is`: type guard for function return types

## Reference
- [react-tpyescript-cheatsheets](https://react-typescript-cheatsheet.netlify.app/docs/basic/troubleshooting/tsconfig)