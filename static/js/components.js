// React components to render the page.
console.log(EtherWordChain);
var theApp = new EtherWordChain('0x3a425eEe8d35DDCA0f6c25e787bb33EA301F0f08');
window.theApp = theApp;

var asyncLoop = function(o) {
    var asyncLoopIter=-1;

    var loop = function() {
        asyncLoopIter++;
        if(asyncLoopIter==o.length) {o.callback(); return;}
        o.functionToLoop(loop, asyncLoopIter, o.args);
    }
    loop();//init
}

var LastWord = React.createClass({

    getInitialState: function() {
        return {
            lastWord: {
                word: 'genesis',
                description: 'ethwordchain.com - first word building game on the blockchain!',
            }
        }
    },

    componentDidMount: function() {
        setInterval(function() {
            var lastWord = theApp.lastWord;
            if (this.state.lastWord.word != lastWord.word) {
                var newWord = {
                    word: lastWord.word,
                    description: lastWord.description
                };
                this.setState({lastWord: newWord});
                this.props.onWordUpdated(newWord);
            }
        }.bind(this), 1000);
    },

    render: function() {
        return (<h1 style={{fontSize: 18, fontWeight: 'bold', color: '#0027ff'}}>{this.state.lastWord.word}</h1>);
    }
});

$(document).ready(function() {
            var tipDialog = document.querySelector("#tip_dialog");
            window.tipDialog = tipDialog;
            if (!tipDialog.showModal) {
                dialogPolyfill.registerDialog(tipDialog);
            }
            var tipInputValue = $("#tip_input_value");
            $("#tip_input_value").on('input', function(){
                var val = $("#tip_input_value").val();
                $("#tip_label").text(val + " ETH");
            });
            $("#send_tip_button").click(function(){
                var tipEth = $("#tip_input_value").val();
                theApp.sendTip($("#tip_for_index").val(), tipEth, function(err, txId) {
                    if (err) {
                        $("#success_err_msg_tip").html("<p><font color='red'>There was an error processing your request</font></p>");
                    } else {
                        $("#success_err_msg_tip").html('<font color="green"><a href="https://etherscan.io/tx/'+ txId + '" target="_blank"' + '>Submitted Transaction</a></font>');
                    }
                });
            });

            $("#tip_dialog_close").click(function(){
                tipDialog.close();
            });
     });

var TipComponent = React.createClass({

    getInitialState: function() {
        return {
            totalTipped: new BigNumber(0),
            totalTippedTimes: 0
        };
    },

    getTotalTippedInEth: function() {
        var val = this.state.totalTipped.dividedBy(theApp.ONE_ETH);
        console.log(val + " val");
        return val.toNumber();
    },

    showDialog: function() {
        $("#tip_label").text(" 1 ETH");
        $("#tip_input_value").val(1);
        $("#tip_for_index").val(this.props.index);
        $("#tip_for_word").text(this.props.word);
        $("#success_err_msg_tip").html("");
        tipDialog.showModal();
    },

    componentWillReceiveProps: function(newProps) {
        this.setState({totalTipped: newProps.ethword.totalTipped, totalTippedTimes: newProps.ethword.totalTippedTimes.toNumber()});
    },

    render: function() {
        var row;
        if (this.state.totalTippedTimes > 0) {
            row = (
                <span className="mdl-chip mdl-chip--contact">
                    <span className="mdl-chip__contact mdl-color--teal mdl-color-text--white">{this.state.totalTippedTimes}</span>
                    <span className="mdl-chip__text">{" " + this.getTotalTippedInEth() + " ETH"}</span>
                </span>
            );
        } else {
            row = (<div className="triangle-up"></div>);
        }

        return (
            <td className="mdl-data-table__cell--non-numeric clickable" onClick={this.showDialog}>
                {row}
            </td>
        );
    }
});

var EthWord = React.createClass({
    getDate: function(date) {
        var thenDate = new Date(date * 1000);
        var now = new Date();
        var diff = now - thenDate;
        console.log("diff: ", diff);
        var diffSecs = parseInt(diff/1000);
        var diffMinutes = parseInt(diffSecs/60);
        var diffHours = parseInt(diffMinutes/60);
        var diffDays = parseInt(diffHours/24);
        if (diffDays > 0) return diffDays == 1 ? (diffDays + " day ago") : (diffDays + " days ago");
        if (diffHours > 0) return diffHours == 1 ? (diffHours + " hour ago") : (diffHours + " hours ago");
        if (diffMinutes > 0) return diffMinutes == 1 ? (diffMinutes + " minute ago") : (diffMinutes + " minutes ago");
        return (diffSecs + " seconds ago");
    },
    getInitialState: function() {
        return {
            word: "",
            description: "",
            date: new Date(),
            ethword: null
        }
    },
    componentDidMount: function() {
        theApp.getWordAt(this.props.index, function(error, index, word){
           this.setState({word: word.word, description: word.description, date: word.addedOn.toNumber(), ethword: word});
        }.bind(this));
    },
    render: function() {
        return (
            <tr>
                   <TipComponent index={this.props.index} word={this.state.word} ethword={this.state.ethword}/>
                   <td className="mdl-data-table__cell--non-numeric">{this.state.word}</td>
                   <td className="mdl-data-table__cell--non-numeric">{this.state.description == "" ? "-" : this.state.description}</td>
                   <td>{this.getDate(this.state.date)}</td>
            </tr>
        );
    }
});

var RecentlyAdded = React.createClass({
    getInitialState: function() {
        return {
            totalWords: 0,
            obtainedWords: 0
        }
    },
    componentDidMount: function() {
        // Do nothing
        setInterval(function() {
            if (this.state.totalWords != theApp.totalWords) {
                this.setState({totalWords: theApp.totalWords});
            }
        }.bind(this), 1000);
    },
    render: function() {
        var rows = [];
        var maxLoop = Math.min(50, this.state.totalWords);
        for (var i=this.state.totalWords - 1, j=0;j<maxLoop;i--,j++) {
            rows.push(
                <EthWord index={i} key={i}/>
            )
        }
        return (
            <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                  <tr>
                    <th></th>
                    <th className="mdl-data-table__cell--non-numeric">Word</th>
                    <th className="mdl-data-table__cell--non-numeric">Comments</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var GameRules = React.createClass({
    render: function() {
        return "Hello";
    }
});

var onWordUpdated = function(word) {
    var startChar = word.word.charAt(word.word.length - 1);
    $("#label_for_input_home_page").text("Enter a word starting with '" + startChar + "'");
    $("#label_for_input_word").text("Enter a word starting with '" + startChar + "'");
    console.log(word);
}

ReactDOM.render(
    <LastWord onWordUpdated={onWordUpdated}/>,
    document.getElementById('last_word')
);

ReactDOM.render(
    <RecentlyAdded/>,
    document.getElementById('recently_added')
);
