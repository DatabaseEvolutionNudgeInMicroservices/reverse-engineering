/**
 * @overview This class represents a downloader.
 */
class Downloader {
  /**
   * Instantiates a downloader.
   */
  constructor() {}

  /**
   * Downloads a list.
   * @param list {[String]} The given list.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the downloading.
   */
  downloadByList(list, destination) {}

  /**
   * Downloads an element.
   * @param element {String} The given element.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the downloading.
   */
  downloadByElement(element, destination) {}
}

module.exports = Downloader
