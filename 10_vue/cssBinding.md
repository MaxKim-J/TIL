# Vue에 CSS 바인딩

## 원칙

- ""안에는 표현식
- 배열 안에 여러개 스타일 객체 혹은 클래스
- 자바스크립트 객체로 스타일 표현한거 :style로 끼워도 됨
- 참거짓값 객체
- 변수는 ''없이
- 클래스는 ''
- 클래스 바인딩 속성으로 ""안에 배열 혹은 객체 포함 가능

## 자주 쓸거 같은 구문

### 변수 하나 참거짓 바인딩(객체)

```html
<component :class="{'classA' : true}">
<component2 :class="{'classB' : false}">
```

### 배열안에 객체

```html
<component :class="[{'classA' : true}, {'classB' : false}] ">
```

### 참거짓 바인딩할때 표현식도 와도 됨

```html
<component :class="{ multiple: inputField.name === 'encrypted_phone' }">
```

### 삼항연산자(배열 사용)

```html
<component :class="[isCouponApplied ? 'alert-valid' : 'alert-invalid']">
```

### 삼항연산자 + 배열의 요소

```html
<component :class="[isCouponApplied ? 'valid' : 'invalid', alert]">
```

### 배열 구문 내에 객체 구문

```html
<component :class="[{'classA' : Aapplied}, 'superClass']">
```

- 객체의 키값은 원래 걍 문자열이므로 클래스에 바인딩하는 객체 키값은 싱글 쿠오테이션 없어도 된다.

```html
<component :class="[{classA : Aapplied}, 'superClass']">
```

### 인라인 스타일 바인딩

- 하지말자 인라인 태그도 안거는 세상에...