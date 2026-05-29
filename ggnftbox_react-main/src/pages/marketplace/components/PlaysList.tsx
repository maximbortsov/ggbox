import React, { FC, useCallback, useEffect, useState } from 'react'
import { Grid, Theme, useMediaQuery } from '@mui/material'
import stores from '../../../stores/Stores'
import { PlayCard } from '../../../components/plays/PlayCard'
import PlayDrawer from '../../../components/plays/PlayDrawer'
import PlayDialog from '../../../components/plays/PlayDialog'
import { observer } from 'mobx-react-lite'
import BoxesSkeletons from '../../../components/boxes/BoxesSkeletons'
import { Play } from '../../../entities/Play'
import { ApiSource } from '../../../utils/api'
import { plainToInstance } from 'class-transformer'
import { useQuery } from 'react-query'
import { http } from '../../../utils/http'
import { Waypoint } from 'react-waypoint'
import { useSearchParams } from 'react-router-dom'


const PlaysList: FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const [page, setPage] = useState<number>(1)

    const [searchParams, setSearchParams] = useSearchParams()
    const playId = searchParams.get('play')

    const handleOpenPlay = (play: Play): void => {
        stores.marketplace.openPlayInfo(play.id)
        setSearchParams({ play: play.id }, {
            state: {
                ignoreScrolling: true,
            },
        })
    }

    const closePlayInfo = useCallback(() => {
        stores.marketplace.closePlayInfo()
        setSearchParams(``, {
            state: {
                ignoreScrolling: true,
            },
        })
    }, [setSearchParams])

    // TODO: add - , preset: 'marketplace'
    const fetchPlaysMarketplace = async (): Promise<Play[]> => http
        .get(ApiSource + 'play', {
            params: {
                ...stores.marketplace.filters,
                preset: 'marketplace',
                include: ['streamer', 'first-edition'],
                take: page * 6,
            },
        })
        .then((res) => res.data)
        .then((res) => plainToInstance(Play, res as any[]))

    const plays = useQuery(['playsMarketplace', page], fetchPlaysMarketplace, { keepPreviousData: true })

    useEffect(() => {
        void plays.refetch()
        if (playId) {
            stores.marketplace.openPlayInfo(playId)
        }
    }, [stores.marketplace.refetch]) // не менять!

    const handleLoadMore = useCallback(() => {
        setPage((prevState) => prevState + 1)
    }, [])

    return (
        <>
            <Grid
                container
                justifyContent={'start'}
                alignItems={'center'}
                maxWidth={'100%'}
                columns={3}
                rowSpacing={{ xs: 6, md: 0 }}
                columnSpacing={{ xs: 0, md: 3 }}
            >
                {
                    plays.isLoading &&
                    <>
                        <BoxesSkeletons/>
                        <BoxesSkeletons/>
                    </>
                }
                {
                    plays.isSuccess &&
                    plays.data
                        .filter((play: Play) => play.name.toLowerCase().includes(stores.marketplace.searchPattern.toLowerCase()))
                        // .sort(stores.marketplace.sortFunction)
                        .map((play: Play) => (
                            <Grid
                                item
                                xs={3}
                                md={1}
                                key={play.id}
                            >
                                <PlayCard
                                    play={play}
                                    onClick={(): void => handleOpenPlay(play)}
                                />
                            </Grid>
                        ))
                }
            </Grid>
            <Waypoint onEnter={handleLoadMore}/>
            {
                stores.marketplace.isPlayInfoOpen && isMobile &&
                <PlayDrawer
                    open={stores.marketplace.isPlayInfoOpen}
                    playId={stores.marketplace.pickedPlayId}
                    onClose={closePlayInfo}
                />
            }
            {
                stores.marketplace.isPlayInfoOpen && !isMobile &&
                <PlayDialog
                    open={stores.marketplace.isPlayInfoOpen}
                    playId={stores.marketplace.pickedPlayId}
                    onClose={closePlayInfo}
                />
            }
        </>
    )
}

export default observer(PlaysList)