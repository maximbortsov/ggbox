import React, { FC, useCallback, useState } from 'react'
import { Box, Container, Dialog, Grid, IconButton, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { GGBox } from '../../entities/GGBox'
import BoxImage from './BoxImage'
import BoxCurrencyPick from './BoxCurrencyPick'
import { GGChip } from '../GGChip'
import { ApiSource, AssetsPath } from '../../utils/api'
import CloseIcon from '@mui/icons-material/Close'
import { plainToInstance } from 'class-transformer'
import { useQuery, useQueryClient } from 'react-query'
import { prettyDate } from '../../utils/date'
import { StreamerWithPhoto } from '../StreamerWithPhoto'
import { Streamer } from '../../entities/Streamer'
import { LoadingButton } from '@mui/lab'
import { http } from '../../utils/http'
import stores from '../../stores/Stores'
import GGConfirmation from '../GGConfirmation'
import { useNavigate } from 'react-router-dom'
import { authInBlocto, checkFlowAccount, isAuthorizedInBlocto, isGgAccountSetUp } from '../../services/flowService'


interface BoxDialogProps {
    boxId: string
    open: boolean
    onClose(): void
}


const BoxDialog: FC<BoxDialogProps> = ({ boxId, open, onClose }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [isBuyingConfirmShown, setIsBuyingConfirmShown] = useState<boolean>(false)
    const [isAccountSetUpConfirm, setIsAccountSetUpConfirm] = useState<boolean>(false)

    const queryClient = useQueryClient()
    const theme = useTheme()
    const navigate = useNavigate()

    // получение бокса
    const fetchBoxById = async (): Promise<GGBox | null> => http
        .get(ApiSource + 'box/' + boxId, { params: { include: ['streamers', 'games', 'tags'] } })
        .then((res) => {
            console.log(res.data)
            if (res.data.inStock == 0) {
                stores.snackbars.showWarningSnackbar('This box doesn\'t contain NFTs')
            }
            return plainToInstance(GGBox, res.data)
        })
        .catch((error) => {
            console.log(error.data.message)
            stores.snackbars.showErrorSnackbar(error.data.message)
            onClose()
            return null
        })

    const box = useQuery('box-' + boxId, fetchBoxById)

    const handleBuyBox = async (): Promise<void> => {
        setLoading(true)

        const payeerLink = await http.post(ApiSource + `buy/box/${boxId}`)

        // navigate
        if (payeerLink.data?.link) {
            window.open(payeerLink.data.link, '_self')
            void queryClient.invalidateQueries('currentUser')
        } else {
            stores.snackbars.showErrorSnackbar('Something went wrong.')
        }

        setLoading(false)
        handleCloseBuyingConfirmDialog()
    }

    const handleSetupGgAccount = async (): Promise<void> => {
        setLoading(true)
        await checkFlowAccount()
        handleCloseAccountSetUpConfirmDialog()
        setLoading(false)
    }

    const handleBuyButtonClick = async (): Promise<void> => {
        // авторизован ли юзер
        if (!stores.appBar.isAuthorized) {
            stores.snackbars.showErrorSnackbar('Unauthorized')
            await authInBlocto()
        } else {
            // авторизован ли в блокто
            if (await isAuthorizedInBlocto()) {
                // настроен ли его аккаунт
                if (!(await isGgAccountSetUp())) {
                    setIsAccountSetUpConfirm(true)
                } else {
                    setIsBuyingConfirmShown(true)
                }
            } else {
                stores.snackbars.showErrorSnackbar('Connect your wallet!')
            }
        }
    }

    const handleCloseBuyingConfirmDialog = useCallback(() => {
        setIsBuyingConfirmShown(false)
    }, [])

    const handleCloseAccountSetUpConfirmDialog = useCallback(() => {
        setIsAccountSetUpConfirm(false)
    }, [])

    return (
        <>
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
                        maxHeight: '80vh',
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        pt: 6,
                        pb: 4,
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
                        <Grid
                            item
                            md={6}
                            sx={{ width: '100%', height: '100%' }}
                        >
                            <Box
                                pl={8}
                                pr={2}
                                sx={{
                                    [theme.breakpoints.only('md')]: {
                                        pl: 4,
                                    },
                                }}
                            >
                                <Typography
                                    variant={'h4'}
                                >
                                    {
                                        box.isLoading &&
                                        <Skeleton width={200}/>
                                    }
                                    {
                                        box.isSuccess &&
                                        box.data?.name
                                    }
                                </Typography>
                                <Typography
                                    variant={'subtitle1'}
                                    sx={{
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {'Total: '}
                                    {
                                        box.isLoading &&
                                        <Skeleton sx={{ display: 'inline', width: 80 }}/>
                                    }
                                    {
                                        box.isSuccess &&
                                        box.data?.total
                                    }
                                </Typography>
                                <Box width={'80%'} py={4} mx={'auto'}>
                                    {
                                        box.isLoading &&
                                        <Skeleton
                                            width={'100%'}
                                            height={250}
                                            sx={{
                                                transform: 'none',
                                            }}
                                        />
                                    }
                                    {
                                        box.isSuccess &&
                                        <Box
                                            sx={{
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <BoxImage
                                                boxImagePath={AssetsPath + box.data?.thumbnail}
                                                alwaysShowBorder
                                                isSoldOut={box.data?.inStock == 0}
                                            />
                                        </Box>
                                    }
                                </Box>
                            </Box>
                        </Grid>
                        {/* СПРАВА */}
                        <Grid item md={6} sx={{ height: '100%' }}>
                            <Box
                                pr={8}
                                pl={2}
                                sx={{
                                    [theme.breakpoints.only('md')]: {
                                        pr: 4,
                                    },
                                }}
                            >
                                {/* ТЭГИ */}
                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    mt={1}
                                    spacing={2}
                                >
                                    {
                                        box.isLoading &&
                                        <>
                                            <Skeleton width={80} height={36}/>
                                            <Skeleton width={80} height={36}/>
                                            <Skeleton width={80} height={36}/>
                                        </>
                                    }
                                    {
                                        box.isSuccess &&
                                        box.data?.tags?.map((tag) =>
                                            <GGChip key={tag.id} tag={tag.name}/>,
                                        )
                                    }
                                </Stack>
                                {/* СТАРТ ПРОДАЖ / В СОСТАВЕ */}
                                <Grid
                                    container
                                    justifyContent={'space-between'}
                                    alignItems={'start'}
                                    mt={4}
                                >
                                    <Grid item md={6}>
                                        <Typography
                                            variant={'body1'}
                                            fontWeight={700}
                                            sx={{
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Start of sales:
                                        </Typography>
                                        <Typography
                                            variant={'body1'}
                                            fontWeight={300}
                                            sx={{
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {
                                                box.isLoading &&
                                                <Skeleton width={64}/>
                                            }
                                            {
                                                box.isSuccess &&
                                                box.data?.startSaleAt &&
                                                prettyDate(box.data.startSaleAt)
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography
                                            variant={'body1'}
                                            fontWeight={700}
                                            sx={{
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Contain:
                                        </Typography>
                                        <Typography
                                            variant={'body1'}
                                            fontWeight={300}
                                        >
                                            {
                                                box.isLoading &&
                                                <Skeleton width={32}/>
                                            }
                                            {
                                                box.isSuccess &&
                                                box.data?.size
                                            }
                                            {' plays'}
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
                                            box.isLoading &&
                                            <Stack direction={'row'} spacing={1}>
                                                <Skeleton variant={'circular'} width={36} height={36}/>
                                                <Skeleton width={150}/>
                                            </Stack>
                                        }
                                        <Box>
                                            {
                                                box.isSuccess && box.data?.streamers &&
                                                box.data.streamers.map((streamer: Streamer) => (
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
                                            box.isLoading &&
                                            <Skeleton width={84}/>
                                        }
                                        {
                                            box.isSuccess && box.data?.games &&
                                            box.data.games.map((game) => (
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
                                            box.isLoading &&
                                            <Skeleton width={120} height={64}/>
                                        }
                                        {
                                            box.isSuccess &&
                                            box.data?.desc
                                        }
                                    </Typography>
                                </Box>

                                {/* КНОПКА ЖМИ */}
                                <Box mt={4}>
                                    <Stack
                                        direction={'row'}
                                        alignItems={'center'}
                                        justifyContent={'start'}
                                        spacing={3}
                                    >
                                        <Box width={'50%'}>
                                            <BoxCurrencyPick cost={box.data?.price ?? -1}/>
                                        </Box>
                                        <LoadingButton
                                            disableElevation
                                            variant={'contained'}
                                            loading={loading}
                                            onClick={(): void => void handleBuyButtonClick()}
                                            disabled={box.data?.inStock == 0}
                                            sx={{
                                                px: 6,
                                                py: 2,
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
                                                {loading ? ' ' : 'BUY'}
                                            </Typography>
                                        </LoadingButton>
                                    </Stack>
                                    <Typography
                                        variant={'body2'}
                                        align={'left'}
                                        mt={1}
                                    >
                                        *Pay with debit or credit card through Payeer
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Dialog>
            {
                isBuyingConfirmShown &&
                <GGConfirmation
                    open={isBuyingConfirmShown}
                    title={'Box Purchase'}
                    message={'You are about to purchase a box. Do you want to proceed?'}
                    onClose={handleCloseBuyingConfirmDialog}
                    onConfirm={(): void => void handleBuyBox()}
                    isLoading={loading}
                />
            }
            {
                isAccountSetUpConfirm &&
                <GGConfirmation
                    open={isAccountSetUpConfirm}
                    title={'Account configuration'}
                    message={'We need to configure your Flow account to store GG NFT. Do you want to proceed?'}
                    onClose={handleCloseAccountSetUpConfirmDialog}
                    onConfirm={(): void => void handleSetupGgAccount()}
                    isLoading={loading}
                />
            }
        </>
    )
}

export default BoxDialog