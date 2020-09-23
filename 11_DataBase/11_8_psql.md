# posgteSQL

개괄적인 내용, 개념, 쿼리 작성법 대충 정리  
뭔가 또 발견하면 또 적자

## 개괄

- 오픈소스 DMBS
- 객체관계형 데이터베이스 시스템(ORDBMS)
- 관계형 DBMS의 기본적인 기능인 트랜잭션, ACID 지원함

## 내부 구조

- 클라이언트는 인터페이스 라이브러리를 통해 서버와의 연결을 요청하면
- Postmaster 프로세스가 서버와의 연결을 중계한다. 이후 클라이언트는 할당한 서버와의 연결을 통해 질의를 수행한다.
- 클라이언트로부터 질의 요청이 들어오면 구문 분석을 통해 parse tree를 생성하고 의미 분석 과정을 통해 새로운 트랜잭션을 시작하고 쿼리 트리를 생성한다.
- 이후 서버에 정의된 룰에 따라 쿼리 트리가 재생성되고 실행 가능한 여러 수행 계획 중 가장 최적화된 플랜 트리를 생성한다.
- 이를 수행하여 요청된 질의에 대한 결과를 클라이언트로 전달하게 된다
- 서버의 쿼리 수행 과정에서는 데이터베이스 내부의 시스템 카탈로그가 많이 사용되는데, 사용자가 함수나 데이터 타입은 물론 인덱스 접근 방식및 rule을 시스템 카탈로그에 직접 정의할 수 있음
- postgreSQL에는 이것이 기능을 새로 추가하거나 확장하는데 있어 중요한 포인트로 활용된다
- 데이터가 저장되는 파일들은 여러개의 페이지들도 구성되며, 하나의 페이지는 확장 가능한 slotted page 구조를 가진다.

![구조](https://d2.naver.com/content/images/2015/06/helloworld-227936-8.png)

## 시스템 명령어

### stop, start

```shell
brew services stop postgresql
brew services start postgresql
```

### 접속, 로그인, 유저 전환

```shell
# 시작과 동시에 접속할 유저, 디비이름, 호스트까지
psql -U confluence[유저네임] -d confluencedb[디비이름]  -W[패스워드 사용] -h localhost[연결할 호스트]
```

```shell
#특정 아이디로 접속
psql -U postgres

#특정 디비로 접속
\c dbname
# 전체 데이터베이스 인스턴스 목록
\list
# 특정 테이블의 상세 정보를 조회 
\d
#전체 유저 목록
\du
# 현재 접속한 DB 인스턴스의 릴레이션들 조회
\dt
# 현재 접속한 DB 인스턴스의 function list 조회
\df
# 이전에 실행한 쿼리와 동일한 쿼리 실행
\g
# 전체 실행 내역 나열
\s
# 쿼리 결과 display 설정
\x, \a, \H
# 종료
\q
```


### 디비 만들기, 유저 만들기

- 유저 이름과 제목이 같은 테이블이 하나는 있어야함(postgres가 기본 계정인것처럼)
- 기본적으로 터미널의 유저 계정과 같은 이름으로 접속(psql 아무 옵션 없이 진입했을 때)

```sql
CREATE DATABASE maxmax;
CREATE DATABASE maxmax OWNER jonghyukkim;
CREATE DATABASE confluencedb OWNER confluence ENCODING 'utf-8';
\c maxmax

-- 디비 오너 바꾸기
ALTER DATABASE dbname OWNER TO username;

-- 기본 계정 postgtes로 접속하는 거
sudo -i -u postgres
CREATE ROLE brown WITH PASSWORD 'brown' SUPERUSER;
-- 이러면 비밀번호 없이 접속 가능
CREATE ROLE jonathan LOGIN;
-- 디비 생성 권한, 유저 생성 권한
CREATE ROLE admin WITH CREATEDB CREATEROLE;
-- 유저 목록
\du

--- 유저 권한, 패스워드 변경
ALTER ROLE jira WITH PASSWORD 'password';
ALTER ROLE ffff WITH CREATEROLE;
```



### 테이블, 릴레이션, CRUD와 SELECT 예제

#### create

- Date, Char, Number, varchar, char 등등

```sql
-- 테이블 만들기
create table student
(
  -- 칼럼
  name varchar(100) null comment '이름',
  student_num varchar(11) null comment '학번',
  birth_dt varchar(6) null comment '생년월일',
  gender varchar(1) null comment '성별',
  entrc_year varchar(4) null comment '입학년도',
  mobile varchar(11) null comment '전화번호',
  major_cd varchar(3) null comment '학과코드'
  -- 관계
  CONSTRAINT PLAYER_PK PRIMARY KEY (PLAYER_ID),
  CONSTRAINT PLAYER_FK FOREIGN KEY (TEAM_ID) REFERENCES TEAM(TEAM_ID)
)
  -- 주석, 포맷팅
  comment '학생정보' charset=utf8;
```

#### insert

```sql
INSERT INTO class.student (name, student_num, birth_dt, gender, entrc_year, mobile, major_cd)
VALUES ('데미안', '16971504', '941112', 'M', '2016', '01010523220', '103');
```

#### select

```sql
--테이블의 전체 투플 선택
SELECT * FROM class.student;

-- 테이블의 특정 투플 선택
SELECT name, gender, mobile FROM class.student;

-- 테이블의 특정 투플 + 조건 + 정렬
SELECT name, gender, mobile FROM class.student WHERE gender='M';
SELECT name, gender, mobile FROM class.student WHERE gender IS NOT NULL;
SELECT * FROM class.student WHERE gender ='M' and entry_year=2017;
SELECT * FROM class.student WHERE major_cd = 103 ORDER BY entry_year DESC;
SELECT exam_seq, avg(math) FROM class.exam_result GROUP BY exam_seq;
```

#### alter, update

- alter은 테이블의 정보를 변경, update는 칼럼의 정보를 변경
- update는 수정할 튜플을 where등으로 최대한 특정하는게 좋다

```sql
-- 칼럼추가
ALTER TABLE books ADD publication date;

-- 칼럼 삭제
ALTER TABLE books DROP publication;

-- 칼럼 default 추가
ALTER TABLE books ALTER COLUMN id SET DEFAULT nextval('book_id');

-- 테이블 이름 변경
ALTER TABLE books RENAME TO literature;

-- 튜플의 칼럼 업데이트
UPDATE cust_master SET age = 40, joindate = '2020-06-20' WHERE id = 3;
```

#### delete, truncate

```sql
DELETE FROM cust_master WHERE id = 1;

-- Delete all rows
DELETE FROM cust_master;
TRUNCATE cust_master;
```

- 차이점: truncate은 롤백할수가 없다

### 트랜잭션

- 트랜잭션에 대한 복습: 트랜잭션의 필수 요소는 여러 단계의 작업을 전부하거나 혹은 전부 안하는 개념의 연산. 여러개의 쿼리를 단일 작업으로 묶는 것을 뜻함
- 단계들간의 중간 상태는 다른 동시처리 트랜잭션에서는 볼 수 없으며 트랜잭션을 완료할 수 없게 하는 일부 오류가 발생하면, 모든 단계들은 **전혀 데이터베이스에 영향을 미치지 않게 된다**
- 철수가 자기 통장에서 백원 꺼내서 영희 통장에 100원 입금한다 치면, 데이터베이스에 뭔가 오류가 생겨서 백원이 출금되었는데 영희 통장에 입금이 안되는 경우가 발생하면 안되고, 오류가 생겼을때는 그 모든 과정이 단 하나라도 처리되서는 안되는 것
- **연산 중 어떤 문제가 발생한다면, 지금까지 실행된 모든 단계가 효력이 발생하지 않을 것이라는 보장이 필요하다**
- postgres에서 되돌리기 기능은 별도로 존재하지 않으니 롤백할 가능성이 있는 작업은 무조건 트랜잭션을 사용해야함
- 트랜잭션 취소 : 시스템이 다운되거나, 사용자가 롤백한 경우. 시스템이 다운된 경우 다시 트랜잭션을 시작해도 여전히 실패할 가능성은 존재함.ㅈ

```sql
-- 스크립트를 하나 짠다고 생각하면 좋다
-- cli임을 잊지말자,,,
BEGIN;

DROP TABLE IF EXISTS ALPHA;
CREATE TEMP TABLE ALPHA AS;
SELECT 'ALPHA' AS AA, 'STAR' AS BB;
SELECT * FROM ALPHA;
-- 에러가 있을 경우, 사용자가 입력할 경우 트랜잭션 블록의 처음으로 돌아가 제어를 다시 시작한다
ROLLBACK;
COMMIT;

BEGIN;
UPDATE accounts SET balance = balance - 100.00 WHERE name = 'Alice';
SAVEPOINT my_savepoint;
UPDATE accounts SET balance = balance + 100.00 WHERE name = 'Bob';
-- oops ... forget that and use Wally's account
ROLLBACK TO my_savepoint;
UPDATE accounts SET balance = balance + 100.00 WHERE name = 'Wally';
COMMIT;

-- 요렇게도 가능
BEGIN
   IF EXISTS (SELECT FROM orders) THEN
      DELETE FROM orders;
   ELSE
      INSERT INTO orders VALUES (1,2,3);
   END IF;
END
```