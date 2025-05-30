/**
 * @overview This class represents a static analyzer.
 */
class StaticAnalyzer {
  /**
   * Instantiates a static analyzer.
   */
  constructor() {}

  /**
   * Initializes an analysis by list.
   * @param list {[String]} The given list.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the preparation.
   */
  initializesByList(list, language, destination) {}

  /**
   * Initializes an analysis by element.
   * @param element {String} The given element.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the preparation.
   */
  initializesByElement(element, language, destination) {}

  /**
   * Performs an identification analysis by list.
   * @param list {[String]} The given list.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the analysis.
   */
  identifyByList(list, language, destination) {}

  /**
   * Performs an identification analysis by element.
   * @param element {String} The given element.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the analysis.
   */
  identifyByElement(element, language, destination) {}

  /**
   * Extracts an analysis by list.
   * @param list {[String]} The given list.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the extraction.
   */
  extractByList(list, language, destination) {}

  /**
   * Extracts an analysis by element.
   * @param element {String} The given element.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the extraction.
   */
  extractByElement(element, language, destination) {}

  /**
   * Interprets  an analysis by list.
   * @param list {[String]} The given list.
   * @param language {String} The targeted language by the analysis.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the extraction.
   */
  interpretByList(list, language, destination) {}
}

module.exports = StaticAnalyzer
