import { IHttp, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { AppSetting } from '../config/Settings';

export class OnSettingUpdatedHandler {
    constructor(private readonly app: IApp, private readonly read: IRead, private readonly http: IHttp) {}

    public async run():Promise<Array<string>> {
        const linkToExtractBadWords: string = await this.read.getEnvironmentReader().getSettings().getValueById(AppSetting.LinkToExtractBadWords);
        const applyFilterToAllChannels: boolean = await this.read.getEnvironmentReader().getSettings().getValueById(AppSetting.ApplyFilterToAllChannels);
        const blacklistedWords: string = await this.read.getEnvironmentReader().getSettings().getValueById(AppSetting.ListOfBlacklistedWords);
        const whitelistedWords: string = await this.read.getEnvironmentReader().getSettings().getValueById(AppSetting.ListOfWhitelistedWords);

        const blacklistedWordsFromURL =  (await this.http.get(linkToExtractBadWords)).content;

        this.app.getLogger().debug("These are the extracted words from url", blacklistedWordsFromURL);

        return blacklistedWords.split(',').map(word => word.trim());
    }
}