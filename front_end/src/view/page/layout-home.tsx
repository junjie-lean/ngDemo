/*
 * @Author: junjie.lean
 * @Date: 2020-03-18 11:00:47
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-04-26 15:04:58
 */

import React, { useEffect, useState, useRef, FC, Fragment } from 'react';
import './../../style/index.scss';
// import { Button, Input } from 'antd';
// import { useSelector } from 'react-redux';
// import Axios from 'axios';

interface UserName {
  title: string;
  first: string;
  last: string;
}

interface ResponseItem {
  gender: string;
  name: UserName;
  email: string;
}

type respostItem = ResponseItem;

function Home(props: any) {
  const [count, setCount] = useState(1);
  const [res, setRes] = useState(null);
  const [isReady, setReadyState] = useState(false);

  return (
    <Fragment>
      <div className="lean-sass-container">sass test</div>
    </Fragment>
  );
}

export default Home;
