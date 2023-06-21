/**
 * External Dependencies
 */
import React, { Component } from 'react';

/**
 * Internal Dependencies
 */
import PageWrap from '../../components/page-wrap';
// import PageTitle from '../../components/page-title';
import PageContent from '../../components/page-content';
import Content from './content'

/**
 * Component
 */
class FormsRangeSliderPage extends Component {
    render() {
        return (
            <PageWrap>
                { /* <PageTitle>
                    <h1>Designer</h1>
                </PageTitle> */ }
                <PageContent>
                    <Content />
                </PageContent>
            </PageWrap>
        );
    }
}

export default FormsRangeSliderPage;
