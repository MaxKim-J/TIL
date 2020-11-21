# PWA

프로그레시브 웹앱  
네이티브 앱과 같은 사용자 경험을 제공하는 웹앱  

## [이런게 왜 나왔나](https://altenull.github.io/2018/02/25/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%A0%88%EC%8B%9C%EB%B8%8C-%EC%9B%B9-%EC%95%B1-Progressive-Web-Apps-%EB%9E%80/)

- 네이티브 앱보다 웹의 접근성이 좋다. 모바일 사용자는 앱을 거의 다운받지 않는다. 하지만 웹페이지는 한달에 백개씩 들어간다.
- 모바일 사용자는 주요한 네이티브 앱만 사용한다. 사용하던 앱을 그냥 계속헤서 사용한다.
- 이게 앱스토어에 들어가서 다운받는게 꽤 장벽이다. 웹은 URL만 있으면 어디고 접속할 수 있어 유용하다.

## 두 가지의 구현체

1. **서비스 워커**는 웹 브라우저 안에 있지만 웹페이지와는 분리되어 항상 실행되는 백그라운드 프로그램을 말한다. 서비스 워커는 브라우저와 서버 사이에서 상탯값의 변경을 감시하고 푸시 알림으로 사용자에게 특정 메시지와 댓글 알림을 보낸다. 심지어는 오프라인 상태에서도 작동한다. 인터넷 연결 여부가 중요치 않다

2. **웹앱 메니패스토**는 앱 소개 정보와 기본 설정을 담은 JSON파일을 말함. 웹앱 메니페스트에는 웹앱의 고유한 제목과 소개글을 비롯해 스플래시 스크린, 화면 방향, 홈 화면 아이콘, 브라우저 아이콘, 배경색 정보 등이 담겨있다.

## 구현 세부사항

1. HTTPS를 써야한다. 홈 화면 추가 기능은 HTTPS에서만 지원하기 때문
2. 푸시알림 : 푸시알림에 동의만 했다면 한 번 방문하고 떠난 사용자에게도 알림을 보낼 수 있다. PWA가 실행되지 않은 백그라운드 상태에서도 알림 메시지 보낼 수 있다(이거 네이티브랑 얼마나 차이가 나는지..?)
3. 홈 화면에 추가 가능 : HTTPS, 매니페스트, 서비스 워커, PWA가 있으면 제안함
4. 웹 API : 사용자의 위치정보, 스마트폰의 카메라

## 웹앱 매니페스토(manifest.json)

name, icons, background_color을 적용하면 네이티브 앱처럼 스플래시 이미지를 띄울 수 있다.

```JSON
{
  "name": "HackerWeb",
  "short_name": "HackerWeb",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#fff",
  "description": "A simply readable Hacker News app.",
  "icons": [{
    "src": "images/touch/homescreen48.png",
    "sizes": "48x48",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen72.png",
    "sizes": "72x72",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen96.png",
    "sizes": "96x96",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen144.png",
    "sizes": "144x144",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen168.png",
    "sizes": "168x168",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen192.png",
    "sizes": "192x192",
    "type": "image/png"
  }],
  "related_applications": [{
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=cheeaun.hackerweb"
  }]
}
```

JSON파일이고, PWA의 세부사항을 포함하고 사용자 기기에 PWA가 설치될 때 동작하는 방법을 브라우저에 알려준다.

## 서비스워커

기존 브라우저 스레드와 별도로 실행되어 네트워크 요청을 가로채고 캐시에서 리소스를 캐싱하거나 푸시 메시지를 전송하는 자바스크립트 파일. 등록, 설치, 활성화의 3가지 생명주기를 갖는다

### 등록

```js
if('serviceWorker' in navigator){
  try {
    navigator.serviceWorker.register('serviceWorker.js');
    console.log("Service Worker Registered");
  } catch (error) {
    console.log("Service Worker Registration Failed");
  }
}
```

브라우저가 서비스 워커를 지원하는지 여부를 체크하고 이벤트리스너에 추가한다. 

### 이벤트 핸들링

- install : 이 이벤트는 브라우저가 새로운 서비스 워커를 감지할 때마다 호출된다. 우리의 목표는 모든 정적 에셋을 검색하기 위해 캐시 API를 호출하는 것이다.
- fetch : 서비스 워커에서는 등록된 이벤트에 응답하는 방법을 결정할 수 있다. 이를 위해서 respondWith() 메서드를 호출한다.

```js
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.url){
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(newtorkFirst(req));
    }
});
```


