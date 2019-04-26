## 简单chrome插件-京东商品历史价格查询


调用的是tool.manmanbuy.com的接口   
后因改动增加了cors的限制，出现Cross-Origin Read Blocking(CORB)。 

   
**没得办法，自己写了个[rproxy](https://github.com/xiangwenhu/rproxy)** 来代理请求，又因https里面不能发http的请求，又修改成https。   
可是，本人么有受信任的证书，尴尬了。   
肿么办，肿么办。

那么就找到 chrome的启动快捷方式，添加参数`--ignore-certificate-errors --allow-running-insecure-content`, 看参数就明白了忽略证书错误，允许跑不安全的内容。   
最终结果类似：
`"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --ignore-certificate-errors --allow-running-insecure-content`


---------

博客地址: [写个简单的chrome插件-京东商品历史价格查询](https://www.cnblogs.com/cloud-/p/9954823.html)



本插件核心就是
* manifest.json 申明文件
* index.js  执行网络请求，解析数据，渲染图标
![项目结构](https://xiangwenhu.github.io/blog/img/chrome//project-dir.jpg)



最后发一张图
![插件效果图](https://xiangwenhu.github.io/blog/img/chrome/jd-price.jpg)