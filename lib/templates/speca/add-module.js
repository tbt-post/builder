const uuid = require('uuid');

module.exports = function (options) {
    return {
        id: uuid(),
        ...options
    }
};