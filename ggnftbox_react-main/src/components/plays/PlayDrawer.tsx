import React, { FC, useCallback, useState } from 'react'
import { Box, Collapse, Skeleton, Stack, styled, SwipeableDrawer, Typography } from '@mui/material'
import ReactPlayer from 'react-player'
import { GGChip } from '../GGChip'
import CurrencyPick from './PlayCurrencyPick'
import { observer } from 'mobx-react-lite'
import PlayHistory from './PlayHistory'
import { PlayCosts } from './PlayCosts'
import stores from '../../stores/Stores'
import { rarityColor } from '../../utils/colors'
import { Play } from '../../entities/Play'
import { ApiSource } from '../../utils/api'
import { plainToInstance } from 'class-transformer'
import { useQuery } from 'react-query'
import { StreamerWithPhoto } from '../StreamerWithPhoto'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LoadingButton from '@mui/lab/LoadingButton'
import { http } from '../../utils/http'
import { Lot } from '../../entities/Lot'
import { PlayLots } from './PlayLots'


interface PlayDrawerProps {
    playId: string
    open: boolean
    onClose(): void
}


const Puller = styled(Box)({
    width: 48,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginTop: 12,
    marginBottom: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
})

const PlayDrawer: FC<PlayDrawerProps> = ({ playId, open, onClose }) => {

    const [buyOpen, setBuyOpen] = useState(false)

    const openBuyMenu = useCallback(() => {
        setBuyOpen((prevState) => !prevState)
    }, [])

    const fetchPlayById = async (): Promise<Play> => http
        .get(
            ApiSource + 'play/' + playId,
            {
                params: {
                    include: ['nfts', 'tags', 'lots', 'streamer', 'game'],
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

    return (
        <SwipeableDrawer
            open={open}
            anchor={'bottom'}
            onClose={onClose}
            onOpen={(): void => console.log('open')}
            sx={{
                '& .MuiDrawer-paper': {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    background: '#15204A',
                },
            }}
        >
            <Puller/>
            <Box
                height={'75vh'}
                textAlign={'center'}
                px={2}
                pb={4}
                sx={{
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                }}
            >
                <Stack direction={'row'} justifyContent={'space-between'} mx={0.5}>
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
                            play.data.name
                        }
                    </Typography>
                    <Typography
                        variant={'h6'}
                        fontFamily={'"Montserrat", sans-serif'}
                        fontWeight={600}
                    >
                        {'# / '}
                        {
                            play.isLoading &&
                            <Skeleton width={80} sx={{ display: 'inline', width: 80 }}/>
                        }
                        {
                            play.isSuccess &&
                            `${play.data?.editions?.[0].maxMintSize ?? -1}`
                        }
                    </Typography>
                </Stack>
                <Typography
                    variant={'subtitle1'}
                    fontFamily={'"Montserrat", sans-serif'}
                    fontWeight={600}
                    color={(): string => rarityColor(play.data?.editions?.[0].rarity ?? 'Common')}
                    textAlign={'start'}
                >
                    {
                        play.isLoading &&
                        <Skeleton width={150}/>
                    }
                    {
                        play.isSuccess &&
                        `● ${play.data.editions?.[0].rarity ?? 'Common'}`
                    }
                </Typography>
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
                <Stack direction={'row'} justifyContent={'space-between'} mt={1}>
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
                </Stack>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    mt={1}
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
                    mt={2}
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
                <Box
                    borderRadius={1}
                    mt={2}
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
                            sx={{
                                px: 4,
                            }}
                        />
                    }
                </Box>
                <Stack direction={'column'} alignItems={'center'} mt={2}>
                    <Box width={'90%'}>
                        <CurrencyPick/>
                    </Box>
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
                </Stack>
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
                    height={350}
                    width={'100%'}
                    mt={4}
                    mb={4}
                >
                    <Typography variant={'h5'} fontFamily={'\'Montserrat\', sans-serif'}>
                        Last sales
                    </Typography>
                    {
                        play.isLoading &&
                        <Skeleton height={300} sx={{ transform: 'none', mt: 1 }}/>
                    }
                    {
                        lots.isSuccess &&
                        <PlayHistory lots={lots.data?.filter((lot: Lot) => lot.buyerId)}/>
                    }
                </Box>
            </Box>
        </SwipeableDrawer>
    )
}

export default observer(PlayDrawer)