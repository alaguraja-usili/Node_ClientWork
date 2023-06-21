/* eslint-disable */
/**
 * Styles
 */
import "./carousel.scss";

/**
 * External Dependencies
 */
import React, { Component } from "react";
import Swiper from "react-id-swiper";
// import { Line } from 'react-chartjs-2';
// import Chartist from 'react-chartist';
const { ipcRenderer } = window.require("electron");
import { Button } from "reactstrap";
/**
 * Internal Dependencies
 */
import { render } from "../../../utils/generateReactSvg";
import Icon from "../../../components/icon";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * (100 - 40) + 40)
      ),
    };

    this.carouselSwiper = false;
  }

  render() {
    const { items } = this.props;

    const {} = this.state;

    console.log(items);
    let elements = this.props.items.map((item) => {
      let innerElement = item.name ? (
        <>
          <span className="rui-icon rui-icon-stroke-1_5">
            {item.crosshairId ? (
              render(JSON.parse(item.crosshairId))
            ) : (
              <img
                style={{ maxHeight: "20px" }}
                src={JSON.parse(item.crosshairImage).localPath}
                className="icon-file"
                type="file"
                alt=""
              />
            )}
          </span>
          {item.name}
        </>
      ) : (
        <>
          {item.crosshairId ? (
            render(JSON.parse(item.crosshairId))
          ) : (
            <img
              style={{ maxHeight: "20px" }}
              src={JSON.parse(item.crosshairImage).localPath}
              className="icon-file"
              type="file"
              alt=""
            />
          )}
        </>
      );

      return (
        <div className="swiper-slide">
          <div
            className="demo-icons "
            style={{ minHeight: "116px" }}
            onClick={() => {
                
              item.crosshairId
                ? this.props.setCurrentActiveCrosshair(
                    JSON.parse(item.crosshairId)
                  )
                : this.props.setCurrentActiveCrosshairImage(
                    JSON.parse(item.crosshairImage)
                  );
              if (item.crosshairId)
                ipcRenderer.send(
                  "setCurrentActiveCrosshair",
                  item.crosshairId,
                  this.props.source,
                  item.name
                );
            }}
          >
            {item.yt_link ? (
              <div className="position-top-right-icon">
                <Button
                  className="btn-custom-round"
                  onClick={() => {
                    ipcRenderer.send("new-window", item.yt_link);
                  }}
                >
                  <Icon name="youtube" />
                </Button>
              </div>
            ) : (
              <></>
            )}

            {innerElement}
          </div>
        </div>
      );
    });

    return (
      <div className="rui-swiper">
        <Swiper
          lazy={false}
          loop={false}
          slidesPerView="auto"
          spaceBetween={30}
          grabCursor
          speed={400}
          keyboard={{ enabled: true }}
          getSwiper={(swiper) => {
            this.carouselSwiper = swiper;
          }}
        >
          {elements}
        </Swiper>
        <div
          className="swiper-button-next"
          onClick={() => {
            if (this.carouselSwiper !== null) {
              this.carouselSwiper.slideNext();
            }
          }}
          onKeyUp={() => {}}
          role="button"
          tabIndex={0}
        >
          <Icon name="chevron-right" />
        </div>
        <div
          className="swiper-button-prev"
          onClick={() => {
            if (this.carouselSwiper !== null) {
              this.carouselSwiper.slidePrev();
            }
          }}
          onKeyUp={() => {}}
          role="button"
          tabIndex={0}
        >
          <Icon name="chevron-left" />
        </div>
      </div>
    );
  }
}

export default Carousel;
