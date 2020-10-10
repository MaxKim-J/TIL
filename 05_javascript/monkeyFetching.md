# 객체간 패칭

- 이건 뭐 복잡할거 없는듯

## 시나리오 1) 객체.프로퍼티 = 객체.프로퍼티


```javascript
// 패칭되는 메소드가 있는 객체(source)

const source = {
    objName:'source',
    petchingFn: function() {
        console.log(this)
        // 해당 객체 안의 프로퍼티를 참조
        console.log(this.objName)
        console.log('source FN')
    }
}
```


```javascript
// 패칭되는 메소드가 붙여지는 객체(target)

const target = {
    objName:'target',
    petchingFn: function() {
        console.log(this)
        console.log(this.objName)
        console.log('origin target FN')
    }
}
```


```javascript
// source 메소드는 원래 this를 잃고 target에 바인딩

target.sourcePetchingFn = source.petchingFn
```


```javascript
target.sourcePetchingFn()
```

    {
      objName: 'target',
      petchingFn: [Function: petchingFn],
      sourcePetchingFn: [Function: petchingFn]
    }
    target
    source FN



```javascript
target.objName
```




    'target'



## 시나리오 2) 객체.프로퍼티 = () => 객체.프로퍼티()


```javascript
const target2 = {
    objName:'target',
    petchingFn: function() {
        console.log(this)
        console.log(this.objName)
        console.log('origin target FN')
    }
}

const source2 = {
    objName:'source',
    petchingFn: function() {
        console.log(this)
        console.log(this.objName)
        console.log('source FN')
    }
}
```


```javascript
target2.sourcePetchingFn = () => source2.petchingFn()
```




    [Function]




```javascript
// source의 함수는 this를 잃지 않고 source 객체 그대로에 바인딩
// 새로운 객체에 들어갈때 원래 this를 같이 갖고 들어간 셈이다.
// 화살표함수의 lexical this 때문에, 화살표 함수는 petchingFn이 호출된 시점에서 상위 컨텍스트에 this를 바인딩한다.

target2.sourcePetchingFn()
```

    { objName: 'source', petchingFn: [Function: petchingFn] }
    source
    source FN



```javascript
target2.objName
```




    'target'



# 객체-생성자간 패칭

- 생성자가 함수를 어떻게 this에 바인딩하고 있는지 + 인자로 함수를 어떻게 넘기는지에 따라 약간 복잡
- 생성자 안에서 화살표 함수 쓰는거랑 화살표 함수를 넘기는것의 차이
- 화살표함수는 bind로 대체할 수 있는데 bind가 가독성에는 더 좋은거같음


```javascript
function Target(name, Fn) {
    this.objName = name
    // 함수 인자를 바로 바인딩
    this.fn = Fn
    // 함수 인자를 화살표함수로 감싸서 바인딩
    this.fnWithArrow = () => Fn()
}
```

## 시나리오 1) 패칭된 메소드가 생성자로 생성된 객체를 바라봄


```javascript
const source3 = {
    objName:'source',
    petchingFn: function() {
        console.log(this)
        console.log(this.objName)
        console.log('source FN')
    }
}
```


```javascript
const targetInstance = new Target('타겟 인스턴스1', source3.petchingFn)
```


```javascript
// source에서 떨어져나온 메소드는 this를 잃어버리고 Target 생성자의 this에 바인딩된다.

targetInstance.fn()
```

    Target {
      objName: '타겟 인스턴스1',
      fn: [Function: petchingFn],
      fnWithArrow: [Function]
    }
    타겟 인스턴스1
    source FN



```javascript
// this를 잃은 sourceMethod가 호출되는 시점에 this는 생성자의 상위 컨텍스트인 window
// 이건 짧게말하면 그냥 하지 말라는 말이다.

targetInstance.fnWithArrow()
```

    Object [global] {
      global: [Circular],
      clearInterval: [Function: clearInterval],
      clearTimeout: [Function: clearTimeout],
      setInterval: [Function: setInterval],
      setTimeout: [Function: setTimeout] { [Symbol(util.promisify.custom)]: [Function] },
      queueMicrotask: [Function: queueMicrotask],
      clearImmediate: [Function: clearImmediate],
      setImmediate: [Function: setImmediate] {
        [Symbol(util.promisify.custom)]: [Function]
      },
      __filename: '[eval]',
      exports: {},
      module: Module {
        id: '[eval]',
        path: '.',
        exports: {},
        parent: undefined,
        filename: '/Users/jonghyukkim/dev/jupyter-notes/node/[eval]',
        loaded: false,
        children: [],
        paths: [
          '/Users/jonghyukkim/dev/jupyter-notes/node/node_modules',
          '/Users/jonghyukkim/dev/jupyter-notes/node_modules',
          '/Users/jonghyukkim/dev/node_modules',
          '/Users/jonghyukkim/node_modules',
          '/Users/node_modules',
          '/node_modules'
        ]
      },
      __dirname: '.',
      require: [Function: require] {
        resolve: [Function: resolve] { paths: [Function: paths] },
        main: undefined,
        extensions: [Object: null prototype] {
          '.js': [Function],
          '.json': [Function],
          '.node': [Function]
        },
        cache: [Object: null prototype] {}
      },
      '$$mimer$$': [Function: defaultMimer],
      '$$done$$': [Function: bound bound done],
      Target: [Function: Target],
      console: Console {
        log: [Function: bound log],
        warn: [Function: bound warn],
        dir: [Function: bound dir],
        time: [Function: bound time],
        timeEnd: [Function: bound timeEnd],
        timeLog: [Function: bound timeLog],
        trace: [Function: bound trace],
        assert: [Function: bound assert],
        clear: [Function: bound clear],
        count: [Function: bound count],
        countReset: [Function: bound countReset],
        group: [Function: bound group],
        groupEnd: [Function: bound groupEnd],
        table: [Function: bound table],
        debug: [Function: bound log],
        info: [Function: bound log],
        dirxml: [Function: bound log],
        error: [Function: bound warn],
        groupCollapsed: [Function: bound group],
        Console: [Function: Console]
      },
      '$$': [Object: null prototype] {
        async: [Function: bound async],
        done: [Function: bound done],
        sendResult: [Function: bound ],
        sendError: [Function: bound ],
        mime: [Function: bound ],
        text: [Function: bound ],
        html: [Function: bound ],
        svg: [Function: bound ],
        png: [Function: bound ],
        jpeg: [Function: bound ],
        json: [Function: bound ],
        input: [Function: bound input],
        display: [Function: bound createDisplay],
        clear: [Function: bound clear]
      }
    }
    undefined
    source FN


## 시나리오 2) 패칭된 메소드가 원래 객체를 바라봄


```javascript
const source4 = {
    objName:'source',
    petchingFn: function() {
        console.log(this)
        console.log(this.objName)
        console.log('source FN')
    }
}
```


```javascript
const targetInstance2 = new Target('타겟 인스턴스2', () => source4.petchingFn())
```


```javascript
// 화살표 함수의 this는 함수의 상위 컨텍스트인 source4를 바라본다

targetInstance2.fn()
```

    { objName: 'source', petchingFn: [Function: petchingFn] }
    source
    source FN



```javascript
// ?????머야 함수가 호출하는 함수의 호출이 미리 이뤄져서 this가 이미 바인딩되어있기 때문에 this가 안바뀌는걸까? 
// arrowWithFn = () => () => source4.fetchingFn()

targetInstance2.fnWithArrow()
```

    { objName: 'source', petchingFn: [Function: petchingFn] }
    source
    source FN



```javascript
const targetInstance3 = new Target('타겟 인스턴스3', () => () => source4.petchingFn())
```


```javascript
// 깊이만 깊어질뿐 this는 똑같네 희한하다

targetInstance3.fnWithArrow()()
```

    { objName: 'source', petchingFn: [Function: petchingFn] }
    source
    source FN



```javascript
// bind가 똑같은 역할을 한다

const targetInstance4 = new Target('타겟 인스턴스4', source4.petchingFn.bind(source4))
```


```javascript
targetInstance4.fn()
```

    { objName: 'source', petchingFn: [Function: petchingFn] }
    source
    source FN


## 시나리오 3) 패칭된 메소드가 원 객체의 클로저 변수를 바라보고 this는 생성된 객체를 바라봄


```javascript
// 패칭할 메소드의 this는 생성자 객체를 바라보게 하고 싶은데
// 패칭할 메소드의 원 객체의 어떤 변수를 참조하게끔 하고 싶으면 클로저를 섞어쓰면 된다.

const source5 = () => {
    const value = 'i`m closer'
    return {
        petchingFn:function() {
            console.log(value)
            console.log(this)
            console.log(this.objName)
            console.log('Source FN')
        }
    }
}
```


```javascript
const targetInstance5 = new Target('타겟 인스턴스5', source5().petchingFn)
```


```javascript
targetInstance5.fn()
```

    i`m closer
    Target {
      objName: '타겟 인스턴스5',
      fn: [Function: petchingFn],
      fnWithArrow: [Function]
    }
    타겟 인스턴스5
    Source FN

