const fs = require('fs-extra');
const path = require('path');

const inquirer = require('inquirer');
const _ = require('lodash');


const {libPath, localPath} = process.env;


const Helpers = {
    exist(file) {
        if (!fs.existsSync(path.join(localPath))) return path.resolve(libPath, file);
        if (!fs.existsSync(path.join(localPath, file))) return path.resolve(libPath, file);
        return path.resolve(localPath, file)
    },

    prompt(options, callback) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'mode',
                message: 'Make a choice!',
                pagination: true,
                pageSize: 12,
                ...options
            }
        ]).then(res => {
            return callback(res.mode);
        });
    },
    createFile(file, message, callback) {
        if (!fs.existsSync(file)) return Helpers.prompt({
            type: 'confirm',
            message: message,
        }, (value) => {
            if (value) {
                fs.ensureFileSync(file);
                if (callback) return callback(file, false);
            }
            if (callback) return callback(file, true);
        });
        console.log(`File ${file} is exist`);
        if (callback) return callback(file, `File ${file} is exist`);
    },
    copyFile(from, file, callback) {
        if (!fs.existsSync(file)) fs.copy(from, file);
        else console.log(`File ${file} is exist`);
        if (callback) return callback(file);
    },
    addImportFile(file, name, variable) {
        let code = fs.readFileSync(file, 'utf8');
        if (code.indexOf(name) === -1) {
            if (variable) {
                code = `import ${variable} from '${name}' \n` + code;
            }
            else {
                code = `import  '${name}' \n` + code;
            }
            fs.writeFileSync(file, code)
        }
    }
};

module.exports = Helpers;