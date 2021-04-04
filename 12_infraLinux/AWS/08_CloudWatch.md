# CloudWatch

리소스의 상태를 모니터링하는 클라우드워치  
모니터링뿐만 아니라 Metric과 연계하여 다양한 액션 사용 가능  
EC2 인스턴스가 이상이 있을 경우 알림을 받고자 할때, 사용량이 급증했을 때  
자동으로 횡적 확장(오토 스케일링)을 하고 부하분산(ELB)를 구축할 때 사용함  

## 개요

- 각 AWS리소스의 특징에 따라 다양한 값을 모니터링 할 수 있음
- 기본 모니터링 간격은 5분이며 세부 모니터링 간격은 1분. 기본 모니터링은 프리 티어에서 무료로 사용 가능

## 모니터링 항목

- EC2 : CPU사용률, 데이터 전송량, 디스크 사용량 측정 가능하고 연계하여 알림, 오토스케일링, EC2 인스턴스 제어 액션 사용 가능
- EBS 볼륨 : 읽기 쓰기 사용량, 지연시간 등을 모니터링 가능.
- ELB : 요청 수 및 지연 시간 등을 모니터링 할 수 있음. 오토스케일링
- RDS : CPU 사용률, DB연결 수, 사용 가능한 메모리 및 스토리지 공간, 읽기/쓰기 지연 시간 등을 모니터링 가능
- 측정치에 따라 이메일 알림 설정 가능

## 커스텀 측정치

cron job으로 스크립트 실행

- 사용자가 측정한 값을 사용할 수 있음
- 서버 애플리케이션, 로그 파일, 언어 레벨에서 측정치를 생성하고, 이들 값을 모니터링 하거나 CloudWatch 액션을 제어하고 싶을 때 사용
- 아마존 리눅스에는 AWS CLI가 미리 깔려있어 편리

## Events-Scheduler

- 매트릭이랑 관련된 작업들 말고도, 그냥 리소스에 있는 작업들에 cron job을 걸어주는 역할도 한다
- 주로 Lambda에 이벤트 스케쥴러를 연결한다 => 람다의 event source
- 람다에서 만들고 cloud watch에서 로그를 볼 수 이씀