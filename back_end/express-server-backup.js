/*
 * @Author: junjie.lean
 * @Date: 2021-10-25 21:30:04
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-03 12:58:31
 */

const express = require('express');
const app = express();
const appPort = 10003;

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '');
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



