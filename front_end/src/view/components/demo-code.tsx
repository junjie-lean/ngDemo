/*
 * @Author: junjie.lean
 * @Date: 2021-11-03 13:12:47
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-05 16:18:56
 */

import React, { Fragment as F, useEffect } from 'react';
import Axios from 'axios';
import './../../style/code.scss';
import axiosMD from './resource/axiosConfig.md';

function Code() {
  useEffect(() => {
    console.log(axiosMD);
  }, []);
  return (
    <F>
      <div className="lean-demo1-container">
        <div
          dangerouslySetInnerHTML={{ __html: `<pre>${axiosMD}</pre>` }}
        ></div>
      </div>
    </F>
  );
}

export default Code;
