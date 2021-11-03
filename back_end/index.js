/*
 * @Author: junjie.lean
 * @Date: 2021-10-25 21:30:04
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-03 10:28:32
 */

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('express server start');
});

app.post('/', (req, res, next) => {
  res.json({
    now: Date.now(),
    source: 10000,
  });
  next();
});

const app2 = express();

app2.get('/', (req, res) => {
  res.send('express server start');
});

app.post('/', (req, res, next) => {
  res.json({
    now: Date.now(),
    source: 10001,
  });
  next();
});

app.listen(10001, () => {
  console.log('10000 prot server start!');
});

app2.listen(10002, () => {
  console.log('10001 port server start!');
});
