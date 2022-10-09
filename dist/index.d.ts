declare type Version = {
    optifineVersion: string;
    fileName: string;
    forgeVersion: string;
    minecraftVersion: string;
    published: Date;
    changelogURL: string;
    download: (path?: string) => Promise<void>;
    getDownloadURL: () => Promise<string>;
};
declare type GetVersionsFiler = {
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
export declare const getDownloadURL: (fileName: string) => Promise<string>;
/**
 * Get all avaliable versions on the Optifine downloads site
 * @param filter Filter the versions
 * @returns Promise<Version[]> The versions
 */
export declare const getVersions: (filter?: GetVersionsFiler) => Promise<Version[]>;
/**
 * Download a version
 * @param version The version to download
 * @param path The path to download the version to
 */
export declare const downloadVersion: (version: Version, path?: string) => Promise<void>;
export {};
