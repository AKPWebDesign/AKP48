var Commands = require('./commands');
var AutoResponse = require('./autoresponse');
var Chatter = require("./chatter");

function CommandProcessor() {
    this.cmd = new Commands();
    this.auto = new AutoResponse();
}

CommandProcessor.prototype.process = function(nick, channel, text, client, pm) {
    var args = [];
    var command = "";
    var nickname = "";

    var start = -1;
    var end = -1;

    //ignore ourself
    if(nick === client.nick) {return;}

    if(nick === client.mcBot) {

        //find user name
        start = text.indexOf('(');
        end = text.indexOf(')');
        nickname = text.substring(start + 1, end);

        //trim text down to remove username
        text = text.substring(end+2);
    } else {
        nickname = nick;
    }

    if(channel === client.nick) {
        channel = nick;
    }

    //if we have a command
    if(text.substring(0, client.delimiter.length) === client.delimiter) {

        // Flood protection
        if((!pm || !(channel === client.nick)) && !client.isOp(nickname)) {
            if(!client.chatters[channel]) {client.chatters[channel] = [];}
            if(client.chatters[channel][nick]) {
                client.chatters[channel][nick].floodProtect();
                //if they have been banned
                if(client.chatters[channel][nick].checkBan()) {
                    //just end here
                    return;
                }
            } else {
                client.chatters[channel][nick] = new Chatter(nick, client, channel);
            }
        }

        //find command
        end = text.indexOf(' ');
        command = text.substring(client.delimiter.length,end);

        //if there wasn't actually a space, we won't have gotten a command.
        //instead, we'll just chop off the first two characters now.
        if(end === -1) {
            command = text.substring(client.delimiter.length, text.length).toLowerCase();
        } else {
            //otherwise, we can cut off the command and save the arguments.
            args = text.substring(end+1).split(' ');
        }

        if(typeof this.cmd[command] === 'function') {
            if(!client.isBanned(nickname)) {
                this.cmd[command](nickname, args, client, channel, client.isOp(nickname), pm);
            }
        }
    } else {
        this.parseMessage(text, client, channel, pm);
    }
};

CommandProcessor.prototype.parseMessage = function(msg, client, channel, pm) {
    var youTubeRegEx = /(?:.+)(?:https?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*(?:.+)?/gi;
    var steamAppRegEx = /(?:.+)?(?:store\.steampowered\.com\/app\/)([0-9]+)(?:.+)?/gi;
    var steamPkgRegEx = /(?:.+)?(?:store\.steampowered\.com\/sub\/)([0-9]+)(?:.+)?/gi;
    var tempRegEx = /^convert (-?\d+(?:\.\d+)?)°?([cf])$/gi;
    var diceRegEx = /^(?:roll(?= *[^+ ]))(?: *(?: |\+) *(?:\d*[1-9]\d*|(?=d))(?:d\d*[1-9]\d*(?:x\d*[1-9]\d*)?)?)+ *$/gi;
    var diceRollRegEx = /[ +](\d+|(?=d))(?:d(\d+)(?:x(\d+))?)?(?= *(\+| |$))/gi;


    if(msg.search(youTubeRegEx) != -1) {
        var youTubeId = msg.replace(youTubeRegEx, "$1");
        this.auto.youtube(youTubeId, function(res) {
            client.getIRCClient().say(channel, res);
        });
    }

    if(msg.search(steamAppRegEx) != -1) {
        var steamId = msg.replace(steamAppRegEx, "$1");
        this.auto.steamApp(steamId, function(res) {
            client.getIRCClient().say(channel, res);
        });
    }

    if(msg.search(steamPkgRegEx) != -1) {
        var steamId = msg.replace(steamPkgRegEx, "$1");
        this.auto.steamPkg(steamId, function(res) {
            client.getIRCClient().say(channel, res);
        });
    }

    if(msg.search(tempRegEx) != -1) {
        var temperatureNum = parseFloat(msg.replace(tempRegEx, "$1"));
        var tempTemp = msg.replace(tempRegEx, "$1");
        var temperatureformat = msg.replace(tempRegEx, "$2");
        var places = "0".repeat((tempTemp.indexOf(".") != -1) ? Math.min(Math.max(tempTemp.length - 1 - tempTemp.indexOf("."), 2), 20) : 2);
        this.auto.tempConvert(temperatureNum, places, temperatureformat, function(res) {
            client.getIRCClient().say(channel, res);
        });
    }

    if(msg.search(diceRegEx) != -1) {

        var result;
        var dice = [];

        while((result = diceRollRegEx.exec(msg)) !== null) {
            var count = (parseInt(result[1]) != 0) ? parseInt(result[1]) : 1;
            if(isNaN(count)) {count = 1;}

            var maxValue = (parseInt(result[2]) != 0) ? parseInt(result[2]) : 1;
            if(isNaN(maxValue)) {maxValue = 1;}

            var multiplier = (parseInt(result[3]) != 0) ? parseInt(result[3]) : 1;
            if(isNaN(multiplier)) {multiplier = 1;}

            dice.push({
                count: count,
                maxValue: maxValue,
                multiplier: multiplier,
                isFinalValue: !("+" === result[4])
            });
        }
        var rolls = [];

        for (var i = 0; i < dice.length; i++) {
            var roll = 0;
            for (var j = 0; j < dice[i].count; j++) {
                roll += (Math.floor(Math.random() * (dice[i].maxValue)) + 1) * dice[i].multiplier;
            }
            rolls.push(roll);
        }


        var outputString = "";

        for (var i = 0; i < rolls.length; i++) {
            outputString += rolls[i] + " | ";
        };

        outputString = outputString.substring(0, outputString.length-3);

        client.getIRCClient().say(channel, outputString);
    }
}

module.exports = CommandProcessor;