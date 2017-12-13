module.exports = {
    "extends": "airbnb-base",
    "env": {
        "node": true
    },
    "rules": {
        "no-use-before-define": ["error", { "functions": false }]
    }
};