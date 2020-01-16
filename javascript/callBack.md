# 콜백 함수
2020.01.16

## 콜백함수란
- 정의 : 다른 코드의 인자로 넘겨주는 함수. 콜백함수를 넘겨받은 코드는 함수를 필요에 따라 적절한 시점에 실행함
- 제어권과 관련이 깊다 - 다른 코드에게 인자로 넘겨줌으로써 그 제어권도 함께 위임한 함수, 콜백 함수를 위임받은 코드는 자체적인 내부 로직에 의해 이 콜백함수를 적절한 시점에 실행함

## 제어권
- **호출시점**의 제어권을 넘겨받은 코드는 사용자의 손을 떠난다(interval)
- 콜백 함수의 인자 역시 메소드가 정해준 순서대로 넘겨야 한다(map)
- 콜백함수도 함수라서 this가 전역객체 참조하지만, 제어권을 넘겨받을 코드에서 콜백 함수에 별도로 this가 될 대상을 지정한 경우에는 그 대상을 참조한다
```javascript
Array.prototype.map = function(callback, thisArg) {
  var mappedArr = [];
  // this는 대상객체인 배열이다
  for (var i = 0; i<this.length; i++) {
    // thisArg는 여기서 따로 지정해준 객체, call을 통한 명시적 바인딩이 일어난다
    // 따라서 this에는 전역객체가 아닌 다른 값이 담김
    var mappedValue = callback.call(thisArg || window, this[i], this);
    mappedArr[i] = mappedValue;
  }
  return mappedArr;
}
```
## 콜백은 함수라네
콜백 함수로 어떤 객체의 메서드를 전달하더라도 그 메서드는 메서드가 아닌 함수로서 호출됨
```javascript
var obj = {
  vals: [1,2,3],
  logValues: function(v,i) {
    console.log(this,v,i);
  }
};
obj.logValues(1,2);
[4,5,6].forEach(obj.logValues); //window 전역객체

// 이런 경우에는 메서드를 그대로 전달한 것이 아니라, 가리키는 함수만 전달한 걸로 봐야
// 메서드로 호출하는 것이 아니니 obj와는 직접적인 연관이 없는 상황. 전역객체를 바라봄
```
## 콜백 지옥과 비동기 제어
콜백 함수를 익명 함수로 전달하는 과정이 반복되어 코드의 들여쓰기 수준이  
감당하기 힘들 정도로 깊어지는 현상, 자바스크립트에서 흔히 발생하는 문제  
이벤트 처리, 서버 통신과 같이 비동기적인 작업을 수행하기 위한 형태 그러나 알다시피 별로임

**비동기적 코드**
- 특정 시간 지날때 까지 함수 실행 보류(setTimeOut)
- 직접적 개입이 있을때만 함수를 실행하기 위해 보류(addEventListner)
- 서버에다가 비동기 요청(XMLHttpRequest) 등등..

### 비동기적 작업 동기적으로 표현

1. promise

new Promise는 호출할 때 바로 실행되지만 그 내부에 resolve 또는 reject함수를 호출하는 구문이 있을 경우 둘 중 하나가 실행되기 전까지는 then이나 catch로 넘어가지 않는다  
비동기 작업이 완료될 때 비로소 resolve나 reject를 호출하는 방법으로 비동기 작업의 동기적 표현을 가능케함

2. async+await

비동기 작업을 수행하고자 하는 함수 앞에 async를 표기하고, 함수 내부에서 실질적인 비동기 작업이 필요한 위치마다 await을 표기하는 것 만으로 뒤의 내용을 Promise로 자동 전환하고 해당 내용이 resolve 되어야만 다음으로 진행함. 

## Reference
- [코어 자바스크립트 - 콜백 함수](http://www.yes24.com/Product/Goods/78586788?scode=032&OzSrank=1)