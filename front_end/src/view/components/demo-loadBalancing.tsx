/*
 * @Author: junjie.lean
 * @Date: 2021-11-08 22:41:45
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-11 17:47:53
 */

// load balancing demo

import React, {
  Fragment as F,
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Divider, Input, Space, Button, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import lodash from 'lodash';
import Axios from 'axios';

import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';

import './../../style/loadBalancing.scss';
import { cancelTimer, createTimer } from './../../util/outInterval';

/**
 * @description 初始化antv实例
 */
function initialDOM() {
  const ds = new DataSet();
  const dv = ds
    .createView()
    .source([])
    .transform({
      type: 'percent',
      field: 'value',
      dimension: 'label',
      groupBy: ['time'],
      as: 'percent',
    });

  const chart = new Chart({
    container: 'chart-dom',
    autoFit: true,
    height: 500,
  });

  chart.data(dv.rows);
  chart.scale({
    percent: {
      min: 0,
      // formatter(val) {
      //   return (val * 100).toFixed(2) + '%';
      // },
    },
  });

  chart.tooltip({
    shared: true,
    showMarkers: false,
  });

  chart.interval().position('time*percent').color('country').adjust('stack');
  chart.interaction('active-region');
  chart.render();
  return chart;
}

/**
 * @description 节流函数
 */
const throttleDisposeData = lodash.throttle(
  (fn = () => {}) => {
    fn();
  },
  2500,
  {
    leadubg: false,
  }
);

function LoadBalancing(props: any) {
  interface ServiceAddrInfo {
    address: string;
    label: string;
    status: 'success' | 'fail' | 'pending' | 'hold';
    // status: string;
    ind: number;
    inputDone: boolean;
  }

  const [addrList, setAddrList] = useState<Array<ServiceAddrInfo>>([
    {
      address: 'localhost:10001',
      label: 'Server A',
      status: 'hold',
      ind: 0,
      inputDone: true,
    },
  ]);

  const [beginRequest, setRequestStatus] = useState<boolean>(false);

  const [resList, setResList] = useState<Array<any>>([]);

  //请求数据的定时器标识
  const requestRef = useRef<string>('');

  //处理数据的定时器标识
  const disposeData = useRef<string>('');

  //antv的chart ref,返回自初始化图表的函数,保存图标实例
  const chartRef = useRef<Chart>();

  /**
   * @description 添加服务器地址
   * @param value address
   * @param index index
   */
  const addAddress = (value: string | any, index: number) => {
    const tmpArr: Array<ServiceAddrInfo> = lodash.cloneDeep(addrList);
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
    const tmpArr: Array<ServiceAddrInfo> = lodash.cloneDeep(addrList);
    tmpArr[index]['label'] = value;
    tmpArr[index]['inputDone'] =
      tmpArr[index]['address'].length > 0 && tmpArr[index]['label'].length > 0;
    setAddrList(tmpArr);
  };

  /**
   * @description 添加一条空白数据到列表
   */
  const pushOneEmptyServer = () => {
    if (addrList.some((item) => item.inputDone === false)) {
      return;
    }
    const tmp: ServiceAddrInfo = {
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
    let arr: Array<ServiceAddrInfo> = addrList.map((item) => ({
      ...item,
      status: 'pending',
    }));
    setAddrList(arr);
    setRequestStatus(true);
  };

  /**
   * @description 停止所有请求
   */
  const stopAllRequest = () => {
    let arr: Array<ServiceAddrInfo> = addrList.map((item) => ({
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
    setResList([]);
  };

  /**
   * @description componentDidMount
   */
  useLayoutEffect(() => {
    chartRef.current = initialDOM();
  }, []);

  /**
   * @description 切换 开始/停止 的请求的状态
   */
  useEffect(() => {
    if (beginRequest) {
      let newAddressList: Array<ServiceAddrInfo> = lodash.cloneDeep(addrList);
      let description: string = '每秒发送三次的请求';
      let interval: number = 333;

      let disposeFunction = () => {
        newAddressList.map((item, index) => {
          let url = 'http://' + item.address;
          Axios.post(url)
            .then((res) => {
              const { status, statusText, data } = res;
              if (status === 200 && statusText === 'OK') {
                //将服务器请求状态标识更改
                newAddressList[index].status = 'success';
                let newArr = lodash.cloneDeep(newAddressList);
                setAddrList(newArr);

                //将服务器返回的数据放在一个新的数组里
                let tmp = {
                  label: item.label,
                  source: data.source,
                  time: data.now,
                  status: 'success',
                };
                // let _resList = lodash.cloneDeep(resList);
                // let dataArr: Array<any> = [].concat(_resList, [tmp]);

                setResList((resList) => [].concat(resList, [tmp]));
              }
            })
            .catch((err) => {
              // console.log(err);
              //将服务器请求状态标识更改
              newAddressList[index].status = 'fail';
              let newArr = lodash.cloneDeep(newAddressList);
              setAddrList(newArr);

              //将服务器返回的数据放在一个新的数组里
              let tmp = {
                label: item.label,
                time: Date.now(),
                status: 'fail',
              };
              let _resList = lodash.cloneDeep(resList);
              let dataArr: Array<any> = [].concat(_resList, [tmp]);
              // setResList(() => dataArr);

              setResList((resList) => [].concat(resList, [tmp]));
            });
        });
      };

      //begin request;
      requestRef.current = createTimer(disposeFunction, interval, description);
    } else {
      // console.log('end request');
      cancelTimer(requestRef.current);
    }
  }, [beginRequest]);

  /**
   * @description 请求的返回值变化时,处理数据
   */
  useEffect(() => {
    // console.log(' useEffect:', resList);
    throttleDisposeData(() => {
      console.log(resList);
    });
  }, [resList]);

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
      <div className="chart-container">
        <div id="chart-dom"></div>
      </div>
    </F>
  );
}

export default LoadBalancing;
