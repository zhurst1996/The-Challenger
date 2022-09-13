const path = require('path');
const fs = require('fs');

class StyleLists {
    constructor() {}

    fetch() {
        const directoryPath = path.join(__dirname, '../../public/styles');

        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {

                if (err) {
                    reject('Unable to scan directory: ' + err);
                }

                resolve(files);
            });
        });

    }

    async formattedLinks() {
        var files = await this.fetch();

        return new Promise((resolve, reject) => {
            var formattedLinks = [];

            files.forEach((file) => {
                formattedLinks.push('/public/styles/' + file);
            });

            resolve(formattedLinks);
        });
    }
}

module.exports = StyleLists;