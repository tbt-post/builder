const fs = require('fs-extra');
const path = require('path');

const inquirer = require('inquirer');
const _ = require('lodash');


const {rootPath, rootName, libPath} = process.env;


const Helpers = {
    exist(file) {
        if (!fs.existsSync(path.join('./', rootName))) return path.resolve(libPath, file);
        if (!fs.existsSync(path.join('./', rootName, file))) return path.resolve(libPath, file);
        return path.resolve('./', rootName, file)
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
    }
};

module.exports = Helpers;