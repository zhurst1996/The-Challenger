const path = require('path');
const fs = require('fs');

class TestLists {
    constructor(params) {
        if (!!params && !!params.page) {
            this.page = params.page;
        }
    }

    fetchList() {
        const directoryPath = path.join(__dirname, '../../public/javascript/tests');

        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {

                if (err) {
                    reject('Unable to scan directory: ' + err);
                }

                resolve(files);
            });
        });
    }

    fetchTest() {
        var htmlPromise = new Promise((resolve, reject) => {
                let directoryPath = path.join(__dirname, '../../public/html/' + this.page + '.htm');

                fs.readFile(directoryPath, (err, data) => {
                    resolve(data);
                });
            }),
            javascriptPromise = new Promise((resolve, reject) => {
                let directoryPath = path.join(__dirname, '../../public/javascript/' + this.page + '.js');

                fs.readFile(directoryPath, (err, data) => {
                    resolve(data);
                });
            });

        return new Promise((resolve, reject) => {
            Promise.all([htmlPromise, javascriptPromise]).then((data) => {
                var testObj = {
                    html: !!data[0] ? data[0].toString() : false,
                    js: !!data[1] ? data[1].toString() : false,
                    jsHTML: !!data[1] ?
                        data[1].toString()
                        .replace(/\r\n/igm, '<br/>')
                        .replace(/ /igm, '&nbsp')
                        .replace(/(var\&nbsp)/igm, '<strong class="text-primary">$1</strong>')
                        .replace(/(if\&nbsp)/igm, '<strong class="text-primary">$1</strong>')
                        .replace(/(else\&nbsp)/igm, '<strong class="text-primary">$1</strong>')
                        .replace(/(return\&nbsp)/igm, '<strong class="text-purple">$1</strong>')
                        .replace(/(new\&nbsp)/igm, '<strong class="text-primary">$1</strong>')
                        .replace(/((Promise\&nbsp)|(Promise))/igm, '<strong class="text-success">$1</strong>')
                        .replace(/(for\&nbsp)/igm, '<strong class="text-purple">$1</strong>')
                        .replace(/(while\&nbsp)/igm, '<strong class="text-purple">$1</strong>')
                        .replace(/(\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$)/igm, '<p class="text-success">$1</p>')
                        .replace(/((function\&nbsp)|(function))/igm, '<strong class="text-primary">$1</strong>') : false
                };

                resolve(testObj);
            });
        });
    }
}

module.exports = TestLists;