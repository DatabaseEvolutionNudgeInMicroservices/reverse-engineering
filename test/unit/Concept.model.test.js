// Model

const Concept = require('../../model/Concept.model')

// Error

const BadFormat = require('../../error/BadFormat.error.js')

// Happy path test suite

describe('Concept', () => {
  test('does to string', () => {
    // Given

    let conceptAsObjectGiven = new Concept('user')

    // When

    let conceptAsStringGiven = conceptAsObjectGiven.toString()

    // Then

    expect(conceptAsStringGiven).toStrictEqual('{"name":"user"}')
  })

  test('revives as object', () => {
    // Given

    let conceptAsStringGiven = '{"name":"user"}'
    let conceptAsObjectGiven = JSON.parse(conceptAsStringGiven)

    // When

    let conceptAsModelGiven = Concept.revive(conceptAsObjectGiven)

    // Then

    let staticAnalysisCodeQLRequestAsModelExpected = new Concept('user')
    expect(conceptAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected)
  })

  test('sets the concept', () => {
    // Given
    let conceptGiven = new Concept('users')

    // When

    conceptGiven.setName('user')

    // Then

    expect(conceptGiven.getName()).toStrictEqual('user')
  })
})

// Failure cases test suite

describe('Concept tries to', () => {
  test('revive an incorrect formatted object', () => {
    // Given

    let conceptAsStringGiven = "{'name':'user'}"

    // When Then

    expect(() => {
      Concept.revive(conceptAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an incomplete formatted object', () => {
    // Given

    let conceptAsStringGiven = '{"name":"}'

    // When Then

    expect(() => {
      Concept.revive(conceptAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an undefined object', () => {
    // Given

    let conceptGiven = undefined

    // When Then

    expect(() => {
      Concept.revive(conceptGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a null object', () => {
    // Given

    let conceptGiven = null

    // When Then

    expect(() => {
      Concept.revive(conceptGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a concept with null name', () => {
    // Given

    let conceptAsStringGiven = '{"name":null}'
    let conceptAsObjectGiven = JSON.parse(conceptAsStringGiven)

    // When Then

    expect(() => {
      Concept.revive(conceptAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a concept with empty name', () => {
    // Given

    let conceptAsStringGiven = '{"name":""}'
    let conceptAsObjectGiven = JSON.parse(conceptAsStringGiven)

    // When Then

    expect(() => {
      Concept.revive(conceptAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('create a concept with undefined name', () => {
    // Given When Then

    expect(() => {
      new Concept(undefined)
    }).toThrow(new BadFormat())
  })

  test('create a concept with null name', () => {
    // Given When Then

    expect(() => {
      new Concept(null)
    }).toThrow(new BadFormat())
  })

  test('create a concept with empty name', () => {
    // Given When Then

    expect(() => {
      new Concept('')
    }).toThrow(new BadFormat())
  })

  test('set a concept undefined name', () => {
    // Given

    let conceptAsObjectGiven = new Concept('user')

    // When Then

    expect(() => {
      conceptAsObjectGiven.setName(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a concept null name', () => {
    // Given

    let conceptAsObjectGiven = new Concept('user')

    // When Then

    expect(() => {
      conceptAsObjectGiven.setName(null)
    }).toThrow(new BadFormat())
  })

  test('set a concept empty name', () => {
    // Given

    let conceptAsObjectGiven = new Concept('user')

    // When Then

    expect(() => {
      conceptAsObjectGiven.setName(undefined)
    }).toThrow(new BadFormat())
  })
})
