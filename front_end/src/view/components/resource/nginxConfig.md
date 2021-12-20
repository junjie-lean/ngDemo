

```nginx

#user  nobody;

# 标识当前nginx需要几个进程来跑
worker_processes 1;

# 指定错误日志地址及等级
error_log /usr/local/etc/nginx/logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid logs/nginx.pid;

events {
    #单个进程支持的最大链接数,理论上支持的最大连接数是 worker_processes * worker_connections
    worker_connections 1024;
}


http {

    include mime.types;
    default_type application/octet-stream;

    # 自定义的日志格式 格式名称为 main
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
    '$status $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"'
    '$upstream_addr "ups_resp_time":$upstream_response_time "request_time":$request_time'
    ;

    # 指定访问日志的格式类型为 main
    access_log /usr/local/etc/nginx/logs/host.access.log main;

    # 是否开启文件在内核里的缓存,方便下载
    sendfile on;

    # tcp维持时间 http1.1
    keepalive_timeout 65;

    # 文件压缩,开启文件压缩后,加载时间可以大幅优化
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 16 64k;
    gzip_http_version 1.1;
    gzip_comp_level 6;
    gzip_types text/plain application/javascript application/x-javascript text/css  text/javascript application/ image/jpeg image/gif image/png  font/ttf  
    gzip_vary on;

    # 是否忽略无效的请求头
    ignore_invalid_headers off;

    server {
        listen 2000;
        server_name localhost;
    
        #charset koi8-r;
        
        # 针对单个服务的日志
        # access_log logs/host.access.log main;

        # 缓存时间,配合压缩,按需请求等逻辑,可以达到非常不错的效果
        add_header Cache-Control max-age=315360000;

        # 转发的配置
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;


        # location / {
        #     root /Users/junjie.lean/Desktop/233新SVN源码/决策指挥江苏录取大屏/build_nginx;
        #     index index.html index.htm;
        # }
        # location /lqcj/ {
        #     proxy_pass http://10.20.5.177:5000/lqcj/;
        # }
        # location /BMXX/ {
        #     proxy_pass http://10.10.0.115:14417/BMXX/;
    

        #error_page  404              /404.html;
        # redirect server error pages to the static page /50x.html
        #
        error_page 500 502 503 504 /50x.html;

        location = /50x.html {
            root html;
        }



        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}
        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }

     
    server {
        listen 8888;
        server_name localhost;
        #charset koi8-r;
        # access_log logs/host.access.log main;
        add_header Cache-Control max-age=315360000;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     

        # 根据路由来分析,转发相关的请求
        location /jwell-km-api-client/ {
            proxy_pass http://10.130.0.63:8086/jwell-km-api-client/;
        }


    }
 
    # HTTPS server
    # server {
    #     listen 443 ssl;
    #     server_name localhost;
    #     ssl_certificate cert.pem;
    #     ssl_certificate_key cert.key;
    #     ssl_session_cache shared:SSL:1m;
    #     ssl_session_timeout 5m;
    #     ssl_ciphers HIGH:!aNULL:!MD5;
    #     ssl_prefer_server_ciphers on;
    #     location / {
    #         root html;
    #         index index.html index.htm;
    #     }
    # }
    # 包含其他文件夹的配置
    # include servers/*;
    # include /Users/junjie.lean/Desktop/nginx_demo/nginx_config/*;
}

```