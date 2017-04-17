import React, { Component } from 'react'
import reactCSS from 'reactcss'


export const styles = reactCSS({
  'default': {
    swatch: {
      padding: '5px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    },
    popover: {
      position: 'absolute',
      zIndex: '2',
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  },
});
