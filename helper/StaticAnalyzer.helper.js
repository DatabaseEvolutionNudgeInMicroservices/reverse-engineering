/**
 * @overview This class represents a static analyzer.
 */
class StaticAnalyzer {
  /**
   * Instantiates a static analyzer.
   */
  constructor() {}

  /**
   * Initializes an analysis for a list of repositories.
   * @param repositories {[Repository]} The given list of repositories.
   * @param destination {String} The destination.
   * @param options {Object} The options.
   * @returns {Promise} A promise for the preparation.
   */
  initializesByRepositories(repositories, destination, options) {}

  /**
   * Initializes an analysis by repository.
   * @param repository {Repository} The given repository.
   * @param destination {String} The destination.
   * @param options {Object} The options.
   * @returns {Promise} A promise for the preparation.
   */
  initializesByRepository(repository, destination, options) {}

  /**
   * Performs an identification analysis for a list of repositories.
   * @param repositories {[Repository]} The given list of repositories.
   * @param destination {String} The destination.
   * @param options {Object} The options.
   * @returns {Promise} A promise for the analysis.
   */
  identifyByRepositories(repositories, destination, options) {}

  /**
   * Performs an identification analysis by repository.
   * @param repository {Repository} The given repository.
   * @param destination {String} The destination.
   * @param options {Object} The options.
   * @returns {Promise} A promise for the analysis.
   */
  identifyByRepository(repository, destination, options) {}

  /**
   * Extracts an analysis for a list of repositories.
   * @param repositories {[Repository]} The given list of repositories.
   * @param destination {String} The destination.
   * @param options {Object} The options.
   * @returns {Promise} A promise for the extraction.
   */
  extractByRepositories(repositories, destination, options) {}

  /**
   * Extracts an analysis by repository.
   * @param repository {Repository} The given repository.
   * @param destination {String} The destination.
   * @param options {Object} The options.
   * @returns {Promise} A promise for the extraction.
   */
  extractByRepository(repository, destination, options) {}

  /**
   * Interprets an analysis for a list of repositories.
   * @param repositories {[Repository]} The given list of repositories.
   * @param destination {String} The destination.
   * @param options {Object} The options.
   * @returns {Promise} A promise for the extraction.
   */
  interpretByRepositories(repositories, destination, options) {}
}

module.exports = StaticAnalyzer
