# useEffect
묘한 유즈이펙트 훅

## 동작방식

1. useState로 선언한 state는 특정 컴포넌트 렌더링에 포함되는 상수다.
2. 이팩트 함수 자체가 매 렌더링마다 별도로 존재한다 
3. 리액트는 이펙트 함수를 기억해놨다가 DOM의 변화를 처리하고 브라우저가 스크린에 그리고 난 뒤에 실행하개 된다.
    - 자체거 cdm과 비숫한 느낌이긴 함, 이 시점에서 렌더링을 다시 할 수도 있음(state 업데이트 등이 이뤄졌을 경우)
4. useEffect는 돔 업데이트 이후에 실행됨 => 모든 렌더링은 고유의 이펙트를 가짐 => useEffect는 매 렌더링마다 다른 함수가 된다
5. 개념적으로 컴포넌트 결과물의 일부로서 특정 랜더링 시점의 prop과 state를 본다
>- 리액트: state가 0 일 때의 UI를 보여줘.
>- 컴포넌트
    - 여기 랜더링 결과물로 You clicked 0 times가 있어.
    - 그리고 모든 처리가 끝나고 이 이펙트를 실행하는 것을 잊지 마: () => { document.title = 'You clicked 0 times' }.
> - 리액트: 좋아. UI를 업데이트 하겠어. 이봐 브라우저, 나 DOM에 뭘 좀 추가하려고 해.
> - 브라우저: 좋아, 화면에 그려줄게.
> - 리액트: 좋아 이제 컴포넌트 네가 준 이펙트를 실행할거야.
> - () => { document.title = 'You clicked 0 times' } 를 실행하는 중.

6. 재밌는 실험
```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(`You clicked ${count} times`);
    }, 3000);
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
- 셋타임아웃이 끝나면 각각의 타이머는 특정 렌더링에 속한 상수값을 반영하기 때문에 그 시점의 count값을 가진다
- 클래스형 컴포넌트는 state가 가장 최신의 값을 유지하기 때문에 계속 최신의 상태로 콘솔로그가 찍힌다

7. 컴포넌트의 렌더링 안에 있는 모든 함수는 렌더가 호출될 때 정의된 props와 state 값을 잡아둔다.
8. 클린업 : 브라우저가 그려지고 나서 이팩트를 실행 => 이팩트의 클린업도 미뤄짐 => 이전 이펙트는 새 prop과 함께 리렌더링 되고 난 뒤에 클린업됨
    - 이펙트의 클린업은 최신의 prop을 읽지 않고, 클린업이 정의된 시점의 렌더링에 있는 값을 읽는다
    - 새 렌더링이 발생되었을 때 이전 렌더링의 effect가 치워진다
9. useEffect를 생명주기 메소드들이랑 대응해서 생각하지 말 것 
    - useEffect는 리액트 트리 바깥에 있는 것들을 props와 state에 따라서 동기화할 수 있게 함
    - 전통적인 마운트 업데이트 언마운트 모델이랑은 차이가 있다

## 의존성배열
1. 가상돔으로 두개의 리액트 요소 트리를 비교하여 바뀐 부분만을 추가로 렌더링한다
2. 이펙트를 적용할 필요가 없을 때는 다시 실행하지 않는 것이 좋을텐데
    - 의존성 배열을 인자로 전달할 수 있다
    - 리액트 트리 요소를 비교할때, 의존성 배열에 든 prop의 변화가 없다면 effect를 실행하지 않는다(오 아귀가 딱딱 맞아 떨어짐)
3. 빈 배열 넘기는거 신중하게
    - 의존성 배열로 빈 배열을 넘기면 최초 마운트시에만 이팩트가 실행됨
    - 이펙트의 의존성을 솔직하게 모두 넘기는게 좋음
    - 요런경우 오류가 상당히 직관적이게 됨
    ```js
    function Counter() {
        const [count, setCount] = useState(0);
        // 최초 한번만 인터벌을 만들고 그담에 제거하자
        // count가 업데이트 되었음에도 빈배열이라서 이펙트를 스킵하게 된다
        // count를 사용하지 않는다고 거짓말을 할 경우 그 때의 state 값을 기억하고 있기 때문에
        // 계속 1만 렌더링 되는거

        // 물론 성능적으로는 안좋을수도 있을듯? 매번 새로운 인터벌을 만들고 지움
        useEffect(() => {
            const id = setInterval(() => {
            setCount(count + 1);
            }, 1000);
            return () => clearInterval(id);
        }, []);
        // count가 필요하다
        return <h1>{count}</h1>;
    }
    ```
    - 이펙트에 사용되는 모든 값이 의존성 배열 안에 포함되도록 고친다
    - 아니면 아예 effect를 state에 의존하지 않게 한다(state 값 자체를 쓰지 않을 수 있다)
    - 매번 새로운 인터벌 만들고 지우는거 방지
    ```js
    // 이렇게하면 의도대로 사용할 수 있음
    useEffect(() => {
        // 사실 count 값이 필요하지는 않다. 그냥 이팩트는 1만 증가시키면 된다
        const id = setInterval(() => {
            // 콜백을 넣을 수 있나보네
            setCount(c => c + 1);
        }, 1000);
        return () => clearInterval(id);
    }, []);
    ```
    - 의존성 배열에는 함수가 들어갈 수 없다

## 함수형 업데이트
1. 최소한의 동작을 표현할 수 있는 액션을 찾아 적용시키는게 현명하다(위의 사례처럼)
2. 서로에게 의존하는 상태값이 있거나 prop기반으로 다음 상태를 계산할 필요가 있을 때는 useReducer 사용하는게 낫다
3. useReducer는 action 함수가 항상 똑같이 작동한다는 것을 보장하게 됨
4. 업데이트 로직과 그로 인해 무엇이 일어나는지 일일히 서술하는 것을 분리할 수 있게 됨 + 불필요한 의존성을 제고
5. 어떠한 함수를 이펙트 안에서만 쓴다면 이펙트 안으로 옮기고 의존성 배열을 적절히 표현해주는게 좋다   
6. 그래도 함수로직을 공유해야 한다면
    - 아예 함수를 컴포넌트 밖으로 분리한다(utils처럼 쓰기) + 그럼 굳이 의존성 따질필요 없음
    - useCallBack을 사용한다 => 이러면 의존성 배열에 넣는게 수월해진다 => 함수 자체가 필요할 때마다 바뀔수 있게 한다
    ```js
    function SearchResults() {
        const [query, setQuery] = useState('react');

        // state에 바인딩, state 바뀔때마다 다른 함수가 됨 => 의존성으로 사용 가능
        const getFetchUrl = useCallback(() => { // No query argument
            return 'https://hn.algolia.com/api/v1/search?query=' + query;
        }, [query]); 
        // ...

        // 이렇게 쓰는게 가능해짐
        useEffect(() => {
            const url = getFetchUrl();
        }, [getFetchUrl]); // ✅ 이펙트의 deps는 OK
    }
    ```
## 라이프사이클 패러다임 vs 이펙트 패러다임
1. 저 패턴은 클래스 컴포넌트에서는 동작할 수 없는데, 클래스 메소드가 state이 달라진다고 해서 바뀌진 않기 때문이다
2. useCallback을 쓰면 함수가 달라진다고 얘기할 수 있나보다
3. 정말 해결하려면 쿼리를 프롭으로 넘겨야 한다 => 프롭은 워칭이 되니까 프롭이 바뀔때마다 새로운 데이터를 패칭해서 가져온다
4. 클래스 컴포넌트에서 함수 prop자체는 실제로 데이터 흐름에서 차지하는 부분이 없다 => 굳이 바뀔 필요도 없다
5. 메소드는 가변성있는 this변수에 묶여있기 때문에 함수의 일관성을 담보할 수 없게 된다. 그러므로 함수만 필요할 때도 차이를 비교하기 위해 온갖 다른 데이터를 전달해야 했음
6. useCallback은 함수를 데이터 흐름에 포함시키는 역할을 한다. 만약 함수의 입력값이 바뀌면 함수 자체가 바뀌고, 그렇지 않다면 같은 함수로 남아있는게 보장된다

## 경쟁상태
1. 클래스 컴포넌트에서 update랑 didmount에서 동시에 패칭을 지시하면 순서를 보장할 수 없게 된다
2. 클리어에서 플래그 변수를 바꾸는 방법으로 일관성을 담보하는 방법을 사용할 수 있다
```js
function Article({ id }) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    let didCancel = false;
    async function fetchData() {
      const article = await API.fetchArticle(id);
      if (!didCancel) {
        setArticle(article);
      }
    }

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [id]);

  // ...
}
```

## 정리
1. useEffect의 개념으로 생각하면 모든 것들은 기본적으로 동기화됨 
2. 사이드이펙트는 리액트 데이터 흐름의 일부
3. 빈 의존성 배열 : 리액트 데이터 흐름에 관여하는 어떠한 값도 사용하지 않겠다는 뜻으로 받아들여야함
4. prop이나 state를 반드시 요구하지 않는 함수는 컴포넌트 바깥에 선언해서 호이스팅하고, 이펙트 안에서만 사용되는 함수는 이펙트 함수 내부에 선언하는 겁니다.
5. 그러고 나서 만약에 랜더 범위 안에 있는 함수를 이펙트가 사용하고 있다면 (prop으로 내려오는 함수 포함해서), 구현부를 useCallback 으로 감싸세요.

## reference
- [useEffect 완벽 가이드](https://rinae.dev/posts/a-complete-guide-to-useeffect-ko)