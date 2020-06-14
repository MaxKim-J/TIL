# Redux - Ducks Pattern
2020.01.24

## 정의
리덕스 공식 문서에서는 액션, 액션 생성자, 리듀서 함수를 각각의 파일로 만들어 설명하더라  
넘모 귀찮다 액션 추가하려고 해도 세개 이상 파일 열어 수정해야함  
그래서 만든 리덕스 패턴

## 규칙
1. 연관된 액션 타입, 액션 생성자 함수, 리듀서 함수를 하나의 파일로 작성 - 한 state에다가 죄다 바인딩하는 느낌
2. 리듀서 함수는 export default 키워드로 내보낸다
3. 액션 생성자 함수는 export 키워드로 내보냄
4. 액션 타입은 접두사와 액션 이름을 조합해서 만든다

```javascript
//이렇게 하면 요런식이 된다
import createReducer from "../common/createReducer"

// 친구목록 관리

// 액션 정의
const ADD = "friend/ADD";
const REMOVE = "friend/REMOVE";
const EDIT = "freind/EDIT";

//액션 객체 생성자
export const addFriend = friend => ({ type: ADD }, friend);
export const removeFriend = friend => ({ type: REMOVE, friend });
export const editFriend = friend => ({ type: EDIT, friend });

// state초기값
const INITIAL_STATE = { friend: [] };

// 리듀서, 액션별 동작정의
const reducer = createReducer(INITIAL_STATE, {
  [ADD]: (state, action) => state.friends.push(action.friend),
  [REMOVE]: (state, action) =>
    (state.friends = state.friends.filter(
      friend => friend.id !== action.friend.id
    )),
  [EDIT]: (state, action) => {
    const index = state.friends.findIndex(
      friend => friend.id === action.friend.id
    );
    if (index >= 0) {
      state.friends[index] = action.friends;
    }
  }
});
export default reducer;
```