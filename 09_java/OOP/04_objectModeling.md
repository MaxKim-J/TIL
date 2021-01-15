# 04_객체 모델링

어떤 식으로 클래스를 만들어야 하나

## 난관

- 이렇다할 정답이 없음
- 사람다운 생각을 프로그래밍에 반영 => 근데 사람다움은 주관적
- 한방에 제대로 설계하기도 어려워서 뒤엎는 일도 빈번

## UML

시스템의 디자인을 시각화하기 위해 만든 표준. 클린 아키텍처에서 많이 봤던 그림. 근데 요즘은 설계할때 대충 비슷하게 쓰는데 그외에는 그렇게 중요치 않음. 근데 어쨋든 코드보다는 보기 편하다.

- 접근 제어자 표현
  - `-` : private
  - `+` : public
  - `~` : default
- `--->` : 의존 관계(인자의 클래스)

## 모델링 예제

꽃에 물주기 => 화분과 분무기

### 분무기

항상 코드는 필요한 시점에 무언가 추가하는게 항상 더 나은 경우가 많다.

```java
class WaterSpray {
  // 반드시 필요한 정보일때만 멤버변수로 추가
  // 그냥 생각할 수 있는 정보를 다 때려박는건 의미가 없다
  // 사용하지않은 멤버 변수나 메서드가 있다면 계속 고치고 테스트해야함
  private int remainingWaterInMl = 0;   // 단위를 정확히
  private int capacity;   // 최대 물 상수

  // 생성자에서만 초기화되고 변경이 불가능한 변수 만들어줄수도
  public WaterSpray(int capacity) {
    this.capacity = capacity
  }

  public int getRemainingWater() {
    return this.remainingWaterInMl;
  }

  // setter말고 동작으로(값을 바꾸지 않는다 더함)
  public void addWater(int amountInMl) {
    this.remainingWaterInMl += amountInMl;
    this.remainingWaterInMl = Math.min(this.remainingWaterInMl, this.capacity);
  }

  public void fillUp() {
    this.remainingWaterInMl = this.capacity
  }

  // 동작에 초점을 맞출 경우 : pull, press
  // 용도에 초점을 맞출 경우 : spray
  // 남은 양을 구할때 => int로 바꿔서 반환? getter?
  // int로 바꿔서는 시그니처만 봤을 때 정확히 뭘 반환하는지 알기 힘듦
  // 명백한게 좋으니 void인게 낫다
  public void spray() {
    this.remainingWaterInMl -= Math.min(this.remainingWaterInMl, 5);
  }

}
```

### 수도꼭지

- 물을 채울 수도꼭지를 만드는데, 먼저 만든 분무기 클래스의 public 메소드가 없어 물을 채울수가 없다. Faucet이 물 양을 바꾸어주게끔 설계가 바뀌어야 함
- 정말 이게 필요한가??? : 수도꼭지를 만들면 물은 자동으로 나오나?? 파이프 송수관 정화시설...끝이없음 => 전세계를 시뮬레이션 하지 않는 이상 불가능ㅋㅋㅋㅋ
- 우리가 **필요한 것들만** 만든다. 선을 긋는다. 

## 화분 

- 살았는지 죽었는지 기억할 변수가 필요(alive). 처음은 살아있으니 true로 시작 => 생성자는 하는일이 따로 없음
- isAlive: 불리언 getter는 is로 시작
- 한번 죽은 꽃은 되살아날 수 없으니 alive는 setter을 사용할 수 없음
- minDailyWaterInMl : 매일 필요한 최소 물의 양, 역시 setter은 없고 생성자로 초기화

```java
public class FlowerPot {
  private boolean alive = true;
  private final int minDailyWaterInMl;
  private int dailyWaterRecieved = 0;

  public FlowerPot(int minDailyWaterInMl) {
    this.minDailyWaterInMl = minDailyWaterInMl;
  }

  public int getMinDailyWaterInMl() {
    return this.minDailyWaterInMl;
  }

  // 한번 뿌릴때마다 생사여부를 타진하면 안되고 하루에 받은 총 분무량을 기억
  // 그리고 하루가 끝났음을 알려야함(따로 - 분무했다고 하루가 지나는게 아니고)
  public void addWater(int amountInMl) {
    dailyWaterReceived += amountInMl;
  }

  public void liveAnotherDay() {
    // 하루 더 살아야 할때 판단
    if (dailyWaterReceived < minDailyWaterInMl) {
      alive = false
    }
    dailyWaterReceived = 0;
  }
}
```

```java
FlowerPot pot = new FlowerPot(10);

// 물을 두번 뿌린다
for (int i = 0;i < 2;++i) {
  int water = waterSpray.getRemainingWater();
  waterSpray.spray();
  water -= waterSpray.getRemainingWater();

  pot.addWater(water);
}

// 내일로 넘어가는 메서드
pot.liveAnotherDay();
System.out.printf("pot alive? %s", pot.isAlive());
```

### 상호작용

- 지금은 waterspray랑 화분이랑 상호작용이 없는데. 이것은 구조체 사고방식에서 벗어나지 못한 것 => 추상화 레벨이 더 높아야함. 그냥 데이터 저장소로만 쓴 것과 다름없음
- 클래스간 상호작용이 없으면 **개발자가 그 사이를 잇고 있는 것** 직접 상호작용하게 만들어야 스스로의 상태를 결정하는 객체가 된다.
- 메서드 인자로 객체를 넘긴다

```java
// 호출자를 간단하게 만들고

// 접근 1) 분무기를 화분에 대고 뿌린다
// 좀 자연스러운 생각을 구현
Class WaterSpray {
  ...
  public void sprayTo(FlowerPot pot) {
    int amountToSpray = Math.min(this.remainingWaterInMl, 5);
    pot.addWater(amountToSpray);
    this.remainingWaterInMl -= amountToSpray;
  }
  ...
}


// 접근 2) 분무기를 줄 테니 화분이 알아서 샤워해라
// 개념적으로 어색하지만 addWater로 int를 받는 함수를 spray에서 제거 가능 => 1톤 2톤 물을 인자로 받아 붓는 그런 에바같은 동작을 사전에 방지
// 분무기만 화분에 물을 줄 수 있음을 정의함
// 분무기가 물이 없으면 물을 못 뿌릴테니 추상화가 더 좋게 됨
Class FlowerPot {
  ...
  public void addWater(WaterSpray spray) {
    int water = spray.getRemainingWater();
    spray.spray();
    water -= spray.getRemainingWater();
    dailyWaterReceived += water;
  }
  ...
}
```

- 사고방식 변화 필요 : 실세계의 물체는 거의 완전히 수동적인 존재
- OO 새계의 물체는 어느 정도 자기 주관을 가진 주체. 실 세계보다는 주체성을 더 가진다, 자기가 자기를 책임질 수 있는 주체
- 꼭 실생활의 모든것을 반영해서 프로그래밍 할 필요는 없다
- 인자로 확실한걸 전달하려고 노력해야한다. 그래야 이상한 동작을 방지할 수 없음

### 유연성(클래스 분리)

- 이 구조대로라면 유연성이 좀 떨어짐. 사실 컵으로도 물을 줄 수 있는건데
- 유연성 == 재활용성
- 분무기는 머리랑 몸통으로 분리할 수도 있다 => 각 부위가 이정도의 유연성을 가질 수 있음 여러군데 사용되니까
- 분무기의 머리 몸통을 나눠서 클래스를 만들고 메서드도 다 거기로 옮김 => 여러 종류의 머리와 몸통을 섞을 수 있음 `<>---` 화살표쪽으로 가서 모여있다.

```java
// 얘는 집합. 분무기의 생존여부와는 상관없이 따로 생존 가능
class WaterSpray {
  private SprayHead head;
  private SprayBottle body;
}

// head
public void addWater(WaterSpray spray) {
  SprayHead head = spray.getHead();
  SprayBottle body = spray.getBody();
  int water = body.getRemainingWater();
  head.sprayFrom(body); // 근데 물은 몸통에 있으므로 이와 동시에 몸통에 있는 물을 줄이는 메소드 필요
  water -= body.getRemainingWater();
  dailyWaterReceived += water;
}

public void sprayFrom(SprayBottle source) {
  source.reduceWater(sprayAmount)
}

// bottle
public void reduceWater(int milliliter) {
  this.remainingWater -= Math.min(milliliter, this.remainingWater);
}
```

- 근데 유연성이 좋은 설계가 맨날 좋은 설계는 아니다. 간단하 예에서 이렇게 하는게 많은데.. 
- 손해보는게 많을때는 유연성이 좋아봤자 별로다
- 사용자에게 진짜 이득이 생겼을때 재사용성을 확보해도 괜찮다.
- 재사용할 수 있어 좋은 경우 : 자주 사용하는 수식들을 함수로 만든 경우
- 너무 쪼개져서 읽기 힘든 경우: 재사용을 고려해 너무 쪼개면 여러 파일을 넘나들어야 함. 너무 많은 파일을 열어서 읽는 것은 불편. 
- 사람의 읽기 습관 : 위에서 아래로 순차적으로 보는 것을 제일 편해함. 유연성이 높다는 것은 성능과 가독성을 포기하고 재사용성을 높이는 것. 그러니까 다시 쓴다는 보장이 꼭 필요하다.
- 기본기 없이 유연성만 고려하면 프로그램이 무너진다. 읽기 명확한 코드를 만들고 실수를 저지르지 어려운 코드를 만들어야함 -> 그 다음에 유연성. 필요에 따라 유연성을 키우는 방법 배우기

### 규격 정하기

- 생성자에서 이넘(열거형) 사용하기

```java
public enum SprayHeadSpeed {
  SLOW,
  MEDIUM,
  FAST
}

public enum BottleSize {
  SMALL,
  MEDIUM,
  LARGE
}

// WaterSpray의 생성자
public WaterSpray(SprayHeadSpeed speed, BottleSize size){
  switch(speed) {
    case SLOW:
      this.head = new SprayHead(1);
      break
    case MEDIUM:
      this.head = new SprayHead(5);
      break
    case FAST:
      this.head = new SprayHead(50);
      break
    default:
      assert(false) : "unrecognized"
      break
  }

   switch(size) {
    case SLOW:
      this.body = new SprayBottle(10);
      break
    case MEDIUM:
      this.body = new SprayBottle(50);
      break
    case FAST:
      this.body = new SprayBottle(150);
      break
    default:
      assert(false) : "unrecognized"
      break
  }
}

WaterSpray spray = new WaterSpray(SprayHeadSpeed.MEDIUM, BottleSize.MEDIUM)
spray.getBody().fillUp();

FlowerPot pot = new FlowerPot(10);
for (int i = 0;i < 2;++i) {
  pot.addWater(spray)
}

pot.liveAnotherDay();
System.out.printf("pot alive? %s", pot.isAlive());
```