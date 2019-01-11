const path = require('path');
const fs = require('fs-extra');
const Helpers = require('../helpers/Helpers');
const {libPath, localPath, globalPath} = process.env;

const rootFolder = path.join(libPath, 'templates', 'module');
const localFolder = path.join(localPath, 'templates', 'module');


function getFilesList(callback) {
    if (!fs.existsSync(rootFolder)) return console.error(err);
    const rootFiles = fs.readdirSync(rootFolder).sort().map(file => ({
        name: file.replace(/.js$/, ''),
        value: path.join(rootFolder, file)
    }));
    if (!fs.existsSync(localFolder)) return callback(rootFiles);
    const localFiles = fs.readdirSync(localFolder).sort().map(file => ({
        name: file.replace(/.js$/, ''),
        value: path.join(localFolder, file)
    }));
    return callback([...localFiles, ...rootFiles]);
}


module.exports = (folderName = '/', fileName = folderName.split('/').pop()) => {
    const options = {
        folderName: folderName,
        fileName: fileName
    };
    getFilesList((files) => {
            Helpers.prompt({
                choices: files,
                message: 'How head file you need?',
            }, (file) => {
                fs.ensureDirSync(folderName);
                options.filePathJs = path.join(folderName, fileName + '.js');
                options.filePathScss = path.join(folderName, fileName + '.scss');
                options.filePathSpec = path.join(folderName, fileName + '.spec.json');
                Helpers.copyFile(file, options.filePathJs, function () {
                    Helpers.createFile(options.filePathScss, 'Add SCSS file?', () => {
                        Helpers.createFile(options.filePathSpec, 'Add Spec file?', (file, err) => {
                            if (!err) {
                                const generateSpec = require(Helpers.exist('templates/speca/add-module.js'));
                                fs.writeFileSync(file, JSON.stringify(generateSpec(options), null, "\t"))
                            }
                        })
                    });
                });
            })
        }
    )
};