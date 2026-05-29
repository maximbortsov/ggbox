import React, { useCallback, useEffect } from 'react'
import { Box, Container, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import stores from '../../../stores/Stores'
import backgroundLines3 from '../../../assets/images/background/bgLines3.png'
import BoxCard from '../../../components/boxes/BoxCard'
import BoxDrawer from '../../../components/boxes/BoxDrawer'
import BoxDialog from '../../../components/boxes/BoxDialog'
import { observer } from 'mobx-react-lite'
import { ApiSource } from '../../../utils/api'
import { useQuery } from 'react-query'
import { plainToInstance } from 'class-transformer'
import { GGBox } from '../../../entities/GGBox'
import BoxesSkeletons from '../../../components/boxes/BoxesSkeletons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Pages } from '../../../utils/routes'
import { http } from '../../../utils/http'


const BoxesSection: React.FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const boxId = searchParams.get('box')

    const handleOpenBox = (box: GGBox): void => {
        stores.main.openBoxInfo(box.id)
        setSearchParams({ box: box.id }, {
            state: {
                ignoreScrolling: true,
            },
        })
    }

    const closeBoxInfo = useCallback(() => {
        stores.main.closeBoxInfo()
        setSearchParams('', {
            state: {
                ignoreScrolling: true,
            },
        })
    }, [])

    const navigateToBoxesMarketplace = useCallback(() => {
        navigate(Pages.BOXES)
    }, [navigate])

    const fetchBoxesPopular = async (): Promise<GGBox[]> => http
        .get(ApiSource + 'box', { params: { include: ['streamers', 'games'], take: 3 } })
        .then((res) => res.data)
        .then((res) => plainToInstance(GGBox, res as any[]))

    const boxes = useQuery('boxesPopular', fetchBoxesPopular)

    useEffect(() => {
        if (boxId) {
            stores.main.openBoxInfo(boxId)
        }
    }, [boxId])

    return (
        <>
            <Box
                id={'boxesSection'}
                mb={10}
                pb={4}
                position={'relative'}
            >
                <img
                    src={backgroundLines3}
                    alt={'bg'}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '170vh',
                        overflowX: 'hidden',
                        overflowY: 'visible',
                        objectFit: 'cover',
                        zIndex: -1,
                    }}
                />
                <Container maxWidth={'lg'} sx={{ mt: 16 }}>
                    <Box position={'relative'}>
                        <Typography
                            variant={'h4'}
                            color={'white'}
                            fontFamily={'\'Russo One\', sans-serif'}
                        >
                            NFT BOX
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
                                onClick={navigateToBoxesMarketplace}
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
                                boxes.isLoading &&
                                <BoxesSkeletons/>
                            }
                            {
                                boxes.isSuccess &&
                                boxes.data.map((box: GGBox, index) => (
                                    <Grid
                                        item
                                        xs={3}
                                        md={1}
                                        key={box.id}
                                    >
                                        <BoxCard
                                            box={box}
                                            onClick={(): void => handleOpenBox(box)}
                                        />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                </Container>
            </Box>
            {
                stores.main.isBoxInfoOpen && isMobile &&
                <BoxDrawer
                    open={stores.main.isBoxInfoOpen}
                    boxId={stores.main.pickedBoxId}
                    onClose={closeBoxInfo}
                />
            }
            {
                stores.main.isBoxInfoOpen && !isMobile &&
                <BoxDialog
                    open={stores.main.isBoxInfoOpen}
                    boxId={stores.main.pickedBoxId}
                    onClose={closeBoxInfo}
                />
            }
        </>
    )
}

export default observer(BoxesSection)
