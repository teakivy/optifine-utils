# Optifine Utils

> A scraper to get a information and download links from <a href="https://optifine.net">optifine.net</a>

## Quick Start

```ts
import OFUtils from 'optifine-utils';

const downloadURL = await (
    await OFUtils.getVersions({ minecraftVersion: '1.19.2' })
)[0].getDownloadURL();
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
    published: Date | string;
    changelogURL: string;
    getDownloadURL: () => Promise<string>;
};
```

#### GetVersionsFilter

```ts
type GetVersionsFiler = {
    optifineVersion?: string;
    fileName?: string;
    forgeVersion?: string;
    minecraftVersion?: string;
    published?: Date | string;
    changelogURL?: string;
};
```

### Methods

#### getDownloadURL

```ts
getDownloadURL(fileName: string): Promise<String>
```

#### getVersions

```ts
getVersions(filter: GetVersionsFilter): Promise<Version[]>
```

## Credits

All Development is by ([@teakivy](https://www.github.com/teakivy))

## Support

For support, Join my discord ([dsc.gg/teakivy](https://discord.gg/Xb6eeRevkb)) and ask for help in `#❓︱support`
