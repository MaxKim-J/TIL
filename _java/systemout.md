# System.out

## 정의

지정된 서식으로 화면에 보여주는 역할을 한다  
system.out은 클래스 변수, print()등은 이에 포함된 메소드  
**메소드** : 자바에서 특정 기능을 처리하며, 다른 프로그래밍 언어에서는 함수 또는 멤버 변수라고 부름  
**필드** : 객체의 상태를 나타내는 것으로 속성이라고도 부름. 주로 **클래스변수이름.속성** 형식으로 사용

## 서식 표현

- %d,%s,%o : 정수(10진수, 16진수, 8진수)
- %f : 실수
- %c : 문자, 반드시 한글자이고 작은따옴표로
- %s : 문자열, 반드시 한글자 이상이고 큰따옴표로

```java
// 정수형
System.out.printf("%d\n", 123);
System.out.printf("%5d\n", 123);
System.out.printf("%05d\n", 123);

// 실수형
System.out.printf("%f\n", 123.45);
System.out.printf("%7.1f\n", 123.34);
System.out.printf("%7.3f\n", 123.29);
```

### 자료형

C언어랑 거의 비슷하다

#### 정수형

1. byte : 1바이트, 아주 작은 정수
2. short : 2바이트, 작은 정수
3. int : 4바이트, 정수형
4. long : 8바이트, 큰 정수형

#### 실수형

1. float : 4바이트, 실수형
2. double : 8바이트, 큰 실수형

#### 문자

1. char : 한 문자를 표현, 2바이트/물론 2바이트 크기의 정수형으로 취급해도 된다

#### 불리언

1. boolean : 1바이트, 참/거짓을 저장

#### 문자열

1. String : 입력한 글자수의 \*2 바이트(오 동적언어같네;;)

```java
int a = 3;
float b = 3.5f;
char c = 'c';
boolean d = true;
String e = "eeeee";

System.out.println(a);
System.out.println(b);
System.out.println(c);
System.out.println(d);
System.out.println(e);
```
