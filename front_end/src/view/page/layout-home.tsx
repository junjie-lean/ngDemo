/*
 * @Author: junjie.lean
 * @Date: 2020-03-18 11:00:47
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-05 15:33:47
 */

import React, { useEffect, useState, useRef, FC, Fragment } from 'react';
import './../../style/index.scss';
import RouterIndex from './../router/router-index';
import { Space, Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

function Home(props: any) {
  const [active, setActive] = useState<Number>(1);
  const { push } = useHistory();


  enum routerPath {
    Path1 = '/code',
    Path2 = '/config1',
    Path3 = '/config2',
    Path4 = '/config3',
  }



  useEffect(() => {
    const path = `path${active}`;
    push(routerPath[path]);
  }, [active]);

  return (
    <Fragment>
      <div className="lean-demo-container">
        <Space size={20}>
          <Button
            type={active === 1 ? 'primary' : 'default'}
            onClick={() => {
              setActive(1);
            }}
          >
            Axios后端配置的处理
          </Button>
          <Button
            type={active === 2 ? 'primary' : 'default'}
            onClick={() => {
              setActive(2);
            }}
          >
            负载均衡配置1
          </Button>
          <Button
            type={active === 3 ? 'primary' : 'default'}
            onClick={() => {
              setActive(3);
            }}
          >
            负载均衡配置2
          </Button>
          <Button
            type={active === 4 ? 'primary' : 'default'}
            onClick={() => {
              setActive(4);
            }}
          >
            负载均衡配置3
          </Button>
        </Space>
      </div>
      <div className="lean-content">
        <RouterIndex />
      </div>
    </Fragment>
  );
}

export default Home;
