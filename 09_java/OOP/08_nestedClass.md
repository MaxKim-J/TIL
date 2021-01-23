# 08_내포 클래스

## 정의

- 클래스 안에 다른 클래스가 들어가있는 모습
- 안에 들어있는 클래스를 내포 클래스라고 함
- 쵸큼 특수한 경우

## 종류

- 비정적 내포 클래스 == 내부 클래스
- 정적 내포 클래스(스태틱이 붙어잇음) : 정적 클래스는 내부에서만 사용할 수 있음이 보장된다

## 용도

- 서로 연관된 클래스를 그룹지을 수 있음 : 패키지로 같이 둘수도 있지만 클래스 속에 넣는 것이 더 긴밀한 그룹이 됨. 관련있는 클래스 그룹짓기 => 내포 클래스로 선언하면 더 명확해짐
- 내포 클래스는 바깥 클래스의 private 멤버에 접근이 가능 : 그 반대의 경우는 불가능(스코프 채이닝처럼)
- 한 클래스의 인스턴스가 어떠한 다른 클래스의 내부에서만 사용되는 경우 바깥에 둘 이유가 좀 줄어든다.

## 비정적 내포 예제

```java
// 레코드는 하나만 있는데, 읽는걸 여러개로 만들고싶음

// 비정적 내포 클래스
public class Record {
  private final byte[] rawData;

  // 생성자
  public Record(byte[] rawData) {
    this.rawData = rawData;
  }

  // 안에다가
  // 얘는 생성자가 없음
  public class Reader {
    private int position;

    public boolean canRead() {
      // rawData를 사용할 수 있음(바깥 클래스의 private)
      return this.position < rawData.length;
    }

    public byte readByte() {
      return rawData[this.position++];
    }

    public String readSignature() {
      ...
    }
  }
}

// main
Record record = new Record(fileData);

// .new 희한하네 
// 이 인스턴스들은 각각 다 fileData에 접근 가능함
// private 변수는 각자
Record.Reader reader0 = record.new Reader()
Record.Reader reader1 = record.new Reader()

if(reader0.canRead()) {
  System.out.println(reader0.readByte())
}

System.out.println(reader1.readSignature())
```

- 클래스 이름이 짧아짐(.)
- 패키지 접근제어자보다 강한 캡슐화 : 패키지의 모든 클래스들이 읽지 못하고 특정한 클래스에서만 사용 가능
- 괴랄한 개체 생성 : 언제나 record 개체로부터 reader을 생성 가능함. 따라서 record.new. 어떻게든 record랑 연결이 되어있음

## 정적내포

```java
public class Record{
  private final byte[] rawData;

  public Record(byte[] rawData) {
    this.rawData = rawData;
  }

  // 스태틱
  public static class Reader {
    // 생성자에서 받아서 넣어줌
    private final Record record;
    private int position;

    // 개체에서 상위 클래스의 Private에 접근을 못하기때문에 인자로 넣어줘야함
    public Reader(Record record) {
      this.record = record;
    }

    // 여기도 마찬가지. 생성자에서 인자로 넣어준 record 바탕으로 읽음
    public boolean canRead() {
      return this.position < this.record.rawData.length;
    }
  }
}

Record record = new Record(fileData);

// 조금더 직관적 => 괴랄하게 생성자 안써도 됨 클래스에서 꺼내쓸수있어서
Record.Reader reader0 = new Record.Reader(record);
Record.Reader reader1 = new Record.Reader(record);

if (reader0.canRead()) {
  System.out.println(reader0.readByte());
}

System.out.println(reader1.readSignature());
```

- 스태틱 클래스라는 의미는 아니고. 바깥 클래스의 레퍼런스가 없다는 의미
- private의 의미를 더 잘 유지할 수 있다 그 클래스에서만 접근할 수 있기 때문에.. 견고하게 멤버변수의 캡슐화를 유지할수있음
- 바깥 클래스의 정적 변수에는 접근할 수 있음 => private이나 이런건 안됨
- 내포 클래스가 아닌 경우에는 Protected와 private을 못붙임. 내포클래스는 허용
- 근데 생각보다 잘 사용안함. 그냥 클래스마다 파일을 만드는게 좋은듯. 그거까지는 과하다 이런식으로 생각하는 느낌도 이씀