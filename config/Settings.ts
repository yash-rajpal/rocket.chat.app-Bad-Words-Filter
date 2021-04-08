import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    LinkToExtractBadWords = 'link_to_extract_bad_words',
    ApplyFilterToAllChannels = 'apply_filter_to_all_channels',
    ListOfBlacklistedWords = 'list_of_blacklisted_words',
    ListOfWhitelistedWords = 'list_whitelisted_words',
    IncludeChannels = 'include_channels',
    ExcludeChannels = 'exclude_channels'
}

export const settings: Array<ISetting> = [
    {
        id: AppSetting.LinkToExtractBadWords,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'link_to_extract_bad_words',
        required: true,
    },
    {
        id: AppSetting.ListOfBlacklistedWords,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'list_of_blacklisted_words',
        required: true,
    },    
    {
        id: AppSetting.ListOfWhitelistedWords,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'list_whitelisted_words',
        required: true,
    },
    {
        id: AppSetting.ApplyFilterToAllChannels,
        public: true,
        type: SettingType.BOOLEAN,
        packageValue: '',
        i18nLabel: 'apply_filter_to_all_channels',
        required: true,
    },
    {
        id: AppSetting.IncludeChannels,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Include_the_Channels',
        required: true,
    },
    {
        id: AppSetting.ExcludeChannels,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Exclude_the_Channels',
        required: true,
    },
];