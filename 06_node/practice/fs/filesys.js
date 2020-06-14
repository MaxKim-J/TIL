const fs = require('fs');

fs.readFile('readme.txt', (err, data) => {
  if (err) {
    throw err;
  }
  console.log(data);
  // 그냥 data는 버퍼라는 형식, 지금은 단순히 버퍼를 메모리의 데이터라고
  console.log(data.toString());
  // 사람이 읽을 수 있는 형식으로 변환
})
