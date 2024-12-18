// Model

const Concept = require("./Concept.model");
const Sample = require("./Sample.model");
const Method = require("./Method.model");
const Operation = require("./Operation.model");
const Technology = require("./Technology.model");

// Error

const BadFormat = require('../error/BadFormat.error.js');

/**
 * @overview This class represents a code fragment.
 */
class CodeFragment {

    /**
     * Instantiates a code fragment.
     */
    constructor(location, technology, operation, method, sample, concepts, heuristics, score) {
        this.setLocation(location);
        this.setTechnology(technology);
        this.setOperation(operation);
        this.setMethod(method);
        this.setSample(sample);
        this.setConcepts(concepts);
        this.setHeuristics(heuristics);
        this.setScore(score);
    }

    setLocation(location) {
        if (location !== null && location !== undefined && location.length > 0) {
            this.location = location;
        } else {
            throw new BadFormat();
        }
    }

    getLocation() {
        return this.location;
    }

    setTechnology(technology) {
        if (technology !== null && technology !== undefined && technology instanceof Technology) {
            this.technology = technology;
        } else {
            throw new BadFormat();
        }
    }

    getTechnology() {
        return this.technology;
    }

    setOperation(operation) {
        if (operation !== null && operation !== undefined && operation instanceof Operation) {
            this.operation = operation;
        } else {
            throw new BadFormat();
        }
    }

    getOperation() {
        return this.operation;
    }

    setMethod(method) {
        if (method !== null && method !== undefined && method instanceof Method) {
            this.method = method;
        } else {
            throw new BadFormat();
        }
    }

    getMethod() {
        return this.method;
    }

    setSample(sample) {
        if (sample !== null && sample !== undefined && sample instanceof Sample) {
            this.sample = sample;
        } else {
            throw new BadFormat();
        }
    }

    getSample() {
        return this.sample;
    }

    setConcepts(concepts) {
        if (concepts !== null && concepts !== undefined) {
            this.concepts = concepts;
        } else {
            throw new BadFormat();
        }
    }

    getConcepts() {
        return this.concepts;
    }

    setHeuristics(heuristics) {
        if (heuristics !== null && heuristics !== undefined) {
            this.heuristics = heuristics;
        } else {
            throw new BadFormat();
        }
    }

    getHeuristics() {
        return this.heuristics;
    }

    setScore(score) {
        if (score !== null && score !== undefined) {
            this.score = score;
        } else {
            throw new BadFormat();
        }
    }

    getScore() {
        return this.score;
    }

    /**
     * Revives a File object.
     * @param object {Object} The given JavaScript object.
     * @return {CodeFragment} The related File object.
     * @throws {Error} In the case of an invalid object format.
     */
    static revive(object) {
        try {
            if (object !== null && object !== undefined && object.hasOwnProperty('location') && object.location !== null && object.location !== undefined && object.hasOwnProperty('technology') && object.technology !== null && object.technology !== undefined && object.hasOwnProperty('operation') && object.operation !== null && object.operation !== undefined && object.hasOwnProperty('method') && object.method !== null && object.method !== undefined && object.hasOwnProperty('sample') && object.sample !== null && object.sample !== undefined && object.hasOwnProperty('concepts') && object.concepts !== null && object.concepts !== undefined && object.hasOwnProperty('heuristics') && object.heuristics !== null && object.heuristics !== undefined && object.hasOwnProperty('score') && object.score !== null && object.score !== undefined) {
                let location = object.location;
                let technology = Technology.revive(object.technology);
                let operation = Operation.revive(object.operation);
                let method = Method.revive(object.method);
                let sample = Sample.revive(object.sample);
                let concepts = []
                object.concepts.forEach(concept => concepts.push(Concept.revive(concept)))
                let heuristics = object.heuristics;
                let score = object.score;
                return new CodeFragment(location, technology, operation, method, sample, concepts, heuristics, score);
            } else {
                throw new BadFormat();
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Prints the object in a human-readable way (JSON).
     */
    toString() {
        return JSON.stringify(this);
    }
}

module.exports = CodeFragment;