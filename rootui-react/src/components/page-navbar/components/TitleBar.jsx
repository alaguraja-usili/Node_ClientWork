/* eslint-disable */
import React, { Component } from 'react';

import { TitleBar } from 'react-desktop/windows';

const { ipcRenderer } = window.require('electron');

export default class extends Component {
  static defaultProps = {
    color: '#1c1c1c',
    theme: 'dark'
  };

  constructor(props) {
    super(props);
    this.state = { isMaximized: false };

    ipcRenderer.on('maximize', (event, arg) => this.setState({ isMaximized: true }));
    ipcRenderer.on('unmaximize', (event, arg) => this.setState({ isMaximized: false }));
  }

  close = () => ipcRenderer.send('close-app')
  minimize = () => ipcRenderer.send('minimize-app')
  toggleMaximize = () => { this.setState({ isMaximized: true }); ipcRenderer.send('maximize-app') };
  toggleRestore = () => { this.setState({ isMaximized: false }); ipcRenderer.send('unmaximize-app') };

  render() {
    return (
      <TitleBar
        title=""
        controls
        isMaximized={ipcRenderer.sendSync('getMaximized')}
        theme={this.props.theme}
        background={this.props.color}
        onCloseClick={this.close}
        onMinimizeClick={this.minimize}
        onMaximizeClick={this.toggleMaximize}
        onRestoreDownClick={this.toggleRestore}
      />
    );
  }
}