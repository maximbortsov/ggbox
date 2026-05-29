import { RolesBuilder } from 'nest-access-control'


export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
}


export enum AppResources {
    AGREEMENT = 'agreement',
    AUTH = 'auth',
    GAME = 'game',
    PLAY = 'play',
    BOX = 'box',
    BOX_TOKEN = 'box_token',
    LOT = 'lot',
    DEPOSIT = 'deposit',
    WITHDRAWAL = 'withdrawal',
    NFT = 'nft',
    SET = 'set',
    EDITION = 'edition',
    USER = 'user',
    STREAMER = 'streamer',
    BUY = 'buy',
    TAG = 'tag',
}


export const roles: RolesBuilder = new RolesBuilder()

roles
    // USER (CRUD)
    .grant(Roles.USER)
    .readOwn(AppResources.AUTH)         // AUTH
    .updateOwn(AppResources.AUTH)
    .readAny(AppResources.PLAY)         // PLAY
    .readAny(AppResources.GAME)         // GAME
    .createOwn(AppResources.LOT)        // LOT
    .readOwn(AppResources.LOT)
    .updateOwn(AppResources.LOT)
    .deleteOwn(AppResources.LOT)
    .createOwn(AppResources.DEPOSIT)    // DEPOSIT
    .readOwn(AppResources.DEPOSIT)
    .createOwn(AppResources.WITHDRAWAL) // WITHDRAWAL
    .readAny(AppResources.USER)         // USER
    .updateOwn(AppResources.USER)
    .createOwn(AppResources.BUY)        // BUY
    .updateOwn(AppResources.BUY)
    .readOwn(AppResources.BOX_TOKEN)    // BOX_TOKEN
    .updateOwn(AppResources.BOX_TOKEN)

    // ADMIN (CRUD)
    .grant(Roles.ADMIN)
    .extend(Roles.USER)
    .createAny(AppResources.AGREEMENT)  // AGREEMENT
    .createAny(AppResources.PLAY)       // PLAY
    .createAny(AppResources.SET)        // SET
    .createAny(AppResources.EDITION)    // EDITION
    .createAny(AppResources.NFT)        // NFT
    .createAny(AppResources.BOX)        // BOX
    .updateAny(AppResources.BOX)
    .deleteAny(AppResources.BOX)
    .createAny(AppResources.GAME)       // GAME
    .updateAny(AppResources.GAME)
    .deleteAny(AppResources.GAME)
    .createAny(AppResources.STREAMER)   // STREAMER
    .updateAny(AppResources.STREAMER)
    .deleteAny(AppResources.STREAMER)
    .createAny(AppResources.TAG)        // TAG
    .updateAny(AppResources.TAG)
    .deleteAny(AppResources.TAG)

// console.log(roles.getGrants()['user']['game'])
