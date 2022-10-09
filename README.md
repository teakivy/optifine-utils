# Optifine Utils

> A scraper to get a information about and download jar files from <a href="https://optifine.net">optifine.net</a>

## Install

```bash
npm install optifine-utils
```

or

```bash
yarn add optifine-utils
```

## Quick Start

```ts
import { getVersions } from 'optifine-utils';

const version = await getVersions({ minecraftVersion: '1.19.2' })[0];

version.download('./Optifine_1.19.2.jar');
```

## Docs

### Types

#### Version

```ts
type Version = {
    optifineVersion: string;
    fileName: string;
    forgeVersion: string;
    minecraftVersion: string;
    published: Date;
    changelogURL: string;
    getDownloadURL: () => Promise<string>;
    download: (path?: string) => Promise<void>;
    install: () => Promise<boolean>;
    runInstaller: () => Promise<boolean>;
};
```

#### GetVersionsFilter

```ts
type GetVersionsFiler = {
    optifineVersion?: string;
    fileName?: string;
    forgeVersion?: string;
    minecraftVersion?: string;
    published?: Date;
    changelogURL?: string;
};
```

### Methods

#### getDownloadURL

Get the download URL of a version

```ts
getDownloadURL(fileName: string): Promise<String>
```

#### getVersions

Get all avaliable versions on the Optifine downloads site

```ts
getVersions(filter?: GetVersionsFilter): Promise<Version[]>
```

#### downloadVersion

Download a version

```ts
downloadVersion(version: Version, path?: string): Promise<void>
```

#### installVersion

Install Optifine (with default settings) without opening the installer

```ts
installVersion(version: Version): Promise<boolean>
```

#### runInstaller

Download and run the Optifine Installer

```ts
runInstaller(version: Version): Promise<boolean>
```

## Credits

All Development is by ([@teakivy](https://www.github.com/teakivy))

## Support

For support, Join my discord ([dsc.gg/teakivy](https://discord.gg/Xb6eeRevkb)) and ask for help in `#❓︱support`
