var n = require('numeral');

function Convert() {
    //the name of the command.
    this.name = "Convert";

    //help text to show for this command.
    this.helpText = "Convert temperatures. Unit must be 'c' or 'f'.";

    //usage message. only include the parameters. the command name will be automatically added.
    this.usageText = "<temperature> <unit>";

    //ways to call this command.
    this.aliases = ['convert'];

    //Name of the permission needed to use this command. All users have 'user.command.use' by default. Banned users have 'user.command.banned' by default.
    this.permissionName = 'user.command.use';

    //whether or not to allow this command in a private message.
    this.allowPm = true;

    //whether or not to only allow this command if it's in a private message.
    this.isPmOnly = false;
}

Convert.prototype.execute = function(context) {
    var args = context.arguments;
    var tempRegEx = /^(-?\d+(?:\.\d+)?)\s?°?\s?([cfk])$/gi;
    var msg = args.join(" ");

    var temp = parseFloat(msg.replace(tempRegEx, "$1"));
    var tempTemp = msg.replace(tempRegEx, "$1");
    var unit = msg.replace(tempRegEx, "$2");
    var places = "0".repeat((tempTemp.indexOf(".") != -1) ? Math.min(Math.max(tempTemp.length - 1 - tempTemp.indexOf("."), 2), 20) : 2);

    if(unit.toLowerCase() === "c") {
        try {
            context.getClient().say(context, temp+"°C is "+n((temp*9/5) + 32).format("0[.]"+places)+"°F.");
        } catch(e) {
            context.getClient().say(context, "Could not convert "+temp+"°C to Fahrenheit!");
        }
        return true;
    }

    if(unit.toLowerCase() === "f") {
        try {
            context.getClient().say(context, temp+"°F is "+n((temp - 32)*5/9).format("0[.]"+places)+"°C.");
        } catch(e) {
            context.getClient().say(context, "Could not convert "+temp+"°F to Fahrenheit!");
        }
        return true;
    }

    if(unit.toLowerCase() === "k") {
        context.getClient().say(context, "I'm a Korean Pop group, not a scientist.");
    }
    return true;
};

module.exports = Convert;