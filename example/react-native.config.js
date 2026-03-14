const path = require('path')
const pkg = require('../package.json')

module.exports = {
    dependencies: {
        [pkg.name]: {
            // eslint-disable-next-line no-undef
            root: path.join(__dirname, '../'),
        },
    },
}
