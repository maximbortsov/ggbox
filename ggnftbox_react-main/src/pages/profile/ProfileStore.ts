import { makeAutoObservable } from 'mobx'
import { User } from '../../entities/User'
import { Play } from '../../entities/Play'
import { plainToInstance } from 'class-transformer'


export interface Transaction {
    id: number
    number: number
    type: string
    amount: string
    date: string
}


class ProfileStore {

    myPlaysList: Play[] = [
        // {
        //     id: 1,
        //     name: 'АХАХА 18+',
        //     rarity: 'COMMON',
        //     twitchUsername: 'poli_di_',
        //     cost: 7.5,
        //     playUrl: ichiniPlay,
        //     streamerPhotoUrl: polidiPhoto,
        // },
        // {
        //     id: 2,
        //     name: 'Не получилось',
        //     rarity: 'RARE',
        //     twitchUsername: 'kakarotodota',
        //     cost: 13,
        //     playUrl: kakaroPlay,
        //     streamerPhotoUrl: kakaroPhoto,
        // },
    ]
    myPlaysSaleList: Play[] = [
        // {
        //     id: 3,
        //     name: 'Уснула на стриме',
        //     rarity: Rarity.LEGENDARY,
        //     twitchUsername: 'IchiNiSan_twitch',
        //     cost: 150,
        //     playUrl: polidiPlay,
        //     streamerPhotoUrl: polidiPhoto,
        // },
        // {
        //     id: 4,
        //     name: 'АХАХА 18+',
        //     rarity: Rarity.COMMON,
        //     twitchUsername: 'poli_di_',
        //     cost: 7.5,
        //     playUrl: ichiniPlay,
        //     streamerPhotoUrl: polidiPhoto,
        // },
        // {
        //     id: 5,
        //     name: 'Не получилось',
        //     rarity: Rarity.MYTHICAL,
        //     twitchUsername: 'kakarotodota',
        //     cost: 13,
        //     playUrl: kakaroPlay,
        //     streamerPhotoUrl: kakaroPhoto,
        // }
    ]
    transactionRows: Transaction[] = [
        {
            id: 0,
            number: 1,
            type: 'box',
            amount: '20',
            date: '12.12.22',
        },
        {
            id: 1,
            number: 2,
            type: 'play',
            amount: '20',
            date: '12.12.22',
        },
        {
            id: 2,
            number: 3,
            type: 'box',
            amount: '20',
            date: '12.12.22',
        },
        {
            id: 3,
            number: 4,
            type: 'box',
            amount: '20',
            date: '12.12.22',
        },
        {
            id: 4,
            number: 5,
            type: 'box',
            amount: '20',
            date: '12.12.22',
        },
    ]

    id = ''
    email = ''
    password = ''
    username = 'My awesome login'
    newPassword = ''
    repeatNewPassword = ''
    currentPassword = ''
    balance = 0
    flowWallet = ''
    roles = ['user']
    avatar: string | null = ''

    constructor() {
        makeAutoObservable(this)
    }

    get profileData(): User {
        return plainToInstance(
            User,
            {
                id: this.id,
                username: this.username,
                balance: this.balance,
                email: this.email,
                roles: this.roles,
            },
        )
    }

    updateUserInfo = (profileInfo: User): void => {
        this.id = profileInfo.id
        this.email = profileInfo.email
        this.username = profileInfo.username
        this.balance = profileInfo.balance
        this.roles = profileInfo.roles
        this.avatar = profileInfo.avatar
        this.flowWallet = profileInfo.flowWallet ?? ''
    }

    updateEmail = (email: string): void => {
        this.email = email
    }
    updateUsername = (username: string): void => {
        this.username = username
    }
    updateNewPassword = (password: string): void => {
        this.newPassword = password
    }
    updateRepeatNewPassword = (password: string): void => {
        this.repeatNewPassword = password
    }
    updateCurrentPassword = (password: string): void => {
        this.currentPassword = password
    }
}


export default ProfileStore
