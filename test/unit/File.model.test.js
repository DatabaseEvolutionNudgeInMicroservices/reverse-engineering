// Model
const File = require('../../model/File.model')
// Error
const BadFormat = require('../../error/BadFormat.error.js')

// Happy path test suite

describe('File', () => {
  test('does to string', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When

    let fileAsStringGiven = fileAsObjectGiven.toString()

    // Then

    expect(fileAsStringGiven).toStrictEqual(
      '{"location":"https://www.github.com/user/project/blob/master/js/app/app.js","linesOfCode":10,"codeFragments":[]}'
    )
  })

  test('revives as object', () => {
    // Given

    let fileAsStringGiven =
      '{"location":"https://www.github.com/user/project/blob/master/js/app/app.js","linesOfCode":10,"codeFragments":[]}'
    let fileAsObjectGiven = JSON.parse(fileAsStringGiven)

    // When

    let fileAsModelGiven = File.revive(fileAsObjectGiven)

    // Then

    let staticAnalysisCodeQLRequestAsModelExpected = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )
    expect(fileAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected)
  })

  test('sets the file', () => {
    // Given
    let fileGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When

    fileGiven.setLocation('https://www.github.com/user/project/blob/master/app.js', 100, [])

    // Then

    expect(fileGiven.getLocation()).toStrictEqual(
      'https://www.github.com/user/project/blob/master/app.js'
    )
  })
})

// Failure cases test suite

describe('File tries to', () => {
  test('revive an incorrectly formatted object', () => {
    // Given

    let fileAsStringGiven =
      "{'location':'https://www.github.com/user/project/blob/master/js/app/app.js'}"

    // When Then

    expect(() => {
      File.revive(fileAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an incomplete formatted object', () => {
    // Given

    let fileAsStringGiven =
      '{"location":"https://www.github.com/user/project/blob/master/js/app/app.js"}'

    // When Then

    expect(() => {
      File.revive(fileAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an undefined object', () => {
    // Given

    let fileGiven = undefined

    // When Then

    expect(() => {
      File.revive(fileGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a null object', () => {
    // Given

    let fileGiven = null

    // When Then

    expect(() => {
      File.revive(fileGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a file with null location', () => {
    // Given

    let fileAsStringGiven = '{"location":null,"linesOfCode":10,"codeFragments":[]}'
    let fileAsObjectGiven = JSON.parse(fileAsStringGiven)

    // When Then

    expect(() => {
      File.revive(fileAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a file with empty location', () => {
    // Given

    let fileAsStringGiven = '{"location":"","linesOfCode":"10","codeFragments":[]}'
    let fileAsObjectGiven = JSON.parse(fileAsStringGiven)

    // When Then

    expect(() => {
      File.revive(fileAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a file with empty null lines of code', () => {
    // Given

    let fileAsStringGiven =
      '{"location":"https://www.github.com/user/project/blob/master/js/app/app.js","linesOfCode":null,"codeFragments":[]}'
    let fileAsObjectGiven = JSON.parse(fileAsStringGiven)

    // When Then

    expect(() => {
      File.revive(fileAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a file with empty lines of code', () => {
    // Given

    let fileAsStringGiven =
      '{"location":"https://www.github.com/user/project/blob/master/js/app/app.js","linesOfCode":"","codeFragments":[]}'
    let fileAsObjectGiven = JSON.parse(fileAsStringGiven)

    // When Then

    expect(() => {
      File.revive(fileAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a file with negative lines of code', () => {
    // Given

    let fileAsStringGiven =
      '{"location":"https://www.github.com/user/project/blob/master/js/app/app.js","linesOfCode":-1,"codeFragments":[]}'
    let fileAsObjectGiven = JSON.parse(fileAsStringGiven)

    // When Then

    expect(() => {
      File.revive(fileAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a file with alphabetic lines of code', () => {
    // Given

    let fileAsStringGiven =
      '{"location":"https://www.github.com/user/project/blob/master/js/app/app.js","linesOfCode":"two","codeFragments":[]}'
    let fileAsObjectGiven = JSON.parse(fileAsStringGiven)

    // When Then

    expect(() => {
      File.revive(fileAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('create a file with undefined location', () => {
    // Given When Then

    expect(() => {
      new File(undefined, 10, [])
    }).toThrow(new BadFormat())
  })

  test('create a file with null location', () => {
    // Given When Then

    expect(() => {
      new File(null, 10, [])
    }).toThrow(new BadFormat())
  })

  test('create a file with empty location', () => {
    // Given When Then

    expect(() => {
      new File('', 10, [])
    }).toThrow(new BadFormat())
  })

  test('create a file with undefined lines of code', () => {
    // Given When Then

    expect(() => {
      new File('https://www.github.com/user/project/blob/master/js/app/app.js', undefined, [])
    }).toThrow(new BadFormat())
  })

  test('create a file with null lines of code', () => {
    // Given When Then

    expect(() => {
      new File('https://www.github.com/user/project/blob/master/js/app/app.js', null, [])
    }).toThrow(new BadFormat())
  })

  test('create a file with empty lines of code', () => {
    // Given When Then

    expect(() => {
      new File('https://www.github.com/user/project/blob/master/js/app/app.js', '', [])
    }).toThrow(new BadFormat())
  })

  test('create a file with alphabetic lines of code', () => {
    // Given When Then

    expect(() => {
      new File('https://www.github.com/user/project/blob/master/js/app/app.js', 'two', [])
    }).toThrow(new BadFormat())
  })

  test('create a file with negative lines of code', () => {
    // Given When Then

    expect(() => {
      new File('https://www.github.com/user/project/blob/master/js/app/app.js', -1, [])
    }).toThrow(new BadFormat())
  })

  test('create a file with undefined code fragments', () => {
    // Given When Then

    expect(() => {
      new File('https://www.github.com/user/project/blob/master/js/app/app.js', 10, undefined)
    }).toThrow(new BadFormat())
  })

  test('create a file with null code fragments', () => {
    // Given When Then

    expect(() => {
      new File('https://www.github.com/user/project/blob/master/js/app/app.js', 10, null)
    }).toThrow(new BadFormat())
  })

  test('set a file undefined location', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setLocation(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a file null location', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setLocation(null)
    }).toThrow(new BadFormat())
  })

  test('set a file empty location', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setLocation(undefined)
    }).toThrow(new BadFormat())
  })

  test('set an undefined lines of code', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setLinesOfCode(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a null lines of code', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setLinesOfCode(null)
    }).toThrow(new BadFormat())
  })

  test('set a empty lines of code', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setLinesOfCode('')
    }).toThrow(new BadFormat())
  })

  test('set an alphabetic lines of code', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setLinesOfCode('two')
    }).toThrow(new BadFormat())
  })

  test('set a negative lines of code', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setLinesOfCode(-1)
    }).toThrow(new BadFormat())
  })

  test('set undefined code fragments', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setCodeFragments(undefined)
    }).toThrow(new BadFormat())
  })

  test('set null code fragments', () => {
    // Given

    let fileAsObjectGiven = new File(
      'https://www.github.com/user/project/blob/master/js/app/app.js',
      10,
      []
    )

    // When Then

    expect(() => {
      fileAsObjectGiven.setCodeFragments(null)
    }).toThrow(new BadFormat())
  })
})
