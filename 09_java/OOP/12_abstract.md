# 12_추상 메서드/클래스

- 다형성은 상속에 기반한다
- 상속과 다형성은 추상화에 기반 : 여러 클래스에서 공통분모를 뽑아 부모 클래스를 만드는 과정, 자식마다 달리 작동하는 구현을 부모의 메서드 시그니처로 일반화하는 과정
- 근데 부모 클래스 말을 듣기만 할까?

## 예시

### Monster 클래스

```java
public class Monster {
  private int hp;
  private int attack;
  private int defense;

  public Monster(int hp, int attack, int defense) {
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
  }

  public int getHp() {
    return this.hp;
  }

  public int getAttack() {
    return this.attack;
  }

  public int getDefense() {
    return this.defense;
  }

  public final boolean isAlive() {
    return this.hp > 0
  }

  public void attack(Monster target) {
    // 비어있음 - 몬스터마다 다른 방법으로 공격 => 상속해서 오버라이딩
  }

  // attack 안에서만 호출 - public이면 아무나 체력 깎을 수 있어서
  protected void inflictDamage(int amount) {
    this.hp = Math.max(0, this.hp - amount)
  }
}
```

### Troll

```java
public final class Troll extends Monster {
  public Troll(int hp, int attack, int defense) {
    super(hp, attack, defense);
  }

  // 무조건 inflictDamage 호출을 강제해야 하는데 어떻게?
  // 다형성을 너무 크게 잡은거
  public void attack(Monster target) {
    int damage = target.getHp() - (this.getAttack() - target.getDefense() / 2)
  }
}
```

- attack을 final로 바궈서 강제하고 attack안에서 calculateDamage 호출도 강제 => attack에 오버라이딩 못함
- calculate라는 새로운 메서드를 만들어서 그걸 오버라이딩

```java
public int calculateDamage(Monster target) {
  return 0
}
```

### 기대만 하면 말대로 안할 수도 있음

- 구현을 안해버리면? : return 0인 데미지 메소드를 계속 사용할 것
- 자식이 다형적으로 고쳐주겠지 => 그러나 자식이 구현하지 않으면 부모가 원했던 기능이 완성이 안됨
- 구현이 없는 메서드 : 시그니처는 있는데 함수 속 코드는 없음
- 동작이 일부라도 구현되지 않은 클래스는 실체가 완성되지 않은 클래스 : 다른 말로 하면 구체적이지 않음 => 이 클래스는 어느정도 추상적이라고 말할 수 있음

```java
// 추상 클래스 => 얘는 객체를 못만듦 그리고 그렇게 강요하게끔
public abstract class Monster {
  // 추상 메서드 => 무조건 자식에서 구현해야한다
  public abstract int calculateDamage(Monster target);
}

// 이제 말 잘들어야함
```

- 개체를 안 만들 클래스 : 부모에 공통적인 모든것을 정의해놔서 추상화를 해서 불완전한 거고 개념적인 것. 굳이 객체를 만들 필요가 없음
- 여기서 Monster는 추상적인 클래스
- UML에서는 이탤릭으로 표시함

### 추상 클래스 메서드로 문제 고치기

- 추상 클래스 : 인스턴스를 만들 수 없는 클래스. 인스턴스를 만들 수 있는 클래스는 구체 클래스
- 다른 클래스의 부모 클래스가 될 수는 있음
- 반드시 추상 메서드가 들어있을 필요는 없음 메서드 구현이 없을수도 있음. 없으면 무조건 그러니까 추상 클래스
- 키워드는 접근제어자 뒤에
- 재사용을 위해서만 만든것은 추상 클래스로 만드는것이 맞다
