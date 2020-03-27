# 자바 배열

2020.03.27

## 어떻게 만드나

뭐 딱히 별건 없는데 좀 다르다  
배열의 끝이 어디까진지를 명시해야한다  
다른 언어와 비슷하게 배열의 첨자는 0부터 시작한다  
배열을 선언하기만 하고 초기화하지 않으면 모두 0이 들어가있다

```java
// 3개의 변수를 담은 정수형 배열
int aa[] = new int[4];
aa[0], aa[1]

// 정수형 배열 aa 선언 후 배열할당
int[] aa;
aa = new int[4]

// 초기화 - 정의하는 동시에 값 대입
// 특이하게 브라켓을 쓴다
int aa[] = {100,200,300,400}

int aa[];
aa = new int[]{100,200,300,400};

// 길이
count = aa.length // 4
```

## 반복문과 활용예제

```java
public class array_example{
    public static void main(String[], args){
        int[]aa = new int[100];
        int bb[] = new int[100];
        int i;

        for (i=0;i<100;i++) {
            aa[i] = i*2;
        }

        for (i=0;i<100;i++) {
            bb[i] = a[100-i];
        }

        System.out.printf("bb[0]는 %d, bb[99]는 %d입력됨", bb[0], bb[99]);
    }
}
```

## 2차원 배열

이것도 별 다른건 없슴. 가로세로 인덱스를 정의해줘야 하구.  
*행 *열의 2차원 배열

```java
int[][] a = new int[3][4];
int i, k;
int val = 1;

// 순회
for (i=0;i<3;i++) {
    for (k=0;k<4;k++) {
        aa[i][k] = val;
        val++;
    }
}

// 초기화
int[][] aa = {
    {1,2,3,4},
    {5,6,7,8},
    {9,10,11,12}
}

// 동적 할당
Scanner s = new Scanner(System.in);
row = s.nextInt();
col = s.nextInt();
int [][]aa = new int[row][col]
```

### 뭔가 메소드 비슷한게 있을거같긴 함;;
