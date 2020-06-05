# HTML 구조

기본 태그들이 뭘 하는지 정리  
그리고 몇가지 알면 좋은 것들

## doctype

- 해당 문서의 버전 표기
- 맨 처음에 옴
- html 태그는 아니고 선언된 페이지의 html 버전이 무엇인지 알려주는 역할을 하는 선언문
- html인지 xhtml인지 버전 낮은 html인지
```html
<!-- 걍 얘는 html5 이다-->
<!DOCTYPE html>
```

## head
- 브라우저 화면에 직접 보이지 않으나 숨은 데이터를 정의하는 태그들이 선언
- title: 사이트 제목
- **meta** : 웹 페이지에 보이지 않는 정보를 제공하는데 쓰이는 태그, 페이지의 설명 요약, 핵심키워드, 제작자, 썸네일, 크롤링 정책 등 많은 정보 제공
    - name과 content로 이루어짐 
    - 한글 인코딩 
    ```html
    <meta charset="utf-8">
    ```
    - seo : discription, subject, keywords
    ```html
    <meta name="description" content="<p>태그에 대해 알아봅시다">
    <meta name="subject" content="HTML - <p>태그">
    ```
    - 브라우저 호환 : X-UA-Compatible, 대부분 ie때문임
    ```html
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
    ```
    - viewport : 반응형, 웹페이지가 사용자에게 보여지는 영역, 가장 일반적인 설정은 이렇고 페이지 너비를 기기의 스크린 너비로 설정한다는 말임
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ```

- link : 주로 css 연결

## body
- 브라우저에 주로 보이는 것들이 들어감

### div vs span

- div : block, 블럭을 쌓듯 위로 포게지는 속성, 사각형 박스 형태로 width와 height값에 영향
- span : inline, 직렬/횡으로 따닥따닥 붙는 속성을 갖고 있으며 영역을 그 안에 들어가는 내용의 크기 만큼으로 제한(width, height의 영향을 안받음,마진탑이나 바텀도 안받는듯 싶음)

### 시맨틱 태그
- 미리 정해둔 태그, 태그만으로도 개발자에게 의미를 제공
- 걍 div라고만 쓰면 이게 뭔지 모르고 그러니깐
- article, aside, details, figcaption, figure, footer, header, main, mark, nav, section, summary, time등

## script 삽입방식과 위치
```html
<script type="text/javascript" src="링크주소"></script>
```
- text/javascript부분 html5에서는 생략 가능
- 문서의 어느 곳에든 둘 수는 있다

### 삽입 위치 matters
- 브라우저는 html의 구조와 css 스타일 렌더링 하는 중에 자스를 만나게되면 이에 대한 **해석과 구현이 완전히 완료될때까지 브라우저의 렌더링을 멈추게 된다** : 삽입위치에 따라 스크립트 실행순서와 브라우저 렌더링에 영향을 미친다

#### head에 삽입

- 브라우저 렌더링에 방해가 되어 무거운 스크립트가 실행되는 경우 오랫동안 완성되지 못한 화면을 노출하는 불상사(프리징 현상)
- 문서를 초기화하거나 설정하는 가벼운 스크립트들이 자주 사용됨
- 문서의 DOM 구조가 필요한 경우 document.onload와 같은 로드 이벤트가 추가되어야 함(dom이 로딩이 끝나야 돔에 접근할테니깐..)

#### body 끝나기 전에

- 브라우저 렌더링이 완료된 상태에서 스크립트가 실행되므로 콘텐츠를 변경하거는 스크립트의 경우 **화면에 노출이 된 채로** 변화된다(최초로 렌더링되는 컨텐츠의 경우)
- 대부분 스크립트의 위치로 추천되는 위치
- 문서 돔구조 렌더링 완료된 상태에서 실행되므로 별도로 추가설정 할 필요 없다




