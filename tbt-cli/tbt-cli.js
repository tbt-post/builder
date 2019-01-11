#! /usr/bin/env node

const program = require('commander');
const path = require('path');
const args = process.argv.slice(2);
const rootPath = path.resolve(__dirname, '../');

process.env.rootPath = path.resolve(rootPath);
process.env.libPath = path.resolve(rootPath, 'lib');
process.env.rootName = path.resolve('./', 'tbt');

program
    .usage('[command] [options] \n         Command without flags will be started in interactive mode.');

// program
//     .command('init')
//     .description('Init TARS-project in current directory')
//     .option('--exclude-html', 'Prevent templater-files uploading')
//     .option('--exclude-css', 'Prevent preprocessor-files uploading')
//     .option('--silent', 'TARS will not ask any question about configuration')
//     .option('-s, --source <source>', 'Change source of TARS')
//     .action(options => require('../lib/command-actions/init')(options));


program
    .command('add-module <folderName> [fileName]')
    .description('Add react component')
    .action((folderName, fileName) => {
        require('../lib/command-actions/add')(folderName, fileName)
    });
if (!args.length) {
    program.outputHelp();
}

program.parse(process.argv);

