import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TextInput, TouchableHighlight, Dimensions } from 'react-native';

import SpeakerMessage from './SpeakerMessage';
import TimerMixin from 'react-timer-mixin';

const TIME_DELAY_CHECK_POST = 3000;
const TIME_DELAY_PROBLEM_POST = 1000;
const styles = StyleSheet.create({
    pic: {
        marginTop:10,
        marginLeft: 10,
        marginRight: 10,
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
        borderWidth: 0,
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
        backgroundColor: '#FFFFFF',
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
        backgroundColor: '#FFFFFF',
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
            incorrectAnswer: '',
            answerInputed: '',
            answerTextInputed: '',

            isHintAskRequired: false,
            isHintRequired: false,

            isAnswerAskRequired: false,
            isAnswerRequired: false,

            isInputReqruied: false,
            isReplyReqruied: false,

            isSuccessAskRequired: false,
            isSuccessRequired: false,

            isIncorrectAskRequired: false,
            isIncorrectRequired: false,

            isInputFormRequired: true,
            isProblemImageRequired: false,

            isFirstButtonRequired: false,
            pausedIndex : 0,
            firstAnswerButtonText:'',
            headShotForProblemText: [],
            problemTexts: [],
            isEnded: false,
            buttonText: this.props.independentTexts.GiveMeAHint['1'].slice(4),
            currentPost: this.props.currentThread.posts.post_1,
            postIndex: 1,
            isTyping: false,
            answer:'',
            lastNPCIncorrect:0,
            lastNPCHint:0,
            lastNPCAnswer:0,
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
        var hintText = (typeof this.state.currentPost.HintText !== 'undefined') ? this.state.currentPost.HintText : '';
        var answerText = (typeof this.state.currentPost.AnswerText !== 'undefined') ? this.state.currentPost.AnswerText : '';

        var npcCount = this.props.npcCount;
        var rNum3 = Math.floor((Math.random() * npcCount)) % npcCount;
        var rNum2 = Math.floor((Math.random() * npcCount)) % npcCount;

        var authorName;
        var playerName = this.props.playerName;
        
        var buttonAnswerText = this.props.independentTexts.GiveMeAnswer['1'];
        var buttonOhNowIGotItText = this.props.independentTexts.OhNowIGotIt['1'];

/*--------------------------------------Problem Text---------------------------------------------*/
        if ( this.state.postIndex > 2 )
            authorName = this.props.currentThread.threadVIP;
        else
            authorName = this.props.currentThread.threadNPCName;
        
        let speaker = this.state.problemTexts.map((r, i) => {
                    r = this.replaceSignWithName(r, '@$', authorName);
                    r = this.replaceSignWithName(r, '@@', playerName);
                    var curHeadShotURI = this.props.npcLists[this.props.currentThread.threadNPCName].Headshot;

                    if ( r.search(authorName+":") != -1) {
                        curHeadShotURI = this.props.npcLists[this.props.currentThread.threadNPCName].Headshot;    
                    } else if ( r.search(playerName + ":") != -1 ) {
                        curHeadShotURI = this.props.playerHeadShot;
                    }

                    return <View key={i}>
                        <SpeakerMessage 
                        headShotURI={curHeadShotURI} 
                        sentences={r} /> 
           </View>
        });
/*--------------------------------------Problem Text---------------------------------------------*/


/*--------------------------------------Start Hint Message---------------------------------------------*/
        var giveMeAHint = this.props.independentTexts.GiveMeAHint['1'];
        var giveMeAHintText = this.props.independentTexts.GiveMeAHintText['1'];
        var hintNPCName = this.props.npcNameLists[this.state.lastNPCHint].npcName;

        giveMeAHint = this.replaceSignWithName(giveMeAHint, '@@', playerName);
        giveMeAHintText = this.replaceSignWithName(giveMeAHintText, '@@', playerName);
        giveMeAHintText = this.replaceSignWithName(giveMeAHintText, '@%', hintNPCName);

        var hintImageAsk = this.state.isHintAskRequired?
            ( 
                <View style={{}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={giveMeAHint} /> 
                </View> 
            ) :
            ( <View/>);
        var hintImage = this.state.isHintRequired ?
            ( 
                <View style={{}}>
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
        var answerNPCName = this.props.npcNameLists[this.state.lastNPCAnswer].npcName;

        giveMeAnswer = this.replaceSignWithName(giveMeAnswer, '@@', playerName);
        GiveMeAnswerText = this.replaceSignWithName(GiveMeAnswerText, '@@', playerName);
        GiveMeAnswerText = this.replaceSignWithName(GiveMeAnswerText, '@%', answerNPCName);

        var answerImageAsk = this.state.isAnswerAskRequired?
            ( 
                <View style={{}}>
                    <SpeakerMessage
                        headShotURI={this.props.playerHeadShot} 
                        sentences={giveMeAnswer} /> 
                </View> 
            ) :
            ( <View/>);

        var answerImage = this.state.isAnswerRequired ?
            ( 
                <View style={{}}>
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

       var successAskImage = this.state.isSuccessAskRequired?
            ( 
                <View style={{}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={theAnswerIs} /> 
                </View> 
            ) :
            ( <View/>);

        var successImage = this.state.isSuccessRequired ?
            ( 
                <View style={{marginTop: 10, paddingRight: 10}}>
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
        var incorrectNPCName = this.props.npcNameLists[this.state.lastNPCIncorrect].npcName;

        var theIncorrectAnswerIs = this.props.independentTexts.TheAnswerIs['1'] + this.state.incorrectAnswer;

        theIncorrectAnswerIs = this.replaceSignWithName(theIncorrectAnswerIs, '@@', playerName);
        theIncorrectAnswerIs = this.replaceSignWithName(theIncorrectAnswerIs, '@$', incorrectNPCName);

        incorrectText = this.replaceSignWithName(incorrectText, '@@', playerName);
        incorrectText = this.replaceSignWithName(incorrectText, '@$', incorrectNPCName);

        var incorrectAskImage = this.state.isIncorrectAskRequired?
            ( 
                <View style={{}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={theIncorrectAnswerIs} /> 
                </View> 
            ) :
            ( <View/>);
        var incorrectImage = this.state.isIncorrectRequired ?
            ( 
                <View style={{}}>
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

        var ansPlaceHolder = '@' + authorName + " The answer is ";
        var ansValue;
        if ( this.state.isTyping == true )
            ansValue = '@' + authorName + " The answer is " + this.state.answerTextInputed;
        else   
            ansValue = "";
        var inputAnswerForm = this.state.isProblemImageRequired ?
            (
                <View style={{paddingTop:10, paddingLeft: 10}}>
                    <View style={inputAnswerStyle.inputView}>
                        <TextInput style={styles.answerInput} keyboardType = 'numeric' placeholder={ansPlaceHolder} value={ansValue}
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
                <View style={{}}>
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
                <View style={{}}>
                    <SpeakerMessage 
                        headShotURI={this.props.playerHeadShot} 
                        sentences={gotIt} /> 
                    <View style={styles.separator} />
                </View> 
            ) :
            ( <View/> ); 
/*--------------------------------------End GotIt---------------------------------------------*/

/*--------------------------------------Start ProblemPic---------------------------------------------*/
        var problemImage = this.state.isProblemImageRequired ?
            (   
                <View style={{}}>
                    <Image source={{uri: problemPicURI}} style={styles.pic}/>
                    <View style={styles.separator} />
                </View> 
            ) :
            ( <View/> ); 
/*--------------------------------------End ProblemPic---------------------------------------------*/

/*--------------------------------------Start firstAnswerButton---------------------------------------------*/
        var firstAnswerButton = this.state.isFirstButtonRequired?
            (
                <View style={{paddingLeft:10, paddingRight:10, marginTop: 10, marginBottom: 10}}>
                    <TouchableHighlight style={styles.button}
                                underlayColor='#327bf7'
                                onPress={this.continuePost.bind(this)}>
                        <Text style={styles.buttonText}>{this.state.firstAnswerButtonText}</Text>
                    </TouchableHighlight>
                </View>
            ) :
            (<View/>);

/*--------------------------------------End firstAnswerButton---------------------------------------------*/

/*--------------------------------------Start Answer Form---------------------------------------------*/
        var answerForm = this.state.isProblemImageRequired?
            (
                <View style={{paddingLeft:10, paddingRight:10, marginTop: 10, marginBottom: 10}}>
                        <TouchableHighlight style={styles.button}
                                    underlayColor='#327bf7'
                                    onPress={this.giveHint.bind(this)}>
                            <Text style={styles.buttonText}>{this.state.buttonText}</Text>
                        </TouchableHighlight>
                </View>
            ):
            (<View/>);
/*--------------------------------------End Answer Form---------------------------------------------*/

        var keypad = this.state.isInputRequired?
            ( <View style={{height:130, width: 300}}></View>):(<View/>);


        return (
            <ScrollView ref="scrollview" 
                onContentSizeChange={(contentWidth, contentHeight) => {
                this.setState({_scrollToBottomY:contentHeight})
            }}>
                <View>
                    <View style={problemViewStyle.problemView}> 
                        <View style={{marginTop:10}}>
                            {speaker}
                        </View>
                        {firstAnswerButton}
                        {problemImage}
                    </View>

                    {hintImageAsk}
                    {hintImage}

                    {answerImageAsk}
                    {answerImage}

                    {incorrectAskImage}
                    {incorrectImage}
                    
                    {successAskImage}
                    {successImage}

                    {inputAnswerForm}
                    {answerForm}
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
        var tmpTexts = [];
        var tmpTexts1 = [];
        var count = 0;
        var index = 0;
        tmpTexts = this.state.currentPost.ProblemText.split("\n");

        tmpTexts.forEach((x) => {
            count++;
        });
        
        myVar = setInterval( () => { 
            if ( index == count-1 )
            {
                clearInterval(myVar);
                tmpTexts1.push(tmpTexts[index]);
                this.setState({isProblemImageRequired: true});
            }
            else 
            {
                if ( tmpTexts[index].search("@@:") != -1 )
                {
                    this.setState({pausedIndex: index});
                    clearInterval(myVar);
                    this.setState({isFirstButtonRequired:true});
                }
                else
                {
                    tmpTexts1.push(tmpTexts[index]);
                    index ++;
                }
            }
            this.setState({problemTexts:tmpTexts1});

        }, TIME_DELAY_PROBLEM_POST);
    }
    
    hideKeyboard(event) {
        this.setState({ answerTextInputed: event.nativeEvent.text.slice(event.nativeEvent.text.search('is')+3) });
        this.setState({ isInputRequired: false});

    }   

    showKeyboard(event) {
        this.setState({answerTextInputed: ""});
        this.setState({ isInputRequired: true});
        this.setState({ isReplyReqruied: true});
        this.setState({isTyping: true});
    }

    captureAnswer(event) {
        this.setState({ answerTextInputed: event.nativeEvent.text.slice(event.nativeEvent.text.search('is')+3)  });

    }

    giveHint(event) {
        this.setState({isIncorrectAskRequired:false});
        this.setState({isIncorrectRequired:false});
        if ( this.state.solvingState == INCORRECT ) {
            if ( this.state.isHintRequired == false ) {
                this.setState({isHintAskRequired:true});

                setTimeout(() => { 
                    this.setState({lastNPCHint: Math.floor((Math.random() * this.props.npcCount)) % this.props.npcCount});
                    this.setState({ isHintRequired: true })
                    this.setState({buttonText: this.props.independentTexts.GiveMeAnswer['1'].slice(4)});
                    this.setState({isIncorrectRequired: false});
                }, TIME_DELAY_CHECK_POST);
                

            } else if (this.state.isAnswerRequired == false ) {
                this.setState({isAnswerAskRequired: true});
                setTimeout(() => {
                    this.setState({lastNPCAnswer: Math.floor((Math.random() * this.props.npcCount)) % this.props.npcCount}); 
                    this.setState({ isAnswerRequired: true });
                    this.setState({isInputFormRequired: false});
                    this.setState({isIncorrectRequired: false});
                    this.setState({buttonText: this.replaceSignWithName(this.props.independentTexts.OhNowIGotIt[1].slice(4), '@#', this.props.currentThread.threadNPCName)});
                    this.setState({isEnded: true});
                    this.setState({solvingState: HELPED});
                }, TIME_DELAY_CHECK_POST);
            }
        }
        else if ( this.state.solvingState == HELPED ){
            if ( this.state.isOhIGotItRequired == false ) {
                this.setState({isOhIGotItRequired:true});
                setTimeout(() => { this.gotoNextPost()}, TIME_DELAY_CHECK_POST);
            }
        }
        else if ( this.state.solvingState == SOLVED ) {
            this.setState({isOhIGotItRequired:true});
            setTimeout(() => { this.gotoNextPost()}, TIME_DELAY_CHECK_POST);
        }
    }
    
    checkAnswer(event) {        
            if ( this.state.answerTextInputed == this.state.currentPost.Answer )
            {
                this.setState({isSuccessAskRequired: true});
//                this.setState({isIncorrectAskRequired: false});
                setTimeout(() => { 
                    this.setState({isSuccessRequired: true});
//                    this.setState({isIncorrectRequired: false});
                    this.setState({isInputFormRequired: false});
                    this.setState({buttonText: this.replaceSignWithName(this.props.independentTexts.GotIt[1].slice(4), '@$', this.props.currentThread.threadNPCName)});
                    this.setState({solvingState: SOLVED});
                    this.setState({isEnded: true});
                    this.setState({});

                    this.setState({isTyping: false});
                    this.setState({answerInputed: this.state.answerTextInputed});
                }, TIME_DELAY_CHECK_POST);
            }
            else {
                this.setState({isIncorrectAskRequired: true});
//                this.setState({isSuccessAskRequired: false});
                this.setState({incorrectAnswer: this.state.answerTextInputed});
                setTimeout(() => { 
                    this.setState({isIncorrectRequired: true});
//                    this.setState({isSuccessRequired: false});
                    this.setState({lastNPCIncorrect: Math.floor((Math.random() * this.props.npcCount)) % this.props.npcCount});
                }, TIME_DELAY_CHECK_POST);
            }
            this.setState({isTyping: false});
            this.setState({answerInputed: this.state.answerTextInputed});
            this.setState({isReplyReqruied: false });
        
    }
    
    continuePost() {
        var tmpTexts = [];
        var tmpTexts1 = [];
        var count = 0;
        var index = this.state.pausedIndex;
        
        tmpTexts = this.props.currentThread.posts["post_"+(this.state.postIndex+1)].ProblemText.split("\n");

        tmpTexts.forEach((x) => {
            count++;
        });
        this.setState({isFirstButtonRequired:false});
        
        for ( var i =0; i <= index; i++ )
            tmpTexts1.push(tmpTexts[i]);
        
        this.setState({problemTexts:tmpTexts1});

        index = index + 1;
        myVar = setInterval( () => { 
            if ( index == count-1 )
            {
                tmpTexts1.push(tmpTexts[index]);
                this.setState({isProblemImageRequired: true});
                clearInterval(myVar);
            }
            else 
            {
                    tmpTexts1.push(tmpTexts[index]);
                    index ++;
            }
            this.setState({problemTexts:tmpTexts1});

        }, TIME_DELAY_PROBLEM_POST);

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

        var tmpTexts = [];
        var tmpTexts1 = [];
        var count = 0;
        var index = 0;
        
        this.setState({problemTexts:tmpTexts1});
        tmpTexts = this.props.currentThread.posts["post_"+(this.state.postIndex+1)].ProblemText.split("\n");

        tmpTexts.forEach((x) => {
            count++;
        });
        
        myVar = setInterval( () => { 
            if ( index == count-1 )
            {
                tmpTexts1.push(tmpTexts[index]);
                this.setState({isProblemImageRequired: true});
                clearInterval(myVar);
            }
            else 
            {
                if ( tmpTexts[index].search("@@:") != -1 )
                {
                    var txt = tmpTexts[index];
                    txt = this.replaceSignWithName(txt, '@@', this.props.playerName);

                    if ( this.state.postIndex > 2 )
                        txt = this.replaceSignWithName(txt, '@$', this.props.currentThread.threadVIP);
                    else    
                        txt = this.replaceSignWithName(txt, '@$', this.props.currentThread.threadNPCName);

                    
                    this.setState({firstAnswerButtonText: txt.slice(txt.search(":")+1)});
                    clearInterval(myVar);
                    this.setState({isFirstButtonRequired:true});
                    this.setState({pausedIndex: index});
                }
                else
                {
                    tmpTexts1.push(tmpTexts[index]);
                    index ++;
                }
            }
            this.setState({problemTexts:tmpTexts1});

        }, TIME_DELAY_PROBLEM_POST);


        this.setState({
            answerInputed: '',
            answerTextInputed: '',
            isProblemImageRequired: false,

            isHintAskRequired: false,
            isHintRequired: false,

            isAnswerAskRequired: false,
            isAnswerRequired: false,

            isInputReqruied: false,
            isReplyReqruied: false,

            isSuccessAskRequired: false,
            isSuccessRequired: false,

            pausedIndex : 0,
            isIncorrectAskRequired: false,
            isIncorrectRequired: false,
            isFirstButtonRequired: false,
            isInputFormRequired: true,
            lastNPCIncorrect:0,
            lastNPCHint:0,
            lastNPCAnswer:0,
            isTyping: false,
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