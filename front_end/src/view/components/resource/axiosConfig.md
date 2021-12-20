### 一、前后端在不同域的请求方式:

#### 以Axios为请求工具的代码示例
```javascript

  //创建axios实例:
  const Ajax = Axios.create({
    baseURL: 'http://some.server.com',
    /*
        ...otherConfig
          example: token,method
    */
  });

  //调用实例
  const reqeustFN = async (params) => {
    await Ajax.post('/some/api/path', params);
  };

```

#### 优点:
- 便于前后端联调测试,结队编程中,不同前端开发人员可以指定不同的后端环境,包括指定开发环境测试环境等等.
- 部署后,将其配置暴露出来,可以灵活变更数据的服务地址,方便调试.
  

#### 缺点:
- 部署前前端需要知道数据服务的地址.
- 部署后可能有暴露数据服务地址的风险.
- 有部署时数据服务地址填写错误的风险.


### 二、前后端在同域的Axios请求方式:


```javascript

  //创建axios实例:
  const Ajax = Axios.create({
    baseURL: window.location.origin,
    /*
        ...otherConfig
          example: token,method
    */
  });

  //调用实例
  const reqeustFN = async (params) => {
    await Ajax.post('/service/api/path', params);
  };

```

#### 优点:
- 部署时不需要知道最终部署后的服务地址及策略,可移植性高.
- 没有暴露数据服务地址的风险.

#### 缺点:
- 不支持多数据服务地址(特殊情况).
  
### 三、前后端同域下的后端解析示例(express):  

- 用http.request.method的方式来做区分:

```javascript

const express = require('express');
const app = express();
app.listen(8080);


//get请求,当做请求静态文件或者模板文件来处理.
app.get('/some/path',(req,res,next)=>{
    res.send('some static file');
    next();
})

//post请求,统一当做请求api接口处理.
app.post('/some/path',(req,res,next)=>{
    //do something
    res.json({});
    next()
})

//RESTful风格方式 
app.get('/user/:id',(req,res,next)=>{
  //some service logic
  res.send("static file with some data")
  next()
})

```

- 用http.request.pathname的方式来做区分:

```javascript

const express = require('express');
const app = express();
app.listen(8080);

//为静态文件设置一个虚拟路径为 /web 的请求pathname
//请求路径为:
//http://localhost:8080/web/static/index.html
app.use('/web',express.static('dist'));


app.get('/web?',(req,res,next)=>{
  res.send('some static file');
  next()
})

app.get('/server?',(req,res,next)=>{
  //some service logic
  res.json({})
  next()
})

```

### 四、建议的配置

开发环境中,采用固定的后端地址,生产环境中,采用URL相对路径进行部署
这样做的好处:
- 开发时候可以根据需求随意切换server地址进行对接
- 部署后采用相对URL的后端地址配置,规避部署后还需要随时调整后端地址的风险
- 部署后,没有暴露后端地址的风险