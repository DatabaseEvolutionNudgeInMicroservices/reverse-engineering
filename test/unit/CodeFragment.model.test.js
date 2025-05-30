// Model
const CodeFragment = require('../../model/CodeFragment.model')
// Error
const BadFormat = require('../../error/BadFormat.error.js')
const Technology = require('../../model/Technology.model')
const Operation = require('../../model/Operation.model')
const Method = require('../../model/Method.model')
const Sample = require('../../model/Sample.model')
const Concept = require('../../model/Concept.model')

// Happy path test suite

describe('CodeFragment', () => {
  test('does to string', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When

    let codeFragmentAsStringGiven = codeFragmentAsObjectGiven.toString()

    // Then

    expect(codeFragmentAsStringGiven).toStrictEqual(
      '{"location":"https://www.github.com/user/project/blob/master/app.js#L0C0L1C1","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"{user_id: userId}"},"concepts":[{"name":"user"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"}'
    )
  })

  test('revives as object', () => {
    // Given

    let codeFragmentAsStringGiven =
      '{"location":"https://www.github.com/user/project/blob/master/app.js#L0C0L1C1","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"{user_id: userId}"},"concepts":[{"name":"user"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"}'
    let codeFragmentAsObjectGiven = JSON.parse(codeFragmentAsStringGiven)

    // When

    let codeFragmentAsModelGiven = CodeFragment.revive(codeFragmentAsObjectGiven)

    // Then

    let staticAnalysisCodeQLRequestAsModelExpected = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )
    expect(codeFragmentAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected)
  })

  test('sets the code fragment', () => {
    // Given
    let codeFragmentGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user'), new Concept('id')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When

    codeFragmentGiven.setLocation(
      'https://www.github.com/user/project/blob/master/js/app/app.js#L0C0L1C1'
    )
    codeFragmentGiven.setTechnology(new Technology('javascript-db-redis-call'))
    codeFragmentGiven.setOperation(new Operation('DELETE'))
    codeFragmentGiven.setMethod(new Method('delete'))
    codeFragmentGiven.setSample(new Sample('{"client_id":clientId}'))
    codeFragmentGiven.setConcepts([new Concept('user')])
    codeFragmentGiven.setHeuristics('E1')
    codeFragmentGiven.setScore('1')

    // Then

    expect(codeFragmentGiven.getLocation()).toStrictEqual(
      'https://www.github.com/user/project/blob/master/js/app/app.js#L0C0L1C1'
    )
    expect(codeFragmentGiven.getTechnology()).toStrictEqual(
      new Technology('javascript-db-redis-call')
    )
    expect(codeFragmentGiven.getOperation()).toStrictEqual(new Operation('DELETE'))
    expect(codeFragmentGiven.getMethod()).toStrictEqual(new Method('delete'))
    expect(codeFragmentGiven.getSample()).toStrictEqual(new Sample('{"client_id":clientId}'))
    expect(codeFragmentGiven.getConcepts()).toStrictEqual([new Concept('user')])
    expect(codeFragmentGiven.getHeuristics()).toStrictEqual('E1')
    expect(codeFragmentGiven.getScore()).toStrictEqual('1')
  })

  test('sets the code fragment without concepts', () => {
    // Given
    let codeFragmentGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user'), new Concept('id')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When

    codeFragmentGiven.setLocation(
      'https://www.github.com/user/project/blob/master/js/app/app.js#L0C0L1C1'
    )
    codeFragmentGiven.setTechnology(new Technology('javascript-db-redis-call'))
    codeFragmentGiven.setOperation(new Operation('DELETE'))
    codeFragmentGiven.setMethod(new Method('delete'))
    codeFragmentGiven.setSample(new Sample('{"client_id":clientId}'))
    codeFragmentGiven.setConcepts([])
    codeFragmentGiven.setHeuristics('E1')
    codeFragmentGiven.setScore('1')

    // Then

    expect(codeFragmentGiven.getLocation()).toStrictEqual(
      'https://www.github.com/user/project/blob/master/js/app/app.js#L0C0L1C1'
    )
    expect(codeFragmentGiven.getTechnology()).toStrictEqual(
      new Technology('javascript-db-redis-call')
    )
    expect(codeFragmentGiven.getOperation()).toStrictEqual(new Operation('DELETE'))
    expect(codeFragmentGiven.getMethod()).toStrictEqual(new Method('delete'))
    expect(codeFragmentGiven.getSample()).toStrictEqual(new Sample('{"client_id":clientId}'))
    expect(codeFragmentGiven.getConcepts()).toStrictEqual([])
    expect(codeFragmentGiven.getHeuristics()).toStrictEqual('E1')
    expect(codeFragmentGiven.getScore()).toStrictEqual('1')
  })
})

// Failure cases test suite

describe('CodeFragment tries to', () => {
  test('revive an incorrect formatted object', () => {
    // Given

    let codeFragmentAsStringGiven = "{'location':'https://'}"

    // When Then

    expect(() => {
      CodeFragment.revive(codeFragmentAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an incomplete formatted object', () => {
    // Given

    let codeFragmentAsStringGiven =
      '{"location":"https://www.github.com/user/project/blob/master/app.js#L0C0L1C1"}'

    // When Then

    expect(() => {
      CodeFragment.revive(codeFragmentAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an undefined object', () => {
    // Given

    let codeFragmentGiven = undefined

    // When Then

    expect(() => {
      CodeFragment.revive(codeFragmentGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a null object', () => {
    // Given

    let codeFragmentGiven = null

    // When Then

    expect(() => {
      CodeFragment.revive(codeFragmentGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a code fragment with null location', () => {
    // Given

    let codeFragmentAsStringGiven = '{"name":null}'
    let codeFragmentAsObjectGiven = JSON.parse(codeFragmentAsStringGiven)

    // When Then

    expect(() => {
      CodeFragment.revive(codeFragmentAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a code fragment with empty location', () => {
    // Given

    let codeFragmentAsStringGiven = '{"name":""}'
    let codeFragmentAsObjectGiven = JSON.parse(codeFragmentAsStringGiven)

    // When Then

    expect(() => {
      CodeFragment.revive(codeFragmentAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with undefined location', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        undefined,
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with null location', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        null,
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with empty location', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        '',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with undefined technology', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        undefined,
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id:' + ' userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with null technology', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        null,
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with a non-typed technology', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        'javascript-api-express-call',
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with undefined operation', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        undefined,
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with null operation', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        null,
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with a non-typed operation', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        'READ',
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with undefined method', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        undefined,
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with null method', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        null,
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with a non-typed method', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        'find',
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with undefined sample', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        undefined,
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with null sample', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        null,
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with a non-typed sample', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        '{user_id: userId}',
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with undefined concepts', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        undefined,
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with null concepts', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        null,
        'E1E2E3E4E5E6E7E8',
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with undefined heuristics', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        undefined,
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with null heuristics', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        undefined,
        '8'
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with undefined score', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        undefined
      )
    }).toThrow(new BadFormat())
  })

  test('create a code fragment with null score', () => {
    // Given When Then

    expect(() => {
      new CodeFragment(
        'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
        new Technology('javascript-api-express-call'),
        new Operation('READ'),
        new Method('find'),
        new Sample('{user_id: userId}'),
        [new Concept('user')],
        'E1E2E3E4E5E6E7E8',
        null
      )
    }).toThrow(new BadFormat())
  })

  test('set a code fragment undefined location', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setLocation(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment null location', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setLocation(null)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment empty location', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setLocation(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment undefined technology', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setTechnology(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment null technology', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setTechnology(null)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment a non-typed technology', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setTechnology('javascript-api-mongo')
    }).toThrow(new BadFormat())
  })

  test('set a code fragment undefined operation', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setOperation(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment null operation', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setOperation(null)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment a non-typed operation', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setOperation('UPDATE')
    }).toThrow(new BadFormat())
  })

  test('set a code fragment undefined method', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setMethod(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment null method', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setMethod(null)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment a non-typed method', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setMethod('findOne')
    }).toThrow(new BadFormat())
  })

  test('set a code fragment undefined sample', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setSample(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment null sample', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setSample(null)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment a non-typed sample', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setSample('{}')
    }).toThrow(new BadFormat())
  })

  test('set a code fragment undefined concepts', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setConcepts(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment null concepts', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setConcepts(null)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment undefined heuristics', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setHeuristics(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment null heuristics', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setHeuristics(null)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment undefined score', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setScore(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a code fragment null score', () => {
    // Given

    let codeFragmentAsObjectGiven = new CodeFragment(
      'https://www.github.com/user/project/blob/master/app.js#L0C0L1C1',
      new Technology('javascript-api-express-call'),
      new Operation('READ'),
      new Method('find'),
      new Sample('{user_id: userId}'),
      [new Concept('user')],
      'E1E2E3E4E5E6E7E8',
      '8'
    )

    // When Then

    expect(() => {
      codeFragmentAsObjectGiven.setScore(null)
    }).toThrow(new BadFormat())
  })
})
