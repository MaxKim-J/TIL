# 05_스태틱

## static

- 전역 변수나 전역 함수가 자바에서는 없어서 불편할 수 있음
- System같은거. 개체 안만들고 사용했으니 이런게 전역변수랑 비슷함
- 독스보면 println은 정적 메소드임
- 모든것이 개체 속에 있는 불편함 : 단순한 계산도 개체를 만들어서 해야 하나? 개체 단위가 아니라 클래스 단위에서 뭔가 하고싶을 때는? 클래스에서 총 몇개의 개체를 만들었는지 기록하고 싶을 경우에는?
- 프로그램 전체에서 이런일 하고 있는게 딱 하나

```java
public class Math {
  public static int abs(int n) {
    return n < 0 ? -n : n;
  }
}
```

- 이 메소드의 소유주는 인스턴스가 아니라 클래스임(`Math.abs()`)
- 클래스명.함수명으로 호출하고 개체를 만들 필요가 없음

## 정적 클래스와 생성자

- 생성자가 있으면 개체를 만들 수 있다는건데?
- 생성자를 쓰면 개체가 생기기는 생기고 정적 메소드를 개체로 호출할 수 있다. 
- 개체.메서드()가 클래스 메서드도 호출해줌 => 생성된 개체 수에 상관없이 클래스는 단 하나만 존재하기 때문에 어떤 개체라도 호출해야 하는 메서드를 특정 가능함
- 근데 이런 경우는 개체 생성을 못하게 막으면 좋다. 언어가 해주는건 아니고 프로그래머가 해줘야함 -> 생성자를 Private으로 바꾸면 new 키워드를 사용하지 못함, 근데 꼼수에 가까움
- 자바는 static 클래스를 지원하지 않아서 이렇게 해줘야함

```java
// Java

public class Math {
  private Math () {}
  public static int abs(int n) {
    return n < 0 ? -n : n;
  }
} 
```

```csharp
// C#

public static class Math 
{
  public static int abs(int n)
  {
    return n < 0 ? -n : n;
  }
}
```

## 인스턴스간 전역 변수

- 클래스의 수명 == 프로그램 런타임
- 클래스의 수명동안 만든 인스턴스의 숫자를 모두 기록한다면? => 개체변수로는 안되고 한 개체에서 다른 개체가 어디있는지 몇개나 있는지 알 수가 없음. 개체단위에서 해결할 수 있는 문제가 아님
- 이 변수는 개체보다 상위 개념에 있어야 함 => static
- static에 대한 getter도 static으로 만들어야 한다(클래스 단에서) -> 역시 개체를 통해서도 정적 메서드에 접근 가능.

```java
public class ColaCan {
  private int remainingMl;
  private static int numCreated;
  public ColaCan(int initialMl) {
    this.remainingMl = initialMl;
    ++numCreated;   // ++this.numCreated; , 스코프 체이닝하니까 this 상관없
  }
}


ColaCan cola = new ColaCan(50);
```

## 정적 메서드에서 비정적 메서드, 멤버변수 접근

```java
public class ColaCan {
  private int remainingMl;
  private static int numCreated;

  public ColaCan(int initialMl) {
    this.remainingMl = initialMl;
    ++numCreated; 
  }

  public static void printStats() {
    System.out.println(numCreated);   // 정적
    System.out.println(this.remainingMl)  // 비정적
  }
}


ColaCan cola = new ColaCan(50);
ColaCan.printStats();   //error
```

- 정적 메서드는 비정적 멤버변수, 함수에 접근할 수 없다
- 개체 수만큼 멤버변수가 생김 => 근데 클래스는 한개 생김
- 정적 메소드는 클래스에서 선언된 메소드이고 클래스는 딱 하나인데, 만약 정적 메소드에서 비정적 무언가를 호출한다면 클래스로 생성한 여러개의 인스턴스 중에 어떤 인스턴스의 멤버변수를 특정해야 한다. 그런데 이미 인스턴스는 여러개이므로 특정 불가능함.
- 반대는 가능했음(개체에서 클래스는 특정할 수 있음)
- static 멤버 변수 및 멤버 함수는 클래스에 속해서 딱 하나만 존재하고, 아닌 것은 개체에 속해서 개체 수만큼 존재한다.
- static은 클래스가 살아있는 런타임동안 계속 살아있다

## static에 대한 비판

- 모든 진영에서 비판받음 : 객체 소속이 아니라 프로그램 실행 동안 존재하는 전역변수 같은 개념
- OO의 개념과는 멀다 : 객체지향이 없애려 하기는 했음. 
- 근데 객체지향으로 모든걸 할 수는 없다. 어쩔때는 절차형, 어쩔때는 객체지향 => 순수성이 중요한건 아니다 좋은 언어는 컨셉을 잘 구현한 언어가 아니라 좋은 해결책을 적당한 때에 사용할 수 있는 언어다.