import React, { FC, useCallback, useState } from 'react'
import { Box, Collapse, Container, Dialog, Grid, IconButton, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import ReactPlayer from 'react-player'
import { GGChip } from '../GGChip'
import { PlayCosts } from './PlayCosts'
import CurrencyPick from './PlayCurrencyPick'
import stores from '../../stores/Stores'
import { observer } from 'mobx-react-lite'
import PlayHistory from './PlayHistory'
import { ApiSource } from '../../utils/api'
import CloseIcon from '@mui/icons-material/Close'
import { StreamerWithPhoto } from '../StreamerWithPhoto'
import { Play } from '../../entities/Play'
import { useQuery } from 'react-query'
import { rarityColor } from '../../utils/colors'
import { plainToInstance } from 'class-transformer'
import LoadingButton from '@mui/lab/LoadingButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { http } from '../../utils/http'
import { Lot } from '../../entities/Lot'
import { PlayLots } from './PlayLots'


interface PlayDialogProps {
    playId: string
    open: boolean
    onClose(): void
}


const PlayDialog: FC<PlayDialogProps> = ({ playId, open, onClose }) => {

    const [buyOpen, setBuyOpen] = useState(false)

    const openBuyMenu = useCallback(() => {
        setBuyOpen((prevState) => !prevState)
    }, [])

    const fetchPlayById = async (): Promise<Play> => http
        .get(
            ApiSource + 'play/' + playId,
            {
                params: {
                    include: ['nfts', 'tags', 'streamer', 'game', 'editions'],
                },
            },
        )
        .then((res) => plainToInstance(Play, res.data))
        .catch((error) => {
            console.log(error.data.message)
            stores.snackbars.showErrorSnackbar(error.data.message)
            onClose()
            return new Play()
        })

    const fetchLotsByPlayId = async (): Promise<Lot[]> => http
        .get(
            ApiSource + 'lot/',
            {
                params: {
                    playId: playId,
                    include: ['nft', 'seller', 'buyer'],
                },
            },
        )
        .then((res) => plainToInstance(Lot, res.data as any[]))
        .catch((error) => {
            console.log(error.data.message)
            stores.snackbars.showErrorSnackbar(error.data.message)
            return []
        })

    const play = useQuery('play-' + playId, fetchPlayById)
    const lots = useQuery('lots-' + playId, fetchLotsByPlayId)
    const theme = useTheme()

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={'lg'}
            fullWidth
            scroll={'paper'}
            sx={{
                zIndex: (theme): number => theme.zIndex.drawer + 1,
                '& .MuiDialog-paper': {
                    borderRadius: 4,
                    background: 'transparent',
                },
            }}
        >
            <Container
                sx={{
                    height: '80vh',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    pt: 8,
                    pb: 2,
                    background: '#15204A',
                    position: 'relative',
                }}
            >
                <Box
                    position={'absolute'}
                    top={12}
                    right={12}
                >
                    <IconButton
                        onClick={onClose}
                        size={'large'}
                    >
                        <CloseIcon sx={{ color: 'white' }}/>
                    </IconButton>
                </Box>
                <Grid
                    container
                    spacing={3}
                    alignItems={'start'}
                >
                    {/* СЛЕВА */}
                    <Grid item md={6}>
                        <Box
                            pl={8}
                            pr={2}
                            sx={{
                                [theme.breakpoints.only('md')]: {
                                    pl: 4,
                                },
                            }}
                        >
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography
                                    variant={'h5'}
                                    fontFamily={'"Raleway", sans-serif'}
                                    fontWeight={600}
                                >
                                    {
                                        play.isLoading &&
                                        <Skeleton width={200}/>
                                    }
                                    {
                                        play.isSuccess &&
                                        play.data?.name
                                    }
                                </Typography>
                                <Typography
                                    variant={'h6'}
                                    fontFamily={'"Montserrat", sans-serif'}
                                    fontWeight={400}
                                >
                                    {'# / '}
                                    {
                                        play.isLoading &&
                                        <Skeleton width={80} sx={{ display: 'inline', width: 80 }}/>
                                    }
                                    {
                                        play.isSuccess &&
                                        `${play.data.editions?.[0].maxMintSize ?? -1}`
                                    }
                                </Typography>
                            </Stack>
                            <Typography
                                variant={'subtitle1'}
                                fontFamily={'"Montserrat", sans-serif'}
                                fontWeight={600}
                                color={(): string => rarityColor(play.data?.editions?.[0].rarity ?? 'Common')}
                            >
                                {
                                    play.isLoading &&
                                    <Skeleton width={150}/>
                                }
                                {
                                    play.isSuccess &&
                                    // `● ${play.data.rarity}`
                                    `● ${play.data.editions?.[0].rarity ?? ''}`
                                }
                            </Typography>
                            {/* Play video */}
                            <Box>
                                {
                                    play.isLoading &&
                                    <Box height={250} mt={1}>
                                        <Skeleton
                                            height={250}
                                            sx={{
                                                transform: 'none',
                                            }}
                                        />
                                    </Box>
                                }
                                {
                                    play.isSuccess &&
                                    <Box
                                        mt={1}
                                        width={'100%'}
                                        height={0}
                                        pb={'56.25%'}
                                        position={'relative'}
                                    >
                                        <ReactPlayer
                                            url={play.data.pinataUrl}
                                            controls
                                            width={'100%'}
                                            height={'100%'}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                            }}
                                        />
                                    </Box>
                                }
                            </Box>
                            <Box mt={1}>
                                {
                                    play.isLoading &&
                                    <Stack direction={'row'} spacing={1}>
                                        <Skeleton variant={'circular'} width={36} height={36}/>
                                        <Skeleton width={150}/>
                                    </Stack>
                                }
                                {
                                    play.isSuccess &&
                                    <StreamerWithPhoto
                                        avatarPath={play.data.streamer?.avatar ?? ''}
                                        username={play.data.streamer?.name ?? ''}
                                    />
                                }
                            </Box>
                        </Box>
                    </Grid>
                    {/* СПРАВА */}
                    <Grid item md={6}>
                        <Box
                            pr={8}
                            pl={2}
                            sx={{
                                [theme.breakpoints.only('md')]: {
                                    pr: 4,
                                },
                            }}
                        >
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                spacing={2}
                            >
                                {
                                    play.isLoading &&
                                    <>
                                        <Skeleton width={80} height={36}/>
                                        <Skeleton width={80} height={36}/>
                                        <Skeleton width={80} height={36}/>
                                    </>
                                }
                                {
                                    play.isSuccess &&
                                    play.data.tags?.map((tag) =>
                                        <GGChip key={tag.id} tag={tag.name}/>,
                                    )
                                }
                            </Stack>
                            <Typography
                                variant={'subtitle1'}
                                mt={1}
                                fontWeight={600}
                            >
                                Description
                            </Typography>
                            <Typography variant={'body2'}>
                                {
                                    play.isLoading &&
                                    <Skeleton height={80} sx={{ transform: 'none', mt: 1 }}/>
                                }
                                {
                                    play.isSuccess &&
                                    play.data.desc
                                }
                            </Typography>
                            {/* GAME */}
                            {
                                play.isSuccess &&
                                <GGChip
                                    tag={play.data.game?.name ?? 'Other'}
                                    gameLogoPath={play.data.game?.logo}
                                    sx={{
                                        display: 'inline-block',
                                        px: 2,
                                        mt: 2,
                                    }}
                                />
                            }

                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                mt={2}
                                spacing={2}
                            >
                                <Box
                                    borderRadius={1}
                                    px={3}
                                    py={2}
                                    width={'100%'}
                                    sx={{
                                        border: '1px solid #554ADA',
                                    }}
                                >
                                    {
                                        play.isLoading &&
                                        <Skeleton height={120} sx={{ transform: 'none' }}/>
                                    }
                                    {
                                        play.isSuccess &&
                                        <PlayCosts
                                            lowestPrice={play.data.lowestAsk}
                                            highestPrice={play.data.topSale}
                                            currency={stores.marketplace.pickedCurrency}
                                        />
                                    }
                                </Box>
                                <Box>
                                    <CurrencyPick/>
                                </Box>
                            </Stack>
                            <LoadingButton
                                disableElevation
                                variant={'contained'}
                                loading={play.isLoading}
                                loadingPosition={'end'}
                                endIcon={<KeyboardArrowDownIcon/>}
                                onClick={openBuyMenu}
                                sx={{
                                    px: 6,
                                    py: 1,
                                    mt: 4,
                                    background: '#554ADA',
                                    borderRadius: 0.5,
                                    '&.Mui-disabled': {
                                        background: 'rgba(85,74,218,0.35)',
                                    },
                                    ':hover': {
                                        background: '#5d53d9',
                                    },
                                }}
                            >
                                <Typography variant={'h5'} fontWeight={600} fontFamily={'\'Montserrat\', sans-serif'}>
                                    SELECT AND BUY
                                </Typography>
                            </LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
                <Collapse in={buyOpen}>
                    <Box
                        width={'70%'}
                        mx={'auto'}
                        mt={2}
                    >
                        {
                            play.isSuccess && lots.isSuccess &&
                            <PlayLots lots={lots.data.filter((lot: Lot) => lot.buyerId === null)} playId={playId}/>
                        }
                    </Box>
                </Collapse>
                <Box
                    width={'85%'}
                    px={8}
                    mt={6}
                    mb={4}
                    sx={{
                        [theme.breakpoints.only('md')]: {
                            px: 4,
                            width: '90%',
                        },
                    }}
                >
                    <Typography variant={'h5'} fontFamily={'\'Montserrat\', sans-serif'}>
                        Sales history
                    </Typography>
                    {
                        play.isLoading &&
                        <Skeleton height={300} sx={{ transform: 'none', mt: 1 }}/>
                    }
                    {
                        lots.isSuccess &&
                        <PlayHistory lots={lots.data.filter((lot: Lot) => lot.buyerId)}/>
                    }
                </Box>
            </Container>
        </Dialog>
    )
}

export default observer(PlayDialog)