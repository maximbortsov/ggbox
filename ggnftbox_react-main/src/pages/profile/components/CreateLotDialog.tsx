import { observer } from 'mobx-react-lite'
import { Box, Dialog, Divider, Grid, IconButton, InputLabel, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import NftPriceSet from '../../../components/nfts/NftPriceSet'
import { Nft } from '../../../entities/Nft'
import { useMutation, useQueryClient } from 'react-query'
import { LoadingButton } from '@mui/lab'
import { CreateStartSaleFusd } from '../../../cadence/transactions/market'
import stores from '../../../stores/Stores'
import * as fcl from '@onflow/fcl'
import { ReadBeneficiaryFee, ReadBuyerFee, ReadEditionRoyalty, ReadSellerFee } from '../../../cadence/scripts/fee'


interface NFTtoSaleProps {
    open: boolean
    nft: Nft
    onClose(): void
}


const CreateLotDialog: React.FC<NFTtoSaleProps> = ({ open, nft, onClose }) => {

    const [price, setPrice] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [streamerFee, setStreamerFee] = useState<number>(0)
    const [beneficiaryFee, setBeneficiaryFee] = useState<number>(0)
    const [buyerFee, setBuyerFee] = useState<number>(0)
    const [sellerFee, setSellerFee] = useState<number>(0)
    const [totalIncome, setTotalIncome] = useState<number>(0)

    const queryClient = useQueryClient()

    const handleClose = () => {
        onClose()
        setPrice(1)
    }

    // получение комиссий
    useEffect(() => {
        // streamer fee
        fcl.query({
            cadence: ReadEditionRoyalty,
            args: (arg, t) => [
                arg(nft.flowEditionID, t.UInt64),
            ],
        }).then((res): void => {
            const fee = Object.values(res).reduce((previousValue: string, currentValue: string): number =>
                parseFloat(previousValue) + parseFloat(currentValue))
            setStreamerFee(parseFloat(fee as string))
        })

        // our fee
        fcl.query({
            cadence: ReadBeneficiaryFee,
        }).then((res) => {
            setBeneficiaryFee(parseFloat(res))
        })

        // seller fee
        fcl.query({
            cadence: ReadSellerFee,
        }).then((res) => setSellerFee(parseFloat(res)))

        // buyer fee
        fcl.query({
            cadence: ReadBuyerFee,
        }).then((res) => setBuyerFee(parseFloat(res)))
    }, [])

    // создние лота
    const handleCreateLot = async (): Promise<void> => {

        setLoading(true)
        let bloctoConfirmed = true

        const transactionId = await fcl.mutate({
            cadence: CreateStartSaleFusd,
            proposer: fcl.currentUser,
            payer: fcl.currentUser,
            authorizations: [fcl.currentUser],
            limit: 500,
            args: (arg, t) => [
                // tokenID: UInt64, price: UFix64
                arg(nft.flowID, t.UInt64),
                arg(totalIncome.toFixed(8), t.UFix64),
            ],
        })
            .catch((e) => {
                console.log(e)
                bloctoConfirmed = false
            })

        if (!bloctoConfirmed) {
            setLoading(false)
            return
        }

        stores.snackbars.showProgressSnackbar('Waiting for the transaction to be sealed')
        handleClose()

        fcl.tx(transactionId).onceSealed()
            .then((res) => {
                console.log(res)
                stores.snackbars.showSuccessSnackbar('Your nft will be placed in marketplace within 5 minutes!')
                setLoading(false)
            })
            .catch((error) => {
                console.error(error)
                stores.snackbars.showErrorSnackbar('Something went wrong')
                setLoading(false)
            })
    }

    // финальная сумма
    useEffect(() => {
        const comission = streamerFee + beneficiaryFee + buyerFee + sellerFee
        setTotalIncome(price / (1 + comission))
    }, [beneficiaryFee, buyerFee, price, sellerFee, streamerFee])

    const createLotMutation = useMutation(handleCreateLot, {
        onSuccess: () => {
            void queryClient.invalidateQueries('myNfts')
            void queryClient.invalidateQueries('myLots')
        },
    })

    const handleStartMutation = useCallback(() => {
        createLotMutation.mutate()
        setLoading(true)
    }, [createLotMutation])

    return (
        <Dialog
            open={open}
            maxWidth={'sm'}
            fullWidth
            scroll={'paper'}
            onClose={handleClose}
            sx={{
                zIndex: (theme): number => theme.zIndex.drawer + 1,
                '& .MuiDialog-paper': {
                    borderRadius: 4,
                    background: 'transparent',
                },
            }}
        >
            <Box
                sx={{
                    maxHeight: '80vh',
                    p: 4,
                    overflowY: 'scroll',
                    overflowX: 'hidden',
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
                        onClick={handleClose}
                        size={'large'}
                    >
                        <CloseIcon sx={{ color: 'white' }}/>
                    </IconButton>
                </Box>

                <Typography
                    variant={'h5'}
                    fontWeight={600}
                    fontFamily={'"Montserrat", sans-serif'}
                >
                    Put NFT up to sale
                </Typography>
                <Grid
                    container
                    direction={'row'}
                    columns={2}
                    spacing={2}
                    mt={0.5}
                >
                    <Grid
                        item
                        xs={2}
                        md={1}
                    >
                        <InputLabel
                            shrink
                            sx={{
                                fontSize: '1.3rem',
                                '&.Mui-focused': {
                                    color: 'white',
                                },
                            }}
                        >
                            Set price in FUSD:
                        </InputLabel>
                        <NftPriceSet price={price} setPrice={setPrice}/>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        md={1}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <InputLabel
                            shrink
                            sx={{
                                fontSize: '1.3rem',
                                '&.Mui-focused': {
                                    color: 'white',
                                },
                            }}
                        >
                            You will get:
                        </InputLabel>
                        <Box
                            sx={{
                                px: 3,
                                background: '#554ADA',
                                borderRadius: 1,
                                fontFamily: '"Raleway", sans-serif',
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                fontSize={22}
                                fontWeight={500}
                                sx={{
                                    px: 1,
                                }}
                            >
                                {`${totalIncome.toFixed(3)} FUSD`}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Box
                    textAlign={'right'}
                    sx={{
                        '.Mui-Typography': {
                            textAlign: 'right',
                        },
                    }}
                >
                    <Typography
                        variant={'body2'}
                        color={'#d0d0d0'}
                        mt={2}
                    >
                        {`Streamer reward (${((totalIncome * streamerFee) / price * 100).toFixed(1)}%): `}
                        {`${(totalIncome * streamerFee).toFixed(2)} FUSD`}
                    </Typography>
                    <Typography
                        variant={'body2'}
                        color={'#d6d6d6'}
                    >
                        {`Platform fee (${((totalIncome * (beneficiaryFee + sellerFee)) / price * 100).toFixed(1)}%): `}
                        {`${(totalIncome * (beneficiaryFee + sellerFee)).toFixed(2)} FUSD`}
                    </Typography>
                    {/*<Typography*/}
                    {/*    variant={'body2'}*/}
                    {/*    color={'#dbdbdb'}*/}
                    {/*>*/}
                    {/*    {`Seller fee (${(sellerFee * 100).toFixed(1)}%): ${(totalIncome * sellerFee).toFixed(2)} FUSD`}*/}
                    {/*</Typography>*/}
                    {/*<Typography*/}
                    {/*    variant={'body2'}*/}
                    {/*    color={'#ccc'}*/}
                    {/*>*/}
                    {/*    {`Buyer fee (${(buyerFee * 100).toFixed(1)}%): ${(totalIncome * buyerFee).toFixed(2)} FUSD`}*/}
                    {/*</Typography>*/}
                    <Divider sx={{ borderColor: '#fff', width: '50%', my: 0.5, ml: '50%' }}/>
                    <Typography
                        variant={'body1'}
                        color={'#fff'}
                    >
                        {`Total (${((1 - (totalIncome / price)) * 100).toFixed(1)}%): `}
                        {`${(price - totalIncome).toFixed(2)} FUSD`}
                    </Typography>
                </Box>
                <LoadingButton
                    disableElevation
                    variant={'contained'}
                    loading={loading}
                    onClick={handleStartMutation}
                    sx={{
                        px: 6,
                        py: 1,
                        mt: 2,
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
                    <Typography variant={'h5'} fontWeight={600} fontFamily={'\'Montserrat\', sans-serif'}>
                        {loading ? ' ' : 'APPROVE'}
                    </Typography>
                </LoadingButton>
            </Box>
        </Dialog>
    )
}

export default observer(CreateLotDialog)