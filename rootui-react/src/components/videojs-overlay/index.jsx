/*eslint-disable*/
import React, { Component } from 'react';
import videojs from 'video.js';
import overlay from 'videojs-overlay';
import '../../../node_modules/video.js/dist/video-js.css';
import '../../../node_modules/videojs-overlay/dist/videojs-overlay.css';


export default class Player extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    window.videojs = videojs;
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });
    this.player.fluid(true);
    videojs.registerPlugin('overlay', overlay);
    this.player.overlay(this.props.captions);

  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div className="video-content"style={{maxWidth:"1080px"}}>
        <video
          ref={node => (this.videoNode = node)}
          className="video-js vjs-big-play-centered"
          crossOrigin="anonymous"
          
        />
      </div>
    );
  }
}