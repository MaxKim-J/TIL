# 02_String 클래스

## java.lang.String

- 문자열을 표현할 수 있는 클래스
- 원시타입이 아니고 참조형이며(클래스 인스턴스니까) new로 생성할 수도 있고 큰따옴표를 사용해 리터럴로 선언할 수 있다.
- 불변형이다. 한번 생성되면 값을 읽기만 할 수 있고 변경할 수는 없음

## 선언

```java
// 클래스 인스턴스 치고는 희한하게 리터럴과 new 모두 가능함
String a = "Happy Java";
String a = new String("Happy Java");
```

## 메소드

## equals()

두 문자열의 값이 동일한지를 비교

## indexOf()

문자열에서 특정 문자가 시작되는 인덱스를 리턴

## replaceAll()

문자열 중 특정 문자 대채

## subString()

특정 부분 뽑아냄

## trim()

좌우 공백 제거

## length()

문자열의 길이

## isEmpty()

빈 문자열인지 체크