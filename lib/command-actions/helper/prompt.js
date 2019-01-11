const inquirer = require('inquirer');
const _ = require('lodash');

module.exports = (options, callback) => {
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