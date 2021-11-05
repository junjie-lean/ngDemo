/*
 * @Author: junjie.lean
 * @Date: 2021-03-09 14:58:59
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-05 15:06:07
 */

import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import asyncComponent from './../public/public-asyncComponent';

const Code = asyncComponent(() =>
  import(
    /*webpackPerload: true,webpackChunkName :"Code" */ './../components/demo-code.tsx'
  )
);

export default function RouterRelation(props) {
  let baseHash = '';
  return (
    // <Router basename="/">
    <Switch>
      <Route exact path={baseHash + '/code'} component={Code} />
      {/* <Redirect to={baseHash + "/loading"} /> */}
    </Switch>
    // </Router>
  );
}
