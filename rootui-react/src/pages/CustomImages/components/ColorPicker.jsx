/* eslint-disable */
// Libraries :
import React, { Component,Fragment } from 'react';
import Pickr from '@simonwep/pickr'; // documentation about this library : https://github.com/Simonwep/pickr 
import '@simonwep/pickr/dist/themes/classic.min.css';

import "../style.scss";
import { Translation } from 'react-i18next';
import { next } from 'dom7';

export default class ColorPicker extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            pickr: null,
            value: props.value
        };
    }

    componentWillReceiveProps(nextProps) {
        // console.log("Recieving props", nextProps);
        if (this.state.value == nextProps.value)
            return;

        this.state.pickr.setColor(nextProps.value)
    }

    componentDidMount() {        
        const pickr = Pickr.create({
            el: '.rui-colorpicker',
            theme: 'classic',
            default: this.state.value,

            components: {
                // Main components
                preview: true,
                opacity: false,
                hue: true,
                lockOpacity: true,
                

                // Input / output Options
                interaction: {
                    hex: true,
                    rgba: false,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    input: true,
                    clear: false,
                    save: true
                }
            }
        })
        
        pickr.on('init', instance => {
            // console.log('Event: "init"', instance);
        }).on('hide', instance => {
            // console.log('Event: "hide"', instance);
            this.props.onHide(instance)
        }).on('show', (color, instance) => {
            // console.log('Event: "show"', color, instance);
        }).on('save', (color, instance) => {
            // console.log('Event: "save"', color, instance);
            this.setState({ 
                lastSetColor: color
            }, () => {
                this.props.onSave(color);
                pickr.hide();
            });
        }).on('clear', instance => {
            // console.log('Event: "clear"', instance);
        }).on('change', (color, source, instance) => {
            this.props.onChange(color);
            // console.log('Event: "change"', color, source, instance);
        }).on('changestop', (source, instance) => {
            // console.log('Event: "changestop"', source, instance);
        }).on('cancel', instance => {
            // console.log('Event: "cancel"', instance);
        }).on('swatchselect', (color, instance) => {
            // console.log('Event: "swatchselect"', color, instance);
        });
        
        this.setState({ 
            pickr: pickr,
            lastSetColor: this.state.value
        });
    }

    render() {
        // console.log("Pickr state", this.state.pickr && this.state.pickr.getSelectedColor())
        return(
            <Fragment>
                <Translation>
                    {
                        t=> {
                            $('input.pcr-save').val(t("Save"))
                            $('input.pcr-type').val(t("Hexa"))
                            return <div className="rui-colorpicker"></div>
                        }
                    }
                </Translation>
                
            </Fragment>
        )
    }
}