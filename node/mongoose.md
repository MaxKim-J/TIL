# mongoose

몽고디비를 더 편하게 사용할 수 있게 하는 모듈  
2020.03.24

## 몽구스 이용한 몽고디비 연결

```js
let database;
let userSchema;
let userModel;

function connectDB() {
  const databaseUrl = "mongodb://localhost:27017/local";
  console.log("데이터베이스 연결을 시도합니다");
  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  database.on(
    "error",
    console.error.bind(console, "mongoose connection error.")
  );
  database.on("open", function() {
    console.log("데이터베이스에 연결되어씀 : " + databaseUrl);
    userSchema = mongoose.Schema({
      id: String,
      name: String,
      password: String
    });
    console.log("스키마 정의함.");

    userModel = mongoose.model("users", userSchema);
    console.log("모델 정의");
  });
}
database.on("disconnected", function() {
  console.log("연결 끊어짐 5초뒤 다시 연결");
  setInterval(connectDB, 5000);
});
```

## 몽구스는 왜 필요?

- 몽구스는 시퀄라이즈와 달리 odm이라고 불리며, 릴레이션이 아니라 다큐먼트를 사용함
- 스키마 : 몽고디비는 테이블이 없어서 자유롭게 데이터를 넣을 수 있지만, 때로는 실수로 잘못된 자료형의 데이터를 넣을 수도 있고, 다른 다큐먼트에는 없는 필드의 데이터를 넣을 수도 있음 => 몽구스는 몽고디비에 데이터를 넣기 전에 노드 서버 단에서 데이터를 한번 필터링 해줌
  > **스키마 정의** : 데이터베이스의 구조를 정의한 것. 엑셀처럼
- 관계가 있는 데이터를 쉽게 가져올 수 있음(populate)
- 몽구스 모듈로 데이터베이스에 연결할 때는 connect 메소드를 호출하면서 동시에 데이터베이스 연결 정보를 파라미터로 넘겨줌.

## 몽구스 이벤트

- open : 데이터베이스가 연결되었을 때 발생
- error : 데이터베이스 연결이 제대로 되지 않을 때
- disconnected : 연결이 끊어졌을 때

## 스키마 타입

- type : String, Number, Boolean, Array, Buffer, Date, ObjectId, Mixed
- index : unique 속성값이 true로 되어있음, 이 속성을 사용하면 인덱스가 알아서 만들어짐. 조회가 필요한 속성에는 인덱스를 만들어놓는게 좋음
- 그외 속성 : required, unique

## 몽구스 데이터 조회 메소드

몽고디비보다 좀 더 직관적인듯?

- find([criteria], [callback]) : 조회 조건을 사용해 컬렉션의 데이터를 조회, 조회 결과는 콜백 함수로 전달.
- save([criteria], [callback]) : 모델 인스턴스 객체의 데이터를 저장
- update([criteria], [callback]) : 컬렉션의 데이터를 조회한 후 업데이트, where과 같이 사용
- remove([criteria], [callback]) : 컬렉션의 데이터를 삭제

```js
UserModel.where({id:'test'}).update({name: '애프터스쿨'}, function(err...){...})
```

## 스키마 메소드

- static : 모델 객체에서 사용할 수 있는 함수 등록. 함수이름과 함수 객체를 파라미터로 전달
- method : 모델 인스턴스 객체에서 사용할 수 있는 함수를 등록

```js
UserSchema.static("findById", function(id, callback) {
  return this.find({ id: id }, callback);
});
```
