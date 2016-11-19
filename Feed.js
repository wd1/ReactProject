import React, { Component, PropTypes } from 'react';
import { StyleSheet, NavigatorIOS } from 'react-native';

import ThreadList from './ThreadList';

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default class Feed extends Component {

    render() {
        return ( <
            NavigatorIOS style = { styles.container }
            initialRoute = {
                {
                    title: 'Thread Lists',
                    component: ThreadList,
                    passProps: { listType: 'showAll', typeChanged: true }
                }
            }
            />
        );
    }
}
