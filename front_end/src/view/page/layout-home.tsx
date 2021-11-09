/*
 * @Author: junjie.lean
 * @Date: 2020-03-18 11:00:47
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-09 16:12:34
 */

import React, { useEffect, useState, useRef, FC, Fragment } from 'react';
import './../../style/index.scss';
import RouterIndex from './../router/router-index';
import { Layout, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
const { Header, Sider, Content } = Layout;

function Home(props: any) {
  const [active, setActive] = useState<number>(0);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { push } = useHistory();

  enum routerPath {
    Path0 = '/os',
    Path1 = '/code',
    Path2 = '/nginx',
    Path3 = '/loadBalancing',
    Path4 = '/homework',
  }

  const scrollBarRef = useRef(null);

  const menuClickHandle = ({ key }) => {
    // console.log('key:', key);
    // console.log('scrollBarRef:', scrollBarRef.current);
    setActive(Number(key));
    scrollBarRef.current.updateScroll();
    scrollBarRef.current._container.scrollTop = 0;
  };

  useEffect(() => {
    const path = `Path${active}`;
    push(routerPath[path]);
  }, [active]);

  return (
    <Fragment>
      <Layout>
        <Header>
          <div>
            <span>前端基础运维知识</span>
          </div>
        </Header>
        <Layout>
          <Sider
            className="sider-content"
            // collapsible
            // collapsed={collapsed}
            // onCollapse={(collapsed) => {
            //   setCollapsed(collapsed);
            // }}
          >
            <Menu theme={'dark'} onClick={menuClickHandle}>
              <Menu.Item key={0}>
                <span>unix系</span>
              </Menu.Item>
              <Menu.Item key={1}>
                <span>后端数据解析方式</span>
              </Menu.Item>
              <Menu.Item key={2}>
                <span>Nginx基础配置</span>
              </Menu.Item>
              <Menu.Item key={3}>
                <span>负载均衡测试</span>
              </Menu.Item>
              <Menu.Item disabled key={4}>
                <span>其他</span>
              </Menu.Item>
            </Menu>
          </Sider>

          <Content>
            <div className="lean-content">
              <PerfectScrollbar
                style={{ height: '100%', width: '100%' }}
                ref={(ref) => {
                  scrollBarRef.current = ref;
                }}
              >
                <RouterIndex />
              </PerfectScrollbar>
            </div>
          </Content>
        </Layout>
      </Layout>
      {/* <div className="lean-demo-container"></div> */}
    </Fragment>
  );
}

export default Home;
