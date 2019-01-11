const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const Helpers = require('../helpers/Helpers');


module.exports = (folderName = '/') => {
    glob(path.join('./', folderName, '/**/!(common).spec.json'), {}, (err, files) => {
        console.log(files);
        const result = {};
        files.forEach(file => {
            const data = fs.readJsonSync(file);
            result[data.id] = data
        });
        fs.writeFileSync(path.join('./', folderName, 'common.spec.json'), JSON.stringify(result, null, "\t"))
    })
};