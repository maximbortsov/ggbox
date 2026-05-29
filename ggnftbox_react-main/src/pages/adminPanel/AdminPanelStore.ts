import { makeAutoObservable } from 'mobx'
import { User } from '../../entities/User'
import { Play } from '../../entities/Play'
import { GGBox } from '../../entities/GGBox'
import { Streamer } from '../../entities/Streamer'
import { Game } from '../../entities/Game'


export enum DrawerSections {
    User = 'User',
    Streamer = 'Streamer',
    Game = 'Game',
    Play = 'Play',
    Box = 'Box',
    Nft = 'Nft',
    Lot = 'Lot',
}


class AdminPanelStore {

    users: User[]
    plays: Play[]
    boxes: GGBox[]
    streamers: Streamer[]
    games: Game[]
    drawerSections = [
        DrawerSections.User,
        DrawerSections.Streamer,
        DrawerSections.Game,
        DrawerSections.Play,
        DrawerSections.Box,
        DrawerSections.Nft,
        DrawerSections.Lot,
    ]
    currentSection = this.drawerSections[0]

    constructor() {
        makeAutoObservable(this)
    }

    setCurrentSection = (section: DrawerSections): void => {
        this.currentSection = section
    }

}


export default AdminPanelStore