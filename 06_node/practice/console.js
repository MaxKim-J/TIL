// console 객체 정리

const string = 'abc';
const number = 1;
const boolean = true;
const obj = {
  outside: {
    inside: {
      key: 'value'
    }
  }
}

console.time('전체 시간');
// 로그 남기기, 에러는 따로 error에
console.log('걍 로그');
console.error('에러 메시지');

// 객체를 콘솔에 표시할때, colors 옵션 트루로 주면 색깔로 표시
// depth는 어느 단계까지 표시할지에 대한 옵션
console.dir(obj, { colors: false, depth: 2 });
console.dir(obj, { colors: true, depth: 1 });

// time과 time end 사이의 측정, 같은 레이블을 가진 것끼리 상응
console.time('시간 측정');
for (let i = 0; i < 10000; i++) {
  continue;
}
console.timeEnd('시간 측정');

function b() {
  // 에러 어디서 나오는지 위치 추적, 콘솔에서 error가 어디서 나왔는지 안 알려주는 경우 사용
  console.trace('에러 위치 추적');
}

function a() {
  b();
}

a();

console.timeEnd('전체 시간');