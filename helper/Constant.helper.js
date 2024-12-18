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

module.exports = {
    FILE_SYSTEM_SEPARATOR,
    TEMP_FOLDER_NAME,
    CODEQL_FOLDER_NAME_SUFFIX,
    QUERY_FOLDER_NAME,
    RESULT_FOLDER_NAME,
    RESULT_FILE_NAME,
    LANGUAGES_SUPPORTED
}