# 함수형 프로그래밍

## 프로그래밍 패러다임

### 명령형 프로그래밍 == 어떻게 하고 싶은가?(how)

프로그래밍의 상태와 상태를 변경시키는 구문의 관점에서 연산을 설명. 어떻게 해야 하냐에 관점. 알고리즘을 명시하고 목표는 명시하지 않음

- 절자지향 : 수행되어야 할 연속적인 계산 과정 포함(C)
- 객체지향 : 객체들의 집합으로 프로그램의 상호과정 표현(Java)

### 선언형 프로그래밍 == 무엇을 하고 싶은가? 무엇이 되게 만들고 싶은가?(what)

어떤 방법으로 해야 하는지를 나타내기보다 무엇과 같은지를 설명하는 방식. 목표만 명시함

- 함수형 프로그래밍 : 순수 함수를 조합해서 소프트웨어를 나타내는 방식(하스켈 등)

### 자스 코드로 보자

자스는 명령형과 선언형을 아우른다  

- for문 : 요래요래 돌려갖구 뭔가를 할거다
- 배열 메소드 : 얘를 요렇게 만들거다 그래서 결과적으로 요렇게 된다 

```js
// 명령형
// 요소에 덕지덕지 붙이기 + for문
function double (arr) {
  let results = []
  for (let i = 0; i < arr.length; i++){
    results.push(arr[i] * 2)
  }
  return results
}

function add (arr) {
  let result = 0
  for (let i = 0; i < arr.length; i++){
    result += arr[i]
  }
  return result
}
// 얘를 요러케요러케...해버릴거야
$("#btn").click(function() {
  $(this).toggleClass("highlight")
  $(this).text() === 'Add Highlight'
    ? $(this).text('Remove Highlight')
    : $(this).text('Add Highlight')
})


// 선언형
// 배열 메소드 + 속성에 콜백함수
function double (arr) {
  return arr.map((item) => item * 2)
}

function add (arr) {
  return arr.reduce((prev, current) => prev + current, 0)
}

// 얘는 요거야!
<Btn
  onToggleHighlight={this.handleToggleHighlight}
  highlight={this.state.highlight}>
    {this.state.buttonText}
</Btn>
```

## 함수형 프로그래밍

- 프로그래밍은 함수의 계산이다
- 무엇에 초첨을 맞춘다
- 람다 계산식 이론에서 나옴
- 함수형 프로그래밍은 계산을 수학적 함수의 조합으로 생각하는 방식
- 이것은 일반적인 프로그래밍 언어에서 함수가 특정 동작을 수행하는 역할을 담당하는 것과 반대되는 개념
- 함수를 실행해도 함수 외부의 값이 변경되지 않는다
- 간단하게) 객체지향 프로그래밍에서 함수는 특정 동작을 수행, 특정 연산의 한 부분 / 함수형 프로그래밍에서 함수는 **연산 그 자체**

### 개념

#### 1급 객체

- 변수나 데이터 구조안에 담기
- 파라미터로 전달하기
- 반환값으로 사용
- 고유한 구별 가능
- 동적으로 프로퍼티 할당
- 자바스크립트 1급, 1등 함수 : 함수와 객체를 구분하지 않으며 함수도 객체이다, 함수도 저 위에 모든게 다 가능하다, 함수 표현식 사용 가능

#### 고차함수

- 함수에 함수를 파라미터로 전달할 수 있다
- 함수의 반환값으로 함수를 사용할 수 있다
- 고차함수는 1급함수의 부분집합

#### 불변성

- 함수형 프로그래밍에서는 데이터가 변할 수 없으며 이를 불변성이라고 함
- 데이터 변경이 필요한 경우 원본 데이터 구조를 변경하지 않고 그 데이터 복사본을 만들어 그 일부를 변경하고 변경한 복사본을 사용해 작업을 진행한다.

#### 순수함수

- 순수함수란 함수형 프로그래밍에 필요한 개념으로 아래 조건을 만족하는 함수
    - 동일한 입력에는 항상 같은 값을 반환
    - 함수의 실행은 프로그램의 실행에 영향을 미치지 않음(부수효과 없음)
    - 함수 내부에서 인자의 값을 변경하거나 프로그램 상태를 변경하는 행위
    - 순수함수를 호출하면 프로그램에 변화를 발생시키지 않고 입력 값에 대한 결과를 예상할 수 있어서 테스트하기 쉬워진다

#### 데이터 변환

- 함수형 프로그래밍에서는 데이터를 변경하지 않으므로 기존 데이터의 복사본을 만들어주는 도구들이 필요
- map, reduce처럼 자바스크립트에서는 데이터의 변경된 복사본을 리턴하는 메소드들이 존재

#### 합성함수
- 새로운 함수를 만들거나 계산하기 위해서 둘 이상의 함수를 조합하는 과정(compose)
- 함수형 프로그램은 여러 작은 순수함수들로 이루어져있으므로 이 함수들을 연쇄적, 혹은 병렬로 호출해서 더 큰 함수를 만드는 과정으로 전체 프로그램을 구축해야 한다
- 메서드 체이닝 방식의 합성함수
```js
const sum = (a, b) => a + b
const square = x => x * x
const addTen = x => x + 10

const computeNumbers = addTen(square(sum(3, 5))) // 74
///compose같은걸 사용할수도 있다. 고차함수로 만든다
const compute = compose(
  addTen,
  square,
  sum
)
compute(3, 5) // 74
```

## 요약
- 함수형 프로그래밍은 순수함수를 조합하고 공유상태, 변경 가능한 데이터 및 부작용을 피하여 소프트웨어를 만드는 프로세스
- 함수형 프로그래밍은 명령형이 아닌 선언형이며 애플리케이션의 상태는 순수함수를 통해 전달

## 시계

### 명령형 시계
```js
setInterval(logClockTime, 1000);

function getClockTime() {
  let date = new Date();
  let time = {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    ampm: "AM"
  };

  if (time.hours === 12) {
    time.ampm = "PM";
  } else if (time.hours > 12) {
    time.ampm = "PM";
    time.hours -= 12;
  }

  if (time.hours < 10) {
    time.hours = "0" + time.hours;
  }

  if (time.minutes < 10) {
    time.minutes = "0" + time.minutes;
  }

  if (time.seconds < 10) {
    time.seconds = "0" + time.seconds;
  }

  return time.hours + ":" + time.minutes + ":" + time.seconds + " " + time.ampm;
}

function logClockTime() {
  let time = getClockTime();
  document.getElementById("time").innerHTML = time;
}
```

### 선언형 시계
```js
// 시계 만들기 (함수형)

// 목표
// 작은 로직으로 나누기
// 각 함수는 한가지 작업에 집중

/*
  - 1초 돌려주는 함수
  - 현재 시각 돌려주는 함수
  - 메시지를 화면에 표시하는 함수
*/

const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const log = message => console.log(message);
const clear = () => console.clear();
const html = message => (document.getElementById("time").innerHTML = message);

/* 데이터 변환 함수들
  - 24시간제 시각 반환 함수
  - 상용시로 변환 함수
  - AM, PM을 붙여주는 함수
*/

const serializeClockTime = date => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds()
});

const civilianHours = clockTime => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours
});

const appendAMPM = clockTime => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? "PM" : "AM"
});

/* 재사용성을 위한 몇가지 고차 함수 
  - 대상 함수를 인자로 받아 그 함수에 시각을 전달하는 함수를 반환하는 함수
  - 형식을 인자로 받아서 해당 형식대로 시각을 표현하는 문자열을 반환하는 함수 
  - 키와 객체를 인자로 받아 키에 해당하는 프로퍼티 값에 따라 문자열을 변환하는 함수
*/

const display = target => time => target(time);
const formatClock = format => time =>
  format
    .replace("hh", time.hours)
    .replace("mm", time.minutes)
    .replace("ss", time.seconds)
    .replace("tt", time.ampm);

const prependZero = key => clockTime => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? "0" + clockTime[key] : clockTime[key]
});

/* 함수들을 순차적으로 실행하는 합성 함수 */
const compose = (...fns) =>
  fns.reduce(
    (prevFn, nextFn) => (...args) => nextFn(prevFn(...args)),
    value => value
  );

/* 프로그램 실행에 필요한 함수들
  - 24시간제 시각을 상용시로 전체로 변환하는 함수 
  - 상용시 객체에 두자리 표시하는 함수
  - 타이머를 설정하고 시계를 시작하는 함수
*/

const convertToCivilianTime = clockTime =>
  compose(
    appendAMPM,
    civilianHours
  )(clockTime);

const doubleDigits = civilianTime =>
  compose(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(civilianTime);

const startTicking = () =>
  setInterval(
    compose(
      clear,
      getCurrentTime,
      serializeClockTime,
      convertToCivilianTime,
      doubleDigits,
      formatClock("hh:mm:ss tt"),
      display(log)
    ),
    oneSecond()
  );

startTicking();

```