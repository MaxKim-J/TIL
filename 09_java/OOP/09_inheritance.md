# 09_상속

어려워지는 부분. 객체지향언어 고유의 개념  

## 개념

- 거의 모든 사람들이 OOP의 핵심이라 여기는 특성
- OOP의 다른 중요한 특성인 다형성의 기반
- 부모의 특징을 받는다는 의미 약간 유전에 의미가 더 가까움(biological inheritance). 뭔가 재물이나 물질을 받는다는 개념이 아님
- 이미 존재하는 클래스를 기반으로 새 클래스를 만드는 방법. 원래 있던 클래스에 기반해 새로운 클래스를 만든다
  - 새 클래스는 기존 클래스의 동작과 상태를 그대로 물려받음(유전)
  - 그외에 새 클래스만의 동작과 상태를 추가 가능(진화)
  - 물론 이 새 클래스를 상속해서 또 다른 클래스를 만들 수 있음
  - 부모, 자식/ 기반, 파생
  - is - a 관계 : 자식 클래스가 부모 클래스의 한 종류이다.
- 비슷한 클래스의 중복되는 코드 한번만 사용할 수 있도록 함
- 중복이 많은 이유 : 공통분모가 있기 때문, 공통된 특성이 있기 때문

## 생성자 호출 순서

- 생성자가 개체를 초기화시켜주는데 상속된 클래스는 부모부분과 자식부분으로 나누어져있음
- 부모부분의 초기화는 부모의 생성자가 담당하고 자식은 자식이 담당할 거. 초기화가 둘다 일어나야하는데 어떻게?
- 부모부터 초기화가 일어남(부모님이 먼저 식사를 하는...)
- 순서 : 메모리에 개체 생성 -> 부모 생성자 호출 -> 자식 생성자 호출
- 자식의 생성자에서 어떻게 부모 생성자를 호출할지 정해줘야함 => 그리고 부모도 생성자가 여러개가 있을 수 있음
- 컴파일러가 알아서 생성자 호출 : 정해져있지 않을 경우. 부모 클래스의 **매개변수가 없는** 생성자를 호출한다(근데 매개변수 없는 생성자 안씀)
- 근데 부모 클래스의 생성자가 인자가 있는것만 있는 경우 자동으로 컴파일러는 초기화를 해주지 않음
- super을 쓰고, 적절한 매개변수를 전달한다

```java
public class Person {
  public Person(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}


public class Student extends Person {
  public Student(String firstName, String lastName) {
    super(firstName, lastName)
  }
}
```

## super()

- 상속받는 개체에서 부모님의 부분
- 부모의 생성자, 멤버변수나 메서드를 호출할때도 사용한다.
- 부모는 자식을 호출할 수 없다(특정이 안되기 때문에)
- 자식의 초기화는 super로 부모를 초기화 한 후 이루어져야한다.
- 오버로딩 가능

```java
public class Teacher extends Person {
  private Department department;

  public Teacher(String firstName, String lastName, Department department) {
    // 순서가 이래되어야함
    super(firstName, lastName);
    this.department = department;
  }
}
```

## 부모 클래스의 독립성, 접근

- student를 2개의 클래스로 나눈게 아님 + Person그 자체로도 사용 가능함
- Person 개체는 student 멤버에 접근 불가능
- 자식에서 부모는? => 상속받은 특정 개체만 어떤 멤버변수를 수정하고 싶다면 **protected**를 사용하면 된다.
- protected: 외부자들은 접근 못하고 클래스 내부, 같은 패키지에 속한 클래스, 자식 클래스만 접근이 가능하다. 클래스의 경우 내포된 클래스에 한해 붙일 수 있다.

```java
// teacher 개체만 이메일 주소를 변경할 수 있도록 하고싶을 때

public class Person {
  protected String email;
  ...
}

public class Teacher extends Person {
  ...
  public void setEmail(String email) {
    // this여도 상관은 없음 - super라면 좀더 명백한듯
    super.email = email;
  }
}
```

- 클래스 상속 트리의 위로 올라갈수록 일반적(모두를 어우르는 개념), 내려갈수록 특징적이고 구체적(특정하구 구체적인것을 가리킴)

## is-a/has-a

- is-a : 부분집합 관계. 부모 클래스를 상속받는 개체는 부모 클래스에 포함이 되어있다. 학생은 사람이다. 시간강사는 선생이다. => 스스로 존재
- has-a : 컴포지션 관계. 어떤 클래스에서 다른 클래스를 가지고 있는 경우 => 사용되는 부모에 의존적. 부모 밖으로 나가면 의미없는 경우
- 둘다 재사용을 위한 방법. 상속으로 해결할 수 있는 많은 문제를 컴포지션으로도 가능
- 하나를 고르는거 큰 결정사항
- 지금은 실생활에서 개체들기리의 관계를 기준으로 선택할 것(has-a:컴포지션, is-a:상속)

## 실제 프로그래밍에서의 is-a

- 부모 타입으로 자식 타입의 개체를 선언 가능함
- 이게 가능한 이유는 두 클래스간의 관계가 Is-a이기 때문이다. 굉장히 시맨틱함
- 그 반대는? 자식 타입으로 부모 타입 선언은 불가능 => 컴파일 안됨(incompatible type)

```java
public static Student convertToStudent(Person person) {
  Student student = person;
  return student
}
```

- 부모를 자식에게 대입할 수 있게 되면 실행 중에 무조건 Student만 들어온다는 보장이 없어짐. person을 상속한 어떤 개체라도 들어올 수 있게 되어 정적타이핑의 의미가 매우 떨어짐. 그래서 컴파일러가 막아줌
- 자식을 부모에 대입한 뒤 부모에서 자식의 메서드를 호출하는 것도 안됨 => 자식 개체에서 부모 개체 메서드는 호출이 가능

## 인스턴스간 형변환

- 사실 부모 타입에 자식 개체를 대입하는게 되는 이유는 묵시적 형변환이 일어나기 때문이다. int를 long에 넣어줄 수 있듯

```java
// 굳이 써주자면 이런 느낌
Student student = new Student()
Person person = (Person)student;
```

- 이 반대의 캐스팅, 부모를 자식에 대입하기 위해서는 무조건 명시적으로 해줘야된다.

```java
Student student = new Student("Leon","kim");
Person person = student;

Student actuallyStudent = (Student)person;
```

- 전혀 상관없는 클래스로 캐스팅을 하면 잡힘
- Person은 Student일 수 있으니 컴파일러가 허용하지만, Teacher은 Student일리 없으니 허용 안함. 형제자매간의 캐스팅은 할 수 없음
- 위아래로 왔다갔다는 되는데 옆으로는 안됨
- 상속 구조상 말이 안되는 경우 오류를 발생시킴
- 컴파일러가 못잡아 주는 경우도 있음 - 상속구조는 말이 되는데 뭔가 하자있는 경우

```java
// 이거는 문제없는데
Person person = new Student('leon', 'kim');
// 요기는 컴파일이 아니라 실행중에 에러가남
Teacher teacher = (Teacher)Person
```

## instanceof, 예외처리

```java
// 얘를 컴파일간에서 오류를 잡아주고 싶다면
Person person = new Student("leon", "kim");

// 1. Person 객체가 실제로는 Teacher인지 확인해야하고
// 2. 실제로 Teacher면 캐스팅함
Teacher teacher = (Teacher) person;]

// 특정 클래스의 인스턴스인지 여부를 판단하는 instanceof
System.out.println(person instanceof Student);
System.out.println(person instanceof Teacher);
```

```java
Person person0 = new Student("Leon", "kim");
Person person1 = new Teacher("Pope", "kim", Department.COMPUTER_SCIENCE);

Teacher teacher = null;
// 안됨 => Null로 유지
if(person0 instanceof Teacher) {
  teacher = (Teacher)person0
}

// 됨 => 캐스팅되서 대입
if(person1 instanceof Teacher) {
  teacher = (Teacher)person1
}
```

- 그런데 instanceof 연산자는 반드시 특정 클래스의 인스턴스 인지를 보여주는것은 아님. 손주를 사용한다면 부모 클래스로 검사해도 무조건 true가 됨 딱 맞는건 아님

