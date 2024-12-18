// Model
const Repository = require("../../model/Repository.model");
const Directory = require("../../model/Directory.model");
const File = require("../../model/File.model");
const CodeFragment = require("../../model/CodeFragment.model");
const Technology = require("../../model/Technology.model");
const Operation = require("../../model/Operation.model");
const Method = require("../../model/Method.model");
const Sample = require("../../model/Sample.model");
const Concept = require("../../model/Concept.model");
// Error
const BadFormat = require('../../error/BadFormat.error.js');

// Happy path test suite

describe('Repository', () => {

    test('does to string', () => {

        // Given

        let repositoryAsObjectGiven = new Repository("https://www.github.com/user/project/blob/master/", [
            new Directory("https://www.github.com/user/project/blob/master/app/", [new Directory("https://www.github.com/user/project/blob/master/app/js/", [], [])], [
                new File("https://www.github.com/user/project/blob/master/app/app.js", 10, [
                    new CodeFragment("https://www.github.com/user/project/blob/master/app/app.js#L0C0L1C1", new Technology("javascript-api-express-call"), new Operation("READ"), new Method("find"), new Sample("{user_id: userId}"), [new Concept("user")], "E1E2E3E4E5E6E7E8", "8")
                ])
            ])
        ]);

        // When

        let repositoryAsStringGiven = repositoryAsObjectGiven.toString();

        // Then

        expect(repositoryAsStringGiven).toStrictEqual('{"location":"https://www.github.com/user/project/blob/master/","directories":[{"location":"https://www.github.com/user/project/blob/master/app/","directories":[{"location":"https://www.github.com/user/project/blob/master/app/js/","directories":[],"files":[]}],"files":[{"location":"https://www.github.com/user/project/blob/master/app/app.js","linesOfCode":10,"codeFragments":[{"location":"https://www.github.com/user/project/blob/master/app/app.js#L0C0L1C1","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"{user_id: userId}"},"concepts":[{"name":"user"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"}]}]}]}');
    });

    test('revives as object', () => {

        // Given

        let repositoryAsStringGiven = '{"location":"https://www.github.com/user/project/blob/master/","directories":[{"location":"https://www.github.com/user/project/blob/master/app/","directories":[{"location":"https://www.github.com/user/project/blob/master/app/js/","directories":[],"files":[]}],"files":[{"location":"https://www.github.com/user/project/blob/master/app/app.js","linesOfCode":10,"codeFragments":[{"location":"https://www.github.com/user/project/blob/master/app/app.js#L0C0L1C1","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"{user_id: userId}"},"concepts":[{"name":"user"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"}]}]}]}';
        let repositoryAsObjectGiven = JSON.parse(repositoryAsStringGiven);

        // When

        let repositoryAsModelGiven = Repository.revive(repositoryAsObjectGiven);

        // Then

        let staticAnalysisCodeQLRequestAsModelExpected = new Repository("https://www.github.com/user/project/blob/master/", [
            new Directory("https://www.github.com/user/project/blob/master/app/", [new Directory("https://www.github.com/user/project/blob/master/app/js/", [], [])], [
                new File("https://www.github.com/user/project/blob/master/app/app.js", 10, [
                    new CodeFragment("https://www.github.com/user/project/blob/master/app/app.js#L0C0L1C1", new Technology("javascript-api-express-call"), new Operation("READ"), new Method("find"), new Sample("{user_id: userId}"), [new Concept("user")], "E1E2E3E4E5E6E7E8", "8")
                ])
            ])
        ]);
        expect(repositoryAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected);
    });

    test('sets the repository', () => {

        // Given
        let repositoryGiven = new Repository("https://www.github.com/user/project/blob/master/", []);

        // When

        repositoryGiven.setLocation("https://www.github.com/user/project/blob/main/");
        repositoryGiven.setDirectories([]);

        // Then

        expect(repositoryGiven.getLocation()).toStrictEqual("https://www.github.com/user/project/blob/main/");
        expect(repositoryGiven.getDirectories()).toStrictEqual([]);
    });
});


// Failure cases test suite

describe('Repository tries to', () => {


    test('revive an incorrect formatted object', () => {

        // Given

        let repositoryAsStringGiven = '{\'location\':\'https://www.github.com/user/project/blob/master/\'}';

        // When Then

        expect(() => {
            Repository.revive(repositoryAsStringGiven);
        }).toThrow(new BadFormat());
    });

    test('revive an incomplete object', () => {

        // Given

        let repositoryAsStringGiven = '{"location":"https://www.github.com/user/project/blob/master/"}';

        // When Then

        expect(() => {
            Repository.revive(repositoryAsStringGiven);
        }).toThrow(new BadFormat());
    });

    test('revive an undefined object', () => {

        // Given

        let repositoryGiven = undefined;

        // When Then

        expect(() => {
            Repository.revive(repositoryGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a null object', () => {

        // Given

        let repositoryGiven = null;

        // When Then

        expect(() => {
            Repository.revive(repositoryGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a repository with null location', () => {

        // Given

        let repositoryAsStringGiven = '{"location":null}';
        let repositoryAsObjectGiven = JSON.parse(repositoryAsStringGiven);

        // When Then

        expect(() => {
            Repository.revive(repositoryAsObjectGiven);
        }).toThrow(new BadFormat());
    });

    test('revive a repository with empty location', () => {

        // Given

        let repositoryAsStringGiven = '{"location":""}';
        let repositoryAsObjectGiven = JSON.parse(repositoryAsStringGiven);

        // When Then

        expect(() => {
            Repository.revive(repositoryAsObjectGiven);
        }).toThrow(new BadFormat());
    });

    test('create a repository with undefined location', () => {

        // Given When Then

        expect(() => {
            new Repository(undefined, []);
        }).toThrow(new BadFormat());
    });

    test('create a repository with null location', () => {

        // Given When Then

        expect(() => {
            new Repository(null, []);
        }).toThrow(new BadFormat());
    });

    test('create a repository with empty location', () => {

        // Given When Then

        expect(() => {
            new Repository("", []);
        }).toThrow(new BadFormat());
    });

    test('create a repository with undefined directories', () => {

        // Given When Then

        expect(() => {
            new Repository("https://www.github.com/user/project/blob/master/", undefined);
        }).toThrow(new BadFormat());
    });

    test('create a repository with null directories', () => {

        // Given When Then

        expect(() => {
            new Repository("https://www.github.com/user/project/blob/master/", null);
        }).toThrow(new BadFormat());
    });

    test('set a repository undefined location', () => {

        // Given

        let repositoryAsObjectGiven = new Repository("https://www.github.com/user/project/blob/master/", []);

        // When Then

        expect(() => {
            repositoryAsObjectGiven.setLocation(undefined);
        }).toThrow(new BadFormat());
    });

    test('set a repository null id', () => {

        // Given

        let repositoryAsObjectGiven = new Repository("https://www.github.com/user/project/blob/master/", []);

        // When Then

        expect(() => {
            repositoryAsObjectGiven.setLocation(null);
        }).toThrow(new BadFormat());
    });

    test('set a repository empty location', () => {

        // Given

        let repositoryAsObjectGiven = new Repository("https://www.github.com/user/project/blob/master/", []);

        // When Then

        expect(() => {
            repositoryAsObjectGiven.setLocation(undefined);
        }).toThrow(new BadFormat());
    });

    test('set a repository undefined directories', () => {

        // Given

        let repositoryAsObjectGiven = new Repository("https://www.github.com/user/project/blob/master/", []);

        // When Then

        expect(() => {
            repositoryAsObjectGiven.setDirectories(undefined);
        }).toThrow(new BadFormat());
    });

    test('set a repository null directories', () => {

        // Given

        let repositoryAsObjectGiven = new Repository("https://www.github.com/user/project/blob/master/", []);

        // When Then

        expect(() => {
            repositoryAsObjectGiven.setDirectories(null);
        }).toThrow(new BadFormat());
    });
});