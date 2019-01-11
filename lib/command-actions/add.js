const path = require('path');
const fs = require('fs-extra');

const prompt = require('./helper/prompt');

const rootFolder = path.resolve(process.env.rootPath, 'templates', 'add', 'components');
const localFolder = path.resolve('./', 'tbt', 'templates', 'components');


function getFilesList(callback) {
    if (!fs.existsSync(rootFolder)) return console.error(err);
    const rootFiles = fs.readdirSync(rootFolder).sort().map(file => ({
        name: file.replace(/.js$/, ''),
        value: path.resolve(rootFolder, file)
    }));
    if (!fs.existsSync(localFolder)) return callback(rootFiles);
    const localFiles = fs.readdirSync(localFolder).sort().map(file => ({
        name: file.replace(/.js$/, ''),
        value: path.resolve(localFolder, file)
    }));
    return callback([...localFiles, ...rootFiles]);
}


function copyFile(from, file, callback) {
    if (!fs.existsSync(file)) fs.copy(from, file);
    else console.log(`File ${file} is exist`);
    if (callback) return callback(file);
}

function createFile(file, message, callback) {
    if (!fs.existsSync(file)) return prompt({
        type: 'confirm',
        message: message,
    }, (scss) => {
        if (scss) {
            fs.ensureFileSync(file);
        }
        if (callback) return callback(file);
    });
    if (callback) return callback(file);
}

module.exports = (folderName = '/', fileName = folderName.split('/').pop()) => {
    getFilesList((files) => {
        prompt({
            choices: files,
            message: 'How head file you need?',
        }, (file) => {
            fs.ensureDirSync(folderName);
            const filePathJs = path.join(folderName, fileName + '.js');
            const filePathScss = path.join(folderName, fileName + '.scss');
            const filePathSpec = path.join(folderName, fileName + '.json');

            copyFile(file, filePathJs, function () {
                createFile(filePathScss, 'Add SCSS file?', () => {
                    createFile(filePathSpec, 'Add Spec file?', (file) => {
                        fs.writeFileSync(file, JSON.stringify({
                            name: 'fileName'
                        }))
                    })
                });
            });
        })
    })
};