const prompt = require('./helper/prompt');

module.exports = (options) => {
    prompt({
        choices: ['Client', 'Server'],
        message: 'Project type.'
    }, (mode) => {
        console.log(mode)
    })
};