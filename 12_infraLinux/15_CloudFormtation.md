# CloudFormation

## 설명

- 미리 만든 템플릿을 이용하여 AWS 리소스 생성과 배포를 자동화함
- 실제로 서비스를 제공하는 AWS리소스는 아니라서 사용 요금이 없음
- 서비스에 필요한 여러 인스턴스들을 미리 구성한대로 자동 생성하는 기능
- 템플릿 파일은 JSON 형식의 텍스트 파일. AWS에서 제공하는 미리 만들어진 템플릿도 활용 가능
- EC2에 소프트웨어를 설치하고 설정할 수도 있음. 소프트웨어 자동화에 여러 플렛폼같은 것도 지원함
- CloudFormation 템플릿으로 생성한 AWS 리소스 조합을 CloudFormation 스택이라고 함. 이 스택을 삭제하면 관련된 AWS 리소스도 모두 삭제됨
- Iac랑 다른점이 뭐지 플랫폼 오리엔티드하다는 게 다른가

## 템플릿

JSON 형식 + 한글을 사용하면 안됨

```json
{
  "Description": "템플릿에 대한 설명",
  "Paremeters": {
    // 템플릿으로 스택을 생성할때 사용자가 입력할 매개변수 목록
  },
  "Resources": {
    // AWS 리소스 종류와 옵션, AWS 리소스 간의 관계를 정의
  },
  "Outputs": {
    // 스택을 생성한 뒤 출력할 값
  },
  "AWSTemplateFormatVersion": "2010-09-09" // 현재 템플릿 구조의 버전 이게 최신버전
}
```

## EC2 인스턴스 생성하는 CloudFormation 템플릿

```json
{
  "Description": "EC2",
  "Parameters": {
    "KeyPair": {
      "Description": "EC2 키페어",
      "Type": "String",
      "Default": "awskeypair"
    }
  },
  "Resource": {
    "Ec2Instance": {
      "Type": "AWS::EC2::Instance",
      // 머신 이미지 ID => 같은 AMI 라도 리전에 따라 이미지 ID가 다름 => 확인해야함
      "Properties": {
        "KeyName": { "Ref": "KeyPair" },
        "ImageId": "ami-c9562fc8",
        "InstanceType": "t1.micro"
      }
    }
  },
  "Outputs": {
    "InstanceId": {
      "Description": "새로운 EC2 인스턴스의 instnaceId",
      "Value": {
        "Ref": "Ec2Instance"
      }
    }
  },
  "AWSTemplateFormatVersion": "2010-09-09"
}
```

## EC2 인스턴스 생성 이후 웹 서버를 설치, 실행하는 템플릿

```json
{
  "Description": "EC2",
  "Parameters": {
    "KeyPair": {
      "Description": "EC2 키페어",
      "Type": "String",
      "Default": "awskeypair"
    }
  },
  "Resource": {
    "Ec2Instance": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "KeyName": { "Ref": "KeyPair" },
        "ImageId": "ami-c9562fc8",
        "InstanceType": "t1.micro",
        // Ec2 인스턴스가 생성된 직후 실행할 스크립트(bash)
        "UserData": {
          "Fn:Base64": {
            "Fn:Join": [
              "",
              [
                "#!/bin/bash\n",
                "/opt/aws/bin/cfn-init --region",
                { "Ref": "AWS::Region" },
                " -s ",
                { "Ref": "AWS::StackName" },
                " -r Ec2Insatnce\n"
              ]
            ]
          }
        }
      }
    }
  },
  "MetaData" :{
    "AWS::CloudFormation::Init" :{
      "config" : {
        "packages" :{
          "yum": {
            "httpd" : []
          }
        }
      }
    },
    "services" :{
      "sysvinit" : {
        "httpd" : {
          "enabled" : "true",
          "ensureRunning" : "true,
        }
      }
    }
  },
  "Outputs": {
    "InstanceId": {
      "Description": "새로운 EC2 인스턴스의 instnaceId",
      "Value": {
        "Ref": "Ec2Instance"
      }
    }
  },
  "AWSTemplateFormatVersion": "2010-09-09"
}
```
