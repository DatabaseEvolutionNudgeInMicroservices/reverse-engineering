// Libraries

const dotenv = require('dotenv');

/**
 * @overview Represents the helper constants.
 */

// Configuration

dotenv.config();

// Constants

const FILE_SYSTEM_SEPARATOR = process.env.FILE_SYSTEM_SEPARATOR;
const TEMP_FOLDER_NAME = 'TEMP';
const CODEQL_FOLDER_NAME_SUFFIX = '-codeql';
const QUERY_FOLDER_NAME = 'query';
const RESULT_FOLDER_NAME = 'result';
const RESULT_FILE_NAME = 'result.csv';
const LANGUAGES_SUPPORTED = ['javascript'];

const FILE_EXTENSIONS_SUPPORTED_FOR_NLP_ANALYSIS = ["js", "mjs", "cjs", "ts"];
const LANGUAGES_RESERVED_KEYWORDS = {
    ".js": {
        "language": [
            "require", "break", "case", "catch", "class", "const", "continue", "debugger", "default",
            "delete", "do", "else", "export", "extends", "finally", "for", "function",
            "if", "import", "in", "instanceof", "new", "return", "super", "switch",
            "this", "throw", "try", "typeof", "var", "void", "while", "with", "yield",
            "let", "static", "await", "enum", "implements", "package", "protected", "interface", "private", "public", "true", "false", "null",
            "resolve", 'reject', "promise", "logger", "parser", "constructor", "console", "log"
        ],
        // Example on how to include more reserved keywords
        // "libraries": {
        //     "mongoDb": [
        //         "find", "findOne", "insert", "insertOne", "insertMany", "update", "updateOne", "updateMany",
        //     ],
        //     "redis": [
        //         "redis", "redisClient", "del", "dump", "exists", "expire", "expireat", "keys",
        //     ]
        // }
    },
    ".mjs": {
        "_extends_": ".js",
    },
    ".cjs": {
        "_extends_": ".js",
    },
    ".ts": {
        "_extends_": ".js",
    },
    ".jsx": {
        "_extends_": ".js",
    },
    ".tsx": {
        "_extends_": ".js",
    },
    ".java": {
        "language": [
            "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
            "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float",
            "for", "goto", "if", "implements", "import", "instanceof", "int", "string", "interface", "long", "native", "exception",
            "new", "package", "private", "protected", "public", "return", "short", "static", "strictfp",
            "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void",
            "volatile", "while", "module", "requires", "exports", "opens", "provides", "uses", "to", "with"
        ],
    }
};

module.exports = {
    FILE_SYSTEM_SEPARATOR,
    TEMP_FOLDER_NAME,
    CODEQL_FOLDER_NAME_SUFFIX,
    QUERY_FOLDER_NAME,
    RESULT_FOLDER_NAME,
    RESULT_FILE_NAME,
    LANGUAGES_SUPPORTED,
    LANGUAGES_RESERVED_KEYWORDS,
    FILE_EXTENSIONS_SUPPORTED_FOR_NLP_ANALYSIS
}