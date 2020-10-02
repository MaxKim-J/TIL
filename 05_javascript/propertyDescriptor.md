# Property Descriptor(속성 설명자)

visible configurations of object`s property  
자바와 비슷해지려는 자스의 노력... ES6 스펙

## 정의

- 객체의 속성들은 그 자체로 객체 내부의 정보와 기능을 표현하지만 각 속성들은 다시 그 자신들의 값과 섲일에 대한 눈에 보이지 않는 내부 속성들을 가지고 있다.
- 위에서 말한 속성의 성질이란 이 속성이 읽기전용인지, 나열될 수 있는지 등의 정보를 의미한다.
- 자바스크립트에서는 이러한 속성의 세부적인 성질을 직접 설정하거나 조회할 수 있는 방법을 제공하는데 이때 이용되는 특수한 객체가 바로 속성 설명자다.

```js
// 이렇게 생김
{
    value: ...,
    writable: true,
    enumerable: true,
    configurable: true
}
```

## 구성요소

- value : 해당 속성의 값. 지정하고 어떤 속성을 정의할 경우, 해당 속성의 값으로는 value에 지정된 값이 할당됨
- get/set : getter setter의 속성은 객체 안에 get과 set이라는 특수한 설명자 요소를 이용해 정의. get/set 키값은 writable, value 키값과 함께 선언될 수 없음

```js
const human1 = {
  firstName:"영재",
  lastName: "주",
}
// 한 프로퍼티(맴버변수 또는 메소드)에 대해 get과 set을 정의할 수 있음
// computed와 비슷하다
Object.defineProperty(human1, "name", {
  get:function () {
    return this.lastName + this.firstName;
    },
  set: function(name) {
    this.firstName = name.substr(1,2);
    this.lastName = name[0];
  }
})

// get
console.log(human1.name); // 출력 : "주영재"

// set
human1.name = "김개똥"
console.log(human1); // 출력 : Object {firstName: "개똥", lastName: "김"}
```

- writable : false일 경우 읽기 전용(read-only)가 됨. 할당 연산자를 통해 새로운 값을 할당하는 것이 불가능해짐(setter가 없는 private 변수처럼 쓰겠네여)
- enumarable : false일 경우 나열 불가능한 상태가 됨. (유사배열)객체를 순회 가능한 배열이나 이런걸로 바꿨을때 index에서 빠져버림

```js
const human1 = {
  name: "주영재",
  age: 30,
  height: "174cm",
  hobby: "자바스크립트 공부"
};

Object.defineProperties(human1, {
  height: {
    enumerable: false
  }
});

console.log(Object.keys(human1));
// 출력 : ["name", "age", "hobby"]

const result = [];

for (const one in human1) {
  result.push(one);
}

console.log(result);
// 출력 : ["name", "age", "hobby"]
```

- configurable : 해당 속성을 수정 불가능하게 만듬(얼려버림). writable만 수정 가능함.

## 관련 메소드

### Object.getOwnPropertyDescriptor(객체, 속성명)

매개변수로 조회하고자 하는 객체와 함께 속성의 이름을 문자열 형태로 받는다

```js
const human1 = {
  firstName: "영재",
  lastName: "주",
  age: 30
};

const result = Object.getOwnPropertyDescriptor(human1,"age");
console.log(result);
//출력 : {value: 30, writable: true, enumerable: true, configurable: true}
```

### Object.getOwnPropertyDescriptors(객체)

해당 객체의 모든 속성들의 설명자를 일괄 조회할 수도 있음.

### Object.defineProperty(객체, 속성명, 설명자 객체)

프로퍼티를 만드는 메소드. 속성의 이름은 문자열로 받는다

```js
const arr = [1, 2, 3];

// 속성명, 배열에선 즉 인덱스
Object.defineProperty(arr, "4", {
  value: 5,
  writable: false,
  configurable: true,
  enumerable: true
});

console.log(arr); // 출력 : [1, 2, 3, undefined, 5]
arr[4] = 2; // writable 키를 이용해 읽기전용으로 설정했으므로 오류 발생.
```

### 설명자 없이 프로퍼티 할당

- 비어있는 키값은 무조건 false가 기본  
- 그냥 리터럴루다가 할당했을때는 싹다 true임

### getter setter 활용

private 따라한 문법중에 제일 private임 내생각엔

```js
let user = {
  get name() {
    return this._name;
  },

  set name(value) {
    if (value.length < 4) {
      alert("입력하신 값이 너무 짧습니다. 네 글자 이상으로 구성된 이름을 입력하세요.");
      return;
    }
    // 굳이 먼저 막 define 안해도 되긴 한다
    this._name = value;
  }
};

user.name = "Pete";
alert(user.name); // Pete

user.name = ""; // 너무 짧은 이름을 할당하려 함
```

## reference

- [자바스크립트 접근자 프로퍼티](https://velog.io/@bigbrothershin/JavaScript-%EC%A0%91%EA%B7%BC%EC%9E%90-%ED%94%84%EB%A1%9C%ED%8D%BC%ED%8B%B0-getter-setter)
- [객체에 대하여.JS #2 속성 설명자](https://velog.io/@zuyonze/%EA%B0%9D%EC%B2%B4%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC.JS-2-%EC%86%8D%EC%84%B1-%EC%84%A4%EB%AA%85%EC%9E%90-muk0axrb8s)