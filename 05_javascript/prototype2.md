# 프로토타입 체인

2020.02.17

## 메소드 오버라이드

만약 인스턴스 안에 prototype 객체의 메소드와 동일한 이름을 가진 메소드가 있다면?

```javascript
var Person = function(name) {
  this.name = name;
};

Person.prototype.getName = function() {
  return this.name;
};

var iu = new Person("지금");
iu.getname = function() {
  return "바로" + this.name;
};
console.log(iu.getName()); // 바로 지금
```

**proto**의 메소드가 아닌 iu 객체에 있는 메소드가 호출됨.  
지금 이 상황이 **메서드 오버라이드** => 메서드 위에 메서드를 덮어 씌웠다  
원본을 제거하고 다른 대상으로 교체하는 것이 아니라 원본이 있는 상태에서 다른 대상을 그 위에 얹는다!!

자스엔진이 getName찾는 방식 => 가장 가까운 대상인 자신의 프로퍼티를 검색하고, 없으면 그 다음으로 가까운 대상인 **proto**를 검색하는 순서  
메서드 오버라이딩이 이루어져 있는 상황에서 prototype에 있는 메서드에 접근하려면?

```javascript
// this의 바인딩을 iu 인스턴스로 해줘야 undefined 출력 막을 수 있음
// getName메소드로서 리턴되는 name프로퍼티에 바인딩된 this는 iu.__proto__객체일 때
// name 프로퍼티가 없으므로 undefined를 출력하고
// iu 객체일 때는 name프로퍼티가 있으니 name프로퍼티를 출력함
console.log(iu.__proto__.getName.call(iu));
```

## 프로토타입 체인

생성자 함수라고 해서 **proto**가 없지는 않다 => 배열 생성자 함수는 **proto**로 객체 생성자 함수를 가지고 있음 =>  
기본적으로 모든 객체의 **proto**에는 Object.prototype이 연결됨  
이말인 즉슨 => 배열에서 생략 가능한 **proto**를 한번 더 따라가면, Object.prototype을 참조할 수 있음

```javascript
var arr = [1, 2];

//배열 메소드
arr.__proto__.push(3);

// 객체 메소드
arr.__proto__.__proto__.hasOwnProperty(2);

// 물론 __proto__들은 생략이 가능함
```

프로토타입 체인 : 어떤 데이터의 **proto**프로퍼티 내부에 다시 **proto**프로퍼티가 연쇄적으로 이어진 것  
프로토타입 체이닝 : 이 체인을 따라가면서 검색하는 것  
메서드 오버라이딩과 동일한 맥락인데,

1. 어떤 메서드를 호출하면 자스 엔진은 데이터 자신의 프로퍼티들을 검색해서 원하는 메소드가 있으면 그 메소드를 실행하고
2. 없으면 **proto**를 검색하여 있으면 그 메서드를 실행하고,
3. 없으면 다시 **proto**의 **proto**를 검색하여 실행... keep going...

#### 자스의 모든 자료형은 객체다

Number도 String도 Boolean도 **proto**가 Object.prototype란 점을 기억하자 =>  
생성자 함수도 함수는 함수이므로 constructor에는 인스턴스가 사용할 수 있는 메서드같은 타입의 정보가 들어가고

그러면 위쪽 삼각형의 우측 꼭짓점에서는 무조건 Object.prototype인가? => yes!

전체 프로토타입 구조는 꽤 신기한데, 생성자 함수는 함수라서 **proto**에 Function과 Object를 가지고 있어서 반복하는 루트를 따지며 끝없이 확장시킬 수도 있음(그림참조)

## 객체 전용 메서드 예외

어떤 생성자 함수이든 prototype은 반드시 객체이기 때문에  
Object.prototype이 언제나 프로토타입의 최상단에 존재하게 됨  
따라서 객체에서만 사용할 메서드는 다른 여느 데이터 타입처럼 프로토타입 객체 안에 정의할 수 없음 => '객체에서만' 사용할 메서드를 Object.prototype 내부에 정의한다면 다른 데이터 타입도 해당 메서드를 사용할 수 있게 되기 때문에...

그래서 객체에서만 사용할 메소드들은 **스태틱 메서드**로 Object에 부여해야함(Object.prototype이 아니라!! => 여기 있으면 하위 **proto**에서 공유되니깐..)

Object.prototype이 여타 참조형 데이터뿐 아니라 기본형 데이터조차 **proto**에 반복 접근함으로써 도달할 수 있는 최상위 존재

반대로 같은 이유에서 Object.prototype에는 어떤 데이터에서도 활용할 수 있는 범용적 메소드들만 있음

## 다중 프로토타입 체인

대각선의 **proto**를 연결해나가기만 하면 무한대로 체인 관계를 이어나갈 수 있다 => 다른 언어의 클래스와 비슷하게 동작하는 구조를 만들 수 있음  
뭐 새로운 이야기는 아니지만 **proto**가 생성자 함수의 prototype이 연결하고자 하는 상위 생성자 함수의 인스턴스를 바라보게끔 해주면 된다

```javascript
var Grade = function() {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    this[i] = args[i];
  }
  this.length = args.length;
};
var g = new Grade(100, 80);

// 프로토타입을 인스턴스로 지정해주기
// grade에서 배열의 메소드를 사용할 수 있다
Grade.prototype = [];
```

g인스턴스 입장에서는 프로토타입 체인에 따라 g 객체 자신이 지니는 멤버, Grade의 prototype에 있는 멤버, Array.prototype에 있는 멤버, 끝으로 Object.prototype에 있는 멤버에까지 접근 가능하게 됨

## 이런거임

![프로토타입](../img/proto.png)
