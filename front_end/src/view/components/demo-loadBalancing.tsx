/*
 * @Author: junjie.lean
 * @Date: 2021-11-08 22:41:45
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-10 17:45:34
 */

// load balancing demo

import React, {
  Fragment as F,
  useLayoutEffect,
  useEffect,
  useState,
} from 'react';
import { Divider, Input, Space, Button, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Chart } from '@antv/g2';
import lodash from 'lodash';
import Axios from 'axios';
import './../../style/loadBalancing.scss';
import { indexedAccessType } from '@babel/types';

function LoadBalancing(props: any) {
  interface serviceAddrInfo {
    address: string;
    label: string;
    status: 'success' | 'fail' | 'pending' | 'hold';
    // status: string;
    ind: number;
    inputDone: boolean;
  }

  const [addrList, setAddrList] = useState<Array<serviceAddrInfo>>([
    {
      address: 'localhost:10001',
      label: 'Server A',
      status: 'hold',
      ind: 0,
      inputDone: true,
    },
  ]);
  const [beginRequest, setRequestStatus] = useState<boolean>(false);

  /**
   * @description 添加服务器地址
   * @param value address
   * @param index index
   */
  const addAddress = (value: string | any, index: number) => {
    const tmpArr: Array<serviceAddrInfo> = lodash.cloneDeep(addrList);
    tmpArr[index]['address'] = value;
    tmpArr[index]['inputDone'] =
      tmpArr[index]['address'].length > 0 && tmpArr[index]['label'].length > 0;
    setAddrList(tmpArr);
  };

  /**
   * @description 添加服务器标识
   * @param value address
   * @param index index
   */
  const addAddressLabel = (value: string | any, index: number) => {
    const tmpArr: Array<serviceAddrInfo> = lodash.cloneDeep(addrList);
    tmpArr[index]['label'] = value;
    tmpArr[index]['inputDone'] =
      tmpArr[index]['address'].length > 0 && tmpArr[index]['label'].length > 0;
    setAddrList(tmpArr);
  };

  /**
   * @description 添加一条空白数据到列表
   */
  const pushOneEmptyServer = () => {
    console.log(addrList);

    if (addrList.some((item) => item.inputDone === false)) {
      return;
    }

    const tmp: serviceAddrInfo = {
      address: '',
      label: '',
      status: 'hold',
      ind: addrList.length,
      inputDone: false,
    };
    const arr = [].concat(addrList, [tmp]);
    setAddrList(arr);
  };

  /**
   * @description 开始执行请求
   */
  const startAllRequest = () => {
    let arr: Array<serviceAddrInfo> = addrList.map((item) => ({
      ...item,
      status: 'pending',
    }));
    setAddrList(arr);

    arr.map((item, index) => {
      let url = 'http://' + item.address;
      Axios.post(url)
        .then((res) => {
          arr[index].status = 'success';
          let newArr = lodash.cloneDeep(arr);
          setAddrList(newArr);
        })
        .catch((err) => {
          arr[index].status = 'fail';
          let newArr = lodash.cloneDeep(arr);
          setAddrList(newArr);
        });
    });

    setRequestStatus(true);
  };

  /**
   * @description 停止所有请求
   */
  const stopAllRequest = () => {
    let arr: Array<serviceAddrInfo> = addrList.map((item) => ({
      ...item,
      status: 'hold',
    }));
    setAddrList(arr);
    setRequestStatus(false);
  };

  /**
   * @description 清楚所有添加的请求
   */
  const removeAllRequest = () => {
    setAddrList([]);
  };
  /**
   * @description componentDidMount
   */
  useLayoutEffect(() => {}, []);

  useEffect(() => {
    console.log('list change:', addrList);
  }, [addrList]);

  return (
    <F>
      <div>负债均衡示例:</div>
      <div className="addrList">
        <div className="addrList-input">
          {addrList.map((item, index) => (
            <div key={index} className="addrList-input-item">
              <Input
                addonBefore="http://"
                value={item.address}
                placeholder="localhost:10001"
                onChange={({ target: { value } }) => addAddress(value, index)}
              />
              <Input
                value={item.label}
                placeholder="flag"
                onChange={({ target: { value } }) =>
                  addAddressLabel(value, index)
                }
              />
            </div>
          ))}
          <div className="addrList-input textAlignRight">
            <Button onClick={pushOneEmptyServer}>添加</Button>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        {addrList.length > 0 ? (
          <p className="serverStatus">
            <span>服务器标识</span>
            <span>服务器状态</span>
          </p>
        ) : null}

        {addrList
          .filter((item) => item.inputDone)
          .map((item, index) => {
            const icon =
              item.status === 'success' ? (
                <CheckCircleOutlined />
              ) : item.status === 'fail' ? (
                <CloseCircleOutlined />
              ) : item.status === 'pending' ? (
                <SyncOutlined spin />
              ) : (
                <ExclamationCircleOutlined />
              );

            const color =
              item.status === 'success'
                ? 'success'
                : item.status === 'fail'
                ? 'error'
                : item.status === 'pending'
                ? 'processing'
                : 'warning';
            return (
              <p key={index} className="serverStatus">
                <span>{item.label}</span>
                <span>
                  <Tag icon={icon} color={color}>
                    {item.status}
                  </Tag>
                </span>
              </p>
            );
          })}
      </div>
      {/* <Divider /> */}
      <div className="operate">
        <Space size={20}>
          <Button
            type="primary"
            disabled={addrList.length === 0}
            onClick={startAllRequest}
          >
            开始
          </Button>
          <Button
            type="primary"
            disabled={!beginRequest}
            onClick={stopAllRequest}
          >
            停止
          </Button>
          <Button
            type="primary"
            danger
            disabled={addrList.length > 0 && beginRequest}
            onClick={removeAllRequest}
          >
            清除
          </Button>
        </Space>
      </div>
      <div>
        <div className="chart-container" id="chart-container"></div>
      </div>
    </F>
  );
}

export default LoadBalancing;
