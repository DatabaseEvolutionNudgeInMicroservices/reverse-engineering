// Constants

const {
  LANGUAGES_KEYWORDS,
  LANGUAGES_COMMENTS,
  LANGUAGES_STRINGS,
  NLP_METRICS_WEIGHTS,
  STOP_WORD_EXCLUSION,
  STOP_WORD_INCLUSION,
  LEMMATIZATION_EXCLUSION,
  TAG_GROUP_TERMS_IN,
  TAG_GROUP_TERMS_OUT,
  TAG_GROUP_TERMS_UNKNOWN,
  GROUP_TERMS_OUT_SEEDS_BASIS
} = require('./Constant.helper')

// Libraries : Wink

const winkNLP = require('wink-nlp')
const model = require('wink-eng-lite-web-model')
const winkNLPLemmatizer = require('wink-lemmatizer')

// Libraries : Natural

const natural = require('natural')

// Libraries : Transformers

const { pipeline } = require('@xenova/transformers')

// Configuration : Wink

const nlp = winkNLP(model)
const its = nlp.its
const as = nlp.as
const patterns = [{ name: 'concept', patterns: ['NOUN', 'PROPN'] }] // Concepts are usually represented as nouns or proper nouns.
nlp.learnCustomEntities(patterns)

// Configuration : Natural

const stopwords = natural.stopwords
  .filter((w) => !STOP_WORD_EXCLUSION.includes(w))
  .concat(STOP_WORD_INCLUSION)
let TfIdf = natural.TfIdf

/**
 * @overview This class represents the NLP helper.
 */
class NLP {
  /**
   * Instantiates a NLP helper.
   */
  constructor() {}

  /**
   * Extracts, filters, normalizes, and refines the concepts from a given file text or string list, using given hints.
   *
   * @param text {String|[String]} The text.
   * @param languageHints {String} The language hints (i.e., file extension, file type).
   * @param keywordHints {[String]} The keyword hints (i.e., technology grammar, conceptual names).
   * @returns {Array} An array of processed concepts after filtering and normalization.
   */
  extractConcepts(text, languageHints = '', keywordHints = null) {
    if (text !== undefined && text !== null && text !== '') {
      let concepts = []
      if (text instanceof Array) {
        concepts = text
      } else {
        concepts = this.extractRawConcepts(text)
      }

      // Normalizing.
      concepts = this.formatMultipleWordsConcepts(concepts)
      concepts = this.lemmatizeConcepts(concepts)

      // Filtering.
      concepts = this.filterNoisyConcepts(concepts)
      concepts = this.filterStopWords(concepts)
      concepts = this.filterReservedKeywords(concepts, languageHints, keywordHints)

      return concepts
    } else {
      return []
    }
  }

  /**
   * Removes the comments from a given file text according to a specified language.
   * @param text {String} The given file text.
   * @param language {String} The language key.
   */
  removeComments(text, language) {
    if (!text) return ''

    const commentSymbols = LANGUAGES_COMMENTS[language]
    const stringSymbols = LANGUAGES_STRINGS[language]

    if (!commentSymbols || !stringSymbols) return text

    const { line: lineTokens = [], block: blockTokens = [] } = commentSymbols
    const { string: stringDelimiters = [], escape: escapeChar = '\\' } = stringSymbols

    const lines = text.split('\n')

    let inBlockComment = false
    let blockEnd = null

    for (let li = 0; li < lines.length; li++) {
      let line = lines[li]
      let chars = line.split('')
      let inString = false
      let stringDelimiter = null

      for (let i = 0; i < chars.length; i++) {
        const theChar = chars[i]
        const prev = chars[i - 1]

        if (inString) {
          if (theChar === stringDelimiter && prev !== escapeChar) inString = false
          continue
        } else if (stringDelimiters.includes(theChar)) {
          inString = true
          stringDelimiter = theChar
          continue
        }

        if (inBlockComment) {
          if (line.slice(i, i + blockEnd.length) === blockEnd) {
            for (let j = 0; j < blockEnd.length; j++) chars[i + j] = ' '
            i += blockEnd.length - 1
            inBlockComment = false
            blockEnd = null
          } else {
            if (theChar !== '\n') chars[i] = ' '
          }
          continue
        }

        const lineToken = lineTokens.find((t) => line.slice(i, i + t.length) === t)
        if (lineToken) {
          for (let j = i; j < chars.length; j++) chars[j] = ' '
          break
        }

        const blockToken = blockTokens.find(
          ([start, end]) => line.slice(i, i + start.length) === start
        )
        if (blockToken) {
          const [start, end] = blockToken
          for (let j = 0; j < start.length; j++) chars[i + j] = ' '
          i += start.length - 1
          inBlockComment = true
          blockEnd = end
          continue
        }
      }

      lines[li] = chars.join('')
    }

    return lines.join('\n')
  }

  /**
   * Extracts raw concepts from the given text using a regular expression identifying alphanumeric words, including
   * those starting with underscores.
   *
   * @param text {String} The input text from which raw concepts are extracted.
   * @returns {Array} An array of raw concepts found in the text.
   */
  extractRawConcepts(text) {
    const RAW_CONCEPTS_REGEX = /\b[a-zA-Z_][a-zA-Z0-9_-]*\b/g
    return text.match(RAW_CONCEPTS_REGEX) || []
  }

  /**
   * Filters out noisy concepts that are too short to be meaningful, with a length greater than 1 are considered valid.
   *
   * @param concepts {Array} The array of concepts to filter.
   * @returns {Array} A filtered array containing only meaningful concepts.
   */
  filterNoisyConcepts(concepts) {
    return concepts.filter((concept) => concept.length > 1)
  }

  /**
   * Removes stop words from the given concepts.
   *
   * @param concepts {Array} The array of concepts to filter.
   * @returns {Array} A filtered array of concepts without stop words.
   */
  filterStopWords(concepts) {
    return concepts
      .map((concept) => {
        return concept
          .split(' ')
          .filter((conceptSplit) => !stopwords.includes(conceptSplit.toLowerCase()))
          .join(' ')
      })
      .filter(Boolean) // Deletes empty string.
  }

  /**
   * Removes or adds reserved keywords from the given concepts list based on given hints.
   *
   * @param concepts {Array} The array of concepts to filter.
   * @param languageHint {String} The language hints.
   * @param keywordHints {[String]} The keyword hints (i.e., technology grammar, conceptual names).
   * @returns {Array} A filtered array of concepts without reserved keywords.
   */
  filterReservedKeywords(concepts, languageHint = '', keywordHints = []) {
    const filter = (conceptList, reservedKeywordsList) =>
      conceptList.filter(
        (c) => !reservedKeywordsList.some((keyword) => c.toLowerCase() === keyword.toLowerCase())
      )

    // Language hints.
    // Uses the language hints (i.e., file extension, file type) to determine the language of the code in the file and to remove reserved keywords.

    const fileReservedKeywords = LANGUAGES_KEYWORDS[languageHint] // Retrieves language (and related libraries) keywords.
    if (!fileReservedKeywords) {
      return concepts
    }
    let fileReservedKeywordsParent = {}
    if ('_extends_' in fileReservedKeywords) {
      const fileReservedKeywordsParentId = fileReservedKeywords['_extends_']
      fileReservedKeywordsParent = LANGUAGES_KEYWORDS[fileReservedKeywordsParentId]
      // Extends the reserved keywords of a language to the parent type. The '_extends_' property indicates that the
      // current language (e.g., .ts, .mjs, .cjs) inherits the reserved keywords of another 'parent' language (e.g.,
      // .js). This ensures that keywords from the extended language are also excluded during concept filtering. For
      // example, a TypeScript (.ts) file extends JavaScript (.js), so JavaScript's reserved keywords (like
      // 'function', 'const') are removed from the concepts in addition to any TypeScript-specific keywords.
    }

    let reservedKeywords = [
      ...(fileReservedKeywords.language ? Object.values(fileReservedKeywords.language).flat() : []),
      ...(fileReservedKeywords.libraries
        ? Object.values(fileReservedKeywords.libraries).flat()
        : []),
      ...(fileReservedKeywordsParent.language
        ? Object.values(fileReservedKeywordsParent.language).flat()
        : []),
      ...(fileReservedKeywordsParent.libraries
        ? Object.values(fileReservedKeywordsParent.libraries).flat()
        : [])
    ]
    reservedKeywords = this.filterNoisyConcepts(reservedKeywords)
    reservedKeywords = this.formatMultipleWordsConcepts(reservedKeywords)
    reservedKeywords = this.lemmatizeConcepts(reservedKeywords)
    reservedKeywords = this.filterStopWords(reservedKeywords)
    reservedKeywords = [...new Set(reservedKeywords)]

    // Keywords hints.
    // Examples:
    // - Concepts. Uses keyword hints to remove conceptual keywords from the reserved keywords list to remove.
    //   Indeed, some concepts sometimes can be confused with some language, libraries or technology reserved keywords.
    //   E.g., 'export', 'import', 'case', 'package', etc. that are reserved keywords but valid conceptual entities also.
    // - Technology. Uses keywords hints to remove specific keywords from the reserved keywords list to remove.
    //   Indeed, some specific technological keyword can direct the detection.
    // - ...

    if (keywordHints && keywordHints.length !== 0) {
      keywordHints = this.filterNoisyConcepts(keywordHints)
      keywordHints = this.formatMultipleWordsConcepts(keywordHints)
      keywordHints = this.lemmatizeConcepts(keywordHints)
      keywordHints = this.filterStopWords(keywordHints)
      reservedKeywords = reservedKeywords.filter((k) => !keywordHints.includes(k))
    }

    // Results.

    return filter(concepts, reservedKeywords)
  }

  /**
   * Formats formalized concepts (e.g., kebab-case, snake_case, CamelCase, and PascalCase) that contain multiple words, normalizing them into isolated words.
   *
   * @param concepts {Array} The array of concepts to normalize.
   * @returns {Array} An array of individual, lowercase words derived from the concepts.
   */
  formatMultipleWordsConcepts(concepts) {
    return concepts.flatMap((concept) => {
      return concept
        .split(/[-_]/) // kebab-case, snake_case, and SCREAMING_SNAKE_CASE to isolated words.
        .map(
          (word) =>
            word
              .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase to isolated words.
              .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // PascalCase to isolated words.
              .toLowerCase() // Converts isolated lowercase words.
        )
        .join(' ') // Join isolated words.
        .trim() // Remove useless spaces.
    })
  }

  /**
   * Lemmatizes the concepts by reducing them to their base form where each concept is split into individual words, and each word is lemmatized using the noun lemmatizer.
   * @param concepts {Array} The array of concepts to lemmatize.
   * @returns {Array} An array of lemmatized concepts.
   */
  lemmatizeConcepts(concepts) {
    return concepts.map((concept) =>
      concept
        .split(' ')
        // Reduces plural nouns and derived forms to their base form (lemma).
        // If the word is not a recognized noun or verb, it returns the original word.
        // Examples: cars -> car,
        //           libraries -> library
        //           winning -> win
        //           ...
        .map(winkNLPLemmatizer.noun) // Nouns.
        // .map(winkNLPLemmatizer.verb) // Verbs.
        .map((c) => (LEMMATIZATION_EXCLUSION[c] ? LEMMATIZATION_EXCLUSION[c] : c)) // Lemmatization exclusion.
        .join(' ')
    )
  }

  /**
   * Counts the occurrences of each concept's lemma (atomic part of a multiple-word concept) present in the given list of concepts.
   * @param concepts {Array} The array of concepts to analyze.
   * @returns {Object} An object mapping each unique word to its number of occurrences.
   */
  getConceptsStatistics(concepts) {
    const counter = {}
    concepts.forEach((concept) => {
      const words = concept.split(/\s+/).filter(Boolean) // Handles multiple spaces.
      words.forEach((word) => {
        if (!counter[word]) {
          counter[word] = { numberOfOccurrence: 0 }
        }
        counter[word].numberOfOccurrence += 1
      })
    })
    return counter
  }

  /**
   * Scores the concepts in the given concepts documents according to several measures.
   * @param conceptsDocuments [[String]] The given concepts documents.
   * @param keywordHints {[String]} The keyword hints (i.e., technology grammar, conceptual names).
   * @return The list of scored concepts.
   */
  scoreConcepts(conceptsDocuments, keywordHints = []) {
    // 1. Compute metrics for each concept.

    // For all concepts
    const documentsSum = conceptsDocuments.length
    let concepts = [...new Set(conceptsDocuments.flat())]
    concepts = concepts.map((c) => {
      const conceptDocuments = conceptsDocuments.filter((f) => f.includes(c)) // Documents: list of documents containing the concept.
      const conceptDocumentsSum = [...new Set(conceptDocuments)].length // Documents Sum: sum of documents containing the concept.
      const conceptOccurrences = conceptDocuments.map((f) => f.filter((x) => x === c).length) // Occurrence List: list of occurrence counts of the concept across documents.
      const conceptOccurrencesSum = conceptOccurrences.reduce((acc, val) => acc + val, 0) // Occurrence Sum: sum of occurrence counts of the concept across documents.
      const conceptOccurrencesMax = Math.max(...conceptOccurrences) // Occurrence Max: maximum occurrence of the concept across documents.
      const conceptOccurrencesMean = conceptOccurrencesSum / conceptDocumentsSum // Occurrence Mean: mean of occurrence counts of the concept across documents.
      const conceptStandardDeviation = Math.sqrt(
        conceptOccurrences.reduce(
          (acc, val) => acc + Math.pow(val - conceptOccurrencesMean, 2),
          0
        ) / conceptDocumentsSum
      ) // Standard Deviation: dispersion of occurrence counts of the concept across documents.
      const conceptCoefficientVariation = conceptStandardDeviation / conceptOccurrencesMean // Coefficient of Variation (CoV): ratio between the dispersion of the occurrence counts of the concept and the occurrence mean across documents.
      const conceptTF = conceptOccurrences.map((val, i) => val / conceptDocuments[i].length)
      const conceptIDF = Math.log(documentsSum / conceptDocumentsSum) // Inverse Document Frequency (IDF): rarity or commonness measure of a concept across documents.
      const conceptTFIDF = conceptTF.map((x) => (conceptIDF !== 0 ? x / conceptIDF : 0)) // Term Frequency - Inverse Document Frequency (TF-IDF): importance of the concept within the corpus.
      const conceptTFIDFAverage =
        conceptTFIDF.reduce((acc, val) => acc + val, 0) / conceptDocumentsSum // Average Coefficient of Variation (aCoV): average measure of the Coefficient of Variation (CoV) for the concept across documents.
      const conceptDominance = conceptOccurrencesMax / conceptOccurrencesSum // Dominance: ratio between the maximum occurrence and the sum of occurrence of the concept across documents.

      // console.log('Concept: ' + c)
      // console.log('conceptDocumentsSum: ' + conceptDocumentsSum)
      // console.log('conceptOccurrencesSum: ' + conceptOccurrencesSum)
      // console.log('conceptOccurrencesMax: ' + conceptOccurrencesMax)
      // console.log('conceptOccurrencesMean: ' + conceptOccurrencesMean)
      // console.log('conceptStandardDeviation: ' + conceptStandardDeviation)
      // console.log('conceptCoefficientVariation: ' + conceptCoefficientVariation)
      // console.log('conceptTF: ' + conceptTF)
      // console.log('conceptIDF: ' + conceptIDF)
      // console.log('conceptTFIDF: ' + conceptTFIDF)
      // console.log('conceptTFIDFAverage: ' + conceptTFIDFAverage)
      // console.log('conceptDominance: ' + conceptDominance)
      // console.log(
      //   'concept: ' + c,
      //   ' | conceptCoefficientVariation: ' +
      //     conceptCoefficientVariation +
      //     ', conceptTFIDFAverage: ' +
      //     conceptTFIDFAverage +
      //     ', conceptDominance: ' +
      //     conceptDominance
      // )

      return {
        name: c,
        documentsSum: conceptDocumentsSum,
        occurrencesSum: conceptOccurrencesSum,
        occurrencesMax: conceptOccurrencesMax,
        occurrencesMean: conceptOccurrencesMean,
        standardDeviation: conceptStandardDeviation,
        coefficientVariation: conceptCoefficientVariation,
        tfIdfAverage: conceptTFIDFAverage,
        dominance: conceptDominance
      }
    }) // Computes metrics.

    // console.log(
    //   concepts.map(
    //     (c) =>
    //       c.name +
    //       ' (CoV: ' +
    //       c.coefficientVariation +
    //       ', TF-IDF AVG: ' +
    //       c.tfIdfAverage +
    //       ', D: ' +
    //       c.dominance +
    //       ')'
    //   )
    // )

    // 2. Normalizes each metric for each concept.

    const normalize = (concepts, metric) => {
      const values = concepts.map((concept) => concept[metric]).filter((v) => !isNaN(v))
      const min = Math.min(...values)
      const max = Math.max(...values)
      return concepts.map((concept) => ({
        ...concept,
        [`${metric}Normalized`]: (concept[metric] - min) / (max - min || 1)
      }))
    }

    concepts = normalize(concepts, 'coefficientVariation')
    concepts = normalize(concepts, 'tfIdfAverage')
    concepts = normalize(concepts, 'dominance')
    concepts = normalize(concepts, 'occurrencesMean')

    // console.log(
    //   concepts.map(
    //     (c) =>
    //       c.name +
    //       ' (CoV normalized: ' +
    //       c.coefficientVariationNormalized +
    //       ', TF-IDF AVG normalized: ' +
    //       c.tfIdfAverageNormalized +
    //       ', D normalized: ' +
    //       c.dominanceNormalized +
    //       ')'
    //   )
    // )

    // 3. Derives the score from metrics for each concept.

    concepts.forEach((concept) => {
      if (keywordHints.includes(concept.name)) {
        concept.score = 1 // Top/Bonus score given when a concept is among the keywords hints.
      } else {
        concept.score =
          NLP_METRICS_WEIGHTS.tfidf * concept.tfIdfAverageNormalized +
          NLP_METRICS_WEIGHTS.coefficientVariation * concept.coefficientVariationNormalized +
          NLP_METRICS_WEIGHTS.dominance * concept.dominanceNormalized +
          NLP_METRICS_WEIGHTS.frequencyMean * concept.occurrencesMeanNormalized
      }
    })

    // 4. Sorts the concepts.

    concepts = concepts.sort((a, b) => b.score - a.score)

    // 5. Formats the concepts.

    concepts = concepts.map((c) => {
      delete c.documentsSum
      delete c.occurrencesSum
      delete c.occurrencesMax
      delete c.occurrencesMean
      delete c.standardDeviation
      delete c.coefficientVariation
      delete c.tfIdfAverage
      delete c.dominance
      delete c.tfIdfAverageNormalized
      delete c.coefficientVariationNormalized
      delete c.dominanceNormalized
      delete c.occurrencesMeanNormalized
      return c
    })

    return concepts
  }

  /**
   * Classifies the concepts in two groups based on inclusion (group A) and exclusion (group B) keyword hints as seeds.
   * @param terms The terms to classify.
   * @param inclusionKeywordHints The inclusion keyword hint seeds.
   * @param exclusionKeywordHints The exclusion keyword hint seeds.
   */
  classifyConcept(terms, inclusionKeywordHints, exclusionKeywordHints) {
    return new Promise(async (resolve, reject) => {
      try {
        // Utils

        let extractor = null

        async function initExtractor() {
          extractor = await pipeline(
            'feature-extraction',
            'sentence-transformers/all-MiniLM-L12-v2',
            { quantized: false }
          )
        }

        async function embed(term) {
          const out = await extractor(term, { pooling: 'mean', normalize: true })
          return Array.from(out.data)
        }

        const center = async (seeds) => {
          if (!seeds || seeds.length === 0) return null

          const vectors = await Promise.all(seeds.map(embed))
          const dimension = vectors[0].length
          const center = new Array(dimension).fill(0)

          vectors.forEach((v) => v.forEach((x, i) => (center[i] += x)))
          return center.map((x) => x / vectors.length)
        }

        const cosineSimilarity = (a, b) => {
          let dot = 0,
            na = 0,
            nb = 0
          for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i]
            na += a[i] * a[i]
            nb += b[i] * b[i]
          }
          return dot / (Math.sqrt(na) * Math.sqrt(nb))
        }

        const similarityThreshold = async (seeds, centerValue) => {
          const similarities = []
          for (const seed of seeds) {
            const vector = await embed(seed)
            similarities.push(cosineSimilarity(vector, centerValue))
          }
          const mean = similarities.reduce((a, b) => a + b, 0) / similarities.length
          const deviation = Math.sqrt(
            similarities.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
              similarities.length
          )
          return mean - deviation
        }

        const classify = async (term, centerTermGroupIn, centerTermGroupOut, threshold) => {
          const vector = await embed(term)
          const hasCenter1 = centerTermGroupIn !== null
          const hasCenter2 = centerTermGroupOut !== null
          let label

          if (hasCenter1 && hasCenter2) {
            const s1 = cosineSimilarity(vector, centerTermGroupIn)
            const s2 = cosineSimilarity(vector, centerTermGroupOut)
            const denominator = Math.abs(s1) + Math.abs(s2)
            const rel = denominator === 0 ? 0 : (s1 - s2) / denominator

            if (inclusionKeywordHints.includes(term))
              label = TAG_GROUP_TERMS_IN // Forces to include inclusive keywords hints into group IN.
            else if (exclusionKeywordHints.includes(term))
              label = TAG_GROUP_TERMS_OUT // Forces to include exclusive keywords hints into group OUT.
            else if (rel > 0.08) label = TAG_GROUP_TERMS_IN
            else if (rel < -0.08) label = TAG_GROUP_TERMS_OUT
            else label = TAG_GROUP_TERMS_UNKNOWN
          } else if (!hasCenter1 && hasCenter2) {
            label =
              cosineSimilarity(vector, centerTermGroupOut) >= threshold
                ? TAG_GROUP_TERMS_OUT
                : TAG_GROUP_TERMS_IN
          } else if (hasCenter1 && !hasCenter2) {
            label = TAG_GROUP_TERMS_IN
          } else {
            label = TAG_GROUP_TERMS_UNKNOWN
          }

          return { term, label }
        }

        await initExtractor()

        // Classification

        const exclusionKeywordHintsExtended = exclusionKeywordHints.concat(
          GROUP_TERMS_OUT_SEEDS_BASIS
        )
        const exclusionSeedsCenterValue = await center(exclusionKeywordHintsExtended)
        const inclusionSeedsCenterValue = await center(inclusionKeywordHints)

        const exclusionSimilarityThresholdValue =
          exclusionSeedsCenterValue !== null
            ? await similarityThreshold(exclusionKeywordHintsExtended, exclusionSeedsCenterValue)
            : null // NOTE: The inclusion group may be empty (not recommended), as the exclusion group has a default basis seed and classification will be performed based on a threshold calculated from this default basis seed.

        const resultsAll = await Promise.all(
          terms.map((t) =>
            classify(
              t,
              inclusionSeedsCenterValue,
              exclusionSeedsCenterValue,
              exclusionSimilarityThresholdValue
            )
          )
        )
        const results = resultsAll.filter((r) => r.label === TAG_GROUP_TERMS_IN).map((r) => r.term)
        resolve(results)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = NLP
