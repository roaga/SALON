const flagchecks = {
    check: function(text) {
        var ret = true;

        text = text.toLowerCase();

        var sentences = text.split('.');

        const flags = ["believe", "think", "know", "incorrect", "correct"];

        sentences.forEach(sentence => {
            sentence = sentence.split(' ');
            sentence.forEach(word => {
                flags.forEach(flag => {
                    if(word === flag) {
                        console.log("This statement is lacking evidence.");
                        ret = false;
                        return false;
                    }
                });
            });
        });

        if(ret) {
            console.log("This statement is valid.");
            return true;
        }
    }
}

flagchecks.check("I believe that Obama was a good president.");

module.exports = flagchecks