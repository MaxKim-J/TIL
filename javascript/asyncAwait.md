# Async & Await
2020.01.18
자스 비동기 프로그래밍 async & await

## 특징
자바스크립트 비동기 처리 패턴 중 가장 최근에 나온 문법  
기존의 비동기 처리 방식인 콜백함수와 프로미스의 단점을 보완하고 개발자가 **읽기 좋은 코드**를 작성할 수 있게 도와줌

### async : 프로미스를 반환
프로미스는 객체로 존재하지만(타입이 객체임) async await는 함수에 적용되는 개념  
async await 함수는 프로미스를 반환하게 됨
```javascript
async function getData() {
  return 123;
  // return Promise.resolve(123) - 이렇게 해도 같은 결과
}
// 123이 resolve된 Promise를 반환한다
getData().then(data => console.log(data));
// 프로미스를 반환하기 때문에 then을 사용할 수 있음

async function getData() {
  throw new Error('123');
}
// 123이 reject된 Promise를 반환하며, 이건 catch에서 잡힌다
getData().catch(error => console.log(error)); // 에러발생
```

### await : 비동기 로직
await 키워드는 async await 함수 내부에서 사용됨.  
await 키워드 오른쪽에 프로미스를 입력하면 **프로미스가 처리됨 상태 될때까지 기다림**  
따라서 await 키워드로 비동기 처리를 기다리면서 순차적으로 코드를 작성할 수 있음  
```javascript
// Promise를 반환하는 비동기로직
function requestData(value) {
  return new Promise(resolve => 
    setTimeout(() => {
      console.log('requestData', value);
      resolve(value);
    }, 100),
  );
}

// async + await
async function getData() {
  // 비동기 처리 메서드가 꼭 프로미스 객체를 반환해야 await가 의도된 대로 동작함
  const data1 = await requestData(10);
  const data2 = await requestData(20);
  // 프로미스가 처리됨 상태가 될때까지 console.log가 실행되지 않음
  console.log(data1, data2);
  // 어쨋든 프로미스를 반환하게 됨
  return [data1, data2]
}
getData();
```
유의) await는 일반 함수에서 async 없이 사용하면 에러가 발생함

### 진보한 가독성
딱보면 안다
```javascript
function getDataPromise() {
  asyncFunc1()
    .then(data => {
      console.log(data);
      return asyncFunc2();
    })
    .then(data => {
      console.log(data);
    });
}

// async는 then을 이용하여 로직 순서를 보장할 필요가 없기 때문에 가독성이 좋음
async function getDataAsync() {
  // async 함수 안에서는 await키워드로 표시된 비동기 로직을 기다리게 되어있기 때문
  const data1 = await asyncFunc1();
  console.log(data1);
  const data2 = await asyncFunc2();
  console.log(data2);
}
```
비동기 함수간에 의존성이 높아질수록 async await와 프로미스의 가독성 차이가 드러남  
종속성이 있을 때는 Promise.all 보다는 await 쓰는게 낫다
```javascript
async function getDataSync() {
  const data1 = await asyncFunc1();
  const data2 = await asyncFunc2(data1);
  return asyncFunc3(data1, data2)
}
```

## 활용

### 병렬처리 
await 사용해서 호출하면 순차적으로 실행됨  
근데 순차적으로 실행되는 두 함수 사이에 의존성이 없다면 동시에 실행하는게 좋음
프로미스는 **생성과 동시에 비동기 로직이 실행되므로** 두개의 프로미스를 먼저 생성하고 await를 나중에 쓰면 병렬로 실행되는 코드가 됨
```javascript
async function getData() {
  // 동기적으로 비동기 로직 동시실행
  const p1 = asyncFunc1();
  const p2 = asyncFunc2();
  const data1 = await p1;
  const data2 = await p2;
}
// 이러면 더 간단쓰
async function getData() {
  const [data1, data2] = await Promise.all([asyncFunc1(), asyncFunc2()]);
}
```

### 예외처리
try catch문으로 처리하는게 좋다
```javascript
async function getData() {
  try {
    await doAsync(); //비동기 - 끝나야만 다음로직 실행
    return doSync(); //동기
  } catch (error) {
    // 모든 예외를 catch문에서 처리한다
    // async await가 아니었다면 비동기로직 예외는 catch에서 처리되지 않음 - 언제 끝날지 모르므로
    console.log(error);
  }
}
```

## 심화

### 치환 가능
async await는 promise then 체이닝으로 치환이 가능한 형태가 되는 편이며, 이벤트 루프를 막지 않는다, 근데 async awiat는 동기 코드가 막는것 처럼 보이기는 함
```js
let result;
getData().then((data) => {
  console.log("패치완료!", data)
  result = data
})

const result = await getData();
console.log("패치완료!",data)
```

### async await의 원리
일단 처음엔 이렇게 생겼다
```js

function getDrink() {
    return new Promise((resolve, reject) => {
        resolve('orange juice')
    })
}

async function fun() {
    let drinks = await getDrink();
    console.log(drinks) // orange juice
}

fun()
```
- 호출되는 함수 getDrink는 Promise 객체를 반환하고, 이 함수를 호출하는 부분에서는 async await 사용하여 함수 호출함
- 동기적으로 보이지만 blocking되는건 아님
- await는 async함수에서만 동기적으로 진행

#### 제너레이터에 대한 이해
- 단 한번의 실행으로 함수의 끝까지 실행이 완료되는 일반 함수와는 달리 제너레이터 함수는 사용자의 요구에 따라(Yiled와 next에 따라) 일시적으로 정지될 수도 있고 다시 시작될 수도 있다. 
- 제너레이터 함수의 반환으로는 제너레이터가 반환
- yield: 함수 실행 정지, 제너레이터의 콜러에게 반환
- next로 인해 재개
- 이터레이터가 값을 읽어오기위한 인터페이스라면, 제너레이터는 값을 쓰기 위한 인터페이스

바벨에 넣어본거 결과
```js
let fun = (() => {
    // 제너레이터 함수를 인자로 받아서 함수를 호출하는 함수
    var _ref = _asyncToGenerator(function* () { 
        // 그냥... yield로 done 상태 봐가면서 순차적으로 promise resolve가 실행될 수 있도록 하나보다
        // yield되면 거기서 멈춤 => 제너레이터 next 될때까지 기다림
        let drinks = yield getDrink();
        console.log(drinks); // orange juice
    });

    // 고차함수 패턴 같기두
    return function fun() { // 4. 실제 우리가 실행하게 될 함수
    //  this바인딩 + arguemnts 넘겨서 함수 호출
        return _ref.apply(this, arguments); 
    };
})(); // 즉시 실행

function _asyncToGenerator(fn) { 
    return function () { 
        // fn은 프로미스를 yield하는 함수임, this 바인딩
        // 제너레이터 함수에다가 this바인딩 한 친구
        var gen = fn.apply(this, arguments); 

        // 그리고 또 이 함수는 ㅅㅂ 프로미스를 리턴한다
        return new Promise(function (resolve, reject) { 
            function step(key, arg) { 
                try { 
                    // key로 호출해주는 이상한 인터페이스
                    // Generator.next(arg) : 제너레이터에 값을 전달한다
                    // 여기서는 yield된 프로미스를 전달 => 얘가 리졸브 될때까지 => 멈춤
                    // next를 부른다, 왜 arg랑 같이 호출하지?

                    // 넥스트 부르면 yiled된 프로미스 가져올것이고
                    var info = gen[key](arg); 
                    var value = info.value; 
                } catch (error) { 
                    reject(error); 
                    return; 
                } 

                // 제너레이터가 끝났다면 젤큰 리턴 프로미스를 리졸브함
                if (info.done) { resolve(value); } 

                // 제너레이터가 끝나지 않았다면 순차적으로 일드된 프로미스를 리졸브하고 다음으로 넘어감
                else { 
                    // 프로미스 리졸브 파라미터로 프로미스를 넘길 수 있따(이행할 것)
                    // 프로미스를 이행한 것을 리졸브하는 새로운 프로미스를 리턴하고, 다음 프로미스로 넘어감
                    // 그럼 얘는 일단 끝난거
                    return Promise.resolve(value).then(function (value) { 
                        // 왜 value를 넘기지???
                        step("next", value); // 9. 재귀적 호출
                    }, function (err) { 
                        step("throw", err); 
                    }); 
                } 
            } 

            // 제너레이터 돌리기 시작!!
            return step("next"); 
    }; 
}

function getDrink() {
    return new Promise((resolve, reject) => {
        resolve('orange juice');
    });
}

fun();
```

**몇줄 요약** 

- _asyncToGenerator : 이 함수를 호출하면서 인자로 generator을 전달한다(yield)
- function* : 제너레이터 함수를 정의, 제너레이터 객체를 반환한다
```js
// yield 부르면 중지, next하면 다음으로 넘어가는데
// 그 사이에 있는 로직들은 일단 계속 실행
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i){
  yield i;
  yield* anotherGenerator(i);
  yield i + 10;
}

var gen = generator(10);

console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // 13
console.log(gen.next().value); // 20
```
- async는 제너레이터 funtion*으로 변경된다.
- await은 yield로 변경된다
- yield되는 얘들은 Promise 객체를 반환하는 함수, next메소드 사용해 다음거, 다음거, 넘어가서 리졸브

### 한줄 요약
async는 제너레이터 함수(function *), await은 promise를 리턴하는 yield로 바뀌어서, yield가 해결되는 순서 기준으로 함수가 처리됨. yield가 호출되면 제너레이터 함수는 잠시 정지되고, 해당 yield실행문이 리턴하는 promise가 resolve되야 다음 실행문으로 넘어감. (오류생기면 끗나고)

## reference
- [실전 리액트 프로그래밍 - async,await](http://www.yes24.com/Product/Goods/74223605)
- [캡틴판교 - 자바스크립트 async와 await](https://joshua1988.github.io/web-development/javascript/js-async-await/)