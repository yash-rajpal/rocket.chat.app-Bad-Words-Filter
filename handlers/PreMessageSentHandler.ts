import { IHttp, IMessageBuilder, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
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

    public run(){

        const messageText = this.message.text ? this.message.text : '';
        this.app.getLogger().debug("org text", this.blackListedWords)
        const cleanText = clean(this.blackListedWords, messageText);
        this.app.getLogger().debug("clean text", cleanText);
        const room = this.message.room;
        const sender = this.message.sender;

        const newMessage = this.builder.setData(this.message);
        newMessage.setText(cleanText);
        newMessage.setRoom(room);
        newMessage.setSender(sender);

        return newMessage.getMessage();
    }

}