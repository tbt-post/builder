const uuid = require('uuid');

module.exports = function (options) {
    return {
        id: uuid(),
        fileName: options.fileName,
        folderName: options.folderName,
        filePathJs: options.filePathJs,
    }
};