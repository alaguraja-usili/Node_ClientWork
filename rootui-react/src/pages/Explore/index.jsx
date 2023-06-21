/**
 * Styles.
 */

/**
 * External Dependencies
 */
import React, { Component } from 'react';

/**
 * Internal Dependencies
 */
import Content from './content'
import PageWrap from '../../components/page-wrap';
// import PageTitle from '../../components/page-title';
import PageContent from '../../components/page-content';

/**
 * Component
 */
class Dashboard extends Component {
    render() {
        return (
            <PageWrap>
                { /* <PageTitle>
                    <h1>Explore</h1>
                </PageTitle> */ }
                <PageContent>
                    <Content />
                </PageContent>
            </PageWrap>
        );
    }
}

export default Dashboard;
