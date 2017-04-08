
function getStartChar() {
    var word = theApp.lastWord;
    if (word != null) {
        return word.word.charAt(word.word.length - 1);
    }
    return 's';
}

function updateStartChar() {
    var startChar = getStartChar();
    var str = "Enter a word starting with '" + startChar + "'";
    $("#input_word_label").text(str);
}


$(document).ready(function() {
            var rulesDialog = document.querySelector("#game_rules");
            var inputDialog = document.querySelector("#input_dialog");
            if (!rulesDialog.showModal) {
                dialogPolyfill.registerDialog(rulesDialog);
            }
            if (!inputDialog.showModal) {
                dialogPolyfill.registerDialog(inputDialog);
            }
            $("#rules_dialog_close").click(function() {
                rulesDialog.close();
            });
            $(".rules_dialog_open").click(function(){
                rulesDialog.showModal();
            });
            $("#input_word_field").click(function(){
                $("#success_err_msg").html("");
                inputDialog.showModal();
            });

            $("#input_dialog_close").click(function() {
                inputDialog.close();
            });
            $("#add_word_to_chain").click(function() {
                var word = $("#input_word").val();
                var description = $("#input_description").val();
                if (word == '') {
                    $("#success_err_msg").html("<p><font color='red'>Please enter a word!</font></p>");
                } else {
                    if (metaMaskEnabled) {
                        theApp.addWord(word, description, function(err, txId) {
                            if (err) {
                                console.log(err);
                                $("#success_err_msg").html("<p><font color='red'>There was an error processing your request</font></p>");
                            } else {
                                $("#success_err_msg").html('<font color="green"><a href="https://etherscan.io/tx/'+ txId + '" target="_blank"' + '>Submitted Transaction</a></font>');
                            }
                        });
                    } else {
                        $("#success_err_msg").html("<p><font color='red'>Install MetaMask chrome extension to continue!</font></p>");
                    }
                }
            });
            $("#add_to_chain").click(function(){
                var val = $("#sample3").val();
                console.log(val);
                if (val == '') {
                    $("#success_err_msg").html("<p>Please enter a word!</p>");
                    dialog.showModal();
                } else {
                    theApp.addWord(val, "", function(err, txId) {
                        if (err) {
                            $("#success_err_msg").html("<p>There was an error processing your request</p>");
                            dialog.showModal();
                        } else {
                            $("#success_err_msg").html('<a href="https://etherscan.io/tx/'+ txId + ' target="_blank"' + '>Submitted Transaction</a>');
                            dialog.showModal();
                        }
                    });
                }
            });
        });