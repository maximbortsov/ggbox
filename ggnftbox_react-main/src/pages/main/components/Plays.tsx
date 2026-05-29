import React, { FC, useCallback, useEffect } from 'react'
import { Box, Container, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import stores from '../../../stores/Stores'
import backgroundLines2 from '../../../assets/images/background/bgLines2.png'
import { PlayCard } from '../../../components/plays/PlayCard'
import PlayDialog from '../../../components/plays/PlayDialog'
import { observer } from 'mobx-react-lite'
import PlayDrawer from '../../../components/plays/PlayDrawer'
import { ApiSource } from '../../../utils/api'
import { plainToInstance } from 'class-transformer'
import { useQuery } from 'react-query'
import { Play } from '../../../entities/Play'
import BoxesSkeletons from '../../../components/boxes/BoxesSkeletons'
import { Pages } from '../../../utils/routes'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { http } from '../../../utils/http'


const Plays: FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const playId = searchParams.get('play')

    const handleOpenPlay = (play: Play): void => {
        stores.main.openPlayInfo(play.id)
        setSearchParams({ play: play.id }, {
            state: {
                ignoreScrolling: true,
            },
        })
    }

    const closePlayInfo = useCallback(() => {
        stores.main.closePlayInfo()
        setSearchParams('', {
            state: {
                ignoreScrolling: true,
            },
        })
    }, [])

    const fetchPlaysPopular = async (): Promise<Play[]> => http
        .get(ApiSource + 'play', { params: { take: 3, include: ['streamer', 'first-edition'] } })
        .then((res) => res.data)
        .then((res) => plainToInstance(Play, res as any[]))

    const plays = useQuery('playsPopular', fetchPlaysPopular)

    const navigateToMarketplace = useCallback(() => {
        navigate(Pages.MARKETPLACE)
    }, [navigate])

    useEffect(() => {
        if (playId) {
            stores.main.openPlayInfo(playId)
        }
    }, [playId])

    return (
        <>
            <Box position={'relative'}>
                <img
                    src={backgroundLines2}
                    alt={'bg'}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '150vh',
                        overflow: 'hidden',
                        objectFit: 'cover',
                        zIndex: -1,
                    }}
                />
                <Container maxWidth={'lg'} sx={{ marginTop: 16 }}>
                    <Box position={'relative'}>
                        <Typography
                            variant={'h4'}
                            color={'white'}
                            fontFamily={'\'Russo One\', sans-serif'}
                        >
                            Moments
                        </Typography>
                        <Box
                            position={'absolute'}
                            top={0}
                            right={0}
                        >
                            <Typography
                                variant={'h6'}
                                color={'white'}
                                fontFamily={'\'Russo One\', sans-serif'}
                                onClick={navigateToMarketplace}
                                sx={{
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    textDecoration: 'underline',
                                }}
                            >
                                More
                            </Typography>
                        </Box>
                    </Box>
                    <Box mt={2}>
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
                                <BoxesSkeletons/>
                            }
                            {
                                plays.isSuccess &&
                                plays.data.map((play: Play) => (
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
                    </Box>
                </Container>
            </Box>
            {
                stores.main.isPlayInfoOpen && isMobile &&
                <PlayDrawer
                    open={stores.main.isPlayInfoOpen}
                    playId={stores.main.pickedPlayId}
                    onClose={closePlayInfo}
                />
            }
            {
                stores.main.isPlayInfoOpen && !isMobile &&
                <PlayDialog
                    open={stores.main.isPlayInfoOpen}
                    playId={stores.main.pickedPlayId}
                    onClose={closePlayInfo}
                />
            }
        </>
    )
}

export default observer(Plays)
