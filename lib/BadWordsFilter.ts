import { IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationModel, RocketChatAssociationRecord } from "@rocket.chat/apps-engine/definition/metadata";

class AppBadWordsFilter{

    constructor(private readonly persistence:IPersistence) {}

    public async storeNewWords(words:Array<string>):Promise<void> {
        words.map(async word =>{
            const wordAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, word)
            await this.persistence.updateByAssociations([wordAssociation], {
                word,
            }, true);
        })

    }

}

