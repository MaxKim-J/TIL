# 01_java Map

## Map

- `key:value`의 쌍 값을 저장할 수 있는 자료구조. 대응관계를 쉽게 표현할 수 있는 자료형
- 리스트나 배열처럼 순차적으로 해당 요소값을 구하지 않고 key를 통해 value를 얻는다. map의 가장 큰 특징은 key로 value를 얻어낸다는 것.
- 자바에서의 Map은 **인터페이스**다. HashMap, LinkedHashMap, TreeMap은 이 인터페이스를 구현한 클래스인것이다.
- 값은 중복 저장될 수 있지만 키는 그럴 수 없다.

## HashMap

[Java HashMap은 어떻게 동작하는가?](https://d2.naver.com/helloworld/831311)

- Java Collections Framework에 속한 구현체 클래스
- 해싱을 사용한 맵으로, 많은 양의 데이터를 검색하는데 있어 성능이 더 좋다
- 해시함수를 통해 키와 값이 저장되는 위치를 결정하므로, 사용자는 그 위치를 알 수 없고, 삽입되는 순서와 들어있는 위치 또한 관계가 없음.
- 해시맵은 저장공간보다 값이 추가로 들어오면 List처럼 저장공간을 추가로 늘리는데, List처럼 저장공간을 하나씩 늘리는게 아니라 약 두개로 늘림. 
- 초기에 저장할 데이터의 개수를 알고 있다면 Map의 초기 용량을 지정해주는게 좋음

```java
// 키와 value의 타입

HashMap<String,String> map6 = new HashMap<String,String>(){{//초기값 지정
    put("a","b");
}};
HashMap<String, String> myDictionary = new HashMap<String, String>();

map.put("people", "사람");
map.put("baseBall", "야구");
```

### 해시테이블 작동 원리 적용

- 완전 해시 함수 : 충돌이 없는 해시함수
- 오픈 어드레싱이 아니라 separate chaining 방식을 사용한다. 오픈 어드레싱은 해쉬의 각 칸에 연속된 자료구조를 탐색하지 않아도 되기때문에 캐싱 효율이 좋다. 하지만 일정 개수 이상으로 많아지면 Open Addressing이 충돌이 더 많아 Separate Chaining보다 느려짐.
- 충돌이 잘 발생하지 않도록 조정할 수 있다면 worst case에 가까운 일이 발생하는 것을 줄일 수 있음.
- 데이터의 개수가 많아지만 링크드 리스트 대신 트리를 사용해 Separate Chaining을 한다. => 이걸 선택하는 기준은 하나의 해시 칸에 할당된 키-값 쌍의 개수(8개)
- 해시 칸 수가 적다면 메모리 사용을 아낄 수 있지만 해시 충돌로 인한 성능상 손실이 발생한다. 그래서 해쉬맵은 키-값 쌍이 일정 개수 이상이 되면, 해시 버킷의 개수를 두배로 늘린다. 기본값은 16이고, 데이터의 개수가 임계점에 이를때마다 버킷 개수의 크기를 두배씩 증가시킨다. 
- 지금은 일단 여기까지만 알자...

### capacity, load factor

- hashMap 생성자가 받는 인자 두개
- capacity : 해쉬 버킷(한 칸)의 크기. 해쉬함수를 모드하는 피연산자(separate chaining)
- load factor : 해쉬 버킷 한 공간에 저장된 데이터의 수를 **평균적으로** 나타내는 비율
- 한 해쉬맵 객체에 저장된 데이터의 수 == capacity * load_factor
- 앞에서 살펴봤는데 해쉬맵은 데이터의 크기가 커질수록 버킷의 수를 늘려버리는데 그걸 두배씩 늘린다.
- 버킷 크기를 늘리는 시점이 바로 `load factor == 저장된 데이터 수 / capacity`가 될 때
- 로드 팩터가 작으면 그만큼 capacity가 더 자주 커지므로 메모리는 많이 차지하지만, 검색 속도가 빨라짐
- 로드 팩터가 크면 그만큼 capacity가 덜 자주 커지므로 검색 속도가 느려짐
- separate chaining은 탐색 속도가 open addressing보다 많이 걸리는데, 대신에 충돌이 좀 적게 발생함 => 버켓 자체가 많으면 버켓 내부의 리스트 인덱스가 값이 적을테니 탐색 속도가 빨라진다
- 메모리는 좀 많이 잡아먹어도 괜찮으니 검색 속도가 빨랐으면 한다 => 로드 팩터를 작게 설정
- 해쉬맵에 저장될 데이터의 수가 짐작이 가능하다면 될 수 있으면 객체를 생성할때 capacity를 그 값에 맞게 설정해주는게 좋음 => capacity를 증가하는 조정 작업에서는 기존에 저장되어있는 모든 데이터의 `해쉬값 % capacity`를 죄다 다시 계산해야하므로 부하가 엄청남.

### methods

#### put()

```java
HashMap<String, String> map = new HashMap<String, String>();
map.put("people", "사람");
map.put("baseball", "야구");
```

key와 value쌍을 맵에 넣는다.

#### get()

```java
System.out.println(map.get("people"));
```

key에 해당하는 value 값을 얻는다.

#### containsKey(), containsValue()

```java
System.out.println(map.containsKey("people"));
```

해당 키가 있는지를 조사하여 그 결과값을 리턴한다. value는 값 

#### remove()

```java
System.out.println(map.remove("people"));
```

key에 해당하는 아이템 쌍을 삭제한 후 그 value 값을 리턴한다.

#### size()

```java
System.out.println(map.size());
```

Map의 키값 쌍 개수를 리턴한다.

#### 순회 

```java
for(Integer i : map.keySet()){ //저장된 key값 확인
    System.out.println("[Key]:" + i + " [Value]:" + map.get(i));
}
```

#### 그외

- clear : 비우기
- putAll(다른맵인스턴스) : 다른 맵 인스턴스의 데이터들을 호출한 맵으로
- clone: 복제

## TreeMap

- 이진트리를 기반으로한 Map 컬렉션
- TreeMap은 키와 값이 저장된 Map, Entry를 저장함. 
- TreeMap에 객체를 저장하면 자동으로 정렬됨 **키**는 저장과 동시에 자동 오름차순으로, 숫자 타입일 경우에는 값으로, 문자열 타입일 경우에는 유니코드로 정렬
- TreeMap은 일반적으로 Map으로써의 성능이 HashMap보다 떨어짐, TreeMap은 데이터를 저장할때 즉시 정렬하기 때문에 추가나 삭제가 HashMap보다 오래걸림.
- 하지만 정렬된 상태로 Map을 유지해야 하거나, 정렬된 데이터를 조회해야 하는 범위 검색이 필요한 경우 TreeMap이 효율성 면에서 좋음

### 레드블랙트리(ㄷㄷ)의 원리 적용

- 이진탐색트리의 문제점을 보완한 레드-블랙트리로 이루어져 있음. 
- 얘는 대표적인 균형이진탐색트리로, 리프의 depth와는 상관없이 모든 탐색에 대해 비교적 균일한 탐색 시간을 보장함. 

### methods

- HashMap과는 다르게 선언시 크기 지정이 안된다.

```java
// TreeMap생성
TreeMap<Integer,String> map1 = new TreeMap<Integer,String>();
// new에서 타입 파라미터 생략가능
TreeMap<Integer,String> map2 = new TreeMap<>();
//map1의 모든 값을 가진 TreeMap생성
TreeMap<Integer,String> map3 = new TreeMap<>(map1);
TreeMap<Integer,String> map6 = new TreeMap<Integer,String>(){{//초기값 설정
    put(1,"a");
}};
```

- 구조만 해쉬맵과 다를 뿐이지 기본적으로 Map 인터페이스를 같이 상속받고 있으므로 기본적인 메소드는 해쉬맵과 동일함. 

#### (요거만 살짝 다름) firstEntry, firstKey, lastEntry, lastKey

트리맵은 해쉬맵과 달리 항상 정렬이 되어있기 때문에 저걸로 최솟값, 최댓값, 최소값 엔트리, 최대값 엔트리를 구할 수 있게 됨