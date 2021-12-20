/*
 * @Author: junjie.lean
 * @Date: 2021-11-08 22:46:29
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-12-20 16:16:45
 */

//nginx config

import React, { Fragment as F, useEffect, useState } from 'react';

import nginxMD from './resource/nginxConfig.md';
import ReactMarkdown from 'react-markdown';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AtomOneDark from 'react-syntax-highlighter/dist/esm/styles/prism/material-dark.js';

function NginxConfig(props: any) {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    setMarkdown(nginxMD);
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
                  // language={match[1]}
                  language={'nginx'}
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

export default NginxConfig;
