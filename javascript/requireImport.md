# require vs module import

2020.03.15
각 모듈간의 의존성을 처리하는 문법

## 자스 모듈

1. 자바스크립트 끼리는 서로 모듈을 공유하는데 제한이 없다.(파이썬과는 다르게) 그래서 꽈배기마냥 얽혀버린다.
2. 자바스크립트 파일이 독립적으로 존재하지 못해 발생하는 여러 문제들 때문에 하나의 모듈로 관리하기 위한 다양한 패턴을 사용하여 의존성을 관리할 수 밖에 없었더라
3. 내보내기(export)와 불러오기(import)
4. CommomJS : 노드js의 기본 모듈 시스템, 유례 명칭은 자바스크립트를 브라우저로 독립시키려고 하는 자발적 워킹 그룹이라고 함.

## require

1. 필요한 부분에서 동적 임포팅을 할때(import는 js파일 맨 위에 놓이도록 강제된다)
2. 동기적으로 처리된다. 위에있는 것부터
3. 웹팩으로 번들링할때 코드를 다 가져와 빌드하니 비효율적이다
4. node.js에서 사용하는 commonJS키워드
5. require 키워드를 통해 변수에 할당할 수 있고, 그 변수를 통해 일반 객체에 접근하는 것 처럼 속성에 세팅되어있는 함수에 접근할 수 있음

```javascript
// 단일 객체로 내보내기
const obj = {};
obj.canadianToUs = function(canadian) {
  return roundTwoDecimals(canadian * exchangeRate);
};
obj.usToCanadian = function(us) {
  return roundTwoDecimals(us / exchangeRate);
};
module.exports = obj;

//따로따로 내보내기
exports.canadianToUs = canadianToUs; // 내보내기 1
exports.usToCanadian = usToCanadian; // 내보내기 2

// 어떻게 내보내든 이렇게 받는다
const currency = require("./currency-functions");
console.log(currency.canadianToUs(50));
```

## import

1. 비동기적으로 처리되니깐 then을 쓸 수 있다
2. 일부분만 가져와서 쓸 수 있다
3. 일부분만 가져와 쓰는 것이 가능하니 웹팩 번들링시 성능이 더 좋다
4. 무조건 strict mode
5. 동적 임포팅은 모듈을 조건적으로 가져오고 싶거나, 필요할 때에만 가져올 때 유용
6. 초기 의존성을 불러올때는 정적 임포팅이 더 좋고, 정적 코드 분석 도구와 트리 셰이킹을 적용하기 쉬움

```javascript
import defaultExport from "module-name";
import * as name from "module-name";
import { export1 } from "module-name";
import { export1 as alias1 } from "module-name";
import { export1 , export2 } from "module-name";
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export1 [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";
var promise = import("module-name");
```
