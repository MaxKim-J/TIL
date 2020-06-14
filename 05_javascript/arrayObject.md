# 자바스크립트 배열 메소드

2020.03.07

## 배열 메소드

```javascript
const arr1 = [2, 3, 4];
const arr2 = [2, 5, 4];
```

1. arr1.concat(arr1, arr2) : 병합된 배열의 사본을 반환
2. arr1.forEach() : 단순히 배열 요소 반복, 각 요소 사용하여 무언가 수행, 새로운 배열을 반환하지 않으므로 콜백에서 아무것도 반환하지 않아도 됨
3. arr1.map() : 리턴문을 기반으로 새 배열을 반환

```javascript
var students = [
  { name: "ryu", age: 25 },
  { name: "han", age: 23 },
  { name: "suzy", age: 29 },
  { name: "park", age: 26 }
];

students.forEach(function(student) {
  console.log(student);
});

const nameList = students.map(function(student) {
  return student.name;
});

console.log(nameList);
// ["ryu", "han", "suzy", "park"]
```

4. arr1.filter(): 인자의 함수값을 true로 만드는 원소로만 구성된 새 배열을 반환
   맵으로는 객체 내부를 꺼내고 필터로는 조건을 제시해 객체를 그대로 넣는다는점이 다름

```javascript
var users = [
  { name: "ryu", age: 18 },
  { name: "han", age: 19 },
  { name: "suzy", age: 17 },
  { name: "park", age: 20 }
];

const adults = users.filter(function(user) {
  return user.age >= 19;
});
```

5. arr1.sort() : 베열 요소 정렬, 원소를 문자열로 취급해 정렬한다
6. arr1.indexOf() : 인자로 전달된 문자열과 매치되는 첫번째 원소의 인덱스를 반환, 존재하지 않는다면 1을 반환(요소 -> 인덱스)
7. arr1.every() : 함수의 결과값이 false가 될 때까지 배열의 모든 원소 반복, 배열의 모든 요소들이 특정 조건을 통과하는지 알고 싶을 때

```javascript
var numbers = [1, 2, 3, 4, 5, 6];

var isEven = function(num) {
  return num % 2 == 0 ? true : false;
};
var even1 = numbers.every(isEven);

console.log(even1); // false

var evenNumbers = [2, 4, 6];

var even2 = evenNumbers.every(isEven);

console.log(even2); // true
```

8. arr1.findIndex() : 인덱스오브인데 콜백이 있는 버전, 제공된 테스트 함수를 만족하는 배열의 첫 번째 요소에 대한 인덱스를 반환, 그렇지 않으면 -1을 반환

```javascript
var users = [
  { name: "ryu", age: 24 },
  { name: "gyeong", age: 29 },
  { name: "suzy", age: 30 },
  { name: "han", age: 19 }
];

var index = users.findIndex(function(user) {
  return user.name == "suzy";
});

console.log(index); // 2
```
