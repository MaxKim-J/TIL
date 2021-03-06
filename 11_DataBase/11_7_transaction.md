# 트랜잭션

- 데이터베이스는 다수의 사용자가 동시에 사용하더라도 항상 모순이 없는 정확한 데이터를 유지해야함 복구도 빨라야 함
- 데이터베이스 관리 시스템은 데이터베이스가 항상 정확하고 일관된 상태를 유지할 수 있도록 다양한 기능을 제공하는데, 그 중심에 트랜잭션이 있음

## 개념

- 트랜잭션이란 하나의 작업을 수행하는데 필요한 데이터베이스의 연산을 모아놓은 것, 데이터베이스에서 논리적인 작업의 단위
- 데이터베이스에서 장애가 발생했을 때 데이터를 복구하는 작업의 단위가 되기도 함
- 작업의 정상적인 실행 보장하기 위해서는 오류시 모든 문장이 정상적으로 실행되거나, 모두 실행되지 않아야 한다
- 이게 결국 명령문들을 묶어야 하는 니즈와도 연결되는데, 서로 의존되어 있는 작업을 묶어서 같이 진행하든 모두 진행하지 않든 트랜잭션으로 정의하고 관리해야 한다
- 일반적으로 데이터베이스를 변경하는 INSERT, DELETE, UPDATE문의 실행을 트랜잭션으로 관리한다

## 트랜잭션의 특성

- 트랜잭션이 성공적으로 처리되어 데이터베이스의 무결성과 일관성이 보장되려면 네 가지 특성을 꼭 만족해야 한다(ACID)

### 1. 원자성(atomicy)

- 트랜잭션을 구성하는 연산들이 모두 정상적으로 실행되거나 하나도 실행되지 않아야 한다
- 트랜잭션을 수행하다가 장애가 발생하여 작업을 완료하지 못했다면, 지금까지 실행한 연산 처리를 모두 취소하고 데이터베이스르르 트랜잭션 작업 상태 전으로 되돌려 원자성을 보장

### 2. 일관성(consistency)

- 트랜잭션이 성공적으로 수행된 후에도 데이터베이스가 일관된 상태를 유지해야 한다
- 전에도 일관 후에도 일관. 수행되는 과정에서는 일관되지 못할수도 있지만 완료된 후에는 일관된 상태 유지해야함

### 3. 격리성(isolation)

- 현재 수행 중인 트랜잭션이 완료될 때까지 트랜잭션이 생성한 중간 연산 결과에 다른 트랜잭션들이 접근할 수 없음을 의미
- 데이터베이스 시스템에서는 여러 트랜잭션이 동시에 수행되지만 각 트랜잭션이 독립적으로 수행될 수 있도록 중간 연산 결과에 접근하지 못함
- 마치 콜스택처럼 하나하나 실행하고 제거

### 4. 지속성(durability)

- 트랜잭션이 성공적으로 완료된 후 데이터베이스에 반영한 수행 결과는 어떠한 경우에도 손실되지 않고 영구적이어야 함
- 시스템에 장애가 발생하더라도 트랜잭션 작업 결과는 없어지지 않고 데이터베이스에 그대로 남아 있어야 함
- 트랜잭션의 지속성을 보장하려면 시스템에 장애가 발생했을 때 데이터베이스를 원래 상태로 복구하는 회복 기능이 필요

### 트랜잭션 특성을 보장하기 위해

- DBMS는 회복과 병행 제어라는 기능을 제공한다

## 트랜잭션 연산

- commit : 트랜잭션의 수행이 성공적으로 완료되었음을 선언하는 연산. commit이 실행된 후에애 트랜잭션의 수행 결과가 데이터베이스에 반영되어 데이터베이스가 일관된 상태를 지속적으로 유지
- rollback : 트랜잭션의 수행이 실패했음을 선언하는 연산. rollback연산이 실행되면 트랜재션이 지금까지 실행한 연산의 결과가 취소되고 트랜잭션이 수행되기 전의 상태로 돌아감

## 트랜잭션 상태

- 트랜잭션은 활동, 부분완료, 실패, 완료, 철회의 다섯가지 상태 중 하나에 속하게 됨
- 트랜잭션이 수행되기 시작 -> 활동
- 트랜잭션의 마지막 연산을 처리하고 나면 -> 부분 완료 상태
- 부분 완료 상태의 트랜잭션이 commit 연산을 수행하면 -> 완료
- 활동 상태나 부분 완료 상태에서 여러 원인으로 인해 더는 수행이 불가능하게 되면 트랜잭션은 실패상태가 됨
- 실패 상태의 트랜잭션은 rollback 연산의 실행으로 철회 상태가 됨

### 활동

- 트랜잭션이 수행되기 시작하여 현재 수행 중인 상태
- 상황에 따라 부분 완료 혹은 실패 상태가 됨

### 부분 완료 

- 트랜잭션의 마지막 연산이 실행된 직후의 상태
- 트랜잭션 연산의 모든 처리가 끝났지만 트랜잭션이 수행된 최종 결과를 데이터베이스에 아직 반영하지 않았음
- 따라서 아직은 성공적으로 완료되었다고 볼 수 없음 실패 상태 될 수 있음

### 완료

- 트랜잭션이 성공적으로 완료되어 commit 연산을 실행한 상태
- 트랜잭션이 완료 상태가 되면 트랜잭션이 수행한 최종 결과를 데이터베이스에 반영하여 데이터베이스가 새로 일관된 상태가 되면서 트랜잭션 종료

### 실패

- 하드웨어, 소프트웨어 문제, 트랜잭션 내부의 여러 이유로 인해 장애가 발생하여 트랜잭션의 수행이 중단된 상태

### 철회

- 트랜잭션 수행이 실패하여 rollback 연산을 실행한 상태
- 트랜잭션이 철회 상태가 되면 지금까지 실행한 트랜잭션의 연산을 모두 취소하고 트랜잭션이 수행되기 전의 데이터벵;스 상태로 되돌리면서 트랜잭션이 종료
- 철회 상태로 종료된 트랜잭션은 상황에 따라 다시 수행되거나 폐기