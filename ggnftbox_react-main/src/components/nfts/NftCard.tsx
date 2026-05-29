import React, { FC, useCallback, useState } from 'react'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import ReactPlayer from 'react-player'
import { AssetsPath } from '../../utils/api'
import { rarityColor } from '../../utils/colors'
import { NftCardType } from '../../utils/enums'
import { Nft } from '../../entities/Nft'
import SaleBtn from '../SaleBtn'
import CancelLotBtn from '../CancelLotBtn'
import { Play } from '../../entities/Play'
import { Edition } from '../../entities/Edition'
import { LoadingButton } from '@mui/lab'
import { TransferNft } from '../../cadence/transactions/nfts'
import stores from '../../stores/Stores'
import * as fcl from '@onflow/fcl'


export interface NftCardProps {
    nft: Nft
    type: NftCardType
    lotPrice?: number
    onClick(): void
    isAdmin?: boolean
}


const NftCard: FC<NftCardProps> = ({ nft, onClick, type, lotPrice, isAdmin = false }) => {

    const edition = nft.edition ?? new Edition()
    const play = edition.play ?? new Play()

    const [videoStyle, setVideoStyle] = useState({
        border: '3px solid transparent',
        borderImage: '',
        borderImageSlice: 1,
    })

    const [rotation, setRotation] = useState(0)
    const [loading, setLoading] = useState(false)

    const playVideo = useCallback(() => {
        setVideoStyle({
            border: '3px outset transparent',
            borderImage: 'linear-gradient(90deg, rgba(85,74,218,1) 0%, rgba(244,64,148,1) 100%)',
            borderImageSlice: 1,
        })

        setRotation(7)
        setTimeout(() => {
            setRotation(0)
        }, 400)
    }, [])

    const pauseVideo = useCallback(() => {
        setVideoStyle({
            border: '3px solid transparent',
            borderImage: '',
            borderImageSlice: 1,
        })
        setRotation(0)
    }, [])

    const getRarityColor = useCallback((): string => rarityColor(edition.rarity), [edition.rarity])

    return (
        <Box
            width={'100%'}
            sx={{
                perspective: '400px',
                transformStyle: 'preserve-3d',
            }}
        >
            <Box
                sx={{
                    // TODO: open play info on click somewhere
                    transition: 'all 1s ease-in',
                    transform: `rotate3d(${play.nftNum ?? 0 % 2 == 0 ? 1 : -1},-1,0,${rotation}deg)`,
                    cursor: 'pointer',
                    ...videoStyle,
                }}
            >
                <ReactPlayer
                    url={play.pinataUrl}
                    width={'100%'}
                    height={'100%'}
                    onPlay={playVideo}
                    onPause={pauseVideo}
                    controls
                    style={{
                        display: 'flex',
                        aspectRatio: '16/9',
                        objectFit: 'contain',
                    }}
                />
            </Box>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                mt={1.5}
                mx={0.75}
            >
                <Typography color={'white'} fontSize={'1rem'}>
                    {play.name}
                </Typography>
                <Typography
                    color={getRarityColor}
                    fontFamily={'Montserrat'}
                    fontSize={'1rem'}
                    fontWeight={300}
                >
                    ●
                    {' '}
                    {edition.rarity}
                </Typography>
            </Stack>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                mt={0.5}
                mx={0.75}
            >
                <Stack direction={'row'} alignItems={'center'}>
                    <Avatar
                        src={AssetsPath + play.streamer?.avatar}
                        sx={{
                            width: 28,
                            height: 28,
                            marginRight: 1,
                        }}
                    />
                    <Typography color={'white'} fontWeight={300} fontSize={'1rem'}>
                        @
                        {play.streamer?.name}
                    </Typography>
                </Stack>
                <Typography color={'white'} fontWeight={300} fontSize={'1rem'}>
                    {'# '}
                    {nft.serialNumber}
                    {' / '}
                    {edition.maxMintSize}
                </Typography>
            </Stack>
            {
                (type === NftCardType.HOLD) ?
                    <SaleBtn
                        onClick={onClick}
                    />
                    :
                    // type === NftCardType.ON_SALE
                    <CancelLotBtn
                        onClick={onClick}
                        cost={lotPrice ?? 0}
                    />
            }
            {/* Дебаг для отправки админу */}
            {
                isAdmin &&
                <LoadingButton
                    disableElevation
                    variant={'contained'}
                    loading={loading}
                    onClick={async (): Promise<void> => {
                        setLoading(true)

                        const transactionId = await fcl.mutate({
                            cadence: TransferNft,
                            args: (arg, t) => [
                                //recipientAddress: Address, withdrawID: UInt64
                                arg('0x61da1a7a40700bf4', t.Address),
                                arg(nft.flowID, t.UInt64),
                            ],
                            proposer: fcl.currentUser,
                            payer: fcl.currentUser,
                            authorizations: [fcl.currentUser],
                            limit: 500,
                        })
                        stores.snackbars.showProgressSnackbar('Waiting for the transaction to be sealed.')
                        fcl.tx(transactionId).onceSealed()
                            .then(() => {
                                stores.snackbars.showSuccessSnackbar('Отправили на GGCORE нфт #' + nft.flowID)
                                console.log('Отправил админу - ' + nft.flowID)
                                setLoading(false)
                            })
                            .catch((err) => {
                                stores.snackbars.showErrorSnackbar(err)
                                console.log(err)
                                setLoading(false)
                            })
                    }}
                    sx={{
                        mt: 2,
                        py: 1,
                        width: '100%',
                        background: '#554ADA',
                        borderRadius: 0.5,
                        '& .MuiCircularProgress-root': {
                            color: 'white',
                        },
                        '&.Mui-disabled': {
                            background: 'rgba(85,74,218,0.35)',
                        },
                        ':hover': {
                            background: '#5d53d9',
                        },
                    }}
                >
                    <Typography fontWeight={600} fontFamily={'\'Montserrat\', sans-serif'}>
                        {loading ? 'Sealing...' : 'Send to admin'}
                    </Typography>
                </LoadingButton>
            }
            {/*/!* Дебаг для снятия с продажи *!/*/}
            {/*<LoadingButton*/}
            {/*    disableElevation*/}
            {/*    variant={'contained'}*/}
            {/*    loading={loading}*/}
            {/*    onClick={async (): Promise<void> => {*/}
            {/*        setLoading(true)*/}

            {/*        const transactionId = await fcl.mutate({*/}
            {/*            cadence: StopSale,*/}
            {/*            args: (arg, t) => [*/}
            {/*                arg(nft.flowID, t.UInt64),*/}
            {/*            ],*/}
            {/*            proposer: fcl.currentUser,*/}
            {/*            payer: fcl.currentUser,*/}
            {/*            authorizations: [fcl.currentUser],*/}
            {/*            limit: 500,*/}
            {/*        })*/}
            {/*        stores.snackbars.showProgressSnackbar('Waiting for the transaction to be sealed.')*/}
            {/*        fcl.tx(transactionId).onceSealed()*/}
            {/*            .then(() => {*/}
            {/*                stores.snackbars.showSuccessSnackbar('Сняли с продажи нфт #' + nft.flowID)*/}
            {/*                console.log('Сняли с продажи нфт #' + nft.flowID)*/}
            {/*                setLoading(false)*/}
            {/*            })*/}
            {/*            .catch((err) => {*/}
            {/*                stores.snackbars.showErrorSnackbar(err)*/}
            {/*                console.log(err)*/}
            {/*                setLoading(false)*/}
            {/*            })*/}
            {/*    }}*/}
            {/*    sx={{*/}
            {/*        mt: 2,*/}
            {/*        py: 1,*/}
            {/*        width: '100%',*/}
            {/*        background: '#554ADA',*/}
            {/*        borderRadius: 0.5,*/}
            {/*        '& .MuiCircularProgress-root': {*/}
            {/*            color: 'white',*/}
            {/*        },*/}
            {/*        '&.Mui-disabled': {*/}
            {/*            background: 'rgba(85,74,218,0.35)',*/}
            {/*        },*/}
            {/*        ':hover': {*/}
            {/*            background: '#5d53d9',*/}
            {/*        },*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Typography fontWeight={600} fontFamily={'\'Montserrat\', sans-serif'}>*/}
            {/*        {loading ? 'Sealing...' : 'Stop sale'}*/}
            {/*    </Typography>*/}
            {/*</LoadingButton>*/}
        </Box>
    )
}

export default NftCard
