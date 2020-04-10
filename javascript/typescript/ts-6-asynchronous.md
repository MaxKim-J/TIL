# 6. 타입스크립트 - Promise, async+await
2020.04.10  
사실 이건 타입스크립트 공부는 아닌거같지만,,(2)    

## 타입스크립트 Promise
타입스크립트 promise는 제네릭 클래스 형태로 사용함

```ts
const numPromise: Promise<number> = new Promise<number>
const strPromise: Promise<string> = new Promsie<string>
const arrayPromise:Promise<number[]> = new Promise<number[]>

// 콜백은 요러케
new promise<T>((resolve:(successValue:T) =>void, reject:(any) => void) => {
    // 비동기 코드 구현
})
```

### 비동기 로직
비동기로직인 readFile을 비동기로 호출하는 로직
```ts
import {readFile} from 'fs'

// 최종적으로 프로미스에 담겨질 타입을 정의
const readFilePromise = (filename:string): Promise<string> => 
    new Promise<string>((
        // 리졸브는 문자열을 받고, 리젝트는 에러를 받는다
        // 리졸브가 뭘 받게될지, 리젝트는 에러를 받을테고 정의해주기
        resolve: (value:string) => void,
        reject: (error:Error) => void) => {
            readFile(filename, (err:Error, buffer:Buffer) => {
                if(err){
                    reject(err)
                } else {
                    resolve(buffer.toString())
                }
            })
        }
    ))

// 사용하는 코드
// then에 들어갈 콜백함수의 인자 타입형 잘 정의해줘야함
readFilePromise('./package.json')
    .then((content:string) => {
        console.log(content)
        return readFilePromise('./tsconfig.json')
    })
    .then((constent:string) => {
        console.log(content)
        return readFilePromise('.')
    })
    .catch((err:Error) => console.log('error' + err.mesaage))
    .finally(() => console.log('프로그램 종료'))
```
### Promise.all 사용하기
```ts
const isAllTrue = (values:boolean[]) => values.every((value => value === true))
const getAllResolvedResult = <T>(promises: Promise<T>[]) => Promise.all(promises)
getAllResolvedResult<any>([promise.reject(new Error('error')), Promise.resolve(1)])
```

## 타입스크립트 async await
- await : 진정한 의미는 피연산자의 값을 반환해준다는 것. 그런데 만일 피연산자가 프로미스 객체이면 then 메서드를 호출해 얻은 값을 반환해줌
- async : await키워드는 async라는 이름의 함수 수정자가 있는 함수 몸통에서만 사용 가능함
- async 함수 수정자가 붙은 함수는 일반 함수처럼 사용할 수 있으며, 프로미스 객체로도 사용할 수 있다. async 함수의 리턴값은 무조건 프로미스
```ts
const readFilesAll = async(filenames: string[]) => {
    return await Promise.all(
        filenames.map(filename => readFilePromise(filename))
    )
}

readFilesAll(['./package.json','./tsconfig.json'])
    .then(([packageJson, tsconfigJson]:string[])=>{
        console.log(packageJson)
        console.log(tsconfigJson)
    })
    .catch(err => console.log(err.message))
```