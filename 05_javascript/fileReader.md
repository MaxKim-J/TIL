# File API

## 쓰임새

- 파일을 읽을 수 있음
- 브라우저가 사용자 컴터에 파일을 쓰게되면 그건 위험함
- 브라우저에서 허용한 파일만 읽기 가능함
- 파일 인풋박스에 onChange 핸들러, e.target에 올린 파일 객체 저장
- 이 파일 객체의 데이터를 파악하려면 FileReader API 사용해야

## 사용방법
- new FileReader() 생성자로 새 파일리더를 만듬
- 파일 읽는방법 4가지(readAsText, readAsDataUrl, ReadAsArrayBuffer, readAsBianryString)
- 파일리더는 동기적으로 파일을 읽지 못하고 onload핸들러를 붙여서 콜백으로 파일을 다 읽었다는 것을 알려주도록 해야 한다.

## 읽는 방식

### readAsText
- 이미지 파일을 텍스트로 읽으라고 하면 외계어가 나온다
- 텍스트 파일(.txt)을 읽을 때 사용하면 된다

### readAsDataUrl
- 제일 중요하다
- 데이터 URL로 만드는 방법
- base64로 인코딩되었다는 말이 나오는데, 이걸로 인코딩하면 브라우저가 이 문자열을 인식해서 원래 데이터로 만들어줌
- 이 문자열을 주소창에 치면 브라우저가 파일을 표시해줌
- 파일 정보를 통해 주소처럼 확인할 수 있음
- img의 src속성으로도 활용할 수 있음 
- **이미지를 올리고 바로 미리보기를 표시하고 싶을 때**

### readAsBinaryString
- 외계어
- 이진 데이터를 반환하므로 서버에서 읽을 수 있다
- 정작 서버에 파일 보낼때는 multipart/form-data에 태워서 보내면 굳이 이런거 해줄필요 없고 지가 알아서 인코딩한다
- 그럼 왜있지...

## 예제 코드

```js
// 이벤트 핸들러에 바로 넣어주기
file.onchange = function(e) {
  var fileReader = new FileReader();
  fileReader.readAsBinaryString(e.target.files[0]);
  fileReader.onload = function(e) {
    console.log(e.target.result);
  }
}

// 프로미스 객체에 넣어서 리턴
function fileRead(file) {
    return new Promise((resolve, reject) => {
         var fileReader = new FileReader();
        fileReader.readAsBinaryString(file);
        fileReader.onload = function(e) {
            // 또는 fileReader.result
            resolve(e.target.result)
        }
    })
}

```