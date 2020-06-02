# itaro
[![NPM version](https://img.shields.io/npm/v/itaro.svg)](https://npmjs.org/package/itaro)
[![NPM](https://img.shields.io/npm/l/itaro)](./LECENSE)
![David](https://img.shields.io/david/psaren/itaro)
[![npm](https://img.shields.io/npm/dm/itaro)](https://www.npmjs.com/package/itaro)  
taro 一键打包 cli
对于一个由 @tarojs/cli 创建的 taro 项目，可以零配置一键打包多种小程序代码
也可以在taro 项目的 package.json添加 itaro 属性进行个性化配置。

## 安装（install）
``` bash
npm install -g itaro
```

## 命令(commands)
- itaro build

``` bash
$ itaro build
```
- build in watch mode
``` bash
$ itaro watch
```
## 配置(config)
在 taro 项目的 package.json，添加配置项
``` javascript
// package.json
{
  ...
  "itaro": {
    "build": {
      "output": "itaro", // 打包输出根目录
      "excludes": ["rn"], // 不需要打包的小程序名称
      "options": ["alipay", "tt", "qq", "weapp", "rn"] // 需要打包的小程序名称
    }
  }
}
```

