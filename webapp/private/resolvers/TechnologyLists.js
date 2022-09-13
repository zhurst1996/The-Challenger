const path = require('path');
const fs = require('fs');

class TechnologyLists {
    constructor() {}

    fetch() {
        const directoryPath = path.join(__dirname, '../../public/assets/technologies.csv');

        var $this = this;
        return new Promise((resolve, reject) => {
            fs.readFile(directoryPath, (err, file) => {
                if (err) {
                    reject('Unable to scan directory: ' + err);
                }

                var allData = $this.formatData(file);
                resolve(allData);
            });
        });

    }

    formatData(file) {
        var fileString = file.toString(),
            fileList = fileString.split(','),
            numberOfColumns,
            numberOfRows;

        fileList.forEach((item, i) => {
            if (!numberOfColumns && !!/\r\n/igm.test(item)) {
                numberOfColumns = (i + 1);
            }
        });

        var dataList = fileString.replace(/\r\n/igm, ',').split(','),
            dataJson = [],
            dataHeaders = [];

        for (var i = 0; i < numberOfColumns; i++) {
            dataHeaders.push({
                column: i + 1,
                data: dataList[i]
            });
        }

        for (var i = 0; i < numberOfColumns; i++) {
            var dataIndex = dataList.indexOf(dataHeaders[i].data);

            dataList.splice(dataIndex, 1);
        }

        dataList.forEach((data, i) => {
            if (!data) {
                return;
            }

            var column = (i % numberOfColumns) + 1;

            dataJson.push({
                column,
                data
            });
        });

        numberOfRows = dataJson.filter((item) => { return item.column == 5 }).length;

        var allData = {
            numberOfRows,
            numberOfColumns,
            headers: dataHeaders,
            data: dataJson
        };

        return allData;
    }
}

module.exports = TechnologyLists;