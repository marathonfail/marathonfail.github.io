// React components to render the page.
console.log(EtherWordChain);
var theApp = new EtherWordChain('0x1229d72d7df79b7d042f828caaaa6526434b30e2');
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
            date: new Date()
        }
    },
    componentDidMount: function() {
        theApp.getWordAt(this.props.index, function(error, index, word){
           this.setState({word: word.word, description: word.description, date: word.addedOn.toNumber()});
        }.bind(this));
    },
    render: function() {
        return (
            <tr>
                   <td className="mdl-data-table__cell--non-numeric">{this.state.word}</td>
                   <td>{this.state.description}</td>
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
                    <th className="mdl-data-table__cell--non-numeric">Word</th>
                    <th className="mdl-data-table__cell--non-numeric">Description</th>
                    <th>Date added</th>
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
    $("#label_for_input").text("Enter a word starting with '" + startChar + "'");
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