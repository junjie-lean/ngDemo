/*
 * @Author: junjie.lean
 * @Date: 2021-03-09 14:58:59
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-08 16:06:13
 */

import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import asyncComponent from './../public/public-asyncComponent';

//axios后端配置的处理
const Code = asyncComponent(() =>
  import(
    /*webpackPerload: true,webpackChunkName :"Code" */ './../components/demo-code.tsx'
  )
);

//操作系统的历史
const Os = asyncComponent(() =>
  import(
    /*webpackPerload: true,webpackChunkName :"Os" */ './../components/demo-os.tsx'
  )
);

export default function RouterRelation(props) {
  let baseHash = '';
  return (
    // <Router basename="/">
    <Switch>
      <Route exact path={baseHash + '/code'} component={Code} />
      <Route exact path={baseHash + '/os'} component={Os} />
      {/* <Redirect to={baseHash + "/loading"} /> */}
    </Switch>
    // </Router>
  );
}
