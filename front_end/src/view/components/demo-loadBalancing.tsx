/*
 * @Author: junjie.lean
 * @Date: 2021-11-08 22:41:45
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-09 16:26:53
 */

// load balancing demo

import React, { Fragment as F, useLayoutEffect, useEffect } from 'react';
import { Divider, Input, Select, Space, Cascader } from 'antd';
import { Chart } from '@antv/g2';
import './../../style/loadBalancing.scss';

function LoadBalancing(props: any) {
  useLayoutEffect(() => {}, []);

  return (
    <F>
      <div>load balancing:</div>
      <div className="addrList">
        <div className="addrList-input">
          <Input addonBefore="http://" addonAfter=".com" value="" />
        </div>
      </div>

      <Divider />
      <div>
        <div className="chart-container" id="chart-container"></div>
      </div>
    </F>
  );
}

export default LoadBalancing;
