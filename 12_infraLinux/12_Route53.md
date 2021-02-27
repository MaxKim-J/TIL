# Route 53

AWS리소스와 연동 가능한 DNS 서비스

## 설명

- EC2, ELB, S3, CloudFront와 연동이 가능한 DNS 서비스
- 프리티어에서는 못쓰기 때문에 나는 3000원씩 내고있다
- 대규모 글로벌 서비스를 할때 유용. AWS 리소스들과 연동할 수 있는 것과 더불어 글로벌 서비스에 꼭 필요한 기능을 제공
- DNS서비스 : 도메인에 연결된 IP 노드 주소를 알려줌. 보통 일반적으로 사용하는 DNS서비스 혹은 직접 구축한 DNS 서버는 도메인당 IP주소 한개만 설정할 수 있음
- 그래서 DNS에 쿼리를 하면 항상 같은 IP 주소만 알려줌
- 일반적인 서버들과는 달리 Latency Based Routing, Weighted Round Robin, Get Routing등을 제공하여 이 기능들은 도메인 하나를 쿼리하더라도 각 상황에 따라 다른 IP주소를 알려줌
- Latency Based Routing : 현재 위치에서 지연 시간이 가장 낮은 리전의 IP주소를 알려줌. 지연시간이 낮다는 것은 현재 위치에서 가장 가깝고 속도가 빠르다는 것 => 가장 가까운 리저느이 IP주소
- 전세계에 DNS 서버를 구축해야 한다면 : 리전 곳곳에 실제 서비스를 하는 서버를 배치해야 한다
- Weighted Round Robin은 서버 IP주소나 도메인마다 가중치를 부여하여 트래픽을 조절하는 기능 => failover 옵션은 장애가 발생하여 동작하지 않는 서버에는 트래픽이 가직 않도록 설정함
- Route53 -> CloudFront -> s3?
- Geo Routing : 지역별로 다른 IP 주소 알려줌

## Hosted Zone

- 도메인을 먼저 구입해야 함
- Create Hosted Zone : Domain 네임 부분에 루트 도메인 입력
  - 네임서버 : 도메인을 구입한 사이트에 접속한 뒤 네임서버를 설정해줘야함
  - 네임서버가 완전히 변경되었는지 확인하기

## A 레코드 설정(EC2, S3, CloudFront Distribution)

- DNS 서버에서 IP주소를 알려주도록 설정하는 기능
- EC2 인스턴스의 IP주소를 A레코드로 설정하면 DNS 서버에 구입한 도메인을 붙이는 것이 가능
- EC2에 Elastic IP 연결 => Hosted Zone, Record Set
  - Name : 생성할 서브 도메인 이름 설정
  - Type : 레코드 종류
  - Alias : A레코드만 사용할 수 있는 기능. IP 주소 대신에 S3, CloudFront, ELB 설정 가능
  - TTL : A 레코드가 갱신되는 주기. 초단위로 설정
  - Value : 도메인 네임을 쿼리했을 때 알려줄 IP 주소, 공인 IP주소를 입력
- CNAME 레코드 : A레코드에 추가로 붙이는 리다이렉션 DNS 주소 => 도메인, www.도메인 등등 => 레코드를 이런식으로 하나하나씩 붙여줄 수 있음
