import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TextInput, TouchableHighlight, Dimensions } from 'react-native';

import SpeakerMessage from './SpeakerMessage';
import TimerMixin from 'react-timer-mixin';

const styles = StyleSheet.create({
    pic: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        width: 350,
        height: 250,
    },
    description: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },

   answerInput: {
        height: 36,
        fontSize: 18,
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 4,
        padding: 5,
        flex: 1
    },
    buttonText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#327bf7',
        borderRadius: 8,
        justifyContent: 'center'
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    playerSentence: {
        backgroundColor: '#F5FCFF',
        padding: 10,
        textAlign : 'right'
    }
});

const problemViewStyle = StyleSheet.create({
    problemView: {

    },
    problemText: {
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    thumbnail: {
        width: 50,
        height: 50,
        marginRight: 10
    },
});

const inputAnswerStyle = StyleSheet.create( {
    replyButton: {
        height: 36,
        width: 100,
        backgroundColor: '#327bf7',
        borderRadius: 8,
        justifyContent: 'center',
        marginRight: 10
    },
    inputView: {
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#F5FCFF',
    }
});

const INCORRECT = 0;
const SOLVED = 1;
const HELPED = 2;

export default class ProblemDetail extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            answerInputed: '',
            isHintRequired: false,
            isAnswerRequired: false,
            isInputReqruied: false,
            isReplyReqruied: false,
            isSuccessRequired: false,
            isIncorrectRequired: false,
            isInputFormRequired: true,
            isEnded: false,
            buttonText: this.props.independentTexts.GiveMeAHint['1'].slice(4),
            currentPost: this.props.currentThread.posts.post_1,
            postIndex: 1,
            answer:'',
            solvingState: INCORRECT,
            isOhIGotItRequired: false,
            isGotItRequired: false,
            _scrollToBottomY: 0
        }
    }
    
    render() {
                
        var footerY;
        var posts = [];
        var problemPicURI = (typeof this.state.currentPost.ProblemPic !== 'undefined') ? this.state.currentPost.ProblemPic : '';
        var hintPicURI = (typeof this.state.currentPost.HintPic !== 'undefined') ? this.state.currentPost.HintPic : '';
        var answerPicURI = (typeof this.state.currentPost.AnswerPic !== 'undefined') ? this.state.currentPost.AnswerPic : '';
        var problemText = (typeof this.state.currentPost.ProblemText !== 'undefined') ? this.state.currentPost.ProblemText : '';
        var hintText = (typeof this.state.currentPost.HintText !== 'undefined') ? this.state.currentPost.HintText : '';
        var answerText = (typeof this.state.currentPost.AnswerText !== 'undefined') ? this.state.currentPost.AnswerText : '';
        
//        var incorrectText = (typeof this.state.currentPost.IncorrectText !== 'undefined') ? this.state.currentPost.IncorrectText : '';

/*        var authorName;
        if ( this.state.postIndex > 2 )
            authorName = this.props.currentThread.threadVIP;
        else
            authorName = this.props.currentThread.threadNPCName;

        problemText = '@' + this.props.currentThread.threadNPCName + ": " + problemText;
        problemText = problemText.replace("Player", "@" + this.props.playerName);*/

        var npcCount = this.props.npcCount;
        var rNum3 = Math.floor((Math.random() * npcCount)) % npcCount;
        var rNum2 = Math.floor((Math.random() * npcCount)) % npcCount;


        var authorName;
        var playerName = this.props.playerName;
        var hintNPCName = this.props.npcNameLists[rNum2].npcName;
        var answerNPCName = this.props.npcNameLists[rNum3].npcName;
        
        var buttonAnswerText = this.props.independentTexts.GiveMeAnswer['1'];
        
        var buttonOhNowIGotItText = this.props.independentTexts.OhNowIGotIt['1'];

/*--------------------------------------Problem Text---------------------------------------------*/
        if ( this.state.postIndex > 2 )
            authorName = this.props.currentThread.threadVIP;
        else
            authorName = this.props.currentThread.threadNPCName;

//        problemText = problemText.split('@$').join('@' + authorName);
//        problemText = problemText.split('@@').join('@' + authorName);
        problemText = this.replaceSignWithName(problemText, '@$', authorName);
        problemText = this.replaceSignWithName(problemText, '@@', playerName);
/*--------------------------------------Problem Text---------------------------------------------*/


/*--------------------------------------Start Hint Message---------------------------------------------*/
        var giveMeAHint = this.props.independentTexts.GiveMeAHint['1'];
        var giveMeAHintText = this.props.independentTexts.GiveMeAHintText['1'];

        giveMeAHint = this.replaceSignWithName(giveMeAHint, '@@', playerName);
        giveMeAHintText = this.replaceSignWithName(giveMeAHintText, '@@', playerName);
        giveMeAHintText = this.replaceSignWithName(giveMeAHintText, '@%', hintNPCName);

        var hintImage = this.state.isHintRequired ?
            ( 
                <View style={{marginTop: 10}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={giveMeAHint} /> 
                    <SpeakerMessage 
                        headShotURI={this.props.npcLists[hintNPCName].Headshot} 
                        sentences={giveMeAHintText} /> 
                    <Image source={{uri: hintPicURI}} style={styles.pic}/>
                    <View style={styles.separator} />
                </View> 
            ) :
            ( <View/>);
/*--------------------------------------End Hint Message---------------------------------------------*/


/*--------------------------------------Start Answer Message---------------------------------------------*/
        var giveMeAnswer = this.props.independentTexts.GiveMeAnswer['1'];
        var GiveMeAnswerText = this.props.independentTexts.GiveMeAnswerText['1'] + this.state.currentPost.Answer;

        giveMeAnswer = this.replaceSignWithName(giveMeAnswer, '@@', playerName);
        GiveMeAnswerText = this.replaceSignWithName(GiveMeAnswerText, '@@', playerName);
        GiveMeAnswerText = this.replaceSignWithName(GiveMeAnswerText, '@%', answerNPCName);

        var answerImage = this.state.isAnswerRequired ?
            ( 
                <View style={{marginTop: 10, paddingRight: 10}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={giveMeAnswer} /> 
                    <SpeakerMessage 
                        headShotURI={this.props.npcLists[answerNPCName].Headshot} 
                        sentences={GiveMeAnswerText} /> 
                    <Image source={{uri: answerPicURI}}  style={styles.pic}/>
                    <View style={styles.separator} />
                </View> 
            ):
            ( <View/>);
/*--------------------------------------End Answer Message---------------------------------------------*/


/*--------------------------------------Start Answer Reply Button---------------------------------------------*/

        var replyButton = this.state.isReplyReqruied ?
            ( <TouchableHighlight style={inputAnswerStyle.replyButton}
                                    underlayColor='#327bf7'
                                    onPress={this.checkAnswer.bind(this)}>
                            <Text style={styles.buttonText}>Reply</Text>
                        </TouchableHighlight>) :
            ( <View/>);
        
/*--------------------------------------End Answer Reply Button---------------------------------------------*/


/*--------------------------------------Start Success Image ---------------------------------------------*/
        var theAnswerIs = this.props.independentTexts.TheAnswerIs['1'] + this.state.answerInputed;
        var successfulText = this.props.currentPost.SuccessfulText;

        theAnswerIs = this.replaceSignWithName(theAnswerIs, '@@', playerName);
        theAnswerIs = this.replaceSignWithName(theAnswerIs, '@$', authorName);

        successfulText = this.replaceSignWithName(successfulText, '@@', playerName);
        successfulText = this.replaceSignWithName(successfulText, '@$', authorName);

        var successImage = this.state.isSuccessRequired ?
            ( 
                <View style={{marginTop: 10, paddingRight: 10}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={theAnswerIs} /> 
                    <SpeakerMessage 
                        headShotURI={this.props.npcLists[this.props.currentThread.threadNPCName].Headshot} 
                        sentences={successfulText} /> 
                    <Image source={{uri: answerPicURI}}  style={styles.pic}/>
                    <View style={styles.separator} />
                </View> 
            ):
            ( <View/>);
/*--------------------------------------End Success Image ---------------------------------------------*/

/*--------------------------------------End Incorrect Text ---------------------------------------------*/
        var incorrectText = this.props.currentPost.IncorrectText;
        var rNum4 = Math.floor((Math.random() * npcCount)) % npcCount;
        var incorrectNPCName = this.props.npcNameLists[rNum4].npcName;

        incorrectText = this.replaceSignWithName(incorrectText, '@@', playerName);
        incorrectText = this.replaceSignWithName(incorrectText, '@$', incorrectNPCName);

        var incorrectImage = this.state.isIncorrectRequired ?
            ( 
                <View style={{marginTop: 10, paddingRight: 10}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={theAnswerIs} /> 
                    <SpeakerMessage 
                        headShotURI={this.props.npcLists[incorrectNPCName].Headshot} 
                        sentences={incorrectText} /> 
                    <View style={styles.separator} />
                </View> 
            ):
            ( <View/>);
/*--------------------------------------End Incorrect Text ---------------------------------------------*/
        
/*--------------------------------------Start AnswerIs -------------------------------------------------*/


/*--------------------------------------Start AnswerIs -------------------------------------------------*/

/*--------------------------------------Start InputAnswer Form---------------------------------------------*/
        var ansPlaceHolder = '@' + authorName + "The answer is";
        var inputAnswerForm = this.state.isInputFormRequired ?
            (
                <View style={{paddingTop:10, paddingLeft: 10}}>
                    <View style={inputAnswerStyle.inputView}>
                        <TextInput style={styles.answerInput} keyboardType = 'numeric' placeholder={ansPlaceHolder}
                            onEndEditing={this.hideKeyboard.bind(this)} onChange={this.captureAnswer.bind(this)} onFocus={this.showKeyboard.bind(this)}/>
                        {replyButton}
                    </View>
                    

                </View>
            ) :
            ( <View/> ); 
/*--------------------------------------End InputAnswer Form---------------------------------------------*/

/*--------------------------------------Start OhIGotIt---------------------------------------------*/

        var ohNowIGotIt = this.props.independentTexts.OhNowIGotIt['1'];

        ohNowIGotIt = this.replaceSignWithName(ohNowIGotIt, '@@', playerName);
        ohNowIGotIt = this.replaceSignWithName(ohNowIGotIt, '@#', authorName);

        var ohNowIGotItImage = this.state.isOhIGotItRequired ?
            (
                <View style={{marginTop: 10}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={ohNowIGotIt} /> 
                    <View style={styles.separator} />
                </View> 
            ) :
            ( <View/> ); 
/*--------------------------------------End OhIGotIt---------------------------------------------*/

/*--------------------------------------Start GotIt---------------------------------------------*/

        var gotIt = this.props.independentTexts.GotIt['1'];

        gotIt = this.replaceSignWithName(gotIt, '@@', playerName);
        gotIt = this.replaceSignWithName(gotIt, '@#', authorName);

        var gotItImage = this.state.isGotItRequired ?
            (   
                <View style={{marginTop: 10}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={gotIt} /> 
                    <View style={styles.separator} />
                </View> 
            ) :
            ( <View/> ); 
/*--------------------------------------End GotIt---------------------------------------------*/

        var keypad = this.state.isInputRequired?
            ( <View style={{height:120, width: 300}}></View>):(<View/>);


        return (
            <ScrollView ref="scrollview" 
                onContentSizeChange={(contentWidth, contentHeight) => {
                this.setState({_scrollToBottomY:contentHeight})
            }}>
                <View>
                    <View style={problemViewStyle.problemView}> 
                        <View style={problemViewStyle.container}>
                            <SpeakerMessage 
                                headShotURI={this.props.npcLists[this.props.currentThread.threadNPCName].Headshot} 
                                sentences={problemText} />
                        </View>
                        <Image source={{uri: problemPicURI}} style={styles.pic}/>
                        <View style={styles.separator} />
                    </View>

                    {hintImage}
                    {answerImage}
                    {successImage}
                    {incorrectImage}
                    {inputAnswerForm}
                    <View style={{paddingLeft:10, paddingRight:10, marginTop: 10, marginBottom: 10}}>
                        <TouchableHighlight style={styles.button}
                                    underlayColor='#327bf7'
                                    onPress={this.giveHint.bind(this)}>
                            <Text style={styles.buttonText}>{this.state.buttonText}</Text>
                        </TouchableHighlight>
                    </View>
                    {ohNowIGotItImage}
                    {gotItImage}
                </View>
                {keypad}
            </ScrollView>
       );
    }

    replaceSignWithName(str, sign, name) {
        var str1;
        str1 = str.split(sign).join('@' + name);
        return str1;
    }

    componentDidUpdate(prevProps, prevState) {
        if ( this.state._scrollToBottomY > Dimensions.get('window').height - 100)
            this.refs.scrollview.scrollTo({y:this.state._scrollToBottomY - Dimensions.get('window').height+ 50});
        else
            this.refs.scrollview.scrollTo({y:-50});

    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {
        alert("sdf");
    }

    hideKeyboard(event) {
        this.setState({ answerInputed: event.nativeEvent.text });
        this.setState({ isInputRequired: false});
    }   

    showKeyboard(event) {
        this.setState({ isInputRequired: true});
        this.setState({ isReplyReqruied: true});
    }

    captureAnswer(event) {
        
    }

    giveHint(event) {
        if ( this.state.solvingState == INCORRECT ) {
            if ( this.state.isHintRequired == false ) {
                setTimeout(() => { 
                    this.setState({ isHintRequired: true })
                    this.setState({buttonText: this.props.independentTexts.GiveMeAnswer['1'].slice(4)});
                    this.setState({isIncorrectRequired: false});
                }, 1000);
                

            } else if (this.state.isAnswerRequired == false ) {
                setTimeout(() => { 
                    this.setState({ isAnswerRequired: true });
                    this.setState({isInputFormRequired: false});
                    this.setState({isIncorrectRequired: false});
                    this.setState({buttonText: this.replaceSignWithName(this.props.independentTexts.OhNowIGotIt[1].slice(4), '@#', "YOU")});
                    this.setState({isEnded: true});
                    this.setState({solvingState: HELPED});
                }, 1000);
            }
        }
        else if ( this.state.solvingState == HELPED ){
            if ( this.state.isOhIGotItRequired == false ) {
                setTimeout(() => { 
                    this.setState({isOhIGotItRequired:true});
                }, 1000);
                setTimeout(() => { this.gotoNextPost()}, 2000);
            }
        }
        else if ( this.state.solvingState == SOLVED ) {
            if ( this.state.isOhIGotItRequired == false ) {
                this.setState({isOhIGotItRequired:true});
                setTimeout(() => { this.gotoNextPost()}, 2000);
            }
        }
    }
    
    checkAnswer(event) {
        setTimeout(() => { 
            if ( this.state.answerInputed == this.state.currentPost.Answer )
            {
                this.setState({isSuccessRequired: true});
                this.setState({isIncorrectRequired: false});
                this.setState({isInputFormRequired: false});
                this.setState({buttonText: this.replaceSignWithName(this.props.independentTexts.GotIt[1].slice(4), '@$', this.props.currentThread.threadNPCName)});
                this.setState({solvingState: SOLVED});
                this.setState({isEnded: true});
                this.setState({});
            }
            else {
                this.setState({isIncorrectRequired: true});
                this.setState({isSuccessRequired: false});
            }
            this.setState({ isReplyReqruied: false });
        }, 1000);
    }
    
    addAnotherRow() {
        return <Text>New Row</Text>
    }
    gotoNextPost() {
        if ( this.state.postIndex >= this.props.currentThread.posts.NumberOfPosts )
        {
            this.props.navigator.pop();
            return;
        }   
        this.setState({
            answerInputed: '',
            isHintRequired: false,
            isAnswerRequired: false,
            isInputReqruied: false,
            isReplyReqruied: false,
            isSuccessRequired: false,
            isIncorrectRequired: false,
            isInputFormRequired: true,
            isEnded: false,
            buttonText: this.props.independentTexts.GiveMeAHint[2].slice(4),
            solvingState: INCORRECT,
            answer:'',
            isOhIGotItRequired: false,
            isGotItRequired: false,
            currentPost: this.props.currentThread.posts["post_"+(this.state.postIndex+1)],
            postIndex: this.state.postIndex+1,
            _scrollToBottomY: 0
        });
    }
}