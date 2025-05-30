// Model
const Sample = require('../../model/Sample.model')
// Error
const BadFormat = require('../../error/BadFormat.error.js')

// Happy path test suite

describe('Sample', () => {
  test('does to string', () => {
    // Given

    let sampleAsObjectGiven = new Sample('test')

    // When

    let sampleAsStringGiven = sampleAsObjectGiven.toString()

    // Then

    expect(sampleAsStringGiven).toStrictEqual('{"content":"test"}')
  })

  test('revives as object', () => {
    // Given

    let sampleAsStringGiven = '{"content":"test"}'
    let sampleAsObjectGiven = JSON.parse(sampleAsStringGiven)

    // When

    let sampleAsModelGiven = Sample.revive(sampleAsObjectGiven)

    // Then

    let staticAnalysisCodeQLRequestAsModelExpected = new Sample('test')
    expect(sampleAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected)
  })

  test('sets the sample', () => {
    // Given
    let sampleGiven = new Sample('test')

    // When

    sampleGiven.setContent('test2')

    // Then

    expect(sampleGiven.getContent()).toStrictEqual('test2')
  })
})

// Failure cases test suite

describe('Sample tries to', () => {
  test('revive an incorrect formatted object', () => {
    // Given

    let sampleAsStringGiven = "{'content':'test'}"

    // When Then

    expect(() => {
      Sample.revive(sampleAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an incomplete formatted object', () => {
    // Given

    let sampleAsStringGiven = '{"content":"}'

    // When Then

    expect(() => {
      Sample.revive(sampleAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an undefined object', () => {
    // Given

    let sampleGiven = undefined

    // When Then

    expect(() => {
      Sample.revive(sampleGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a null object', () => {
    // Given

    let sampleGiven = null

    // When Then

    expect(() => {
      Sample.revive(sampleGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a sample with null content', () => {
    // Given

    let sampleAsStringGiven = '{"content":null}'
    let sampleAsObjectGiven = JSON.parse(sampleAsStringGiven)

    // When Then

    expect(() => {
      Sample.revive(sampleAsObjectGiven)
    }).toThrow(new BadFormat())
  })

  test('create a sample with undefined content', () => {
    // Given When Then

    expect(() => {
      new Sample(undefined)
    }).toThrow(new BadFormat())
  })

  test('create a sample with null content', () => {
    // Given When Then

    expect(() => {
      new Sample(null)
    }).toThrow(new BadFormat())
  })

  test('set a sample undefined content', () => {
    // Given

    let sampleAsObjectGiven = new Sample('test')

    // When Then

    expect(() => {
      sampleAsObjectGiven.setContent(undefined)
    }).toThrow(new BadFormat())
  })

  test('set a sample null content', () => {
    // Given

    let sampleAsObjectGiven = new Sample('test')

    // When Then

    expect(() => {
      sampleAsObjectGiven.setContent(null)
    }).toThrow(new BadFormat())
  })
})
