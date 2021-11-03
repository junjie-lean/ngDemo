/*
 * @Author: junjie.lean
 * @Date: 2021-11-03 13:12:47
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-03 14:18:57
 */

import React, { Fragment as F, useEffect } from 'react';
import Axios from 'axios';
import axiosPng from './../../media/picture/AxiosCreate.png';
import axiosPng1 from './../../media/picture/AxiosCreate1.png';
import './../../style/code.scss';

function Code() {
  useEffect(() => {}, []);

  //   const Ajax = Axios.create({
  //     baseURL: 'http://some-domain.com',
  //   });

  //   const Ajax = Axios.create({
  //     baseURL: window.location.origin,
  //   });

  //   Ajax.post('/some/api/path', {
  //     params: 'xxxxxx',
  //   });

  return (
    <F>
      <div className="lean-demo1-container">
        <div>
          <h3>前后端在不同域的Axios请求方式:</h3>
          <img src={axiosPng} className="demo1Img" />
        </div>
        <div>
          <h3>前后端在同域的Axios请求方式:</h3>
          <img src={axiosPng1} className="demo1Img" />
        </div>
      </div>
    </F>
  );
}

export default Code;
