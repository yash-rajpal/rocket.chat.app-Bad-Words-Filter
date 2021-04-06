import { IHttp, IMessageBuilder, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { RocketChatAssociationModel, RocketChatAssociationRecord } from "@rocket.chat/apps-engine/definition/metadata";
import { clean } from './Helper'
export class PreMessageSentHandler {
    constructor(
        private app: IApp,
        private message: IMessage,
        private builder: IMessageBuilder,
        private read: IRead,
        private http: IHttp,
        private persist: IPersistence,
        private blackListedWords: Array<string>
    ) {}

    public async run(){

        const messageText = this.message.text ? this.message.text : '';
        this.app.getLogger().debug("org text", this.blackListedWords)
        const cleanText = clean(this.blackListedWords, messageText);
        this.app.getLogger().debug("clean text", cleanText);
        const room = this.message.room;
        const sender = this.message.sender;

        const newMessage = this.builder.setText(cleanText.cleanText).setRoom(room).setSender(sender);

        this.app.getLogger().debug("is any profane", cleanText.isanyWordProfane)

        if(cleanText.isanyWordProfane){
            var channelAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.displayName || 'dummy');
            var userAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, sender.username);
            // var badwordsQuantity = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'badWords')
            const [record] = await this.read.getPersistenceReader().readByAssociations([channelAssociation, userAssociation]) as Array<{badWords:number}>;
            this.app.getLogger().debug("The history of persist", record.badWords)
            if(record){
                var persisting = await this.persist.updateByAssociations([channelAssociation, userAssociation],{badWords : record.badWords+1}, true)
                this.app.getLogger().debug("persisting", persisting)
            }

        }

        return newMessage.getMessage();
    }

}