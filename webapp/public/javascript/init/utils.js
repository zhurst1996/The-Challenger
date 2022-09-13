function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function copy(input) {
    navigator.clipboard.writeText(input.value);
}