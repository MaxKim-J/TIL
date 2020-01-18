# JS 비동기 프로그래밍 + 프로미스

## 비동기 프로그래밍
어떤 일이 완료되기를 기다리지 않고 다음 코드를 실행해 나가는 프로그래밍 방식  
특정 코드의 연산이 끝날 때까지 코드의 실행을 멈추지 않고 다음 코드를 먼저 실행

### 왜 필요하나?
- 화면에서 서버로 데이터를 요청했을 때 **서버가 언제 그 요청에 대한 응답을 줄지도 모르는데** 마냥 다른 코드를 실행 안하고 기다릴 수가 없음
- 오래 걸리거나 서버와의 통신처럼 언제 끝날지 잘 모르겠는 작업들을 브라우저에 위임할 때 이루어짐
- 요청이 많아졌을 때는? 요청이 100개 1000개 됐을 때 실행하고 기다리고 실행하고 기다리고... 시간 엄청 많이 걸림

```javascript
// #1
console.log('Hello');
// #2
setTimeout(function() {
	console.log('Bye');
}, 3000);
// #3
console.log('Hello Again');
```
- web API인 setTimeout() 함수 : 코드를 바로 실행하지 않고 지정한 시간만큼 기다렸다가 로직을 실행
- 그전에 `console.log('Hello Again')`은 미리 실행됨
- 비동기 실행이 끝나고 난 후 바로 콜백함수 실행 가능

### JS 엔진의 비동기 로직 처리 프로세스
- 자바스크립트 엔진은 기본적으로 하나의 쓰레드에서 동작
- 하나의 쓰레드를 가지고 있다는 것 = 하나의 스택 = 동시에 단 하나의 작업만을 할 수 있음
- `web API`에서 비동기적으로 이벤트를 처리하거나, Ajax 통신을 하게 됨
- `Event Loop`과 `Queue`를 이용해서 비동기 작업을 함

#### 이벤트 루프와 큐
이벤트 루프가 하는 일: 콜스택과 큐 사이의 작업들을 확인, 콜스택이 비워있는 경우 큐에서 작업을 꺼내서 콜스택에 넣는다.  
자바스크립트 엔진이 하나의 코드 조각을 하나씩 처리할 수 있도록 작업을 스케쥴하는 동시에 + 비동기 처리도 함  

#### 동기+비동기 로직 처리순서

```javascript
//1 - 콘솔로그
console.log("script start");

//2 - 셋타임아웃(비동기)
setTimeout(function() {
  console.log("setTimeout");
}, 0);

//3 - 프로미스(비동기)
Promise.resolve().then(function() {
  console.log("promise1");
}).then(function() {
  console.log("promise2");
});

//4 - 콘솔로그
console.log("script end");
```
이 로직의 실행 결과는
```javascript
script start
script end
promise1
promise2
requestAnimationFrame
setTimeout
```
**실제 처리 순서**
1. 전역 컨텍스트 콜스택에 등록
2. console.log('script start')
3. 셋타임아웃 작업이 stack에 등록되고, web API에 setTimeout을 요청. 이때 셋타임아웃의 콜백 함수를 함께 전달. 요청 이후 stack의 settimeout은 제거
4. web api는 setTimeOut의 작업이 완료되면 setTimeout callback함수를 task queue에 등록한다.
5. 프로미스 작업이 stack에 등록되고 web api에 프로미스 작업 요청, 이때 then의 콜백 함수를 함께 전달, web api에서 프로미스 작업 완료되면 콜백함수를 큐에 등록
6. console.log('script end')
7. **스택이 비워져 있으니** 큐의 작업들 수행이 시작된다. 먼저 프로미스의 콜백함수가 실행되어 console.log("promise1")이 처리됨
8. 첫번째 then 다음 then이 있다면 그 callback을 큐에 등록함 + 스택에서 첫번째 then 콜백 처리
9. 두번째 then 콜백 스택에서 처리 + settimeout 스택에 등록
10. 셋타임아웃의 콜백 처리 + 스택에서 지워짐

#### 비동기 작업의 종류
1. task 큐: 비동기 작업이 순차적으로 수행될 수 있도록 보장하는 형태의 작업 유형(setTimeout)
2. Microtask 큐: 비동기 작업이 현재 실행되는 스크립트 바로 다음에 일어나는 작업. task보다 먼저 실행된다 (Promise)


### 콜백함수
- 다른 함수의 인수로 넘기는 함수
- 특정 비동기 로직 시행 후 바로 실행되는 로직
- 데이터를 여러 방식으로 처리하려면 꼬리에 꼬리를 무는 콜백 함수...복잡 => 콜백 지옥
- 자세한건 [#콜백함수]()에서 정리

## Promise
콜백 함수의 문제를 해결하는 Promise Pattern  
비동기 상태를 값으로 다룰 수 있는 객체  
비동기 프로그래밍을 동기 프로그래밍 방식으로 코드 짜기 가능  
```javascript
// 비동기 로직 후 코드의 순차적 실행을 보장

requestData1().then(data => {
  console.log(data);
  return requestData2();
})
  .then(data => {
    console.log(data);
});
```
### 세 가지 상태
1. pending : 결과를 기다리는 중
2. fulfilled: 수행이 정상적으로 끝났고 결과값을 가지고 있음
3. rejected : 거부됨, 수행이 비정상적으로 끝났음

2,3 상태를 처리된 상태라고 함, pending => settled로 변함  

```javascript
const p1 = new Promise((resolve, reject) => {
  //로직로직
  resolve(data) or reject('error Message')
});

const p2 = Promise.reject('error Message');
const p3 = Promise.resolve(param);
```
- 생성자 이용해 만들면 대기중 프로미스 만들어지고, 생성자에 입력되는 함수는 resolve와 reject라는 콜백 함수
- 어떤 작업을 수행 후 성공했을 때 resolve 호출하고, 실패했을 때 reject를 호출한다.
- resolve를 호출했을 때 p1은 이행됨 상태가 된다. 반대로 reject를 호출하면 거부됨 상태가 된다
- new 키워드를 이용해 프로미스를 생성하는 순간 생성자의 입력 함수가 실행됨. 생성되는 순간에 요청 ㄱ
- 그냥 바로 처리됨 상태의 프로미스를 만들려면 `Promise.~` 이런식으로 만든다
  - 프로미스 생성할 때 프로미스가 아닌 인수 넣으면 그 인수를 가진 이행됨 프로미스가 반환됨
  - promise.resolve 함수에 프로미스가 입력되면 그 자신이 반환됨

### then
처리됨 상태가 된 프로미스를 처리할 때 사용하는 메소드  
프로미스가 처리됨 상태가 되면 then 메서드의 인수로 전달된 함수가 호출된다  
```javascript
requestData1().then(data => {
  console.log(data);
  return requestData2();
  })
  .then(data => {
    console.log(data);
  })
  .then(data => {
    return data + 1;
  })
  .then(null, error => {
    console.log(error);
  })
```
**then 메서드는 항상 Promise를 리턴한다** 따라서 하나의 프로미스로부터 연속적으로 then메소드 호출 가능  
또한 이어지는 then 메소드들은 항상 연결된 순서대로 호출됨(동기적으로)
```javascript
// 기본적인 형태 - 프로미스 반환하고 then에 있는 두 함수 인자로 받는 콜백
requestData().then(onResolve, onReject);

// 이행됨 상태의 프로미스 반환, 첫번째 인자로 함수 받음
Promise.resolve(123).then(data => console.log(data));

// 거부됨 상태인 프로미스 반환, 두번째 인자로 함수 받음
Promise.reject('err').then(null, error => console.log(error));
```

### catch
catch는 프로미스 수행 중 발생한 예외를 처히라는 메서드  
catch 메서드는 then 메서드의 onReject 함수와 같은 역할을 함

#### 프로미스 예외처리 onReject vs catch
프로미스에서 예외처리 할때는 then 메서드의 두번째 인자인 onReject함수보다는  
좀 더 직관적인 catch 메서드를 이용하는게 좋음 

**왜?** 
1. 일단 가독성 면에서 더 좋음
2. then 메서드의 onResolve 함수에서도 예외가 발생할 수 있는데, 같은 메서드의 onReject 함수에서 처리되지 않음. 
3. then 메소드와 같이 catch 메소드에서도 새로운 프로미스를 반환함 => 꼬리물고 계속 사용 가능
```javascript
// 거부된 상태의 프로미스를 처리하지 않았기 때문에 에러 발생!
Promise.resolve().then(() => {throw new Error('some Error');}, error => {console.log(error)};)

// catch를 써서 해결, onResolve에서 발생한 예외상황을 처리하는 catch 메소드
Promise.resolve()
  .then(() => {
    throw new Error('some Error');
  })
  .catch(error => {
    console.log(error);
  })

Promise.reject(10)
  .then(data => {
    console.log('then1:', data);
    return 20;
  })
  .catch(error => {
    console.log('catch:', error);
    return 30;
    // catch: 10 콘솔로그
  })
  .then(error => {
    console.log('then2:', data);
    // then2: 30 콘솔로그
  });
```

### finally
이전에 사용한 프로미스를 그대로 반환해서 로직 실행  
finally의 존재 여부를 신경쓰지 않아도 됨. 리턴되는 프로미스는 안바뀜  
성공 실패 여부에 상관없이 실행해야할 로직이 있을 때

### 유의점

#### return을 쓰자!
then으로 꼬리무는 식으로 콜백을 이용한다면, 위 then 메소드안에 return을 넣어주자  
then 메서드가 반환하는 프로미스 객체의 데이터는 **내부 함수가 반환한 값**이다

#### 프로미스는 불변 객체임!
then 메서드는 기존 객체를 수정하지 않고, 새로운 프로미스를 반환함  
```javascript
// then으로 프로미스 객체의 리턴값을 수정하려는 시도 => 10
function requestData() {
  const p = Promise.resolve(10);
  p.then(() => {
    return 20;
  });
  return p;
}
// 안되구.. 이런식으로 반환값을 온전히 반환해야함 => 20
function requestData() {
  return Promise.resolve(10).then(v => {
    return 20;
  });
}

requestData().then(v => {
  console.log(v); 
})
```

#### 동기코드는 예외처리!
함수 안에 비동기 로직과 동기 로직이 함께 있을 때 => then 안으로 몰아서 한꺼번에 예외처리하자  
(호출 순서를 굳이 따지지 않는 상황에서는,,)  


### 추가로 알아두면 좋은 것

#### Promise.all
비동기 함수 간에 의존성이 없으면(비동기 로직 결과값 받은 담에 그 값으로 또 요청할거 아니면..) 병렬로 처리하는게 좋음  
then 체인으로 연결 말고 각각 호출하면 병렬로 처리됨
```javascript
Promise.all([requestData1(), requestData2()].then(([data1, data2]) => {
  console.log(data1, data2);
}));
```
의존성 있는 것도 순차적으로 처리 가능
```javascript
requestData1()
.then(result1 => {
  return Promise.all([result1, requestData(result1)])
})
.then(([result1, result2]) => {
  // 로직로직
});
```
**MDN WEB DOCS 정리**  
순회 가능한 객체에 주어진 모든 프로미스가 이행한 후, 혹은 프로미스가 주어지지 않았을 때 이행하는 Promise를 반환한다. 주어진 프로미스 중 하나가 거부하는 경우, 첫번째로 거절한 프로미스의 이유를 사용해 자신도 거부  

이행된 프로미스를 반환하는 로직(함수) or 이행된 프로미스 모두 순회가능한 객체에 들어갈 수 있음  

여러개의 비동기 작업들이 존재하고 이들이 모두 완료되었을 때 작업을 진행하고 싶다면 쓰는 api  
```javascript
//map이랑 사용한다고 할때 
function wait(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitLog(item){
  // 500ms 후에 resolve시키는 비동기로직
  await wait(500);
  return (`waitLog : ${item}`);
}

async function AsyncAwaitByForOfParallel() {
  const arrays = [1, 2, 3];
  // 500ms뒤에 resolve된 Promise 반환하는 로직에 인수 바인딩
  const arrayPromises = arrays.map(this.waitLog);
  // 프로미스 3개가 push된 배열이 Promise.all의 인자
  await Promise.all(arrayPromises)
    .then(([data1, data2, data3]) => {
      console.log(data1);
      console.log(data2);
      console.log(data3);
    });
  // 비동기 로직 실행!
  console.log('end');
}
```

#### Pormise.race
병렬로 처리된 여러개의 비동기로직 중 가장 먼저 처리된 것을 프로미스로 반환한다  
많이 쓸 것 같지는 않다..


## reference
- [캡틴판교 - 자바스크립트 비동기 처리와 콜백 함수](https://joshua1988.github.io/web-development/javascript/javascript-asynchronous-operation/)
- [자바스크립트로 만나는 세상 - 비동기 프로그래밍](https://helloworldjavascript.net/pages/285-async.html#fn_6)
- [실전 리액트 프로그래밍 - 2.4 향상된 비동기 프로그래밍1:프로미스](http://www.yes24.com/Product/Goods/74223605?scode=032&OzSrank=1)
- [자바스크립트 비동기 처리 과정과 RxJs Scheduler](http://sculove.github.io/blog/2018/01/18/javascriptflow/)
- [async / await 최적화 방법 (병렬처리)](https://blog.woolta.com/categories/3/posts/138)




