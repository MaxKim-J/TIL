# 보안 그룹

EC2 인스턴스를 생성하고 열심히 여러가지 서버들을 설치했는데 외부에서 접속이 안될때가 있음. 이럴때는 먼저 보안 그룹 설정을 확인하고, 설치된 서버들이 사용하는 포트가 인바운드 설정에서 열려있는지, 포트 번호가 잘 못 설정되지는 않았는지, 프로토콜이 잘 못 설정되지는 않았는지, 인바운드 설정을 아웃바운드에다 하지는 않았는지 살펴본다.

## 설명

- 보안 그룹은 EC2 인스턴스에 적용할 수 있는 방화벽 설정
- 일단 리눅스의 기본 접속 포트인 22번만 여는 것은 기본이고 + 여기에 접속 가능한 IP대역까지 설정하면 공격 위협이 상당수 줄어듬

## 방화벽 설정의 기본 요소

- Inbound : 외부에서 EC2로 들어오는 트래픽. HTTP, HTTPS, SSH, RDP
- Outbound : EC2에서 외부로 나가는 트래픽. EC2 인스턴스 안에서 인터넷을 사용할 경우는 Outbound. 대표적으로 파일을 다운로드하거나 외부 SSH로 접속한다거나
- Type : 프로토콜 형태. 프로토콜은 TCP, UDP, ICMP로 나눌 수 있음
- Port, Port Range : TCP, UDP 프로토콜은 0 ~ 65525사이의 포트 번호를 사용하고 HTTP는 80번, SSH는 22번 등 각 서버 애플리케이션은 고유의 포트 번호를 사용하고 있음
- Source/Destination : 연결 혹은 접속 가능한 IP대역. Inbound일 경우 Source, Outbound일 경우 Destination. IP주소 하나만 지정할 수도 있고, CIDR 표기 방법을 이용해 일정한 대역 설정 가능
- Rule : 위의 이것들을 조합한 것을 규칙이라고 함 => 규칙이 모여서 보안 그룹이 됨. 한 보안 그룹에 규칙은 여러개

## 규칙 설정 옵션

- Type : HTTP는 TCP, Port Range는 80
- Source : 기본값은 Anywhere, IP 주소 대역을 설정할 수 있음. 

## CIDR 표기법

- Classless Inter-Domain Routing : IP주소 할당 방법. 급격히 부족해지는 IPv4 주소를 더욱 효율적으로 사용하기 위해 CIDR 표기법을 사용함
- xxx.xxx.xxx.xxx/yy : 뒤의 yy는 서브넷 마스트를 2진수로 바꾸었을 때 1의 개수 => yy는 API의 대역폭을 나타냄