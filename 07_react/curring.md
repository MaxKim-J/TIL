# 커링

리액트의 대표적인 디자인 패턴들  
2020.03.16

## 커링이 뭐냐

- 함수를 반환하는 함수, 함수를 재활용하기 위함

```javascript
function multiply(a, b) {
  return a * b;
}

function letsMul(a, b) {
  return multiply(a, 2);
}

function multiplyX(x) {
  return function(a) {
    return multiply(a, x);
  };
}

// 화살표 함수를 이용한 고차함수
const multiplyX = x => a => multiply(a, x);

// 처음에 x에 인자를 넣어준 함수의 리턴값은 function a이고
// 그 리턴값에 인자를 넣어줘서 최종적인 결과값을 구하게 됨
const multiplyThree = multiplyX(3);
const result1 = multiplyThree(3); //9

// 중간에 있는 함수선언 생략 가능
const result1 = multiplyThree(3)(3); // 9
```

- 멀티플라이 엑스 함수는 인자 x를 받아 익명함수를 반환하고, 익명함수는 다시 인자 a를 받아 multiply(a,x)를 실행한 값을 반환함.
- 그냥 인자를 두개 받는 함수와는 다른 점은(`multiply(a,b)`)인자를 한꺼번에 전달해야 하므로 multiply(3)을 실행한 다음 다른 작업을 할 수 없음. 이 방법으로는 함수를 재활용하기 어려움
- 인자를 나눠 받아 실행할 수 있다는 점이 핵심

```javascript
const equation = (a, b, c) => x => x * a * b + c;
//formula는 함수를 반환해서 가지고 이씀
const formula = equation(2, 3, 4);

// 나중에 인자를 넣어줌, 그리고 결과값
const x = 10;
const result = formula(x);

// 활용
const multiply = (a, b) => a * b;
const add = (a, b) => a + b;

const multiplyX = x => a => multiply(a, 2);
const addX = x => a => add(x, a);

// 커링 자체를 여러겹 겹쳐서 재사용도 가능
const addFour = addX(4);
const multiplyTwo = multiplyX(2);
const multiplyThree = multiplyX(3);
const formula = x => addFour(multiplyThree(multiplyTwo(x)));
```

- 인자를 나중에 받아 실행할 함수를 생성해주는 `equation()`같은 함수가 바로 커링 함수
- 인자의 순서, 개수에 따라 비슷한 함수를 반복해서 작성해야 하는 부분을 커링을 이용하면 커링 패턴으로 묶인 함수들을 쉽게 유지, 보수할 수 있으므로 유용

## 함수 조합 기법

- 앞에서의 `formula`처럼 조합하면 적용 순서가 오른쪽에서 왼쪽 방향이므로 사람이 함수 적용 흐름을 한번에 이해하기 어렵다는 단점이 있다
- 커링함수를 순서대로 조합하는 compose함수를 만들면 되더라. 배열 메소드인 reduce를 사용한다

### 리듀스 이해하기

- 리듀스 매소드의 4가지 인자 : 누산기, 현재값, 현재인덱스, 원본배열

`배열.reduce((누적값, 현잿값, 인덱스, 요소) => { return 결과 }, 초깃값);`

```javascript
// 덧셈기
result = oneTwoThree.reduce((acc, cur, i) => {
  console.log(acc, cur, i);
  return acc + cur;
}, 0);
// 0 1 0
// 1 2 1
// 3 3 2
result; // 6

// 초기값 없음 : 배열의 0번째 인덱스가 초깃값이 된다
result = oneTwoThree.reduce((acc, cur, i) => {
  console.log(acc, cur, i);
  return acc + cur;
});
// 1 2 1
// 3 3 2
result; // 6

// 연산만 할 수 있는 건 아니고 map이나 filter처럼 구현도 가능, 초기값이 배열
result = oneTwoThree.reduce((acc, cur) => {
  acc.push(cur % 2 ? "홀수" : "짝수");
  return acc;
}, []);
result; // ['홀수', '짝수', '홀수']

// 비동기 프로그래밍할때 프로미스 순차실행을 보장
const promiseFactory = time => {
  return new Promise((resolve, reject) => {
    console.log(time);
    setTimeout(resolve, time);
  });
};
[1000, 2000, 3000, 4000].reduce((acc, cur) => {
  return acc.then(() => promiseFactory(cur));
}, Promise.resolve());
```

### 리듀스로 커링함수 만들기

```javascript
// array.prototype.reduce() : 배열의 각 요소에 대해 주어진 리듀서 함수를 실행하고,
//하나의 결과값을 반환함, 많은 함수를 겹처서 실행할 때 사용

[multiplyTwo, multiplyThree, addFour].reduce(
  // 리듀서 함수의 1,2 인자 = 누산값, 현재값
  function(prevFunc, nextFunc) {
    return function(value) {
      return nextFunc(prevFunc(value));
    };
  },
  //초기값(그대로 리턴)
  function(K) {
    return k;
  }
);

//임의의 함수를 넣어 리듀스 함수를 반환
function compose() {
  // arguments객체를 배열 인자로 받을 수 있게 하는 메소드
  // array.slice를 arguments객체에 바인딩해서 쓸 수 있고(call), slice는 인자를 비우면 얕은 복사본 반환
  const funcArr = Array.prototype.slice.call(arguments);
  return funcArray.reduce(
    function(prevFunc, nextFunc) {
      return function(value) {
        return nextFunc(prevFunc(value));
      };
    },
    function(k) {
      return k;
    }
  );
}
const furmulaWithCompose = compose([multiplyTwo, multiplyThree, addFour]);

//전개연산자 사용하여 더 간결한 버전
function compose(...funcArr) {
  return funcArray.reduce(
    function(prevFunc, nextFunc) {
      return function(...args) {
        return nextFunc(prevFunc(...args));
      };
    },
    function(k) {
      return k;
    }
  );
}
const furmulaWithCompose = compose([multiplyTwo, multiplyThree, addFour]);
```

## reference

- [doit 리액트의 정석]()
- [제로초 - 맵리듀스]()
