// Model
const Directory = require("../../model/Directory.model");
// Error
const BadFormat = require('../../error/BadFormat.error.js');

// Happy path test suite

describe('Directory', () => {

    test('does to string', () => {

        // Given

        let directoryAsObjectGiven = new Directory("https://www.github.com/user/project/blob/master/app/", [], []);

        // When

        let directoryAsStringGiven = directoryAsObjectGiven.toString();

        // Then

        expect(directoryAsStringGiven).toStrictEqual('{"location":"https://www.github.com/user/project/blob/master/app/","directories":[],"files":[]}');
    });

    test('revives as object', () => {

        // Given

        let directoryAsStringGiven = '{"location":"https://www.github.com/user/project/blob/master/app/","directories":[],"files":[]}';
        let directoryAsObjectGiven = JSON.parse(directoryAsStringGiven);

        // When

        let directoryAsModelGiven = Directory.revive(directoryAsObjectGiven);

        // Then

        let staticAnalysisCodeQLRequestAsModelExpected = new Directory("https://www.github.com/user/project/blob/master/app/", [], []);
        expect(directoryAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected);
    });

    test('sets the directory', () => {

        // Given
        let directoryGiven = new Directory("https://www.github.com/user/project/blob/master/app/", [], []);

        // When

        directoryGiven.setLocation("https://www.github.com/user/project/blob/master/app/js/");
        directoryGiven.setDirectories([]);
        directoryGiven.setFiles([]);

        // Then

        expect(directoryGiven.getLocation()).toStrictEqual("https://www.github.com/user/project/blob/master/app/js/");
        expect(directoryGiven.getFiles()).toStrictEqual([]);
        expect(directoryGiven.getDirectories()).toStrictEqual([]);
    });
});


// Failure cases test suite

describe('Directory tries to', () => {


    test('revive an incorrect formatted object', () => {

        // Given

        let directoryAsStringGiven = '{\'location\':\'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1"\'}';

        // When Then

        expect(() => {
            Directory.revive(directoryAsStringGiven);
        }).toThrow(new BadFormat());
    });

    test('revive an incomplete object', () => {

        // Given

        let directoryAsStringGiven = '{"location":"https://www.github.com/user/project/blob/master/app/"}';

        // When Then

        expect(() => {
            Directory.revive(directoryAsStringGiven);
        }).toThrow(new BadFormat());
    });

    test('revive an undefined object', () => {

        // Given

        let directoryGiven = undefined;

        // When Then

        expect(() => {
            Directory.revive(directoryGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a null object', () => {

        // Given

        let directoryGiven = null;

        // When Then

        expect(() => {
            Directory.revive(directoryGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a directory with null location', () => {

        // Given

        let directoryAsStringGiven = '{"location":null,"directories":[],"files":[]}';
        let directoryAsObjectGiven = JSON.parse(directoryAsStringGiven);

        // When Then

        expect(() => {
            Directory.revive(directoryAsObjectGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a directory with empty location', () => {

        // Given

        let directoryAsStringGiven = '{"location":"","directories":[],"files":[]}';
        let directoryAsObjectGiven = JSON.parse(directoryAsStringGiven);

        // When Then

        expect(() => {
            Directory.revive(directoryAsObjectGiven);
        }).toThrow(new BadFormat());
    });

    test('create a directory with undefined location', () => {

        // Given When Then

        expect(() => {
            new Directory(undefined, []);
        }).toThrow(new BadFormat());
    });

    test('create a directory with null location', () => {

        // Given When Then

        expect(() => {
            new Directory(null, []);
        }).toThrow(new BadFormat());
    });

    test('create a directory with empty location', () => {

        // Given When Then

        expect(() => {
            new Directory("", []);
        }).toThrow(new BadFormat());
    });

    test('create a directory with undefined files', () => {

        // Given When Then

        expect(() => {
            new Directory("https://www.github.com/user/project/blob/master/app/", undefined);
        }).toThrow(new BadFormat());
    });

    test('create a directory with null files', () => {

        // Given When Then

        expect(() => {
            new Directory("https://www.github.com/user/project/blob/master/app/", null);
        }).toThrow(new BadFormat());
    });

    test('set a directory undefined location', () => {

        // Given

        let directoryAsObjectGiven = new Directory("https://www.github.com/user/project/blob/master/app/", [], []);

        // When Then

        expect(() => {
            directoryAsObjectGiven.setLocation(undefined);
        }).toThrow(new BadFormat());
    });

    test('set a directory null location', () => {

        // Given

        let directoryAsObjectGiven = new Directory("https://www.github.com/user/project/blob/master/app/", [], []);

        // When Then

        expect(() => {
            directoryAsObjectGiven.setLocation(null);
        }).toThrow(new BadFormat());
    });

    test('set a directory empty location', () => {

        // Given

        let directoryAsObjectGiven = new Directory("https://www.github.com/user/project/blob/master/app/", [], []);

        // When Then

        expect(() => {
            directoryAsObjectGiven.setLocation(undefined);
        }).toThrow(new BadFormat());
    });

    test('set a directory undefined files', () => {

        // Given

        let directoryAsObjectGiven = new Directory("https://www.github.com/user/project/blob/master/app/", [], []);

        // When Then

        expect(() => {
            directoryAsObjectGiven.setFiles(undefined);
        }).toThrow(new BadFormat());
    });

    test('set a directory null files', () => {

        // Given

        let directoryAsObjectGiven = new Directory("https://www.github.com/user/project/blob/master/app/", [], []);

        // When Then

        expect(() => {
            directoryAsObjectGiven.setFiles(null);
        }).toThrow(new BadFormat());
    });
});