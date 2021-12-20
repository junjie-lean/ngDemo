/*
 * @Author: junjie.lean
 * @Date: 2021-11-03 13:12:47
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-12-20 15:42:14
 */

import React, { Fragment as F, useEffect, useState } from 'react';
// import Axios from 'axios';
import './../../style/code.scss';
import axiosMD from './resource/axiosConfig.md';
import ReactMarkdown from 'react-markdown';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AtomOneDark from 'react-syntax-highlighter/dist/esm/styles/prism/material-dark.js';

// front_end/node_modules/react-syntax-highlighter/dist/esm/styles/prism/material-dark.js
function Code() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    setMarkdown(axiosMD);
  }, []);

  return (
    <F>
      <div className="lean-demo1-container">
        <ReactMarkdown
          children={markdown}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={AtomOneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
    </F>
  );
}

export default Code;
