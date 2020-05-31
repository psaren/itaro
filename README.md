# itaro
A tool for taro build multiple app

## commands
- itaro build

``` bash
$ itaro build
```
- build in watch mode
``` bash
$ itaro watch
```
## config
config in package.json
``` javascript
// package.json
{
  ...
  "taro": {
    "build": {
      "output": "build",
      "excludes": ["alipay"],
      "options": ["alipay", "tt", "qq"]
    }
  }
}
```

