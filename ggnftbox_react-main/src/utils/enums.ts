export enum Errors {
    INCORRECT_EMAIL,
    NON_EXISTING_EMAIL,
    EMAIL_ALREADY_EXIST,
    LOGIN_ALREADY_EXIST,
    WEAK_PASSWORD,
    WRONG_PASSWORD,
    PASSWORDS_DONT_MATCH,
    TERMS_DONT_EXIST,
    NON_CONFIRMED_EMAIL,
    MAX_LENGTH,
    WRONG_PASSWORD_OR_EMAIL
}


export enum Rarity {
    COMMON = 'Common',
    RARE = 'Rare',
    MYTHICAL = 'Mythical',
    LEGENDARY = 'Legendary',
}


export enum SnackbarType {
    ERROR = 'error',
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    LOADING = 'loading',
}


export enum NftCardType {
    ON_SELL,
    HOLD,
    ON_OPEN
}


export enum BoxCardType {
    ON_SALE,
    ON_OPEN
}


export enum Sorts {
    Newest = 'Newest',
    PriceUp = 'PriceUp',
    PriceDown = 'PriceDown',
    // LotsUp = 'LotsUp',
    // LotsDown = 'LotsDown',
}


export enum Currencies {
    USD = '$',
    FUSD = 'FUSD',
    // Eth = 'ETH',
    GG = '$GG'
}


export enum TransactionType {
    BUY_LOT = 'buy-lot',
    BUY_BOX = 'buy-box',
}