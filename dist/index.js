"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadVersion = exports.getVersions = exports.getDownloadURL = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = __importDefault(require("fs"));
const url = {
    base: 'https://optifine.net',
    download: '/downloads',
    mirror: '/adloadx?f=',
};
url.download = url.base + url.download;
url.mirror = url.base + url.mirror;
const AxiosInstance = axios_1.default.create(); // Create a new Axios Instance
/**
 * Get the download URL of a version
 * @param fileName The name of the file
 * @returns Promise<string> The download URL
 */
const getDownloadURL = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data } = yield AxiosInstance.get(url.mirror + fileName);
            const $ = cheerio_1.default.load(data); // Load the HTML into Cheerio
            const downloadLink = $('#Download > a').attr('href'); // Get the download link from the HTML
            resolve(url.base + '/' + downloadLink); // Resolve the Promise with the download link
        }
        catch (error) {
            reject(error); // Reject the Promise with the error
        }
    }));
});
exports.getDownloadURL = getDownloadURL;
const gdu = exports.getDownloadURL;
/**
 * Get all avaliable versions on the Optifine downloads site
 * @param filter Filter the versions
 * @returns Promise<Version[]> The versions
 */
const getVersions = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data } = yield AxiosInstance.get(url.download); // Get the HTML from the URL
            const $ = cheerio_1.default.load(data); // Load the HTML into Cheerio
            const tables = $('.downloadLine');
            const versions = [];
            tables.each((i, table) => {
                const optifineVersion = $(table).find('.colFile').text();
                const mirrorUrl = $(table)
                    .find('.colMirror')
                    .find('a')
                    .attr('href');
                const fileName = mirrorUrl === null || mirrorUrl === void 0 ? void 0 : mirrorUrl.split('f=')[1];
                const forgeVersion = $(table).find('.colForge').text();
                const minecraftVersion = fileName
                    .split('OptiFine_')[1]
                    .split('_')[0];
                const dateString = $(table).find('.colDate').text();
                const day = dateString.split('.')[0];
                const month = dateString.split('.')[1];
                const year = dateString.split('.')[2];
                const published = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const getDownloadURL = () => __awaiter(void 0, void 0, void 0, function* () {
                    return yield gdu(fileName);
                });
                const changelogURL = `${url.base}/${$(table)
                    .find('.colChangelog')
                    .find('a')
                    .attr('href')}`;
                const version = {
                    optifineVersion,
                    fileName,
                    forgeVersion,
                    minecraftVersion,
                    published,
                    changelogURL,
                    getDownloadURL,
                };
                if (_checkFilter(version, filter)) {
                    versions.push(version);
                }
            });
            resolve(versions);
        }
        catch (error) {
            reject(error); // Reject the Promise with the error
        }
    }));
});
exports.getVersions = getVersions;
/**
 * Download a version
 * @param version The version to download
 * @param path The path to download the version to
 */
const downloadVersion = (version, path) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const downloadURL = yield version.getDownloadURL();
            const writer = fs_1.default.createWriteStream(path);
            const response = yield AxiosInstance({
                url: downloadURL,
                method: 'GET',
                responseType: 'stream',
            });
            response.data.pipe(writer);
            writer.on('finish', () => {
                resolve();
            });
            writer.on('error', (error) => {
                reject(error);
            });
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.downloadVersion = downloadVersion;
/**
 * Check if a version matches against a filter
 * @param version The version to check against the filter
 * @param filter The filter to check against the version
 * @returns boolean If the version matches against the filter
 */
const _checkFilter = (version, filter) => {
    if (!filter)
        return true;
    for (let check of Object.keys(filter)) {
        if (filter[check] !== version[check]) {
            return false;
        }
    }
    return true;
};
// async function main() {
//     const latestVersion = await (
//         await getVersions({ minecraftVersion: '1.19.2' })
//     )[0];
//     console.log(latestVersion);
//     // await downloadVersion(latestVersion, 'test.jar');
// }
// main();
//# sourceMappingURL=index.js.map