import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    LinkToExtractBadWords = 'link_to_extract_bad_words',
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
];