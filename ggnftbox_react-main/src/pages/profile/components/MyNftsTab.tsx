import React, { useCallback, useState } from 'react'
import FromPlaysToMarketplaceLink from './FromPlaysToMarketplaceLink'
import { http } from '../../../utils/http'
import { ApiSource } from '../../../utils/api'
import { plainToInstance } from 'class-transformer'
import { useQuery, useQueryClient } from 'react-query'
import BoxesSkeletons from '../../../components/boxes/BoxesSkeletons'
import { Box, Grid } from '@mui/material'
import { Nft } from '../../../entities/Nft'
import NftCard from '../../../components/nfts/NftCard'
import { NftCardType } from '../../../utils/enums'
import CreateLotDialog from './CreateLotDialog'
import { Waypoint } from 'react-waypoint'
import { observer } from 'mobx-react-lite'
import { User } from '../../../entities/User'


interface MyNftsProps {
    index: number
    value: number
}


const MyNftsTab: React.FC<MyNftsProps> = (props: MyNftsProps) => {
    const { value, index, ...other } = props

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [pickedNft, setPickedNft] = useState<Nft | null>(null)
    const [page, setPage] = useState<number>(1)
    const queryClient = useQueryClient()
    const user = queryClient.getQueryData('currentUser') as User

    const getOwnNfts = async (): Promise<Nft[]> => {
        const user = queryClient.getQueryData('currentUser') as User
        if (!user.id) return Promise.reject()
        return http.get(ApiSource + `nft`, {
            params: {
                take: page * 4,
                ownerID: user.id,
                include: ['streamer'],
                preset: 'not_on_sale',
            },
        })
            .then((res) => res.data)
            .then((res) => plainToInstance(Nft, res as any[]))
    }

    const myNfts = useQuery(['myNfts', page], getOwnNfts, { keepPreviousData: true })

    const handleOpenDialog = useCallback(() => {
        setIsDialogOpen(true)
    }, [])

    const handleCloseDialog = useCallback(() => {
        setIsDialogOpen(false)
    }, [])

    const handleLoadMore = useCallback(() => {
        setPage((prevState) => prevState + 1)
    }, [])

    if (value !== index) return null

    return (
        <Box
            {...other}
        >
            {
                myNfts.isLoading &&
                <Grid
                    container
                    columns={2}
                    rowSpacing={{ xs: 6, md: 0 }}
                    columnSpacing={{ xs: 0, md: 3 }}
                >
                    <BoxesSkeletons/>
                    <BoxesSkeletons/>
                </Grid>
            }
            {
                myNfts.isSuccess && myNfts.data.length > 0 ?
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
                                myNfts.data.map((nft) => (
                                    <Grid
                                        item
                                        xs={2}
                                        md={1}
                                        key={nft.id}
                                        onClick={(): void => {
                                            setPickedNft(nft)
                                        }}
                                    >
                                        <NftCard
                                            nft={nft}
                                            onClick={(): void => {
                                                setPickedNft(nft)
                                                handleOpenDialog()
                                            }}
                                            type={NftCardType.HOLD}
                                            isAdmin={user.roles.includes('admin') || user.roles.includes('moderator')}
                                        />
                                    </Grid>
                                ))
                            }
                        </Grid>
                        <Waypoint onEnter={handleLoadMore}/>
                    </>
                    :
                    <FromPlaysToMarketplaceLink
                        titleText={'You haven\'t any Moments for sale'}
                        text={'You can buy Moments and start collecting.\n' +
                            'After purchase Moments would be placed here.'}
                    />
            }
            {
                pickedNft &&
                <CreateLotDialog
                    open={isDialogOpen}
                    nft={pickedNft}
                    onClose={handleCloseDialog}
                />
            }
        </Box>
    )
}
export default observer(MyNftsTab)
