const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const Helpers = require('../helpers/Helpers');
const {localRootPath} = process.env;

module.exports = (folderName = '/') => {
    glob(path.join('./', localRootPath, folderName, '/**/!(common).spec.json'), {}, (err, files) => {
        console.log(files);
        const basePath = path.join(localRootPath, folderName);
        if (files.length) {
            const result = {};
            files.forEach(file => {
                const data = fs.readJsonSync(file);
                data.loader = `{{func}}()=>{import(/* webpackChunkName: '${data.folderName.replace(/\//gi, '.')}.${data.fileName}' */ './${path.relative(basePath, data.filePathJs)}')}{{func}}`;
                result[data.id] = data
            });
            const tmpl = 'export default ' + JSON.stringify(result, null, "\t");
            fs.writeFileSync(path.join('./', basePath, 'common.spec.js'), tmpl.replace(/("{{func}}|{{func}}")/gi, ''))
        }
    })
};