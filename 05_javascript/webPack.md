# WebPack

## 웹팩이란?

- 최신 프론트엔드 프레임워크에서 가장 많이 서용되는 모듈 번들러
- 모듈 번들러 : 웹 애플리케이션을 구성하는 자원을 모두 각각의 모듈로 보고 이를 조합해서 병합된 하나의 결과물을 만드는 도구
- 모듈 : 프로그래밍 관점에서 특정 기능을 갖는 작은 코드 단위
- 웹팩에서의 모듈 : 자바스크립트 모듈에만 국한하지 않고, 웹 애플리케이션을 구성하는 모든 자원을 의미. 파일 하나하나
- 모듈 번들링 : 웹 애플리케이션을 구성하는 몇십, 몇백개의 자원들을 하나의 파일로 병합 압축 해주는 동작을 모듈 번들링이라고 함.
  ![모듈 번들링](https://joshua1988.github.io/webpack-guide/assets/img/webpack-bundling.e79747a1.png)

## 웹팩이 필요한 이유

### 의존성의 해결

- 파일 단위의 자바스크립트 모듈 관리의 필요성
- 의존성이 생기는 변수(좀 더 전역에 가깝게 생성된 변수)를 참조했어야 됬는데 조금더 가까운 변수를 참조하게 됨
- 변수의 이름을 모두 기억하지 않는 이상 변수를 중복 선언하거나 의도치 않은 값을 할당할 수 있음
- 이처럼 **파일 단위**로 변수를 관리하고 싶은 욕구, 자바스크립트 모듈화에 대한 욕구가 생김

### 웹 개발 작업 자동화

- 코드를 고치고 새로고침을 누르지 않아도 다시 수정한 코드를 가지고 빌드하면 됨
- 배포할때 css 전처리라던가 파일이나 이미지를 압축하는 등의 작업이 필요했는데, 이러한 일들을 자동화해주는 도구들이 필요 => 웹팩

### 빠른 로딩 속도와 성능

- 웹 사이트 로딩 속도를 높이기 위한 노력의 일환 => 브라우저에서 서버로 요청하는 파일 숫자를 줄이는 것
- 초기 페이지 로딩 속도를 높이기 위해 나중에 필요한 자원들은 나중에 요청하는 레이지 로딩
- 필요한 자원은 미리 로딩하지 말고 그때그때 요청하자는 철학을 가지고 있음

## 웹팩으로 해결하려는 문제

1. 자바스크립트의 변수 유효 범위 : es6의 modules 문법과 웹팩의 모듈 번들링으로 해결
2. 브라우저별 HTTP 요청 숫자의 제약 : http 요청을 줄이는 것이 웹 애플리케이션의 성능을 높여줄 뿐 아니라 사용자가 사이트를 조작하는 시간을 앞당길 수 있음
3. 사용하지 않는 코드의 관리
4. Dynamic Loading, Lazy Loading 미지원 : 코드 스플리팅으로 해결

## webpack.config.js

```js
var path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

### Entry

- 웹팩에서 웹 자원을 변환하기 위한 **최초 진입점**이자 자바스크립트 파일 경로
- 여기서부터 빌드 시작!
- 웹 에플리케이션의 전반적인 구조와 내용이 담겨져 있어야 한다고 함. 웹팩이 해당 파일을 가지고 웹 애플리케이션에 사용되는 모듈들간의 연관 관계를 이해하고 분석하기 때문에 에플리케이션을 동작시킬 수 있는 내용들이 담겨져 있어야 함(진입점이기 때문에 트리처럼 진입점부터 시작해서 모든 곳에 갈 수 있어야 함)
  ![엔트리](https://joshua1988.github.io/webpack-guide/assets/img/webpack-entry.90e26197.png)
- 위와 같이 모듈 간의 의존 관계가 생기는 구조 : 디펜던시 그래프
- 진입점을 여러개 설정할 수도 있음 => 멀티 페이지 어플리케이션에 적합

### Output

```js
module.exports = {
  output: {
    filename: "bundle.js",
  },
};
```

- 웹팩을 돌리고 난 결과물의 파일 경로
- 속성 옵션
  - `filename` : 필수, 번들링 결과물의 이름
  - `path` : 해당 파일의 경로, `path.resolve()`는 인자로 넘어온 경로들을 조합하여 유효한 파일 경로를 만들어주는 node의 api
- output의 파일명 옵션들

```js
// 결과 파일 이름에 entry 속성 포함
module.exports = {
  output: {
    filename: "[name].bundle.js",
  },
};

// 결과 파일 이름에 웹팩 내부적으로 사용하는 모듈 ID를 포함
module.exports = {
  output: {
    filename: "[id].bundle.js",
  },
};

// 매 빌드마다 고유 해시값을 붙임
module.exports = {
  output: {
    filename: "[name].[hash].bundle.js",
  },
};

// 웹팩의 각 모듈 내용을 기준으로 생성된 해시 값을 붙임
module.exports = {
  output: {
    filename: "[chunkhash].bundle.js",
  },
};
```

### Loader

- 웹팩이 웹 애플리케이션을 해석할 때 자바스크립트 파일이 아닌 웹 자원들을 변환할수 있도록 도와주는 속성

```js
module.exports = {
  entry: "./app.js",
  output: {
    filename: "bundle.js",
  },
  module: {
    // css 로더 추가 + 모듈 별도 설치 필요
    rules: [
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
    ],
  },
};
```

- `rules`배열
  - `test` : 로더를 적용할 파일 유형을 정규표현식으로 표현
  - `use` : 해당 파일에 적용할 로더의 이름 모듈은 따로 설치
- 주로 사용하는 로더 
  - Babel 
  - Sass
  - File
  - Vue
  - TS
- 로더가 적용되는 순서 : 오른쪽에서 왼쪽
  ```js
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['css-loader', 'sass-loader']
      }
    ]
  }
  ```
  - scss 파일에 대해 먼저 sass 로더로 전처리를 한 다음에 웹팩에서 css를 인식할 수 있게 css 적용
  - 해당 css파일이 웹 애플리케이션에 인라인 스타일 태그로 추가되는 것 원한다면 style로더 사용
   ```js
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader','css-loader', 'sass-loader']
      }
    ]
  }
  ```
### Plugin
- 웹팩의 기본적인 동작에 추가적인 기능을 제공하는 속성
- 로더는 파일을 해석하고 변환하는 과정에 관여하는데, 플러그인은 해당 결과물의 형태를 바꾸는 역할을 함
- 플러그인 배열에는 생성자 함수로 생성한 객체 인스턴스만 추가 가능
```js
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    // 웹팩 빌드 결과물로 HTML 파일 선언해줌
    new HtmlWebpackPlugin(),
    // 웹팩 빌드 진행율을 표시해줌
    new webpack.ProgressPlugin()
  ]
}
```
- 자주 사용하는 플러그인
  - split-chunks-plugin
  - clean-webpack-plugin
  - image-webpack-loader
  - webpack-bundle-analyzer-plugin

### 이외 알아두면 좋은 속성들
- resolve : path와 관련되는 속성
```js
resolve: {
    alias: {
      xyz$: path.resolve(__dirname, 'path/to/file.js')
    }
  }
```
- devServer : 웹팩에 개발 서버 정보 써놓음, 개발 서버 실행되었을 때 전후에 실행되는 일들 설정
```js
 devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
```


