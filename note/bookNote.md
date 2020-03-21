# 책읽은거 러프하게 정리

**???** : 질문  
**!!!** : 블로그 글감

2020.03.20

## 자스 코딩의 기술

1. **???** const로 생성한 객체배열들은 메소드를 사용해서 변형을 할 수 있는데 왜? 상수라고 하쟈나
2. let과 const는 var과는 다르게 같은 이름의 변수를 다시 선언하는게 불가함
3. var은 함수내에서 마지막 할당한 값을 참조
4. **???** for문이나 if문의 호이스팅은 어떻게 처리될까?
5. 배열의 순서는 기술적으로 보장되지 않는다
6. includes() : 이터레이트 자료형에서 존재 여부 판단
7. 펼침연산자 : 배열에 포함된 항목을 목록으로 바꾼다, 그래서 다른데다가 할당도 가능함
8. 펼침연산자는 제너레이터를 이용하는 데이터 구조나 클래스 속성에도 이용이 가능하다.
9. 강려크한 펼침연산자

```javascript
// 배열 합치기
function removeItem(items, removalbe) {
  const index = items.indexOf(removable);
  return [...items.slice(0, index), ...items.slice(index + 1)];
}

// 함수 인자로 배열 풀어헤쳐 전달하기
const book = ["bookone", "booktwo", "bookthree"]
fucntion formatBook(title, author, price) {
    return `${title} by ${author} $${price}`
}
formatBook(...book);

// 앞에추가, 복사

const titles = ['Moby Dick', 'White Teeth'];
titles.shift('The Conscious Mind');
const moreTitles = ['Moby Dick', 'White Teeth']

// 앞에추가
const evenMoreTitles = ['The consios", ...moreTitles]
const copy = [...titles]

```

10. **!!! 원본 배열 조작 피하기** : 순수함수인 것은, 불변객체인 것은 왜 중요한가? : 결과를 예상 가능하게 만들어줌
11. 함수에 전달한 값을 변경하지 않을 것이라는 신뢰, 부수효과(side effect)가 없는 함수 : 순수함수(리덕스가 지향하는 바도 이와 비슷했던듯)
12. 문법을 선택하는데 있어 의도 전달이 제일 중요하다
13. 의도에 맞게 자료형을 고르자

- 데이터 간의 정보의 차등을 두어야 하지만 변화가 거의 없을 때 : 객체
- 계속해서 값이 바뀔 때 : map

14. object.assign

- 중첩 객체가 있는 객체를 복사하는 것을 깊은 복사, 깊은 병합이라고 하는데
- 위 예제 코드에서 years속성은 문제없이 복사할 수 있지만, name속성은 복사할 수 없음. **실제로 키 name에 할당된 독립적인 객체에 대한 참조만 복사됨, 중첩된 객체는 해당 객체를 담고 있는 객체와 독립적으로 존재**
- 첫번째 인자로 빈 객체를 넘기면 원본 객체가 아니라 빈 객체에 결과값이 들어감(원본 객체를 안 건들수 있음)

```javascript
// 깊은 복사를 할때는 키값에 해당하는 객체도 assign해준다
const employee2 = Object.assign({}, defaultEmployee, {
  name: Object.assign({}, defaultEmployee.name)
});
```

15. 물론 갓-펼침

- 기존 배열 조작 없이, 간결한 코드로 구현할 수 있어 ㄹㅇ짱짱맨이라고 할 수 있다.
- 동일한 키에 서로 다른 값을 추가하면 어떤 값이든 가장 마지막에 선언된 값을 사용함.

```javascript
const book = {
  title: "reasons",
  author: "종혁"
};

const updateObject = {
  author: "종혁2",
  year: 2017
};

// 저 코드들이 다 같은 일을 한다
const updateByAssign = Object.assign({}, book, updateObject);
const updateBySpread = { ...book, author: "종혁2", year: 2020 };
const updateBySpread2 = { ...book, ...updateObject };

// 중첩 객체일 경우
const employee = {
  ...defaultEmployee,
  name: {
    ...defaultEmployee.names
  }
};
```

16. 짱짱 맵객체
- 키 값 쌍이 자주 추가되거나 삭제되는 경우에 추천됨
- 키가 문자열이 아닌 경우 추천됨 : 이건 객체의 키가 무조건 문자열만 되기 때문임
```javascript

```
