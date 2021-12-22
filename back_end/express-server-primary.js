/*
 * @Author: junjie.lean
 * @Date: 2021-10-25 21:30:04
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-12-22 11:07:30
 */

const express = require('express');
const app = express();
const app2 = express();
const appPort = 10001;
const app2Port = 10002;

//请求拒绝率,有 ${rejectRate}%的概率拒绝此处请求;
const rejectRate = 50;

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.get('/', (req, res) => {
  res.send(`express server ${appPort}`);
});

app.post('/', (req, res, next) => {
  res.json({
    now: Date.now(),
    source: appPort,
  });
  next();
});

app.listen(appPort, () => {
  console.log(`${appPort} prot server start`);
});

app2.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app2.get('/', (req, res) => {
  res.send(`express server ${app2Port}`);
});

app2.post('/', (req, res, next) => {
  //拒绝率,有 rejectRate 的几率
  let reject = Math.round(Math.random() * 100) < rejectRate;
  if (!reject) {
    res.json({
      now: Date.now(),
      source: app2Port,
    });
    next();
  } else {
    res.status(404).send('request reject');
  }
});

app2.listen(app2Port, () => {
  console.log(`${app2Port} prot server start`);
});
