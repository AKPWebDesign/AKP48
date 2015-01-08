function Hex2Bin() {
    //the name of the command.
    this.name = "Hex to Bin";

    //help text to show for this command.
    this.helpText = "Converts hexadecimal to binary.";

    //usage message. only include the parameters. the command name will be automatically added.
    this.usageText = "<hexadecimal>";

    //ways to call this command.
    this.aliases = ['hex2bin', 'h2b'];

    //Name of the permission needed to use this command. All users have 'user.command.use' by default. Banned users have 'user.command.banned' by default.
    this.permissionName = 'user.command.use';

    //whether or not to allow this command in a private message.
    this.allowPm = true;

    //whether or not to only allow this command if it's in a private message.
    this.isPmOnly = false;
}

Hex2Bin.prototype.execute = function(context) {
    if(!context.arguments[0]) {return;}

    var s = context.arguments.join();

    var i, k, part, ret = '';
    // lookup table for easier conversion. '0' characters are padded for '1' to '7'
    var lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111',
        'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
        'E': '1110', 'F': '1111'
    };
    for (i = 0; i < s.length; i += 1) {
        if (lookupTable.hasOwnProperty(s[i])) {
            ret += lookupTable[s[i]];
        } else {
            context.getClient().say(context, "Cannot convert "+context.arguments.join(" ")+" to binary!");
            return true;
        }
    }
    context.getClient().say(context, context.arguments.join(" ")+" to binary: "+ret);
    return true;
};

module.exports = Hex2Bin;