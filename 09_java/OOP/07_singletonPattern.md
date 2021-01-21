# 07_싱글턴 패턴

## 정의

- 어떤 클래스에서 만들 수 있는 인스턴스 수를 하나로 제한하는 패턴
- 프로그램 실행 중 최대 하나만 있어야함(단하나)
- 이 개체에 전역적으로 접근이 가능해야 함

## 비공식적 정의

- static이 OO답지 않다는 의견(전역변수 같고 객체가 아니라서)과 부합하는 패턴
- OO의 전역객체

## 클래스 어캐만듬

- private 생성자 : 생성자 호출 못하게 막음
- static 메서드를 통해서만 개체를 얻어올 수 있음
- 아직 개체가 없다면 : 개체를 생성해서 static변수에 저장하고 변수에 저장된 객체를 반환
- 이미 객체가 있는 경우에는 static 변수에 저장되어 있는 객체를 반환한다.
- 객체가 클래스 안에 갇혀있음
- 처음 호출할때만 객체를 만들어놓음

```java
public class Singleton {
  // 이렇게 안에서 참조가 가능함
  private static Singleton instance;
  private Singleton() {}

  public static Singleton getInstance() {
    if (instance == null) {
      instance = new Singleton();
    }
    return instance;
  }

  // 요거 두개 그냥 같음
  Singleton instance0 = Singleton.getInstance()
  Singleton instance1 = Singleton.getInstance()
}
```

## Math 클래스

```java
public class Math {
  private static Math instance;
  private Math() {}
  public static Math getInstance() {
    if (instance == null) {
      instance = new Math();
    }
    return instance
  }
  // 나머지는 다 일반 메서드
  public int abs(int n) {
    return n < 0 ? -n:n;
  }
}

int absValue = Math.abs(-2) // 컴파일오류

// 개체를 일단 가져와야함
Math math = Math.getInstance();
int minValue = math.min(-2,1);
int maxValue = Math.getInstance().max(3,100)
```

- 요 클래스는 메서드만 있어서 별로 좋지는 않음 이렇게 쓸거면 차라리 스태틱만 쓰는게 낫고

## 설정

- private 변수 만들고 게터세터 제공
- 싱글턴의 뭔가 설명할때 대표적으로 예를 드는것
- 설정은 프로그램 실행 중 하나만 존재 프로그램창의 위치와 크기를 기억
- 파일에 저장하거나 파일로부터 로딩가능

```java
// 프로그램 실행 후 설정 읽어오기
Configuration config = Configuration.getInstance()
config.load("settings.scv")

// 창위치를 바귈때 x와 y를 설정
Configuration config = Configuration.getInstance()

config.setX(windowX);
config.setY(windowY);
```

## static과의 차이

- 대충 스태틱과 대응이 되는 경향이 있음.
- 스태틱이 못하는 일 : 다형성을 사용할 수 없음. 시그니처를 그대로 둔 채로 멀티턴으로 바꿀 수 없다(한번 스태틱은 영원한 스태틱). 개체의 생성 시점을 제어할수 없다(자바의 스태틱은 프로그램 실행시에 초기화)
- 생성 시기 제어 : 클래스 여러개의 인스턴스 가져올때 누가먼저 호출되는지 몰라도 알기 어렵긴 하지만 큰 문제는 아님 => 때에 따라서는 중요할때도 있긴 함
- 초기화 순서 보장 방법 : 프로그램 시작 시 여러 싱글턴의 getInstnace()를 순서대로 호출함
- 싱글턴 생성시에 인자가 필요한 경우도 있음(매개변수가 필요한 경우) : 다른 개체를 받아야 한다면..?
- 만들어줄수는 있는데 다른 클래스에서 사용할때 사용하지도 않을 매개변수를 넣어줘야 하는 경우가 생길 수 있음 => 복잡 =-> 그래서 변형해서 사용
- getInstance 말고도 createInstance, deleteInstance 같은거를 추가해서 클래스 내부의 인스턴스를 지웠다가 다시 필요에 의해서 생성해서 반환하고.. => 클래스에서 사용할때는 매개변수가 없는 getInstance를 호출(좀더 추상화 레벨을 높이는 방법)
- 안전 수칙이 사고를 방지한다 : 프로그램 구조에서 실수나 버그를 잡아내지 말고 좋은 규칙을 먼저 만드는게 더 가성비가 좋음