import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

const url = {
    base: 'https://optifine.net',
    download: '/downloads',
    mirror: '/adloadx?f=',
};
url.download = url.base + url.download;
url.mirror = url.base + url.mirror;

const AxiosInstance = axios.create(); // Create a new Axios Instance

export type Version = {
    optifineVersion: string;
    fileName: string;
    forgeVersion: string;
    minecraftVersion: string;
    published: Date;
    changelogURL: string;
    download: (path?: string) => Promise<void>;
    getDownloadURL: () => Promise<string>;
    install: () => Promise<boolean>;
    runInstaller: () => Promise<boolean>;
};

export type GetVersionsFiler = {
    optifineVersion?: string;
    fileName?: string;
    forgeVersion?: string;
    minecraftVersion?: string;
    published?: Date;
    changelogURL?: string;
};

function os_func() {
    const exec = require('child_process').exec;
    this.execCommand = function (cmd) {
        return new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout);
            });
        });
    };
}
var os = new os_func();

/**
 * Get the download URL of a version
 * @param fileName The name of the file
 * @returns Promise<string> The download URL
 */
export const getDownloadURL = async (fileName: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await AxiosInstance.get(url.mirror + fileName);
            const $ = cheerio.load(data); // Load the HTML into Cheerio
            const downloadLink = $('#Download > a').attr('href'); // Get the download link from the HTML
            resolve(url.base + '/' + downloadLink); // Resolve the Promise with the download link
        } catch (error) {
            reject(error); // Reject the Promise with the error
        }
    });
};

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
            const tables = $('.downloadLine');

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
                    getDownloadURL: async () => {
                        return url.base;
                    },
                    download: async (path?: string) => {
                        return;
                    },
                    install: async () => {
                        return false;
                    },
                    runInstaller: async () => {
                        return false;
                    },
                };

                version.getDownloadURL = async (): Promise<string> => {
                    return getDownloadURL(fileName);
                };

                version.download = async (path?: string): Promise<void> => {
                    return downloadVersion(version, path);
                };

                version.install = async (): Promise<boolean> => {
                    return installVersion(version);
                };

                version.runInstaller = async (): Promise<boolean> => {
                    return runInstaller(version);
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
 * Download a version
 * @param version The version to download
 * @param path The path to download the version to
 */
export const downloadVersion = async (
    version: Version,
    path?: string
): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            const downloadURL = await getDownloadURL(version.fileName);

            if (!path) {
                path = './';
            }

            if (path.endsWith('/')) {
                path = path + version.fileName;
            }

            const writer = fs.createWriteStream(path);

            const response = await AxiosInstance({
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
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Download and run the Optifine Installer
 * @param version The version to install
 * @returns Promise<boolean> If the installation was successful
 */
export const runInstaller = async (version: Version): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        let filename = `./${Math.floor(Math.random() * 8999) + 1000}_${
            version.minecraftVersion
        }.jar`;
        await downloadVersion(version, filename).then(async () => {
            await os
                .execCommand(
                    `java -cp ${filename} optifine.InstallerFrame`,
                    async (res) => {}
                )
                .catch((err) => {
                    reject(err);
                });

            fs.unlinkSync(filename);
            resolve(true);
        });
    });
};

/**
 * Install Optifine (with default settings) without opening the installer
 * @param version The version to install
 * @returns Promise<boolean> If the installation was successful
 */
export const installVersion = async (version: Version): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        let filename = `./${Math.floor(Math.random() * 9999)}_${
            version.minecraftVersion
        }.jar`;
        await downloadVersion(version, filename).then(async () => {
            await os
                .execCommand(
                    `java -cp ${filename} optifine.Installer`,
                    async (res) => {}
                )
                .catch((err) => {
                    reject(err);
                });

            fs.unlinkSync(filename);
            resolve(true);
        });
    });
};

/**
 * Check if a version matches against a filter
 * @param version The version to check against the filter
 * @param filter The filter to check against the version
 * @returns boolean If the version matches against the filter
 */
const _checkFilter = (version: Version, filter?: GetVersionsFiler): boolean => {
    if (!filter) return true;

    for (let check of Object.keys(filter)) {
        if (filter[check] !== version[check]) {
            return false;
        }
    }

    return true;
};

// async function main() {
//     const latestVersion = (
//         await getVersions({ minecraftVersion: '1.19.2' })
//     )[0];

//     console.log(latestVersion);

//     await latestVersion.runInstaller();
// }

// main();
