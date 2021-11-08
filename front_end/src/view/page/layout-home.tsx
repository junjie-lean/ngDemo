/*
 * @Author: junjie.lean
 * @Date: 2020-03-18 11:00:47
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-08 17:40:27
 */

import React, { useEffect, useState, useRef, FC, Fragment } from 'react';
import './../../style/index.scss';
import RouterIndex from './../router/router-index';
import { Space, Button, Divider, Layout } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

function Home(props: any) {
  const [active, setActive] = useState<Number>(0);
  const { push } = useHistory();

  enum routerPath {
    Path0 = '/os',
    Path1 = '/code',
    Path2 = '/config1',
    Path3 = '/config2',
    Path4 = '/config3',
  }

  useEffect(() => {
    const path = `Path${active}`;
    push(routerPath[path]);
  }, [active]);

  return (
    <Fragment>
      <Layout>
        <Header>
          <div>
            <h2>前端基础运维知识</h2>
          </div>
        </Header>
        <Layout>
          {/* <Sider theme={'light'}>
            <Space size={20}>
              <Button
                type={active === 0 ? 'primary' : 'default'}
                onClick={() => {
                  setActive(0);
                }}
              >
                unix系
              </Button>
              <Button
                type={active === 1 ? 'primary' : 'default'}
                onClick={() => {
                  setActive(1);
                }}
              >
                Axios配置的处理
              </Button>
              <Button
                type={active === 2 ? 'primary' : 'default'}
                onClick={() => {
                  setActive(2);
                }}
              >
                Nginx基础配置
              </Button>
              <Button
                type={active === 3 ? 'primary' : 'default'}
                onClick={() => {
                  setActive(3);
                }}
              >
                Nginx负载均衡
              </Button>
              <Button
                disabled
                type={active === 4 ? 'primary' : 'default'}
                onClick={() => {
                  setActive(4);
                }}
              >
                其他
              </Button>
            </Space>
          </Sider> */}
          <Content>
            <div className="lean-content">
              <RouterIndex />
            </div>
          </Content>
        </Layout>
      </Layout>
      {/* <div className="lean-demo-container"></div> */}
    </Fragment>
  );
}

export default Home;
