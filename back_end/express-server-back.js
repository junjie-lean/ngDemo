/*
 * @Author: junjie.lean
 * @Date: 2021-10-25 21:30:04
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-03 11:01:10
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

app.listen(10003, () => {
  console.log('10003 prot server start!');
});
