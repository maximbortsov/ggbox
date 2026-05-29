import React, { useCallback, useState } from 'react'
import FromPlaysToMarketplaceLink from './FromPlaysToMarketplaceLink'
import { http } from '../../../utils/http'
import { ApiSource } from '../../../utils/api'
import { plainToInstance } from 'class-transformer'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Box, Grid } from '@mui/material'
import NftCard from '../../../components/nfts/NftCard'
import { NftCardType } from '../../../utils/enums'
import GGConfirmation from '../../../components/GGConfirmation'
import stores from '../../../stores/Stores'
import { Waypoint } from 'react-waypoint'
import { observer } from 'mobx-react-lite'
import { StopSale } from '../../../cadence/transactions/market'
import * as fcl from '@onflow/fcl'
import { Nft } from '../../../entities/Nft'
import { User } from '../../../entities/User'


interface OnSaleProps {
    index: number
    value: number
}


const OnSaleTab: React.FC<OnSaleProps> = (props: OnSaleProps) => {
    const { value, index, ...other } = props

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [pickedNft, setPickedNft] = useState<Nft | null>(null)
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const queryClient = useQueryClient()

    const getOwnNfts = async (): Promise<Nft[]> => {
        const user = queryClient.getQueryData('currentUser') as User
        if (!user.id) return Promise.reject()
        return http.get(ApiSource + `nft`, {
            params: {
                take: page * 4,
                ownerID: user.id,
                include: ['lots', 'streamer'],
                preset: 'on_sale',
            },
        })
            .then((res) => res.data)
            .then((res) => plainToInstance(Nft, res as any[]))
    }

    const nfts = useQuery(['myNftLots', page], getOwnNfts, { keepPreviousData: true })

    const cancelLot = async (): Promise<void> => {
        if (!pickedNft) return
        let bloctoConfirmed = true

        const transactionId = await fcl.mutate({
            cadence: StopSale,
            proposer: fcl.currentUser,
            payer: fcl.currentUser,
            authorizations: [fcl.currentUser],
            limit: 500,
            args: (arg, t) => [
                // tokenID: UInt64, price: UFix64
                arg(pickedNft.flowID, t.UInt64),
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
        handleCloseConfirmDialog()

        fcl.tx(transactionId).onceSealed()
            .then((res) => {
                console.log(res)
                void nfts.refetch()
                stores.snackbars.showSuccessSnackbar(`Your lot will be cancelled within 5 minutes!`)
            })
            .catch((error) => {
                console.error(error.data)
                stores.snackbars.showErrorSnackbar('Something went wrong')
            })
            .finally(() => {
                setLoading(false)
            })

    }

    const cancelLotMutation = useMutation(cancelLot, {
        onSuccess: () => {
            void queryClient.invalidateQueries('myLots')
            handleCloseConfirmDialog()
        },
    })

    const handleStartMutation = useCallback(() => {
        cancelLotMutation.mutate()
        setLoading(true)
    }, [cancelLotMutation])

    const handleOpenConfirmDialog = useCallback(() => {
        setIsDialogOpen(true)
    }, [])

    const handleCloseConfirmDialog = useCallback(() => {
        setIsDialogOpen(false)
    }, [])

    const handleLoadMore = useCallback(() => {
        setPage((prevState) => prevState + 1)
    }, [])

    if (value !== index) return null

    return (
        <Box
            hidden={value !== index}
            {...other}
        >
            {
                nfts.isSuccess && nfts.data.length > 0 ?
                    <>
                        <Grid
                            container
                            justifyContent={'start'}
                            alignItems={'center'}
                            maxWidth={'100%'}
                            columns={2}
                            rowSpacing={{ xs: 6, md: 0 }}
                            columnSpacing={{ xs: 0, md: 3 }}
                        >
                            {
                                nfts.data.map((nft) =>
                                    nft &&
                                    <Grid
                                        item
                                        xs={2}
                                        md={1}
                                        key={nft.id}
                                    >
                                        <NftCard
                                            nft={nft}
                                            // TODO: испправить
                                            lotPrice={nft.lots !== undefined ? nft.lots[0].price : undefined}
                                            onClick={(): void => {
                                                setPickedNft(nft)
                                                handleOpenConfirmDialog()
                                            }}
                                            type={NftCardType.ON_SELL}
                                        />
                                    </Grid>,
                                )
                            }
                        </Grid>
                        <Waypoint onEnter={handleLoadMore}/>
                    </>
                    :
                    <FromPlaysToMarketplaceLink
                        titleText={'You haven\'t any NFT on sale'}
                        text={'You can buy NFT and sell them on marketplace.\n' +
                            'After purchase NFTs would be placed here.'}
                    />
            }
            <GGConfirmation
                open={isDialogOpen}
                title={'Confirm Cancellation'}
                message={'Are you sure you want to cancel your lot?'}
                onClose={handleCloseConfirmDialog}
                isLoading={loading}
                onConfirm={handleStartMutation}
            />
        </Box>
    )
}
export default observer(OnSaleTab)
