/*
    String Manipulations
*/
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.capitalizeEachFirstLetters = function(delimitter) {
    var splitOn = delimitter || ' ';

    var stringText = '';
    this.split(splitOn).forEach(function(word) {
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