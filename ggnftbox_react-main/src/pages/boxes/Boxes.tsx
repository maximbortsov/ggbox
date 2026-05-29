import React, { FC, useCallback } from 'react'
import { Box, Button, Container, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import Search from '../../components/marketplaces/Search'
import SortBy from '../../components/marketplaces/SortBy'
import stores from '../../stores/Stores'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import Filters from '../../components/marketplaces/Filters'
import FiltersMobile from '../../components/marketplaces/FilterMobile'
import BoxesList from './components/BoxesList'
import { observer } from 'mobx-react-lite'


const Boxes: FC = () => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    const openOrCloseFilterMenu = useCallback(() => {
        stores.boxes.openOrCloseFilterMenu()
    }, [])

    return (
        <Container maxWidth={'lg'}>
            <Typography
                variant={'h4'}
                color={'white'}
                mt={isMobile ? 0 : -2}
                fontFamily={'\'Russo One\', sans-serif'}
            >
                NFT Boxes
            </Typography>
            <Grid container mt={2} alignItems={'center'}>
                <Grid item xs={12} md={6}>
                    <Search store={stores.boxes}/>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    mt={isMobile ? 2 : 0}
                    sx={{ position: 'relative' }}
                >
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        justifyContent={isMobile ? 'space-between' : 'end'}
                    >
                        <SortBy sortedStore={stores.boxes}/>
                        <Button
                            variant={'outlined'}
                            onClick={openOrCloseFilterMenu}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                borderRadius: 0.25,
                                px: 3,
                                py: 0.9375, //сука не трогать!! вымерено по пикселям
                                ml: isMobile ? 0 : 4,
                                fontSize: 16,
                                textTransform: 'none',
                                fontFamily: '"Raleway", sans-serif',
                                ':hover': {
                                    borderColor: '#d5d4d4',
                                },
                            }}
                            startIcon={<FilterAltOutlinedIcon sx={{ color: 'white' }}/>}
                        >
                            Filter
                        </Button>
                    </Stack>
                    {
                        !isMobile &&
                        <Filters
                            sx={{
                                position: 'absolute',
                                top: 50,
                                right: 600 * 0.75,
                            }}
                            store={stores.boxes}
                        />
                    }
                </Grid>
                {
                    isMobile &&
                    <FiltersMobile store={stores.boxes}/>
                }
            </Grid>

            {/*  BOXES FINALLY  */}
            <Box mt={4}>
                <BoxesList/>
            </Box>
        </Container>
    )
}

export default observer(Boxes)
