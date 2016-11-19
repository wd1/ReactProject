import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    headShot: {
        width: 50,
        height: 50,
        marginRight: 10
    },
    sentences: {
        flex:1,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#656565',
    }
});

export default class SpeakerMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (             
            <View style={styles.container}>
                <Image source={{uri: this.props.headShotURI}} style={styles.headShot} />
                <Text style={styles.sentences}>{this.props.sentences}</Text>
            </View>      
        );
    }
}