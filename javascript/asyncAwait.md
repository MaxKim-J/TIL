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
## reference
- [실전 리액트 프로그래밍 - async,await](http://www.yes24.com/Product/Goods/74223605)
- [캡틴판교 - 자바스크립트 async와 await](https://joshua1988.github.io/web-development/javascript/js-async-await/)