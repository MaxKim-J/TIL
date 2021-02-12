# 13_인터페이스

- 정의 : 딱 나오면 딱 아는것. 직관적으로 뭘 해야할지 딱 알게되는 풍경. 두 물체가 만나는 경계선, 경계면
- 서로 다른 두 공간을 잇는 경계
- 내가 모르는, 다른사람이 설계한 공간 혹은 기계와 소통할 수 있는 무언가를 제공

## 인터페이스와 함수 포인터

- 사용자는 본인에게 익숙한 공간에서 지시 : 사용자의 공간은 사용자에게 매우 익숙함. 잘 알지 못하는 공간에서는 실질적인 변경이 일어남(구현자가 잘 아는 공간)
- 절차형 언어에서 함수는 블랙박스 : 함수 호출자는 함수 내부가 어떻게 도는지 이해할 필요가 없다. 시그니처만 보고 어캐 작동하는지 알아야댐
- 함수 안에서 해 놓은 이상한 짓에 의존하는 코드를 짜면 안됨
- 시그니처 == 인터페이스 : 척하면 척! 알 수 있는 것

```c
// C에서의 함수 포인터 === 시그니처만 선언
void register_error_handler(void (*handler)(const char* msg)){
  s_handler = handler
}
```

## Monster 클래스 수정

```java
public final boolean canSurviveAttackFrom(Monster attacker) {
  // 얘는 추상 메서드로 선언되어있었음
  // 근데 얘를 넣는 이유는 딱 요거를 호출하기만 하기 위해서이고
  // 이거는 함수포인터랑 별로 다른게 없음
  return attacker.calculateDamage(this) < this.hp;
}
```

## 인터페이스는 순수 추상 클래스

- 클래스 매개변수 : 부모 클래스를 상속한 클래스면 다 받아줌. 그중 다형적 메서드 하나를 호출. 실질적으로 C의 함수 포인터처럼 작동하지만, 배보다는 배꼽이 더 큼
- OO에서 동작만 떼어다가 따로 지정하기 => 순수 추상 클래스: 동작만 모아놓은 것 => 인터페이스(구현부가 단 하나도 없다)
- 어떤 상태도 없고, 동작의 구현도 없고 시그니처만 있음
- 추상 클래스랑 직접적인 차이? = 일단 모양이 다르고(interface 키워드), 메서드는 언제나 public, 추상클래스에서는 상태나 구현부가 들어갈 수 있는거 같긴 하네
- 추상 클래스에서는 꼭 public이 아닌 클래스의 공통적인 구현부가 들어갈 수 있음 => 내용이 없는 것들은 물론 인터페이스처럼 오버라이딩 하겠지만
- implements와 extends를 동시에 할 수도 있음

```java

// 둘이 개념은 같다
public abstract class LoggerBase {
  public abstract void log(String message)
}

public interface ILoggable {
  void log(String message)
}
```

- implement : 구현한다. 상속이 아님
- 사실 굳이 구분하지 않아도 사용은 가능. 자바가 그렇게 하는것
- 무조건 I를 붙이는 식으로 컨벤션 지정하면 ㄱㅊ

## 미구현

- 추상메서드를 구현 안하면 컴파일 오류가 나는것처럼 인터페이스를 implement해도 구현을 안하면 컴파일때 오류남
- 사실 추상클래스 상속이랑 다른게 없음 => 특정 추상 클래스를 인터페이스라고 하는것임
- 미구현으로 인한 컴파일 오류는 실수를 방지함
- 근데 클래스 상속은 실수가 있어서 오버라딩할 메서드를 오타로 잘못 입력했다거나 해도, 걍 아 구현 안했군 하면서 부모를 호출함
- 인터페이스는 컴파일부터가 안됨
- 이런 실수를 막겠다고 Interface만 쓰거나 할 필요는 없음 => 자식 클래스에서 그 의도를 명백히 적어줄 수 있으면 됨 => 컴파일러가 그 의도에 맞는 메서드 시그니처를 못 찾으면 컴파일 오류

## 자바 어노테이션

- 프로그램에 대한 메타데이터를 제공하고, 프로그램의 일부가 아니어서 코드 실행에는 아무 영향을 안미침
- 컴파일러에게 부수정보를 제공 : 컴파일 도는 배포중 어노테이션을 기반으로 어떤 처리를 할 수 있음
- 실행 중에도 어노테이션을 기반으로 어떤 처리를 할 수 있음

## 인터페이스 접근 제어자

- 추상 메서드는 Protected를 쓸 수 있었는데 인터페이스는 나 Public이라 이상함
- 왜 public만? : 누구라도 보고 명령할 수 있는 동작. 모든게 전역변수인 C의 헤더파일과 비슷한 느낌도 있음
- 그단계 강제를 인터페이스만 하게 되는곤가
- 앞에 접근제어자 없으면 무조건 public
- 클래스를 엄청 만들고 인터페이스에는 I를 붙이는데 구별하기 위해. 클래스는 줄창 만들기 때문에 굳이 구별 안함

## 다중상속

- 인터페이스는 다중상속이 됨

```java
interface ILoggable {
  void log(String message);
}

interface ISavable {
  void save(String filename);
}

// 둘다 구현해야 컴파일 에러가 안남쓰
public final class ConsoleLogger implements ILoggable, ISavable {
  private ArrayList<String> logs = new ArrayList<String>();

  public void log(String message) {
    logs.add(message);
    System.out.println(message);
  }

  public void save(String filename){}
}
```

- 근데 클래스 다중 상속은 상태와 메서드 구현이 중복되기도 함(다이아몬드 상속문제) => 그래서 자바에서는 다중상속이 안됨(C++은 된다는군)
- 근데 인터페이스는 구현이 없기 때문에 중복되도 상관없음 -> 메서드 시그니처가 중복될 경우 상속받은 클래스가 어떤 한 메서드 구현만 제공하면 ㅇㅋ
- 두 인터페이스의 같은 이름의 메소드 시그니처가 반환형만 다르면 두 함수를 다 구현할 방법이 없으므로 컴파일 오류가 난다 => 반환형만 다른 경우는 올바른 함수 오버로딩이 아니다.

## 인터페이스 구현 후에 자식들이 상속받아도 문제 없나

- 구조가 좀 복잡해질때 문제 없냐
- 일단 문제는 없다
- 어떻게 상속을 해도 인터페이스의 구현은 하나뿐임 : 아무리 복잡하게 상속 구조를 설계해도 마찬가지. 인터페이스에서 선언한 메서드의 구현은 클래스에서 생김. 근데 클래스를 다중 상속받는 것은 불가능
- 주로 인터페이스를 사용하는게 다중상속을 위해서 많이 사용하게 된다
- 캐스팅 필요 없이 다형적인 메소드 호출을 돕는 역할을 함

```java
for (IMountable mountable : clocksToMount) {
  mountable.mount();
}
```

- 어쨋든 핵심은 다형성 + 늦은 바인딩
- 다형성 없는 인터페이스는 의미가 없음

## Object.clone()

```java
// 얘 인터페이스를 상속해서 구현 => 그렇지 않으면 예외발생
protected Object clone() throws CloneNotSupportedException;

public final class Robot implements Cloneable {
  public Object clone() throws CloneNotSupportedException {
    // 얘를 반드시 호출 -> 각 클래스마다 clone의 의미가 다를 수 있음
    return super.clone()
  }
}

Robot robot = new Robot(300);
// Object 인스턴스를 반환하므로 다운캐스팅을 해줘야한다
Robot savePoint = (Robot)robot.clone();

System.out.println(savePoint == robot);
```

- 깊복하는 메서드를 Object에서 상속받아 클래스 안에 구현할 수 있음
- 객체를 다른 메모리 주소에 복사하는 동작을 함
- 근데 만약에 컴포지션으로다가 클래스가 안에서 어떤 인스턴스를 공유한다면?(nested 일때)
- 좀더 깊은복사가 되야함 => 하위 클래스에도 clone을 구현해줘야한다.

```java
public final class Head implement Cloneable {
  public Object clone() throws CloneNotSupportedException {
    return super.clone()
  }
}

public final class Robot implements Cloneable {
  public Object clone() throws CloneNotSupportedException {
    Robot cloned = (Robot) super.clone();
    // 직접 복사해서 바꾸기
    cloned.head = (Head) head.clone()
    return cloned
  }
}
```

## 생성자를 이용한 복사

```java
public final class Point {
  // 새로운 메모리에 새로운 객체를 생성하기 때문에 가능
  public Point(final Point other) {
    this(other.x, other.y)
  }
}

public final class Line {
  public Line(final Line other) {
    this(new Point(other.p1), new Point(other.p2))
  }
}
```

## 구체 클래스 vs 인터페이스

- 구체 클래스 : 상태와 동작을 모두 포함, 동작에 다양한 접근권한 부여 가능, 이로부터 인스턴스 생성 가능, 다중 상속의 부모가 될 수 없음
- 인터페이스 : 동작에 대한 설명만 포함함, 모든 동작은 public, 이로부터 인스턴스 생성 불가능, 다중 상속의 부모가 될 수 있음(순수 추상 클래스)