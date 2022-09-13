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
                    js: !!data[1] ? data[1].toString() : false
                };

                resolve(testObj);
            });
        });
    }
}

module.exports = TestLists;