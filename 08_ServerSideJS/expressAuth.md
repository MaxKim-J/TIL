# JWT 토큰 인증방식 Express에서 구현하기

토큰기반인증 시스템은 API 모델을 가진 어플리케이션에 매우 적합. 세션기반인증보다 stateless하다는 점에서 더 나음

## 모듈

**jsonwebtoken**

SON 웹 토큰을 손쉽게 생성할 수 있고 검증도 해줌

## 구현

### 로그인 + 토큰 발급

```js
exports.login = (req, res) => {
    const {username, password} = req.body
    const secret = req.app.get('jwt-secret')

    // check the user info & generate the jwt
    // check the user info & generate the jwt
    const check = (user) => {
        if(!user) {
            // user does not exist
            throw new Error('login failed')
        } else {
            // user exists, check the password
            if(user.verify(password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: user.username,
                            admin: user.admin
                        }, 
                        secret, 
                        {
                            expiresIn: '7d',
                            issuer: 'velopert.com',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token) 
                        })
                })
                return p
            } else {
                throw new Error('login failed')
            }
        }
    }

    // respond the token 
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)
}
```

- jwt.sign(payload, secret, options, [callback])
- callback이 전달되면 비동기적으로 작동하고, 콜백함수의 파라미터는 (err, token). 전달되지 않을시엔 동기적으로 작동 
- payload: 객체, buffer, 문자열
- secret : 서명을 만들때 사용되는 알고리즘에서 문자열, buffer형태
- Options
  - algorithm : 해싱 알고리즘
  - expiresIn : JWT의 클레임중 exp를 설정
  - issuer : 발급자..

### 토큰 검증

클라이언트가 헤더에 x-access-token 또는 Authorization 헤더에 넣으면 그거 가지고 검증 후 라우팅이 되는 로직

일반적으로는 Authorization 헤더에 넣고 토큰이 없으면 401, 토큰이 만료되었으면 403 => 이걸 위해 JWT 디코드해서 만료여부나 verify여부 체크

```js
exports.check = (req, res) => {
    // 검출
    const token = req.headers['x-access-token'] || req.query.token

    // 토큰이 없으면 forbidden
    // 일반적으로는 401
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    // 디코딩 => 하면 객체가 나옵니다
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // 그 객체 가지고 베리파잉 하면 되는듯
    // 만료됬으면 403보내고(토큰은 있지만 이토큰가지고는 뭐 못함)
    const respond = (token) => {
        res.json({
            success: true,
            info: token
        })
    }

    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    // process the promise
    p.then(respond).catch(onError)
}
```

### 미들웨어로 처리하기

라우터마다 저 로직 반복시키기 귀찮으니까 미들웨어화시켜서 반복하게 만들자

```js
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    // read the token from header or url 
    const token = req.headers['x-access-token'] || req.query.token

    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    // 디코드한 토큰 리퀘스트에 넣고 next
    // 그다음 미들웨어에서 검증?
    p.then((decoded)=>{
        req.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = authMiddleware

// 이 미들웨어 받는 컨트롤러에서는
exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}
```

### 참고) crypto

- 비밀번호를 데이터베이스에 저장할때 Plain text로 저장하지 않는것은 너무 기본이다. HMAC-SHA1로 비밀번호를 해쉬하여 저장하도록 하자
- node의 내장 모듈인 crypto를 불러와서 사용하면 됨 
- secret 필요함

```js
// 저장 - 인코딩
User.statics.create = function(username, password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
                      .update(password)
                      .digest('base64')

    const user = new this({
        username,
        password: encrypted
    })

    // return the Promise
    return user.save()
}

// 검증 전 - 비교
User.methods.verify = function(password) {
    // 인자 password 인코딩 후
    const encrypted = crypto.createHmac('sha1', config.secret)
                      .update(password)
                      .digest('base64')
                      
    // 인코딩된 값과 비교 - 인코딩해서 비교
    return this.password === encrypted
}
```