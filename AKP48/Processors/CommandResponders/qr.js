/**
 * Copyright (C) 2015  Austin Peterson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function QR(logger) {
    //the name of the command.
    this.name = "QR Code";

    //help text to show for this command.
    this.helpText = "Creates a QR code.";

    //usage message. only include the parameters. the command name will be automatically added.
    this.usageText = "[content of QR code]";

    //ways to call this command.
    this.aliases = ['qr', 'qrcode'];

    //dependencies that this module has.
    this.dependencies = ['googl'];

    //whether or not to allow this command in a private message.
    this.allowPm = true;

    //whether or not to only allow this command if it's in a private message.
    this.isPmOnly = false;
}

QR.prototype.execute = function(context) {
    //return if no arguments
    if(!context.arguments.length) {return false;}

    //this is the link that we're going to send to imgur
    var imageURL = "http://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=" + encodeURIComponent(context.arguments.join(" "));

    //upload the image to imgur
    context.AKP48.getAPI("Imgur").uploadImageFromURL(imageURL, function (url) {
        if(url) {
            context.commands['googl'].shortenURL(context, url);
        } else {
            context.commands['googl'].shortenURL(context, imageURL);
        }
    });

    return true;
};

module.exports = QR;