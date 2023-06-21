/* eslint-disable */
import React, {useState, useEffect} from 'react'

import Slider from "../../../components/range-slider";
import "../style.scss";

import { withTranslation, WithTranslation, Trans } from 'react-i18next';
import i18n from '../../../i18n';
const cn = require("chinese-numbering");

function AttributeSlider(props) {
    // Name, Min,Max, featuretochange(ex firingOffset), unit(secs, px, etc)
    const [currentVal,setCurrentVal] = useState(props.sliderValue);

    useEffect(() => {
      if(props.sliderValue){
          setCurrentVal(props.sliderValue)
      }
    }, [props.sliderValue]) // This will only run when one of those variables change

    return (
      <div>
              <div className="row">
              <div className="description" >
                  <Trans>{props.name}</Trans>
                </div>
                <div className="col rui-irs">
                  <Slider
                    value={
                      currentVal
                    }
                    min={props.min}
                    step={props.step}
                    max={props.max}
                    onChange={(val) => {
                        props.sliderOnChange(val, props.feature1,props.feature2)
                        setCurrentVal(val)
                    }}
                  />
                </div>
                <div className="w-10">
                  {/* Create an input box that modifies currentVal */}
                  {/* <input
                    className="attribute-input"
                    value={currentVal}
                    onChange={(e) => {
                      setCurrentVal(parseFloat(e.target.value));
                      props.sliderOnChange(parseFloat(e.target.value), props.feature1,props.feature2)
                    }}
                  /> */}

                    { String("zhCN" === i18n.language ? cn.numberToChinese(parseFloat(currentVal).toFixed(2) - 0) :parseFloat(currentVal).toFixed(2) - 0 ) + String(i18n.t(props.unit))}
                </div>
              </div>
      </div>
    );
  }

  export default withTranslation()(AttributeSlider);