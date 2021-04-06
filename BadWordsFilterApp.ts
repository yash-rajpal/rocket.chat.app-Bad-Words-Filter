import {
    IAppAccessors,
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IMessageBuilder,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IMessage, IPreMessageSentModify } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { ISetting } from '@rocket.chat/apps-engine/definition/settings';
import { AppSetting, settings } from './config/Settings';
import { OnSettingUpdatedHandler } from './handlers/OnSettingUpdatedHandler';
import { PreMessageSentHandler } from './handlers/PreMessageSentHandler';
export class BadWordsFilterApp extends App implements IPreMessageSentModify {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        
    }
    public blackListedWords:Array<string>

    public async onEnable(environment: IEnvironmentRead, configurationModify: IConfigurationModify):Promise<boolean>{
        this.blackListedWords = ((await environment.getSettings().getById(AppSetting.ListOfBlacklistedWords)).value).split(',').map(word => word.trim());
        
        this.getLogger().debug("FROM Enable", this.blackListedWords)
        return true;
    }

    async executePreMessageSentModify(
        message: IMessage,
        builder: IMessageBuilder,
        read: IRead,
        http: IHttp,
        persist : IPersistence
    ):Promise<IMessage> {
        const preMessageHandler = new PreMessageSentHandler(this, message, builder, read, http, persist, this.blackListedWords)
        return preMessageHandler.run();
    }

    public async onSettingUpdated(setting: ISetting, configurationModify: IConfigurationModify, read: IRead, http: IHttp): Promise<void> {
        const onSettingUpdatedHandler: OnSettingUpdatedHandler = new OnSettingUpdatedHandler(this, read, http);
        this.blackListedWords = await onSettingUpdatedHandler.run();
        this.getLogger().debug("FROM MAIN", this.blackListedWords)
    }

    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        await Promise.all(settings.map((setting) => configuration.settings.provideSetting(setting)));
    }
}
