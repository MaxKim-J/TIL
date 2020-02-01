var a = 1;
var outer = function () {
  var inner = function () {
    console.log(a); // undefined
    var a = 3;
  };
  inner();
  console.log(a); // 1 - 전역 컨텍스트 참조
};
outer();
console.log(a); // 1 - 전역 컨텍스트 참조