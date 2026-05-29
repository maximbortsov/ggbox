import React, { useState } from 'react'
import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material'
import BoxImage from './BoxImage'
import { AssetsPath } from '../../utils/api'
import { prettyDate } from '../../utils/date'
import { Streamer } from '../../entities/Streamer'
import { StreamerWithPhoto } from '../StreamerWithPhoto'
import { LoadingButton } from '@mui/lab'
import ShakeChildren from '../../utils/ShakeChildren'
import { BoxToken } from '../../entities/BoxToken'
import stores from '../../stores/Stores'
import { observer } from 'mobx-react-lite'


interface OpenBoxCardProps {
    boxToken?: BoxToken
    isSkeleton?: boolean
    disabled?: boolean
    handleBoxOpen?(boxToken: BoxToken): void
}


const OpenBoxCard: React.FC<OpenBoxCardProps> = ({ boxToken, isSkeleton, disabled, handleBoxOpen }) => {
    const loading = boxToken ? disabled && stores.boxes.boxTokenId === boxToken.id : false
    const [shaking, setShaking] = useState<boolean>(false)

    const box = boxToken ? boxToken.box : null

    const handleOpenBox = (): void => {
        if (!handleBoxOpen || !boxToken) {
            stores.snackbars.showErrorSnackbar('No box chosen')
            return
        }

        handleBoxOpen(boxToken)
    }

    const startShaking = (): void => {
        setShaking(true)
    }

    const stopShaking = (): void => {
        setShaking(false)
    }

    return (
        <Grid
            item
            container
            spacing={3}
            mb={3}
            alignItems={'start'}
            onMouseEnter={startShaking}
            onMouseLeave={stopShaking}
        >
            {/* СЛЕВА */}
            <Grid
                item
                md={4}
                xs={12}
            >
                <Box
                    width={'100%'}
                    maxWidth={'60vw'}
                    mx={'auto'}
                    sx={{
                        cursor: 'pointer',
                    }}
                    onClick={handleOpenBox}
                >
                    {
                        isSkeleton &&
                        <Skeleton
                            width={'100%'}
                            height={250}
                            sx={{
                                transform: 'none',
                            }}
                        />
                    }
                    {
                        box &&
                        <ShakeChildren shake={shaking}>
                            <BoxImage
                                boxImagePath={AssetsPath + box.thumbnail}
                                alwaysShowBorder
                            />
                        </ShakeChildren>
                    }
                </Box>
            </Grid>

            {/* СПРАВА */}
            <Grid
                item
                md={8}
                xs={12}
            >
                <Box
                    maxWidth={'70vw'}
                    mx={'auto'}
                >
                    {/*НАЗВАНИЕ*/}
                    <Typography
                        variant={'h4'}
                    >
                        {
                            isSkeleton &&
                            <Skeleton width={200}/>
                        }
                        {
                            box?.name
                        }
                    </Typography>

                    {/* ОПИСАНИЕ */}
                    <Box mt={2}>
                        <Typography
                            variant={'body1'}
                            fontWeight={700}
                            sx={{
                                textTransform: 'uppercase',
                            }}
                        >
                            Description:
                        </Typography>
                        <Typography
                            variant={'body1'}
                            fontWeight={300}
                            py={0.25}
                        >
                            {
                                isSkeleton &&
                                <Skeleton width={120} height={64}/>
                            }
                            {
                                box?.desc
                            }
                        </Typography>
                    </Box>

                    <Grid
                        container
                        justifyContent={'space-between'}
                        alignItems={'start'}
                        mt={2}
                    >
                        {/* ДАТА ПОКУПКИ */}
                        <Grid item md={6}>
                            <Typography
                                variant={'body1'}
                                fontWeight={700}
                                sx={{
                                    textTransform: 'uppercase',
                                }}
                            >
                                Purchase date:
                            </Typography>
                            <Typography
                                variant={'body1'}
                                fontWeight={300}
                                sx={{
                                    textTransform: 'uppercase',
                                }}
                            >
                                {
                                    isSkeleton &&
                                    <Skeleton width={64}/>
                                }
                                {
                                    boxToken?.createdAt &&
                                    prettyDate(boxToken.createdAt)
                                }
                            </Typography>
                        </Grid>
                        {/* СОДЕРЖИТ */}
                        <Grid item md={6}>
                            <Typography
                                variant={'body1'}
                                fontWeight={700}
                                sx={{
                                    textTransform: 'uppercase',
                                }}
                            >
                                Contains:
                            </Typography>
                            <Typography
                                variant={'body1'}
                                fontWeight={300}
                            >
                                {
                                    isSkeleton &&
                                    <Skeleton width={32}/>
                                }
                                {
                                    box?.size
                                }
                                {' NFTs'}
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* СТРИМЕРЫ / ИГРЫ */}
                    <Grid
                        container
                        justifyContent={'space-between'}
                        alignItems={'start'}
                        mt={2}
                    >
                        <Grid item md={6}>
                            <Typography
                                variant={'body1'}
                                fontWeight={700}
                                sx={{
                                    textTransform: 'uppercase',
                                }}
                            >
                                Streamers:
                            </Typography>
                            {
                                isSkeleton &&
                                <Stack direction={'row'} spacing={1}>
                                    <Skeleton variant={'circular'} width={36} height={36}/>
                                    <Skeleton width={150}/>
                                </Stack>
                            }
                            <Box>
                                {
                                    box?.streamers?.map((streamer: Streamer) => (
                                            <StreamerWithPhoto
                                                avatarPath={streamer.avatar ?? ''}
                                                key={streamer.id}
                                                username={streamer.name}
                                            />
                                        ),
                                    )
                                }
                            </Box>
                        </Grid>
                        <Grid item md={6}>
                            <Typography
                                variant={'body1'}
                                fontWeight={700}
                                sx={{
                                    textTransform: 'uppercase',
                                }}
                            >
                                Games:
                            </Typography>
                            {
                                isSkeleton &&
                                <Skeleton width={84}/>
                            }
                            {
                                box?.games?.map((game) => (
                                        <Typography
                                            key={game.id}
                                            variant={'body1'}
                                            fontWeight={300}
                                            py={0.25}
                                        >
                                            {game.name}
                                        </Typography>
                                    ),
                                )
                            }
                        </Grid>
                    </Grid>

                    {/* КНОПКА ЖМИ */}
                    <Box
                        mt={4}
                        display={'flex'}
                        justifyContent={{ xs: 'center', md: 'start' }}
                    >
                        {
                            isSkeleton &&
                            <Skeleton width={120} height={64}/>
                        }
                        {
                            box &&
                            <LoadingButton
                                disableElevation
                                variant={'contained'}
                                loading={loading}
                                disabled={disabled}
                                onClick={handleOpenBox}
                                sx={{
                                    px: 12,
                                    py: 1,
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
                                    {loading ? ' ' : 'OPEN'}
                                </Typography>
                            </LoadingButton>
                        }
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )

}

export default observer(OpenBoxCard)