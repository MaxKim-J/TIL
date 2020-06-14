
dec();
exp();

// 식별자와 함수 전체가 같이 호이스팅되므로 선언 이전에 함수 참조 가능
function dec() {
  console.log("함수 선언문")
}

// 식별자가 먼저 호이스팅되고 나서 함수가 할당되므로 선언 이전에 함수 참조 불가능
const exp = function () {
  console.log("함수 표현식")
}
