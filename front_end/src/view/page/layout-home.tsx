/*
 * @Author: junjie.lean
 * @Date: 2020-03-18 11:00:47
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-03 13:38:08
 */

import React, { useEffect, useState, useRef, FC, Fragment } from 'react';
import './../../style/index.scss';
import RouterIndex from './../router/router-index';
import { Space, Button } from 'antd';
function Home(props: any) {
  const [active, setActive] = useState<String>('1');

  return (
    <Fragment>
      <div className="lean-demo-container">
        <Space size={20}>
          <Button
            type={active == '1' ? 'primary' : 'default'}
            onClick={() => {
              setActive('1');
            }}
          >
            code
          </Button>
          <Button
            type={active == '2' ? 'primary' : 'default'}
            onClick={() => {
              setActive('2');
            }}
          >
            负载均衡配置1
          </Button>
          <Button
            type={active == '3' ? 'primary' : 'default'}
            onClick={() => {
              setActive('3');
            }}
          >
            负载均衡配置2
          </Button>
          <Button
            type={active == '4' ? 'primary' : 'default'}
            onClick={() => {}}
          ></Button>
        </Space>
      </div>
      <div className="lean-content">
        <RouterIndex />
      </div>
    </Fragment>
  );
}

export default Home;
