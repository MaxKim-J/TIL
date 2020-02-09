const path = require('path')
const string = __filename;

console.log("경로의 구분자:", path.sep)
console.log("환경 변수의 구분자:", path.delimiter)
console.log("파일이 위치한 폴더 경로:", path.dirname(string))
console.log("파일의 확장자:", path.extname(string))
console.log("파일의 이름:", path.basename(string))
console.log("파일 경로 세부사항(루트, 디렉토리, 베이스네임, 확장자, 이름):", path.parse(string))
console.log("parse한 객체를 파일 경로로 합친다(parse의 반대):", path.format(path.parse(string)))
console.log("디렉토리 이름을 이상하게 입력할때 정상화 해주기:", path.normalize("home/max/dev//TIL///node/practice///path.js"))
console.log("절대경로인지 상대경로인지 알려줌:", path.isAbsolute(string))
console.log("경로를 두개 넣으면 첫 경로에서 두 경로까지 가는 방법 알려줌:", path.relative(__dirname, 'home//max//dev//TIL'))
console.log("여러 인자를 넣으면 하나로 합쳐줌:", path.join(__dirname, '..', '..'))
console.log("join과 비슷하지만 맨 상위 /를 무시하고 절대경로로 인식:", path.resolve('/', __dirname, '..', '..'))