// Model
const Operation = require('../../model/Operation.model')
// Error
const BadFormat = require('../../error/BadFormat.error.js')
const BadOperation = require('../../error/BadOperation.error')

// Happy path test suite

describe('Operation', () => {
  test('does to string', () => {
    // Given

    let operationAsObjectGiven = new Operation('READ')

    // When

    let operationAsStringGiven = operationAsObjectGiven.toString()

    // Then

    expect(operationAsStringGiven).toStrictEqual('{"name":"READ"}')
  })

  test('revives as object', () => {
    // Given

    let operationAsStringGiven = '{"name":"READ"}'
    let operationAsObjectGiven = JSON.parse(operationAsStringGiven)

    // When

    let operationAsModelGiven = Operation.revive(operationAsObjectGiven)

    // Then

    let staticAnalysisCodeQLRequestAsModelExpected = new Operation('READ')
    expect(operationAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected)
  })

  test('checks the valid operation', () => {
    // Given

    let operations = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'OTHER']

    // When

    let operationsCheck = operations.every((operation) => Operation.check(operation))

    // Then

    expect(operationsCheck).toBe(true)
  })

  test('sets the operation', () => {
    // Given
    let operationGiven = new Operation('READ')

    // When

    operationGiven.setName('UPDATE')

    // Then

    expect(operationGiven.getName()).toStrictEqual('UPDATE')
  })
})

// Failure cases test suite

describe('Operation tries to', () => {
  test('revive an incorrect formatted object', () => {
    // Given

    let operationAsStringGiven = "{'name':'READ'}"

    // When Then

    expect(() => {
      Operation.revive(operationAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an incomplete formatted object', () => {
    // Given

    let operationAsStringGiven = '{"name":"}'

    // When Then

    expect(() => {
      Operation.revive(operationAsStringGiven)
    }).toThrow(new BadFormat())
  })

  test('revive an undefined object', () => {
    // Given

    let operationGiven = undefined

    // When Then

    expect(() => {
      Operation.revive(operationGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a null object', () => {
    // Given

    let operationGiven = null

    // When Then

    expect(() => {
      Operation.revive(operationGiven)
    }).toThrow(new BadFormat())
  })

  test('revive a bad operation object', () => {
    // Given

    let operationAsStringGiven = '{"name":"UNKNOWN"}'
    let operationAsObjectGiven = JSON.parse(operationAsStringGiven)

    // When Then

    expect(() => {
      Operation.revive(operationAsObjectGiven)
    }).toThrow(new BadOperation())
  })

  test('create an operation without operation name', () => {
    // Given When Then

    expect(() => {
      new Operation('')
    }).toThrow(new BadOperation())
  })

  test('create a bad operation', () => {
    // Given When Then

    expect(() => {
      new Operation('unknown')
    }).toThrow(new BadOperation())
  })

  test('set a bad operation', () => {
    // Given

    let operationAsObjectGiven = new Operation('READ')

    // When Then

    expect(() => {
      operationAsObjectGiven.setName('UNKNOWN')
    }).toThrow(new BadOperation())
  })
})
