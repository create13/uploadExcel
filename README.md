### 前端包打包生产
```
npm run build
```
### 前端包本地运行
```
npm run serve
```
### 文件目录结构
```
* GenerateJson --后端包
    * exportData --要导出的生成json包
    * readData --原本地读取资源目录 现做备份
    * app.js --入口js文件 处理接口大体逻辑
    * generatePic --处理excel表读取到的数据 并且转成json内容导出的相关逻辑
    * jsonFile.zip --post请求要导出下载的压缩包
    * package-lock.json --配置文件
    * package.json 依赖包等配置文件
* public --前端打包生成模板
* src 前端业务文件
    * component --前端组件
        *index.vue --上传表格button以及相关逻辑
    * APP.vue --入口文件
    * main.js --入口js
* gitignore --忽略上传的文件内容
* babel.config.js --babel配置文件
* package-lock.json -- 配置文件
* package.json --依赖包等配置文件
* vue.config.js --配置代理