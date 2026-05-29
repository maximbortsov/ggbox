import React, { FC, ReactElement } from 'react'
import { Box } from '@mui/material'
import AdminDrawer from './components/AdminDrawer'
import ManageUser from './user/ManageUser'
import stores from '../../stores/Stores'
import { DrawerSections } from './AdminPanelStore'
import ManageStreamer from './streamer/ManageStreamer'
import { observer } from 'mobx-react-lite'
import { User } from '../../entities/User'
import { ApiSource } from '../../utils/api'
import { plainToInstance } from 'class-transformer'
import { useQuery } from 'react-query'
import { Streamer } from '../../entities/Streamer'
import { Game } from '../../entities/Game'
import ManageGame from './game/ManageGame'
import ManagePlay from './play/ManagePlay'
import { Play } from '../../entities/Play'
import { GGBox } from '../../entities/GGBox'
import ManageBox from './box/ManageBox'
import ManageNft from './nft/ManageNft'
import ManageLot from './lot/ManageLot'
import { http } from '../../utils/http'


const AdminPanel: FC = () => {

    const fetchUsersAdmin = async (): Promise<User[]> => http
        .get(ApiSource + 'user')
        .then((res) => res.data)
        .then((res) => plainToInstance(User, res as any[]))

    const fetchStreamersAdmin = async (): Promise<Streamer[]> => http
        .get(ApiSource + 'streamer', { params: { include: 'user' } })
        .then((res) => res.data)
        .then((res) => plainToInstance(Streamer, res as any[]))

    const fetchGamesAdmin = async (): Promise<Game[]> => http
        .get(ApiSource + 'game')
        .then((res) => res.data)
        .then((res) => plainToInstance(Game, res as any[]))

    const fetchPlaysAdmin = async (): Promise<Play[]> => http
        .get(ApiSource + 'play', { params: { include: 'streamer' } })
        .then((res) => res.data)
        .then((res) => plainToInstance(Play, res as any[]))

    const fetchBoxesAdmin = async (): Promise<GGBox[]> => http
        .get(ApiSource + 'box')
        .then((res) => res.data)
        .then((res) => plainToInstance(GGBox, res as any[]))

    const streamers = useQuery('adminStreamers', fetchStreamersAdmin)
    const users = useQuery('adminUsers', fetchUsersAdmin)
    const games = useQuery('adminGames', fetchGamesAdmin)
    const plays = useQuery('adminPlays', fetchPlaysAdmin)
    const boxes = useQuery('adminBoxes', fetchBoxesAdmin)

    const navigation = (): ReactElement => {
        switch (stores.admin.currentSection) {
            case DrawerSections.User:
                return <ManageUser users={users}/>
            case DrawerSections.Game:
                return <ManageGame games={games}/>
            case DrawerSections.Play:
                return <ManagePlay plays={plays} streamers={streamers} games={games}/>
            case DrawerSections.Box:
                return <ManageBox boxes={boxes}/>
            case DrawerSections.Streamer:
                return <ManageStreamer users={users} streamers={streamers}/>
            case DrawerSections.Nft:
                return <ManageNft plays={plays} boxes={boxes}/>
            case DrawerSections.Lot:
                return <ManageLot plays={plays}/>
        }
    }

    return (
        <Box display={'flex'}>
            <Box
                sx={{
                    width: 250,
                    flexShrink: 0,
                }}
            >
                <AdminDrawer/>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    width: `calc(100% - 250px)`,
                }}
            >
                {navigation()}
            </Box>
        </Box>
    )
}

export default observer(AdminPanel)