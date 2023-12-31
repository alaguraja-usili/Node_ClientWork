/**
 * Styles
 */
import './style.scss';
import Icon from '../../components/icon';

/**
 * External Dependencies
 */
import React, { Component } from 'react';
import classnames from 'classnames/dedupe';

/**
 * Component
 */
class TouchSpin extends Component {
    onChange( newVal ) {
        const {
            min,
            max,
            onChange = () => {},
        } = this.props;

        newVal = parseFloat( newVal );

        if ( typeof min !== 'undefined' ) {
            newVal = Math.max( min, newVal );
        }
        if ( typeof max !== 'undefined' ) {
            newVal = Math.min( max, newVal );
        }

        onChange( newVal );
    }

    render() {
        const {
            className,
            position,
            min,
            max,
            step = 1,
            value,
            verticalButtons,
            verticalButtonsOverlay,
            icon1,
            icon2,
        } = this.props;

        return (
            <div className={ classnames(
                'rui-touchspin',
                position ? `rui-touchspin-${ position }` : '',
                verticalButtons ? `rui-touchspin-vertical` : '',
                verticalButtons && verticalButtonsOverlay ? `rui-touchspin-overlay` : '',
                className
            ) }>
                <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected">
                    { ! verticalButtons ? (
                        <span className="input-group-btn input-group-prepend">
                            <button
                                className="btn btn-grey-2 btn-uniform bootstrap-touchspin-down"
                                onClick={ () => {
                                    this.onChange( value - step );
                                } }
                            ><Icon name={ icon1 + "" } /></button>
                        </span>
                    ) : '' }
                    <input
                        className="form-control"
                        type="number"
                        icon1={ icon1 }
                        icon2={ icon2 }
                        value={ value }
                        min={ min }
                        max={ max }
                        step={ step }
                        data-touchspin-btn="btn-grey-2"
                        onChange={ ( e ) => {
                            this.onChange( e.target.value );
                        } }
                    />
                    { ! verticalButtons ? (
                        <span className="input-group-btn input-group-append">
                            <button
                                className="btn btn-grey-2 btn-uniform bootstrap-touchspin-up"
                                onClick={ () => {
                                    this.onChange( value + step );
                                } }
                            ><Icon name={ icon2 + "" } /></button>
                        </span>
                    ) : '' }
                    { verticalButtons ? (
                        <span className="input-group-btn-vertical">
                            <button
                                className="btn btn-grey-2 btn-uniform bootstrap-touchspin-up"
                                onClick={ () => {
                                    this.onChange( value + step );
                                } }
                            ><Icon name={ icon2 + "" } /></button>
                            <button
                                className="btn btn-grey-2 btn-uniform bootstrap-touchspin-down"
                                onClick={ () => {
                                    this.onChange( value - step );
                                } }
                            >-</button>
                        </span>
                    ) : '' }
                </div>
            </div>
        );
    }
}

export default TouchSpin;
