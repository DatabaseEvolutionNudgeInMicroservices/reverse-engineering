// Helpers

const CleanerFile = require('../../helper/CleanerFile.helper.js')

// Libraries

const fs = require('fs')

// Constants

const { FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME } = require('../../helper/Constant.helper')

// Errors

const CleaningFail = require('../../error/CleaningFail.error.js')
const BadFormat = require('../../error/BadFormat.error.js')

// Setup

const tempPath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}`

// Happy path test suite

describe('File cleaner', () => {
  it('cleans a file', async () => {
    // Given

    let cleanerFile = new CleanerFile()
    fs.writeFileSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_File1.txt`, 'Test')

    // When Then

    await cleanerFile.cleanByElement('CleanerFile_File1.txt').then((result) => {
      const fileDeleted = fs.existsSync(
        `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}CleanerFile_File1.txt`
      )
      expect(fileDeleted).toBe(false)
    })
  })

  it('cleans a directory', async () => {
    // Given

    let cleanerFile = new CleanerFile()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory1`)

    // When Then

    await cleanerFile.cleanByElement('CleanerFile_Directory1').then((result) => {
      const directoryDeleted = fs.existsSync(
        `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}directory1`
      )
      expect(directoryDeleted).toBe(false)
    })
  })

  it('cleans a file list', async () => {
    // Given

    let cleanerFile = new CleanerFile()
    fs.writeFileSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_File2.txt`, 'Test')
    fs.writeFileSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_File3.txt`, 'Test')

    // When Then

    await cleanerFile
      .cleanByList(['CleanerFile_File2.txt', 'CleanerFile_File3.txt'])
      .then((result) => {
        const fileDeleted2 = fs.existsSync(
          `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}CleanerFile_File2.txt`
        )
        const fileDeleted3 = fs.existsSync(
          `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}CleanerFile_File3.txt`
        )
        expect(fileDeleted2 || fileDeleted3).toBe(false)
      })
  })

  it('cleans a directory list', async () => {
    // Given

    let cleanerFile = new CleanerFile()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory2`)
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory3`)

    // When Then

    await cleanerFile
      .cleanByList(['CleanerFile_Directory2', 'CleanerFile_Directory3'])
      .then((result) => {
        const directoryDeleted2 = fs.existsSync(
          `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory2`
        )
        const directoryDeleted3 = fs.existsSync(
          `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory3`
        )
        expect(directoryDeleted2 || directoryDeleted3).toBe(false)
      })
  })

  it('cleans a directory list with files inside', async () => {
    // Given

    let cleanerFile = new CleanerFile()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory4`)
    fs.writeFileSync(
      `${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory4${FILE_SYSTEM_SEPARATOR}CleanerFile_File4.txt`,
      'Test'
    )
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory5`)
    fs.writeFileSync(
      `${tempPath}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory5${FILE_SYSTEM_SEPARATOR}CleanerFile_File5.txt`,
      'Test'
    )

    // When Then

    await cleanerFile
      .cleanByList(['CleanerFile_Directory4', 'CleanerFile_Directory5'])
      .then((result) => {
        const directoryDeleted4 = fs.existsSync(
          `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory4`
        )
        const directoryDeleted5 = fs.existsSync(
          `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}CleanerFile_Directory5`
        )
        expect(directoryDeleted4 || directoryDeleted5).toBe(false)
      })
  })
})

// Failure cases test suite

describe('File cleaner tries to', () => {
  it('clean a not found file or directory', () => {
    // Given

    let cleanerFile = new CleanerFile()

    // When Then

    expect(cleanerFile.cleanByElement('unknown')).rejects.toThrow(CleaningFail)
  })

  it('clean a list with not found files or directories', () => {
    // Given

    let cleanerFile = new CleanerFile()

    // When Then

    expect(cleanerFile.cleanByList(['unknown'])).rejects.toThrow(CleaningFail)
  })

  it('clean an undefined file or directory', () => {
    // Given

    let cleanerFile = new CleanerFile()

    // When Then

    expect(cleanerFile.cleanByElement(undefined)).rejects.toThrow(BadFormat)
  })

  it('clean an undefined file or directory list', () => {
    // Given

    let cleanerFile = new CleanerFile()

    // When Then

    expect(cleanerFile.cleanByList(undefined)).rejects.toThrow(BadFormat)
  })

  it('clean a null file or directory', () => {
    // Given

    let cleanerFile = new CleanerFile()

    // When Then

    expect(cleanerFile.cleanByElement(null)).rejects.toThrow(BadFormat)
  })

  it('clean a null file or directory list', () => {
    // Given

    let cleanerFile = new CleanerFile()

    // When Then

    expect(cleanerFile.cleanByList(null)).rejects.toThrow(BadFormat)
  })

  it('clean a file or directory list with undefined directories', () => {
    // Given

    let cleanerFile = new CleanerFile()

    // When Then

    expect(cleanerFile.cleanByList([undefined])).rejects.toThrow(CleaningFail)
  })

  it('clean a file or directory list with null directories', () => {
    // Given

    let cleanerFile = new CleanerFile()

    // When Then

    expect(cleanerFile.cleanByList([null])).rejects.toThrow(CleaningFail)
  })

  it('clean an empty file or directory list', () => {
    // Given

    let cleanerFile = new CleanerFile()

    // When Then

    expect(cleanerFile.cleanByList([])).toBeInstanceOf(Promise)
  })
})
