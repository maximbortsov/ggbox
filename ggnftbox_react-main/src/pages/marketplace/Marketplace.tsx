import React, { FC, useCallback, useRef } from 'react'
import { Box, Button, Container, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import stores from '../../stores/Stores'
import { observer } from 'mobx-react-lite'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import Filters from '../../components/marketplaces/Filters'
import FiltersMobile from '../../components/marketplaces/FilterMobile'
import Search from '../../components/marketplaces/Search'
import PlaysList from './components/PlaysList'
import { useOutsideClickAlerter } from '../../utils/useOutsideClickAlerter'


const Marketplace: FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    const openOrCloseFilterMenu = useCallback(() => {
        stores.marketplace.openOrCloseFilterMenu()
    }, [])

    const filterRef = useRef(null)
    useOutsideClickAlerter(filterRef, stores.marketplace.closeFilterMenu)

    return (
        <Container maxWidth={'lg'}>
            <Typography
                variant={'h4'}
                color={'white'}
                mt={isMobile ? 0 : -2}
                fontFamily={'\'Russo One\', sans-serif'}
            >
                Moments
            </Typography>
            <Grid container mt={2} alignItems={'center'}>
                <Grid item xs={12} md={6}>
                    <Search store={stores.marketplace}/>
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
                        {/* TODO: uncomment */}
                        {/*<SortBy sortedStore={stores.marketplace}/>*/}
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
                        <Box ref={filterRef}>
                            <Filters
                                sx={{
                                    position: 'absolute',
                                    top: 50,
                                    right: 600 * 0.75,
                                }}
                                store={stores.marketplace}
                            />
                        </Box>
                    }
                </Grid>
                {
                    isMobile &&
                    <FiltersMobile store={stores.marketplace}/>
                }
            </Grid>

            {/*  MOMENTS FINALLY  */}
            <Box mt={4}>
                <PlaysList/>
            </Box>
        </Container>
    )
}

export default observer(Marketplace)
