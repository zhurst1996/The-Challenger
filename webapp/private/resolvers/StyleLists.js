import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url
);

class StyleLists {
    constructor() {}

    fetch() {
        const directoryPath = path.join(path.dirname(__filename), '../../public/styles');

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

export default StyleLists;