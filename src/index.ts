import axios from 'axios';
import cheerio from 'cheerio';

const url = {
    base: 'https://optifine.net',
    download: '/downloads',
    mirror: '/adloadx?f=',
};
url.download = url.base + url.download;
url.mirror = url.base + url.mirror;

const AxiosInstance = axios.create(); // Create a new Axios Instance

type Version = {
    optifineVersion: string;
    fileName: string;
    forgeVersion: string;
    minecraftVersion: string;
    published: Date;
    changelogURL: string;
    getDownloadURL: () => Promise<string>;
};

type GetVersionsFiler = {
    optifineVersion?: string;
    fileName?: string;
    forgeVersion?: string;
    minecraftVersion?: string;
    published?: Date;
    changelogURL?: string;
};

/**
 * Get the download URL of a version
 * @param fileName The name of the file
 * @returns Promise<string> The download URL
 */
export const getDownloadURL = async (fileName: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await AxiosInstance.get(url.mirror + fileName); // Get the HTML from the URL
            const $ = cheerio.load(data); // Load the HTML into Cheerio
            const downloadLink = $('#Download > a').attr('href'); // Get the download link from the HTML
            resolve(url.base + '/' + downloadLink); // Resolve the Promise with the download link
        } catch (error) {
            reject(error); // Reject the Promise with the error
        }
    });
};

const gdu = getDownloadURL;

/**
 * Get all avaliable versions on the Optifine downloads site
 * @param filter Filter the versions
 * @returns Promise<Version[]> The versions
 */
export const getVersions = async (
    filter?: GetVersionsFiler
): Promise<Version[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await AxiosInstance.get(url.download); // Get the HTML from the URL
            const $ = cheerio.load(data); // Load the HTML into Cheerio
            const tables = $('.downloadLine'); // Get the download link from the HTML
            // resolve(url.base + '/' + downloadLink); // Resolve the Promise with the download link

            const versions: Version[] = [];

            tables.each((i, table) => {
                const optifineVersion = $(table).find('.colFile').text();
                const mirrorUrl = $(table)
                    .find('.colMirror')
                    .find('a')
                    .attr('href');

                const fileName = mirrorUrl?.split('f=')[1];
                const forgeVersion = $(table).find('.colForge').text();
                const minecraftVersion = fileName
                    .split('OptiFine_')[1]
                    .split('_')[0];

                const dateString = $(table).find('.colDate').text();
                const day = dateString.split('.')[0];
                const month = dateString.split('.')[1];
                const year = dateString.split('.')[2];
                const published: Date = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day)
                );

                const getDownloadURL = async () => {
                    return await gdu(fileName);
                };

                const changelogURL = `${url.base}/${$(table)
                    .find('.colChangelog')
                    .find('a')
                    .attr('href')}`;

                const version: Version = {
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
        } catch (error) {
            reject(error); // Reject the Promise with the error
        }
    });
};

/**
 * Check if a version matches against a filter
 * @param version The version to check against the filter
 * @param filter The filter to check against the version
 * @returns boolean If the version matches against the filter
 */
const _checkFilter = (version: Version, filter?: GetVersionsFiler) => {
    if (!filter) return true;

    if (filter.optifineVersion) {
        if (version.optifineVersion !== filter.optifineVersion) return false;
    }

    if (filter.fileName) {
        if (version.fileName !== filter.fileName) return false;
    }

    if (filter.forgeVersion) {
        if (version.forgeVersion !== filter.forgeVersion) return false;
    }

    if (filter.minecraftVersion) {
        if (version.minecraftVersion !== filter.minecraftVersion) return false;
    }

    if (filter.published) {
        if (version.published !== filter.published) return false;
    }

    if (filter.changelogURL) {
        if (version.changelogURL !== filter.changelogURL) return false;
    }

    return true;
};

// async function main() {
//     const latestVersion = await (
//         await getVersions({ minecraftVersion: '1.19.2' })
//     )[0].getDownloadURL();
//     console.log(latestVersion);
// }

// main();
