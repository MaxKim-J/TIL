# AMI(Amazon Machine Image)

## 설명

- ec2인스턴스를 생성하기 위한 기본 파일. 빈 EC2에 직접 OS를 설치할 수는 없다.
- 그렇기 때문에 미리 OS가 설치된 AMI를 이용하여 EC2 인스턴스를 생성하게 됨
- 이 AMI는 단순히 OS만 설치되어 있는 것은 아니고 각종 서버 어플리케이션, 데이터베이스, 방화벽, 네트워크 솔루션, 각종 비즈니스 솔루션등도 함께 설치될 수 있음 => 설치 된 채로 같이 찍어낼 수 있음
- 프리티어에서 사용 가능
- Auto Scailing : 모든 설치와 설정이 완료된 AMI를 이용하여 EC2 인스턴스를 신속하게 늘려나가는 자동횡적 확장을 가능하게함

## 쓰임새

- 모든 설치와 설정이 완료된 AMI로 EC2를 찍어냄
- 설치 및 설정이 완료된 EC2 인스턴스를 신속하게 생성해야 할때, Auto Scailing 등으로 자동화할때, EC2 인스턴스를 다른 리전으로 이전해야 할때, 상용 솔루션을 사용하고자 할때
- EBS 스냅샷으로 AMI를 생성할 수 있다. 또는 EC2로 바로 AMI를 만들수도 있음

## AWS Marketplace

- AMI를 구입할 수 있음

## EC2 인스턴스로 AMI 사용하기

- EC2 인스턴스 목록에서 AMI를 생성할 때 EC2 인스턴스를 선택하고, 마우스 오른쪽 버튼을 클릭하면 팝업 메뉴가 나옴. Create Image
  - Image Name : AMI 이름
  - Image Description : AMI 설명
  - No reboot : AMI를 생성할 때 EC2를 재부팅하지 않고 생성하는 옵션
  - Instance Volumes : 기본 장착될 EBS 볼륨 설정. 기본값 그대로 사용
  - EC2에다 뭐 이것저것 깔고 이미지로 만들면 바로 반영이 되는건가?
- 다른 리전으로 복사하는거 가능 