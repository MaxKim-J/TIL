# 클로저
2020.02.02  
아 어려워;

## 정의
클로저는 함수와 그 함수가 선언될 당시의 lexical environment의 상호관계에 따른 현상  
어떤 컨텍스트 a에서 선언한 내부함수 b의 실행 컨텍스트가 활성화된 시점에는  
b의 outerEnvironmentReference가 참조하는 대상인 a의 lexicalenvironment에도 접근이 가능 
내부함수에서 외부 변수를 참조하는 경우 - combination  

실행 컨텍스트가 종료되면 LE에 저장된 식별자들에 대한 참조를 지움(맨 아래)

```javascript
var outer = function() {
  var a = 1;
  var inner = function() {
    return ++a;
  };
  // inner함수 자체를 반환시키기
  return inner;
  // inner함수 실행된 시점에는 outer 함수가 이미 실행이 종료된 상태
};
var outer2 = outer();

console.log(outer2()); // 2
console.log(outer2()); // 3
```
outer 실행 컨텍스트가 종료되었을 때도 inner함수는 outer함수의 LE에 접근 가능  
가비지 컬렉터의 동작 방식 : 어떤 값을 참조하는 변수가 **하나라도 있다면** 그 값은 수집 대상에 포함시키지 않음  
=== 어떤 함수의 LE가 이를 참조할 예정인 다른 실행 컨텍스트가 있는 한 실행 종료 이후에도 GC되지 않는다

이를 바탕으로 도출한 정의 : 
클로저란 어떤 함수 A에서 선언한 변수 a를 참조하는 내부함수 B를 **외부로 전달할 경우** A의 실행 컨텍스트가 종료된 이후에도 변수 a가 사라지지 않는 현상  
or  
함수를 선언할 때 만들어지는 유효범위가 사라진 후에도 호출할 수 있는 함수  

## 클로저와 메모리 관리
클로저는 어떤 필요에 의해 의도적으로 함수의 지역변수가 메모리를 소모하도록 함으로써 발생  
그 필요성이 사라진 시점에는 **더는 메모리를 소모하지 않게 해주면** 되더라  
참조 카운트를 0으로 만드는 방법 = 참조형이 아닌 기본형 데이터를 할당하면 됨
```javascript
// ()() : 함수를 선언한 뒤 바로 실행
var outer = (function() {
  var a = 1;
  var inner = function() {
    return ++a;
  };
  return inner;
})();
console.log(outer()); // 2
console.log(outer()); // 3
// 참조형인 함수 대신에 null을 할당, 그 다음 컨텍스트에서는 outer을 갖다 쓰지 않으므로 gc의 대상이 됨
outer = null;
```  

## Reference
- [코어 자바스크립트 - 클로저](http://www.yes24.com/Product/Goods/78586788?scode=032&OzSrank=1)
