/*
 * @Author: junjie.lean
 * @Date: 2021-11-08 22:41:45
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-12-22 09:35:02
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
import moment from 'moment';
import './../../style/loadBalancing.scss';
import { cancelTimer, createTimer } from './../../util/outInterval';

//统计数据间隔
const countInterval: number = 3000;

/**
 * @description 初始化antv实例
 */
function initialDOM() {
  const chart = new Chart({
    container: 'chart-dom',
    autoFit: true,
    height: 350,
    width: 400,
  });

  chart.scale('count', {
    // nice: true,
    max: 50,
    min: 0,
  });

  chart.tooltip({
    // shared: true,
    showMarkers: false,
    title(title) {
      return '时间:' + title;
    },
    customItems(items) {
      console.log('list:', items);
      let formatArray = items.map((item) => ({
        ...item,
        name: item.data.name,
        value: item.value + '次',
      }));
      // console.log('before:', items);
      // console.log('after:', formatArray);
      return formatArray;
    },
  });

  chart.legend(false);

  const colorList = [
    {
      color: '#667898',
      name: 'Server A',
    },
    {
      color: '#62daab',
      name: 'Server B',
    },
    {
      color: '#6395f9',
      name: 'Server C',
    },
    {
      color: '#f6c12c',
      name: 'Server D',
    },
  ];

  chart
    .interval()
    .style('name', (name) => {
      return {
        fill: colorList.find((item) => item.name === name)?.color ?? '',
      };
    })
    .position('time*count')
    // .color('color')
    .size(35)
    .adjust('stack');
  // chart.interaction('active-region');
  chart.render();

  return chart;
}

function initialPieChart() {
  const chart = new Chart({
    container: 'chart-pie-dom',
    autoFit: true,
    height: 350,
    width: 400,
  });
  chart.coordinate('theta', {
    radius: 0.75,
  });

  chart.interval().position('count').color('name').adjust('stack');

  chart.tooltip({
    showTitle: false,
    showMarkers: false,
  });

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
  countInterval,
  {
    // leadubg: false,
    leading: false,
    // trailing:false
  }
);

/**
 * @description 组件
 */
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

  const [requestInterval, setRequestInterval] = useState<number>(150);

  const [beginRequest, setRequestStatus] = useState<boolean>(false);

  const [resList, setResList] = useState<Array<any>>([]);

  const [chartData, setChartData] = useState<Array<any>>([]);

  const [pieChartData, setPieChartData] = useState<Array<any>>([]);

  //请求数据的定时器标识
  const requestRef = useRef<string>('');

  //处理数据的定时器标识
  const disposeData = useRef<string>('');

  //antv的chart ref,返回自初始化图表的函数,保存图标实例
  const chartRef = useRef<Chart>();
  const pieChareRef = useRef<Chart>();
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
    let arr: Array<ServiceAddrInfo> = addrList
      .filter((item) => item.label)
      .map((item) => ({
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
   * @description 清除所有添加的请求
   */
  const removeAllRequest = () => {
    setAddrList([]);
    setResList([]);
    setChartData([]);
    setPieChartData([]);
  };

  /**
   * @description 每轮数据更新的数据处理函数,和countInterval有关
   */
  const perLoopRenderChart = () => {
    let newArray = lodash.groupBy(
      resList.filter((item) => item.time > Date.now() - countInterval),
      'label'
    );
    // console.log(newArray);
    let now = moment().format('HH:mm:ss');

    let tmpChartData = lodash
      .cloneDeep(chartData)
      // 过滤掉7轮之前的数据,
      .filter((item) => item.timeStamp > Date.now() - countInterval * 7);

    let pieArray = lodash.groupBy(
      resList.filter((item) => item.time > Date.now() - countInterval),
      'source'
    );

    console.log(pieArray);
    let peiData = Reflect.ownKeys(pieArray)
      .filter((key) => key !== 'undefined')
      .map((item) => ({
        [item]: pieArray[item].length,
        name: item,
        count: pieArray[item].length,
      }));
    // console.log('peiData', peiData);

    setPieChartData(peiData);

    let colorList = [
      '#62daab',
      '#5b8ef9',
      '#5d7092',
      '#145ab7',
      '#a0c8ff',
      '#bce3ff',
    ];

    Object.keys(newArray).map((key, index) => {
      let obj = {
        name: key,
        time: now,
        timeStamp: Date.now(),
        count: newArray[key].filter((item) => item.status === 'success').length,
        // color: colorList[index],
      };
      tmpChartData.push(obj);
    });

    let tmpChartDataSort = lodash.sortBy(tmpChartData, 'name');

    // 每轮请求完成后,把上一轮的请求列表置为空
    setResList([]);
    setChartData(tmpChartDataSort);
  };

  /**
   * @description 开始处理请求
   * @param isBegin boolean
   */
  const beginRequestFn = (isBegin) => {
    if (isBegin) {
      let newAddressList: Array<ServiceAddrInfo> = lodash.cloneDeep(addrList);
      let description: string = '每秒发送请求';
      let interval: number = requestInterval;

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
  };

  /**
   * @description componentDidMount
   */
  useLayoutEffect(() => {
    // console.log('did mounted');
    chartRef.current = initialDOM();
    pieChareRef.current = initialPieChart();
  }, []);

  /**
   * @description 切换 开始/停止 的请求的状态
   */
  useEffect(() => {
    beginRequestFn(beginRequest);
  }, [beginRequest]);

  /**
   * @description 请求的返回值变化时,处理数据
   */
  useEffect(() => {
    if (beginRequest) {
      throttleDisposeData(perLoopRenderChart);
    }
  }, [resList]);

  /**
   * @description   把处理过后的数据放入渲染
   */
  useEffect(() => {
    // console.log(chartData);
    chartRef.current.changeData(chartData);
  }, [chartData]);

  useEffect(() => {
    console.log(pieChartData);
    pieChareRef.current.changeData(pieChartData);
  }, [pieChartData]);

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
            <Button onClick={pushOneEmptyServer} disabled={beginRequest}>
              添加
            </Button>
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
        <div id="chart-pie-dom"></div>
      </div>
    </F>
  );
}

export default LoadBalancing;
