// Model
const Method = require("../../model/Method.model");
// Error
const BadFormat = require('../../error/BadFormat.error.js');

// Happy path test suite

describe('Method', () => {

    test('does to string', () => {

        // Given

        let methodAsObjectGiven = new Method("find");

        // When

        let methodAsStringGiven = methodAsObjectGiven.toString();

        // Then

        expect(methodAsStringGiven).toStrictEqual('{"name":"find"}');
    });

    test('revives as object', () => {

        // Given

        let methodAsStringGiven = '{"name":"find"}';
        let methodAsObjectGiven = JSON.parse(methodAsStringGiven);

        // When

        let methodAsModelGiven = Method.revive(methodAsObjectGiven);

        // Then

        let staticAnalysisCodeQLRequestAsModelExpected = new Method("find");
        expect(methodAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected);
    });

    test('sets the method', () => {

        // Given
        let methodGiven = new Method("find");

        // When

        methodGiven.setName("findOne");

        // Then

        expect(methodGiven.getName()).toStrictEqual("findOne");
    });
});


// Failure cases test suite

describe('Method tries to', () => {


    test('revive an incorrect formatted object', () => {

        // Given

        let methodAsStringGiven = '{\'name\':\'find\'}';

        // When Then

        expect(() => {
            Method.revive(methodAsStringGiven);
        }).toThrow(new BadFormat());
    });

    test('revive an incomplete formatted object', () => {

        // Given

        let methodAsStringGiven = '{"name":"}';

        // When Then

        expect(() => {
            Method.revive(methodAsStringGiven);
        }).toThrow(new BadFormat());
    });

    test('revive an undefined object', () => {

        // Given

        let methodGiven = undefined;

        // When Then

        expect(() => {
            Method.revive(methodGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a null object', () => {

        // Given

        let methodGiven = null;

        // When Then

        expect(() => {
            Method.revive(methodGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a method with null name', () => {

        // Given

        let methodAsStringGiven = '{"name":null}';
        let methodAsObjectGiven = JSON.parse(methodAsStringGiven);

        // When Then

        expect(() => {
            Method.revive(methodAsObjectGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a method with empty name', () => {

        // Given

        let methodAsStringGiven = '{"name":""}';
        let methodAsObjectGiven = JSON.parse(methodAsStringGiven);

        // When Then

        expect(() => {
            Method.revive(methodAsObjectGiven);
        }).toThrow(new BadFormat());
    });

    test('create a method with undefined name', () => {

        // Given When Then

        expect(() => {
            new Method(undefined);
        }).toThrow(new BadFormat());
    });

    test('create a method with null name', () => {

        // Given When Then

        expect(() => {
            new Method(null);
        }).toThrow(new BadFormat());
    });

    test('create a method with empty name', () => {

        // Given When Then

        expect(() => {
            new Method("");
        }).toThrow(new BadFormat());
    });

    test('set a method undefined name', () => {

        // Given

        let methodAsObjectGiven = new Method("find");

        // When Then

        expect(() => {
            methodAsObjectGiven.setName(undefined);
        }).toThrow(new BadFormat());
    });

    test('set a method null name', () => {

        // Given

        let methodAsObjectGiven = new Method("find");

        // When Then

        expect(() => {
            methodAsObjectGiven.setName(null);
        }).toThrow(new BadFormat());
    });

    test('set a method empty name', () => {

        // Given

        let methodAsObjectGiven = new Method("find");

        // When Then

        expect(() => {
            methodAsObjectGiven.setName(undefined);
        }).toThrow(new BadFormat());
    });
});