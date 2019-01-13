const path = require('path');
const fs = require('fs-extra');
const Helpers = require('../helpers/Helpers');
const {libPath, localPath, localRootPath} = process.env;

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
                fs.ensureDirSync(path.join(localRootPath, folderName));
                options.filePathJs = path.join(localRootPath, folderName, fileName + '.js');
                options.filePathScss = path.join(localRootPath, folderName, fileName + '.scss');
                options.filePathSpec = path.join(localRootPath, folderName, fileName + '.spec.json');
                Helpers.copyFile(file, options.filePathJs, (js) => {
                    Helpers.createFile(options.filePathScss, 'Add SCSS file?', (file, err) => {
                        console.log(file, err)
                        if (!err) {
                            Helpers.addImportFile(js, './' + path.basename(file));
                        }
                        Helpers.createFile(options.filePathSpec, 'Add Spec file?', (file, err) => {
                            console.log(file, err);
                            if (!err) {
                                Helpers.addImportFile(js, './' + path.basename(file), 'spec');
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