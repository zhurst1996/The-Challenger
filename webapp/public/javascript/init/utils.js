/*
    String Manipulations
*/
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.capitalizeEachFirstLetters = function(char) {
    var delimitter = char || ' ';

    var stringText = '';
    this.split(delimitter).forEach(function(word) {
        stringText += (' ' + word.capitalizeFirstLetter());
    });

    return stringText;
}

/*
    Input Manipulations
*/
function copy(input) {
    navigator.clipboard.writeText(input.value);
}

/*
    Date Manipulations
*/
Date.prototype.getDateTime = function() {
    return this.toLocaleString('en-US', { hour12: true });
};