/*
 * @Author: junjie.lean
 * @Date: 2021-11-08 16:04:50
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-11-08 16:50:18
 */

import React, { Fragment as F } from 'react';
import unixLike from './../../media/picture/unixLike.gif';
function Os(props: any) {
  return (
    <F>
      <div>
        <h3>Unix系的操作系统分支关系图:</h3>
        <img src={unixLike} className="osHistory" />
      </div>
    </F>
  );
}

export default Os;
