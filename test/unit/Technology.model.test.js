// Model
const Technology = require("../../model/Technology.model");
// Error
const BadFormat = require('../../error/BadFormat.error.js');

// Happy path test suite

describe('Technology', () => {

    test('does to string', () => {

        // Given

        let technologyAsObjectGiven = new Technology("javascript-db-redis");

        // When

        let technologyAsStringGiven = technologyAsObjectGiven.toString();

        // Then

        expect(technologyAsStringGiven).toStrictEqual('{"id":"javascript-db-redis"}');
    });

    test('revives as object', () => {

        // Given

        let technologyAsStringGiven = '{"id":"javascript-db-redis"}';
        let technologyAsObjectGiven = JSON.parse(technologyAsStringGiven);

        // When

        let technologyAsModelGiven = Technology.revive(technologyAsObjectGiven);

        // Then

        let staticAnalysisCodeQLRequestAsModelExpected = new Technology("javascript-db-redis");
        expect(technologyAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected);
    });

    test('sets the technology', () => {

        // Given
        let technologyGiven = new Technology("javascript-db-redis");

        // When

        technologyGiven.setId("javascript-db-mongo");

        // Then

        expect(technologyGiven.getId()).toStrictEqual("javascript-db-mongo");
    });
});


// Failure cases test suite

describe('Technology tries to', () => {


    test('revive an incorrect formatted object', () => {

        // Given

        let technologyAsStringGiven = '{\'id\':\'hello\'}';

        // When Then

        expect(() => {
            Technology.revive(technologyAsStringGiven);
        }).toThrow(new BadFormat());
    });

    test('revive an incomplete formatted object', () => {

        // Given

        let technologyAsStringGiven = '{"id":"}';

        // When Then

        expect(() => {
            Technology.revive(technologyAsStringGiven);
        }).toThrow(new BadFormat());
    });

    test('revive an undefined object', () => {

        // Given

        let technologyGiven = undefined;

        // When Then

        expect(() => {
            Technology.revive(technologyGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a null object', () => {

        // Given

        let technologyGiven = null;

        // When Then

        expect(() => {
            Technology.revive(technologyGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a technology with null id', () => {

        // Given

        let technologyAsStringGiven = '{"name":null}';
        let technologyAsObjectGiven = JSON.parse(technologyAsStringGiven);

        // When Then

        expect(() => {
            Technology.revive(technologyAsObjectGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a technology with empty id', () => {

        // Given

        let technologyAsStringGiven = '{"name":""}';
        let technologyAsObjectGiven = JSON.parse(technologyAsStringGiven);

        // When Then

        expect(() => {
            Technology.revive(technologyAsObjectGiven);
        }).toThrow(new BadFormat());
    });

    test('create a technology with undefined id', () => {

        // Given When Then

        expect(() => {
            let technologyGiven = new Technology(undefined);
        }).toThrow(new BadFormat());
    });

    test('create a technology with null id', () => {

        // Given When Then

        expect(() => {
            let technologyGiven = new Technology(null);
        }).toThrow(new BadFormat());
    });

    test('create a technology with empty id', () => {

        // Given When Then

        expect(() => {
            let technologyGiven = new Technology("");
        }).toThrow(new BadFormat());
    });

    test('set a technology undefined id', () => {

        // Given

        let technologyAsObjectGiven = new Technology("javascript-api-express");

        // When Then

        expect(() => {
            technologyAsObjectGiven.setId(undefined);
        }).toThrow(new BadFormat());
    });

    test('set a technology null id', () => {

        // Given

        let technologyAsObjectGiven = new Technology("javascript-api-express");

        // When Then

        expect(() => {
            technologyAsObjectGiven.setId(null);
        }).toThrow(new BadFormat());
    });

    test('set a technology empty id', () => {

        // Given

        let technologyAsObjectGiven = new Technology("javascript-api-express");

        // When Then

        expect(() => {
            technologyAsObjectGiven.setId(undefined);
        }).toThrow(new BadFormat());
    });
});