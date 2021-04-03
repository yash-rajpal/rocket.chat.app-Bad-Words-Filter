import { IHttp, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { AppSetting } from '../config/Settings';

export class OnSettingUpdatedHandler {
    constructor(private readonly app: IApp, private readonly read: IRead, private readonly http: IHttp) {}

    public async run() {
        const linkToExtractBadWords: string = await this.read.getEnvironmentReader().getSettings().getValueById(AppSetting.LinkToExtractBadWords);

        this.app.getLogger().debug("The link is:", linkToExtractBadWords);
        console.log("Link", linkToExtractBadWords)
    }
}