
var WordBuildingABI = [
];

var WordBuildingABI = [{"constant":false,"inputs":[{"name":"fees","type":"uint256"},{"name":"negativeVoteFees","type":"uint256"}],"name":"setFees","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"word","type":"string"},{"name":"description","type":"string"}],"name":"nextWord","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"},{"name":"description","type":"string"}],"name":"updateDescription","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"},{"name":"link","type":"string"}],"name":"updateLink","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"getTotalWordsOnChain","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"percent","type":"uint256"}],"name":"sendTipPercent","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"claim","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"word","type":"string"}],"name":"isWordOnChain","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"checkAccrual","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"negativeVote","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getWordAt","outputs":[{"name":"word","type":"string"},{"name":"description","type":"string"},{"name":"link","type":"string"},{"name":"addedBy","type":"address"},{"name":"addedTime","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"shouldRefund","type":"bool"}],"name":"setShouldRefund","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"sendEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"maxNegVotes","type":"uint256"}],"name":"setMaxNegativeVotes","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getNegativeVotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"fee","type":"uint256"}],"name":"setLinkFee","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getTotalTipped","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getFees","outputs":[{"name":"feeToAdd","type":"uint256"},{"name":"feeToUpdateLink","type":"uint256"},{"name":"feeToTip","type":"uint256"},{"name":"feeToNegativeVote","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"tip","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getTotalWordsAddedBy","outputs":[{"name":"total","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}];

var EtherWordChain = function(ct_address) {
    this.address = ct_address;
    var ctnt = web3.eth.contract(WordBuildingABI).at(ct_address);
    this.contract = ctnt;
    this.totalWords = 0;
    this.lastWord = null;
    this.feeToAdd = null;
    this.feeToNegativeVote = null;
    this.feeToTip = null,
    this.feeToUpdateLink = null,
    this.init();
}

EtherWordChain.prototype.init = function() {
    console.log("Getting lastword");
    this.getLastWord(function(error, word) {
        console.log("Last word: ", word);
        this.lastWord = word;
    }.bind(this));
    this.contract.getFees(function(error, data) {
        this.feeToTip = data[2];
        this.feeToUpdateLink = data[1];
        this.feeToAdd = data[0];
        this.feeToNegativeVote = data[3];
        console.log(data);
    }.bind(this));
    setInterval(function() {
        this.getLastWord(function(error, word) {
            this.lastWord = word;
        }.bind(this));
        this.contract.getFees(function(error, data) {
            this.feeToTip = data[2];
            this.feeToUpdateLink = data[1];
            this.feeToAdd = data[0];
            this.feeToNegativeVote = data[3];
            console.log(data);
        }.bind(this));
    }.bind(this), 60000);

}

var EtherWord = function(word, description, link, addedBy, addedOn) {
    this.word = word;
    this.description = description;
    this.link = link;
    this.addedBy = addedBy;
    this.addedOn = addedOn;
}

EtherWordChain.prototype.getTotalWordsOnChain = function(callback) {
    if (callback == null) {
        return this.totalWords;
    }
    this.contract.getTotalWordsOnChain(function(error, words) {
            this.totalWords = words.toNumber();
            console.log(this.totalWords, error);
            if (callback) {
                callback(this.totalWords);
            }
        }.bind(this));
}

EtherWordChain.prototype.getLastWord = function(callback) {
    if (callback == null) {
        return this.lastWord;
    }
    this.getTotalWordsOnChain(function(totalWords){
        if (totalWords != 0) {
            this.getWordAt(totalWords - 1, function(error, index, word) {
                this.lastWord = word;
                if (callback) {
                    callback(error, word);
                }
            }.bind(this));
        }
    }.bind(this));
}

EtherWordChain.prototype.getWordAt = function(index, callback) {
    this.contract.getWordAt(index, function(error, wordAtIndex) {
        console.log(error, wordAtIndex);
        if (error) {
            callback(error);
        } else {
            callback(error, index, new EtherWord(wordAtIndex[0], wordAtIndex[1], wordAtIndex[2], wordAtIndex[3], wordAtIndex[4]));
        }
    }.bind(this));
}

EtherWordChain.prototype.addWord = function(word, description, callback) {
    if (typeof description === 'undefined') {
        description = "";
    }
    word = word.toLowerCase();
    console.log(word, description, web3.eth.coinbase);
    try {
        this.contract.nextWord.sendTransaction(word, description, {from: web3.eth.coinbase, value: this.feeToAdd}, callback);
    } catch (ex) {
        console.log(ex);
        callback("Error processing");
    }
}

module.exports = EtherWordChain;

