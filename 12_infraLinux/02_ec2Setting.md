# EC2 서버 배포 세팅

ec2에서 죄다 하는 방법으루다가

## 과정

### 0. EC2 만들기

- 보안 그룹에 http:80, https:443, postgresql:5432, tcp:3000
- 이후에 ssh로 터미널에서 접속

### 1. 계정 설정 

root 비번 설정, db네임용 계정 만들기

- sudo passwd root
- adduser로 계정 추가: sudo adduser jonhyuk
- su - : 루트로 로그인
- passwd : 비밀번호 변경 => root 비번부터 설정하기
- 주로 사용할 계정 : db관리용 만든 계정 하나, root 이 두가지

### 2. 데이터베이스 설정 

postgres 설치, 계정 하나 더 만들고 계정 이름 데이터베이스 만들기, 배포에 필요한 데이터베이스 만들기

  1. postgres 설치

  ```shell
  sudo apt-get update
  sudo apt-get install postgresql postgresql-contrib
  ```

  2. sudo -u -i postgres로 들어가서 계정 만들기 + 계정 이름의 디비 만들기 + 배포에 사용할 디비 만들기

  ```shell
  sudo -i -u postgres
  psql
  CREATE USER name PASSWORD 'password';
  ALTER ROLE name createdb createrole;
  CREATE DATABASE name OWNER name ENCODING 'utf-8';
  CREATE DATABASE proddb OWNER name ENCODING 'utf-8';
  ```

  3. 해당 계정으로 다시 접속해서 디비 만들어졌나 확인하기

  ```shell
  sudo -i -u name
  psql
  \l
  \du
  ```

### 3. node 환경 설정

node.js, npm, yarn 설치

1. node, npm 설치

```shell
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install build-essential
```

2. yarn 설치

```shell
sudo npm install yarn -g
```

### 4. git clone 

```shell
git clone url,,,
cd 디렉토리
yarn install
yarn start:prod 해보기
```

### 5. pm2로 무중단 프로세스 만들기

```shell
yarn global add pm2
pm2 start ecosystem.config.js --env production
pm2 list
```

에코시스템 파일
```js
module.exports = {
  apps: [
    {
      name: 'name',
      script: 'server.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}

```

### 6. https 도메인 연결

- route 53 서비스에서 도메인 등록 후 서버네임 바꾸기
- 도메인 ssl 인증서 받기
- 로드 밸런서 만들기
- 그룹 설정하고 인증서 연결
- 80포트 443으로 리다이렉팅 설정
- EC2 인스턴스랑 연결하기


끝,,,
