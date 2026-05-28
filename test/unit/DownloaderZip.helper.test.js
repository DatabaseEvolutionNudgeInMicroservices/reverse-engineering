// Helpers

const DownloaderZip = require('../../helper/DownloaderZip.helper.js')

// Libraries

const fs = require('fs')
const path = require('path')

// Constants

const { TEMP_FOLDER_NAME } = require('../../helper/Constant.helper')

// Errors

const DownloadFail = require('../../error/DownloadFail.error.js')
const BadFormat = require('../../error/BadFormat.error.js')
const { INPUT_INCORRECTLY_FORMATTED } = require('../../error/Constant.error.js')

// Setup

const tempPath = path.join(process.cwd(), TEMP_FOLDER_NAME)

// Happy path test suite

describe('Zip downloader', () => {
  it('downloads a zip file', async () => {
    // Given

    let downloaderZip = new DownloaderZip()

    // When Then

    await downloaderZip
      .downloadByElement(
        path.join(process.cwd(), 'test', 'unit', 'asset', 'example.zip'),
        'DownloaderZip_Directory1'
      )
      .then((result) => {
        const repositoryDownloaded = fs.existsSync(
          path.join(tempPath, 'DownloaderZip_Directory1', 'example')
        )
        const returnedDownloadedRepositoryEqualsToGivenRepository =
          JSON.stringify(result) === JSON.stringify(['example'])
        expect(repositoryDownloaded && returnedDownloadedRepositoryEqualsToGivenRepository).toBe(
          true
        )

        // Free

        fs.rmSync(path.join(tempPath, 'DownloaderZip_Directory1'), {
          recursive: true,
          force: true
        })
      })
  })
})

// Failure cases test suite

describe('Zip downloader tries to', () => {
  it('download a not found zip file path', async () => {
    // Given

    let downloaderZip = new DownloaderZip()

    // When Then

    await expect(downloaderZip.downloadByElement('/unknown')).rejects.toThrow(DownloadFail)
  })

  it('download an undefined zip file path', async () => {
    // Given

    let downloaderZip = new DownloaderZip()

    // When Then

    await expect(downloaderZip.downloadByElement(undefined)).rejects.toThrow(BadFormat)
  })

  it('download a null zip file path', async () => {
    // Given

    let downloaderZip = new DownloaderZip()

    // When Then

    await expect(downloaderZip.downloadByElement(null)).rejects.toThrow(BadFormat)
  })

  it('download an empty zip file path', async () => {
    // Given

    let downloaderZip = new DownloaderZip()

    // When Then

    await expect(downloaderZip.downloadByElement(undefined)).rejects.toThrow(BadFormat)
  })

  it('downloads an empty zip file', async () => {
    // Given

    let downloaderZip = new DownloaderZip()

    // When Then

    await expect(
      downloaderZip.downloadByElement(
        path.join(process.cwd(), 'test', 'unit', 'asset', 'empty.zip'),
        'DownloaderZip_Directory2'
      )
    ).rejects.toThrow(DownloadFail)
  })
})
