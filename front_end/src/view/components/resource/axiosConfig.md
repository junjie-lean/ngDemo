### 一、前后端在不同域的请求方式:

#### 以Axios为请求工具的代码示例:
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
- 便于前后端联调测试,不同前端开发人员可以指定不同的后端环境,包括开发环境测试环境等等





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

### 2.2以Express框架举例:  
- 采用http.request.method的方式来做区分:

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


```

- 采用http.request.pathname的方式来做区分:
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

//RESTful风格方式 
app.get('/user/:id',(req,res,next)=>{
  //some service logic
  res.send("static file with some data")
  next()
})

```

