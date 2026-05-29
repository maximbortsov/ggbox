import React, { useCallback, useState } from 'react'
import { Container, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import { http } from '../../utils/http'
import { ApiSource } from '../../utils/api'
import { useQuery, useQueryClient } from 'react-query'
import FromPlaysToMarketplaceLink from '../profile/components/FromPlaysToMarketplaceLink'
import { GGBox } from '../../entities/GGBox'
import OpenBox from '../../components/boxes/OpenBox'
import { Nft } from '../../entities/Nft'
import { plainToInstance } from 'class-transformer'
import stores from '../../stores/Stores'
import OpenBoxCard from '../../components/boxes/OpenBoxCard'
import { BoxToken } from '../../entities/BoxToken'
import { observer } from 'mobx-react-lite'


const MyBoxes: React.FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const [nfts, setNfts] = useState<Nft[]>([])
    const [box, setBox] = useState<GGBox | null>(null)
    const [disabled, setDisabled] = useState<boolean>(false)

    const queryClient = useQueryClient()

    // const mockBoxTokens = [
    // {
    //     id: '1',
    //     boxId: 'b16d74f7-4311-40f3-8836-d42f5b59376f',
    //     createdAt: new Date(),
    //     box: {
    //         'id': 'b16d74f7-4311-40f3-8836-d42f5b59376f',
    //         'name': 'NFT BOX from poli_di_',
    //         'size': 3,
    //         'total': 10,
    //         'inStock': 10,
    //         'price': 1,
    //         'desc': 'Best @poli_di_ gaming moments ',
    //         'startSaleAt': new Date(),
    //         'endSaleAt': new Date(),
    //         'thumbnail': 'boxes/thumbnails/b16d74f7-4311-40f3-8836-d42f5b59376f.png',
    //         'openVideo': 'boxes/open-videos/b16d74f7-4311-40f3-8836-d42f5b59376f.mp4',
    //         'openMobileVideo': 'boxes/open-mobile-videos/b16d74f7-4311-40f3-8836-d42f5b59376f.mp4',
    //         'games': [],
    //         'streamers': [],
    //     },
    // },
    // {
    //     id: '2',
    //     boxId: 'a63a8b99-4642-41a4-9a6e-5c750e62137d',
    //     createdAt: new Date(),
    //     box: {
    //         'id': 'a63a8b99-4642-41a4-9a6e-5c750e62137d',
    //         'name': 'NFT BOX from Nauhgty',
    //         'size': 3,
    //         'total': 10,
    //         'inStock': 0,
    //         'price': 0.5,
    //         'desc': 'Best twitch moments of Naughty',
    //         'startSaleAt': new Date(),
    //         'endSaleAt': new Date(),
    //         'thumbnail': 'boxes/thumbnails/a63a8b99-4642-41a4-9a6e-5c750e62137d.png',
    //         'openVideo': 'boxes/open-videos/a63a8b99-4642-41a4-9a6e-5c750e62137d.mp4',
    //         'openMobileVideo': 'boxes/open-mobile-videos/a63a8b99-4642-41a4-9a6e-5c750e62137d.mp4',
    //         'games': [],
    //         'streamers': [],
    //     },
    // },
    // ] as BoxToken[]

    const fetchBoxTokens = async (): Promise<BoxToken[]> => http
        .get(ApiSource + 'box-token', {
            params: {
                include: ['box', 'streamers', 'games'],
                open: false,
            },
        })
        .then((res) => res.data)
        .then((res) => plainToInstance(BoxToken, res as any []))
        // TODO: delete
        // .then((res) => mockBoxTokens)
        .catch((error) => {
            console.log(error.data)
            return []
        })

    const boxTokens = useQuery('purchasedBoxTokens', fetchBoxTokens)

    const handleBoxOpen = (boxToken: BoxToken): void => {
        stores.snackbars.showProgressSnackbar()
        stores.boxes.setBoxTokenId(boxToken.id)
        setDisabled(true)
        http
            .post(ApiSource + `box-token/open/${boxToken.id}`)
            .then((res) => plainToInstance(Nft, res.data as any []))
            .then((res) => {
                stores.snackbars.showSuccessSnackbar('Opening!')
                setNfts(res)
                setBox(boxToken.box)
                void queryClient.invalidateQueries('purchasedBoxTokens')
            })
            .catch((err) => {
                console.error(err.data)
                stores.snackbars.showErrorSnackbar('Something went wrong')
                stores.snackbars.showErrorSnackbar(err.data.message)
            })
            .finally(() => {
                setDisabled(false)
                stores.boxes.removeBoxTokenId()
            })
        // void new Promise(() => {
        //     setTimeout(() => {
        //         setBox(boxToken.box)
        //         stores.snackbars.showSuccessSnackbar('Successful testing!')
        //         stores.boxes.removeBoxTokenId()
        //         setDisabled(false)
        //     }, 3000)
        // })
    }

    // const boxOpenMutation = useMutation(handleBoxOpen)

    const handleCloseOpenVideo = useCallback(() => {
        setBox(null)
    }, [])

    return (
        <Container
            maxWidth={'lg'}
        >
            <Typography
                variant={'h4'}
                color={'white'}
                mb={isMobile ? 2 : 6}
                fontFamily={'\'Russo One\', sans-serif'}
            >
                Purchased NFT Boxes
            </Typography>
            <Grid
                container
                direction={'column'}
                rowSpacing={10}
            >
                {
                    boxTokens.isLoading &&
                    <OpenBoxCard isSkeleton/>
                }
                {
                    boxTokens.isSuccess && boxTokens.data.length > 0 ?
                        boxTokens.data.map((boxToken) => (
                                <OpenBoxCard
                                    key={boxToken.id}
                                    boxToken={boxToken}
                                    disabled={disabled}
                                    handleBoxOpen={handleBoxOpen}
                                />
                            ),
                        )
                        :
                        <FromPlaysToMarketplaceLink
                            titleText={'You haven\'t any boxes ready to open'}
                            text={'You can buy boxes under the NFTBOX tab.\n' +
                                'After purchasing, boxes will be displayed here.'}
                        />
                }
                {
                    box &&
                    <OpenBox
                        box={box}
                        nfts={nfts}
                        handleClose={handleCloseOpenVideo}
                    />
                }
            </Grid>
        </Container>
    )
}

export default observer(MyBoxes)