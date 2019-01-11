#! /usr/bin/env node

const program = require('commander');
const path = require('path');
const args = process.argv.slice(2);
const rootPath = path.resolve(__dirname, '../');

process.env.globalPath = path.join(rootPath);
process.env.libPath = path.join(rootPath, 'lib');
process.env.localPath = path.join('./', 'tbt');


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
    .description('Add react module')
    .action((folderName, fileName) => {
        require('../lib/command-actions/add-module')(folderName, fileName)
    });

program
    .command('gen-module [folderName]')
    .description('Generation spec common file')
    .action((folderName) => {
        require('../lib/command-actions/gen-module')(folderName)
    });


if (!args.length) {
    program.outputHelp();
}

program.parse(process.argv);

