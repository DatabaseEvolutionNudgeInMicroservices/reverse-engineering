// Helpers

const DownloaderZip = require('../../helper/DownloaderZip.helper.js');

// Libraries

const fs = require('fs');

// Constants

const {FILE_SYSTEM_SEPARATOR} = require('../../helper/Constant.helper');

// Errors

const DownloadFail = require('../../error/DownloadFail.error.js');
const BadFormat = require('../../error/BadFormat.error.js');

// Setup

const zipFileList = ['example'];
const downloadedRepositoryList = ['example'];

// Happy path test suite

describe('Zip downloader', () => {

    afterEach(async () => {
        // Cleaning.
        for (let i = 0; i < downloadedRepositoryList.length; i++) {
            if (fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR +
                downloadedRepositoryList[i])) {
                await fs.rmdirSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR +
                    downloadedRepositoryList[i], {recursive: true});
            }
        }
    });

    it('downloads a zip file', async () => {

        // Given

        let downloaderZip = new DownloaderZip();

        // When Then

        await downloaderZip.downloadByElement(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + zipFileList[0] + '.zip').then((result) => {
            const repositoryDownloaded = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + 'TEMP' + FILE_SYSTEM_SEPARATOR + downloadedRepositoryList[0]);
            const returnedDownloadedRepositoryEqualsToGivenRepository = JSON.stringify(result) === JSON.stringify(downloadedRepositoryList);
            expect(repositoryDownloaded && returnedDownloadedRepositoryEqualsToGivenRepository).toBe(true);
        });
    });
});

// Failure cases test suite

describe('Zip downloader tries to', () => {

    it('download a not found zip file path', async () => {

        // Given

        let downloaderZip = new DownloaderZip();

        // When Then

        await expect(downloaderZip.downloadByElement('/unknown')).rejects.toThrow(DownloadFail);
    });

    it('download an undefined zip file path', async () => {

        // Given

        let downloaderZip = new DownloaderZip();

        // When Then

        await expect(downloaderZip.downloadByElement(undefined)).rejects.toThrow(BadFormat);
    });

    it('download a null zip file path', async () => {

        // Given

        let downloaderZip = new DownloaderZip();

        // When Then

        await expect(downloaderZip.downloadByElement(null)).rejects.toThrow(BadFormat);
    });

    it('download an empty zip file path', async () => {

        // Given

        let downloaderZip = new DownloaderZip();

        // When Then

        await expect(downloaderZip.downloadByElement(undefined)).rejects.toThrow(BadFormat);
    });

    it('downloads an empty zip file', async () => {

        // Given

        let downloaderZip = new DownloaderZip();

        // When Then

        await downloaderZip.downloadByElement(process.cwd() + FILE_SYSTEM_SEPARATOR + 'test' + FILE_SYSTEM_SEPARATOR + 'unit' + FILE_SYSTEM_SEPARATOR + 'asset' + FILE_SYSTEM_SEPARATOR + 'empty.zip').then((result) => {
            const returnedDownloadedRepositoryEqualsToGivenRepository = JSON.stringify(result) === JSON.stringify([]);
            expect(returnedDownloadedRepositoryEqualsToGivenRepository).toBe(true);
        });
    });
});