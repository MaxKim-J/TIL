# MVC/MVP/MVVM
모델-뷰-컨트롤러, 모델-뷰-프리젠터, 모델-뷰-뷰모델  
화면에 보여주는 로직과 실제 데이터가 처리되는 로직을 분리

## 뭔가요
- 프로그램을 구성하는 요소들을 대이터, 화면, 컨트롤로 나눠서 각자의 역할을 부여하고 각자 일에만 충실
- 각각의 특징들을 이해해 구성 요소들이 할일만 구현하면 다른 요소를 수정하지 않으면서 유지보수 간편
- MVC가 제일 유명하고 MVP와 MVVM은 파생된 것

## MVC
![mvc](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2F7IE8f%2FbtqBRvw9sFF%2FAGLRdsOLuvNZ9okmGOlkx1%2Fimg.png)
- 모델 뷰 컨트롤러
    - Model : app에서 사용되는 데이터와 그 데이터를 처리하는 부분
    - View : 사용자에서 보여지는 UI부분
    - Controller : 사용자와의 interaction, 액션을 받고 처리

### 동작
1. 사용자의 action들이 컨트롤러에 들어온다
2. controller은 사용자의 action을 확인하고 model을 업데이트한다
3. controller은 model을 나타내줄 view를 선택한다
4. view는 모델을 이용하여 화면을 나타낸다

### 특징
1. MVC에서 view 업데이트 방법들
    - view가 모델을 이용하여 직접 업뎃
    - model에서 view에게 notify
    - view가 polling으로 주기적으로 model의 변경을 감지하여 업로드
2. Controller는 여러개의 view를 선택할 수 있는 1:n 구조
3. Controller는 View를 선택할 뿐 직접 업데이트 하지 않음(view는 컨트롤러를 알지 못함)

### 장단
1. 장점 : 가장 단순, 보편적으로 많이 사용
2. 단점 : view가 model에 너무 의존 => view와 model의 높은 의존성을 어플리케이션이 커질수록 복잡해지고 유지보수가 어렵게 만들 수 있음

## MVP
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FclZlsT%2FbtqBTLzeUCL%2FIDA8Ga6Yarndgr88g9Nkhk%2Fimg.png)
- 프레젠터 : 뷰에서 요청한 정보로 모델을 가공하여 뷰에 전달해주는 부분 뷰와 모델을 붙여주는 역할을 함 

### 동작
1. 사용자의 액션은 뷰를 통해 들어옴
2. 뷰는 데이터를 프리젠터에 요청(뷰와 모델은 직접적으로 소통하지 않음)
3. 프레젠터는 모델에게 데이터를 요청
4. 모델은 프레젠터에서 요청받은 데이터 응답
5. 프레젠터는 뷰에게 데이터를 응답
6. 뷰는 프레젠터가 응답한 데이터를 이용하여 화면을 나타냄

### 장단
1. 장점 : 뷰와 모델은 의존성이 없음, 프레젠터를 통해서만 데이터를 전달받기 때문
2. 단점 : 뷰랑 모델의 의존성은 낮췄지만 이제 프레젠터에 대해서 의존성이 생김

## MVVM
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FCiXz0%2FbtqBQ1iMiVT%2FstaXr7UO95opKgXEU01EY0%2Fimg.png)

### 동작
1. 사용자의 액션은 뷰를 통해 들어옴
2. 뷰에 액션이 들어오면 command 패턴으로 뷰 모델에 데이터 전달
3. 뷰모델은 모델에게 데이터를 요청
4. 모델은 뷰모델에게 받은 데이터 응답
5. 뷰 모델은 응답받은 데이터를 가공하여 저장(저장을 함)
6. 뷰는 뷰 모델과 데이터 바인딩하여 화면을 나타냄
7. 뷰 모델 : 뷰를 표현하기 위해 만들어진 뷰를 위한 모델

### 특징
- 뷰 모델과 뷰는 1:n 관계임
- command와 data binding을 이용하여 view와 view 모델 사이의 의존성을 없앰

### 장단
- 장점 : 뷰와 모델 사이의 의존성이 없음, 뷰와 뷰 모델 사이의 의존성도 없음
-각 부분은 독립적이라 모듈화 개발 가능
- 단점 : 뷰모델 설계가 쉽지 않음