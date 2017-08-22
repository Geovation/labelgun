module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "globals": {
        "expect": true,
        "it": true,
        "describe": true,
        "require" : true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "valid-jsdoc": [
            "error"
        ],
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};