# 하이어오더 컴포넌트

2020.03.16  
리액트의 대표적인 디자인 패턴

## 데코레이터 패턴

- 상속 패턴 : 공통 기능은 부모로부터 물려받고 추가 기능만 구현하여 중복 코드의 양을 줄일 수 있는 패턴, 그러나 여러 부모 속성을 동시에 가질 경우 문제점이 발생
- 원치 않은 상속이 발생할 수 있고, 상속 구조가 깊어지면 상속 항목을 한눈에 파악하기 어렵다
- 데코레이터 패턴은 클래스 간의 종속성 없이 기능만을 공유할 수 있게 한다
- 상속 패턴에서는 상속 구조에 따라 기능을 순서대로 물려받았으나, 데코레이터 패턴에서는 필요한 기능만 탑재하여 각각 독립된 객체를 생성했음
- 독립된 데코레이터로 기능을 구성했다 => 자바의 인터페이스, 자바스크립트의 커링

## 하이어오더 컴포넌트

자바스크립트의 커링 함수를 고차함수라고 하는데, 고차함수의 영어 표현 그대로 살려 하이어오더 컴포넌트, 고차 컴포넌트라고 부르게 됨

### 특징

```javascript
// 함수형 컴포 반환
function hoc(Component) {
  return function Enhanced(props) {
    return <Component {...props} />;
  };
}

// 클래스형 컴포 반환
function hoc(Component) {
  return class Enhanced extends Component {
    render() {
      return <Component {...this.props} />;
    }
  };
}
```

- 함수, 클래스형태의 컴포넌트 모두 반환 가능
- 기존 컴포넌트에 기능을 덧입혀 새 컴포넌트로 반환하는 함수
- 보통 생명주기 함수를 확장한 하이어오더 컴포넌트를 구성해야 하는 경우 클래스형 컴포넌트를 반환하도록 구현
- 하이어오더 컴포넌트는 기존 컴포넌트에 연결된 프로퍼티를 모두 전달해 주어야 한다. 전개 표현식 이용
- 하이어오더 컴포넌트와 확장 컴포넌트의 이름은 **with**로 시작 => 암묵적인 룰
- 인자가 결국 달라도 같은 이름의 컴포넌트가 된다(리액트 데브툴에서 볼 수 있음), static displayname메소드를 사용하면 이 값을 바꿀 수 있다

```javascript
// 인자로 받는 컴포넌트의 이름을 고차컴포넌트의 이름으로 한다
// 이러면 데브툴에 같이 찍힘
static displayname = `withHoc(${WrappedConponent.name})`;
```

### 예제 - 로딩 컴넌 만들기

```javascript
import React from "react";

export default function(loadingMessage = "로딩 중인걸..") {
    // 확장 컴넌에서 출력할 메시지를 받는 또 하나의 커링 함수
    return function withLoading(WrappedComponent) {
        // 로딩중 이외으 다른 메시지를 출력하기 위해, 인자를 하나 더 받을 수 있지만
        // 이건 암묵룰에 위배(고차컴포는 인자 하나만 받아야 함)
        // 인자로 들어온 컴포넌트의 displayname과 name을 추출
        const {displayName, name:componentName} = WrappedComponent;
        const wrappedComponentName = displayName || componentName;

        function WithLoading({isLoading, ...otherProps}) {
            // 구조할당으로 일단 추출(없을수도 있으므로)
            // isLoading 프로퍼티 값이 있으면 로딩중이라는 메시지를 표시함
            // 리턴값이 여러개일 수 있다는 점이 재사용성을 높이는 것 가틈
            if (props.isLoading) {
                return "로딩 중";
            }
            return (
                <WrappedComponent {...props}>
            );
        }
        withLoading.displayName = `withLoading(${wrappedComponentName})`;
        // hoc의 리턴값
        return withLoading
    }
}

// 고차 커링을 사용했을 때는 이렇게 넘기면 된다
import Text from "../../text"
// export default이므로 그냥 이름정해서 부르고 인자넘기고 다음인자 넘기고 하면 됨
// 근데 뭐 프롭으로 하면 되지 않을까?
import withLoading from "../05/.."

const TextWithLoading = withLoading('로딩중')(Text);
```

## recompose 라이브러리

1. branch 함수로 조건에 따라 다른 컴포넌트 출력

```javascript
branch(
  // 출력 조건
  (condition: props => boolean),
  // 출력 조건이 참일때
  (left: HigherOrderComponent),
  // 출력 조건이 거짓일때
  [(rigth: HigherOrderComponent)]
)(wrappedComponent);

// 컴포넌트에 적용
export default branch(
  ({ isLoading }) => isLoading,
  () => () => <button></button>
)(button);
```

2. withState 함수로 컴포넌트에서 상태값 활용할 수 있음
3. lifecycle 함수로 컴포넌트에 생명주기 함수 추가할 수 있음
4. 굳이 안쓸거가틈
5. 하이어오더 컴포넌트를 제작할 때도 동일하게 유사한 기능을 가진 컴포넌트의 조합을 최소화하여 최적화된 컴포넌트 조합 확장을 하는 것이 중요

## 다중 하이어오더 컴포넌트

- 하이어오더 컴포넌트는 기존 컴포넌트에 기능을 추가하여 새로운 컴포넌트를 반환하는 구조
- 고차 컴넌을 계속해서 겹치면 컴포넌트의 기능을 계속 확장할 수 있다

```javascript
function Component() {
  return null;
}

const ComponentWithZ = withZ(Component);
const ConponentWithYandZ = withY(ComponenetWithZ);
const ConponentWithXandYandZ = withX(ComponentWithYandZ);

// 한번에
const ComponentWithXYZ = withX(withY(withZ(Component)));

// recompose 이용
import compose from "recompose/compose";

const ComponentWithXYZ = compose(withX, withY, withZ)(Component);
```

## 예제 - 필수 입력 항목 표시 기능 추가

동일한 오류 메시지를 출력하는 하이어오더 컴포넌트 제작

```javascript
import React from 'react';

export default function(defaultMessage) {
    return WrappedComponent => {
        const {displayName, name:componentName} = WrappedComponent;
        const wrappedComponentName = displayName || componentName;

        function ComponentWithError({
            hasError,
            errorMessage,
            styles,
            ...props
        }) {
            return (
                <>
                    <WrappedComponent {...props}>
                    {hasError && <div>{errorMessage}</div>}
                </>
            )
        };
        // 인자로 전달받은 오류 매시지를 기본 오류 메시지로
        ComponentWithError.defaultProps = {
            errorMessage : defaultMessage
        };
        ComponentWithError.displayName = `withError(${wrappedComponentName}`)
    }
    return ComponentWitdhError;
}
```

## reference

- [doit 리액트의 정석]()
