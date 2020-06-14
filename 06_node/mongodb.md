# 몽고디비
몽고디비의 기본  
2020.03.28

## NoSQL
대표적인 특징
- 자유로운 데이터 입력
- 컬렉션 간 join은 미지원
- 트랜잭션 미지원
- 확장성, 가용성
- 컬렉션, 다큐멘트, 필드

몽고디비에는 고정된 테이블이 없으며, 칼럼을 따로 정의하지 않는다.  
> SQL :  users 테이블을 만들면 users 안에 name, age, married등의 컬럼 정의하고 자료형, 옵션 정의  
NoSQL : users 컬렉션을 만들면 땡임

JOIN을 지원하지 않아서 하나의 쿼리로 여러 테이블을 합치는 작업이 항상 가능하지 않음    
트랜잭션을 지원하지 않음 : 데이터 일관성에 문제가 생길 수 있음  
>트랜잭션 : 여러 쿼리가 모두 정상적으로 수행되거나 아예 하나도 수행되지 않음을 보장  

안 좋아 보이는데 쓰는 이유 : 데이터의 일관성을 보장해주는 기능이 약한 대신 데이터를 빠르게 넣을 수 있고, 쉽게 여러 서버에 데이터를 분산할 수 있음  

| noSQL    | SQL    |
|----------|--------|
| 컬렉션   | 테이블 |
| 다큐먼트 | 로우   |
| 필드     | 컬럼   |

## 콘솔 명령어
### `use`
데이터베이스 만듬

### `dbs`
데이터베이스 목록 확인  
데이터를 최소 한 개 이상 넣어야 목록에 표시됨.

### `db`
현재 사용하고 있는 디비

### `db.createCollection('users')`
컬렉션을 생성하는 명령어  
따로 생성할 필요가 없긴 함. 다큐먼트를 넣는 순간 컬렉션도 자동으로 생성

## CRUD
### Create
컬렉션에 칼럼을 정의하지 않아도 되므로 컬렉션에는 아무 데이터나 넣을 수 있음  
몽고디비는 자바스크립트 문법을 사용하므로 자바스크립트의 자료형을 따름 + 추가적인 자료형  
```js
// 다큐먼트 생성
db.users.save({
    title:"첫번째 포스트",
    author:"max", 
    content:"이것은 첫번째 포스트",
    createdAt:new Date()
});

// 다큐먼트 조회
db.users.find({title:'첫번째 포스트'}, {_id:1})

// 댓글 다큐먼트 생성
db.comments.save({
    targetPost:ObjectId('위의 find에서 조회한 objectid'),
    comment:'첫번째 포스트이군요',
    createdAt:new Date()
})
```

### Read
다큐먼트들 조회는 find로  
시퀄라이즈 쿼리랑 비슷한데, 몽고디비는 자바스크립트 객체를 사용해 명령어 쿼리를 생성하므로  
특수한 연산자를 사용하는 것
- $gt(초과)
- $gte(이상)
- $lt(미만) 
- $lte(이하) 
- $ne(같지 않음) 
- $or(or) 
- $in(배열 요소 중 하나)

```js
// 컬렉션 내의 모든 다큐먼트를 조회
db.users.find({});
db.comments.find({});
// 다큐먼트에서 특정 필드만 가져오기
// id는 기본적으로 가져오게 되있음
db.users.find({}, {_id:0, title:1, author:1});

// 쿼리 만들기 - 조건

// 나이 30초과 기혼인 유저와 이름과 나이 필드 가져오기
db.users.find({age:{$gt:30}, married:true}, {_id:0, name:1, age:1});

// 나이 30초과이거나 미혼인 유저의 이름과 나이 필드 가져오기
// 특이하게 배열에 넣는다
db.users.find({$or:[{age:{$gt:30}}, {married : false}]}, {_id:0, name:1. age:1});

// 정렬도 가능함 + 조회할 다큐먼트 개수도
db.users.find({}, {_id:0, name:1, age:1}).sort({age:-1}).limit(1)

// 개수 설정하면서 몇개 건너뛸지 설정 => skip
db.users.find({}, {_id:0, name:1, age:1}).sort({age:-1}).limit(1).skip(1)
```
### Update
```js
// $set연산자는 일부 필드만 수정하고 싶을 때 사용
db.users.update({name:'nero'}, {$set:{comment:"이 필드를 바꿀거임"}});
```

### Delete
```js
db.users.remove({name:'nero'});
```


## mongoose로 작성하는 쿼리
1. 스키마 작성
2. 스키마 익스포트시 몽고디비의 컬렉션과 연결
3. 스키마를 가지고 쿼리작성
```js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 1. 스키마 작성
const userSchema = new Schema({
    ...스키마 내용
})

// 2. 스키마 몽고디비의 컬렉션과 연결
module.exports = mongoose.model('User', userSchema)

// 3. (다른 파일-라우터 함수 같은데서) 스키마 임포트해서 쿼리 수행
var Users = require("../schemas/user");

router.get('/', function(req,res,next){
    // db.users.find({})와 동일
    User.find({}).then((users) => {
        res.json(users);
    }).catch((err) => {
        console.error(err);
        next(err);
    })
})
```

## 트리비아
- 꼭 디비 종류를 하나만 사용해야 되는 건 아니고 주로 섞어쓴다
- 일관성있게 정리되어야 하는 정보는 sql, 확장성과 가용성이 중요한 정보는 nosql

## reference
- [조현영 - 노드js 교과서]()