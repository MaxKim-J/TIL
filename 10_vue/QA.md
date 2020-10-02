# Vue Q&A

헷갈렸던거 한번에 정리

## 1. 뷰 인스턴스

```js
var data = { a: 1 }

// Vue인스턴스에 데이터 객체를 추가합니다.
var vm = new Vue({
  data: data
})
```

- 리액트랑 비교해보면 리액트 엘리먼트와 같다고 생각해도 될듯. 생긴게 좀 다른.. 가상돔 이용하는 거 보면 이제 비슷함
- 모든 Vue앱은 Vue 생성자 함수로 새 Vue 인스턴스를 만드는 것 부터 시작, vue 인스턴스 참조하기 위해 종종 변수 vm을 사용
- data 변경시 화면 다시 렌더링, data에 있는 속성들은 인스턴스가 생성될 때 존재한 것들만 반응형
- $는 다른 사용자 속성과 구분되는 vm이 속성을 참조하기 위해 붙인 거

```js
vm.$data === data // => true

//vue에 마운트할 기존 dom 엘리먼트임, HTML Element
vm.$el === document.getElementById('example') // => true
```

$el 활용은 요렇게
```html
<div id="app">{{ msg }}</div>

<script>
// 내부적으로 연결된 템플릿의 범위, 여기서부터 뷰가 적용된다! 이런 느낌임
var vm = new Vue({
  el: '#app',
  data: {
    msg: 'Hello world'
  }
});
</script>
```

## 2. 단일파일 컴포넌트

- 뷰 인스턴스를 HTML에 대입해 돌리는 방식은 특정 뷰를 향상시키는 방식으로 사용될 수 있고 중소규모 프로젝트에서 유용, 하지만 커지면?
    - 빌드 단계 : 전처리기 적극적인 사용
    - css : 지원 없음
- `.vue` 싱글파일 컴포넌트로 이를 해결(webpack, browserfy 등과 함께)
- css지원 : 빌드 시점에 고유한 셀렉터 이름으로 대체하는 방식으로 사용해 상위 컴포넌트의 영향을 안 받도록

## 3. computed

### computed vs 메소드

템플릿 표현식에서 메소드를 호출하여 conputed와 같은 결과를 얻을 수 있다. 최종 결과는 동일하지만 **computed 속성은 종속 대상을 따라 캐싱된다는 점**이 다르다. 종속 대상이 변경될 때만 함수를 실행함. 아무 곳에도 의존하지 않은 computed 속성은 바뀌지 않는다. Props이나 state를 쳐다봐야함.

### computed vs watch

watch는 특정 값의 변경을 추적하여 특정 로직을 수행함. computed는 특정 값의 변경을 추적하여 결과물을 바꿈. 이 역시 modify의 측면에서 결과 데이터는 같은데, watch 속성은 감시할 데이터를 지정하고 그 데이터가 바뀌면 이런 함수(how)를 실행하는 방식인 **명령형 프로그래밍 방식**, computed는 계산해야하는 목표 데이터를 정의하는 방식(what)으로 **선언형 프로그래밍 방식**임. 선언형이 좀 더 깔끔
```js
// 워치
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }

// 컴퓨티드
computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
```


## 4. created vs mounted

### 비교

- created : 인스턴스가 작성된 후 동기적으로 호출, 이 단계에서 인스턴스는 데이터, 컴퓨티드, 메서드, 감시/이벤트 콜백 옵션처리 완료. 마운트가 시작되지 않았으므로 $el에 접속할 수 없음
- moutned : el이 새로 생성된 vm.$el로 대체된 인스턴스가 마운트된 직후 호출. DOM이 인스턴스에 마운트됨

### 통신순서

제일 중요한 차이, 모든 하위 컴포가 마운트된 상태를 보장하지는 않음. 부모의 mounted 훅이 자식의 mounted 훅보다 먼저 실행되지 않는다. 오히려 그 반대. 자식의 mounted를 기다리게 됨. (created는 상하위에서 순차적으로 실행)  
created로는 데이터 초기화 하고, mounted에서는 dom조작에 관련된 로직을 처리하면 될 거 같음

## 5. v-show vs v-if

- v-if : 참 조건부 렌더링, 조건부 블럭 안에 리스너와 자식 컴포넌트가 토글하는 동안 적절하게 제거되고 다시 만들어지기 때문에 진짜 조건부 렌더링.**초기 렌더링 조건이 거짓인 경우 암것도 안함**
- v-show : display css 속성을 토글함, 조건이 거짓이면 렌더링은 하는데 감춰줌
- v-if는 토글 비용이 높고, v-show는 초기 렌더링 비용이 더 높음, 자주 바뀐다면 v-show를/바뀌지 않으면 v-if를 쓰면 댈듯

## 6. data는 왜 함수의 return값으로 제공?

컴포넌트에서 data는 반드시 함수여야 한다. 동일한 컴포넌트가 여러 번 사용되더라도 동일한 객체를 가리키는 것이 아니라 함수가 호출될 때마다
만들어진 객체가 리턴되게 되어 **서로 다른 객체**를 참조할 수 있기 때문이라고 함 => 객체 각각의 불변성을 유지하기 위함인것 같음, 각각의 컴포넌트마다 새로운 객체를 반환하게 하여 해당되는 Data만 컨트롤 할수 있도록   
컴포넌트마다 다 달라야될 필요성이 있는 값이라 그럼. 메소드나 computed는 똑같아도 되잖아.

## 7. 동적, 비동기 컴포넌트

### keep-alive
성능상 이유로 상태를 유지하거나 재렌더링을 피하고 싶을때가 있을 때 사용. 처음 생성되고나서 다음 업데이트시에 재렌더링하지 않고 **캐싱되어 그대로 유지** => keep-alive

## 비동기 컴포넌트
청크 분리와 레이지로딩이 필요할때 동적 임포트 쓰면 된다. 그럼 웹팩에서 청크 분리해주니까 좋음
```js
new Vue({
  // ...
  components: {
    "my-component": () => import("./my-async-component")
  }
});
```
