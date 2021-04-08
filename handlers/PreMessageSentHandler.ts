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
        this.app.getLogger().debug("LIST OF BLACKLISTED WORDS", this.blackListedWords)
        this.app.getLogger().debug("ORIGNAL MESSAGE", messageText)
        const cleanText = clean(this.blackListedWords, messageText);
        this.app.getLogger().debug("CLEANED MESSAGE", cleanText.cleanText);
        const room = this.message.room;
        const sender = this.message.sender;

        const newMessage = this.builder.setText(cleanText.cleanText).setRoom(room).setSender(sender);

        this.app.getLogger().debug("IS ANY BAD WORD FOUND ? ", cleanText.isanyWordProfane)



        // const messageCleanText = clean(this.blackListedWords, messageText);
        // if(messageCleanText.isanyWordProfane) {
        //     // making associations for the message received
        //     const channelAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.displayName || 'something');
        //     const userAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, sender.username);
        //     const allDataAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'ALLDATA') ;

        //     // fetching previous details of this user in this channel.
        //     const [prevRecord] = await this.read.getPersistenceReader()
        //                     .readByAssociations([channelAssociation, userAssociation, allDataAssociation]) as Array<{badWords:number, username:string}>;  
            
        //     if(prevRecord) {
        //         // if record exists then update the value of it and increase by 1 (or increase by number of bad-words used)
        //         await this.persist.updateByAssociations([channelAssociation, userAssociation, allDataAssociation],{badWords : prevRecord.badWords+1, username: sender.username})
        //     } else {
        //         // else create the record for this user and this channel and initialise by 1 (or bad words used)
        //         await this.persist.createWithAssociations({badWords: 1, username: sender.username}, [channelAssociation, userAssociation, allDataAssociation]);
        //     }
        // }


        if(cleanText.isanyWordProfane){
            var channelAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.displayName || 'dummy');
            var userAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, sender.username);
            var allDataAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'ALLDATA')
            const [record] = await this.read.getPersistenceReader().readByAssociations([channelAssociation, userAssociation, allDataAssociation]) as Array<{badWords:number, username:string}>;
            // this.app.getLogger().debug("The record is", record)
            if(record){
                await this.persist.updateByAssociations([channelAssociation, userAssociation, allDataAssociation],{badWords : record.badWords+1, username: sender.username})
            } else {
                await this.persist.createWithAssociations({badWords: 1, username: sender.username}, [channelAssociation, userAssociation, allDataAssociation]);
            }
            const badWordsRecords = await this.read.getPersistenceReader().readByAssociation(allDataAssociation) as Array<any>;
            this.app.getLogger().debug("ALL OFFENDING USERS ARE - ", badWordsRecords);

        }



        return newMessage.getMessage();
    }

}