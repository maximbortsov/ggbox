import React, { FC, useCallback } from 'react'
import { Box, Button, Container, Grid, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import styled from '@emotion/styled'
import boxPreview from '../../../assets/images/boxPreview.png'
import BoxImage from '../../../components/boxes/BoxImage'
import { useNavigate } from 'react-router-dom'
import theme from '../../../utils/theme'
import stores from '../../../stores/Stores'
import { authInBlocto } from '../../../services/flowService'


const StartButton = styled(Button)({
    borderRadius: 3,
    width: '40%',
    whiteSpace: 'nowrap',
    fontFamily: '\'Raleway\', sans-serif',
    fontWeight: 500,
    color: '#fff',
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    background: 'linear-gradient(90deg, rgba(85,74,218,1) 0%, rgba(244,64,148,1) 100%)',
    [theme.breakpoints.only('xs')]: {
        fontSize: '1rem',
        marginTop: theme.spacing(3),
        width: '100%',
    },
    [theme.breakpoints.only('sm')]: {
        fontSize: '1.125rem',
        marginTop: theme.spacing(3),
        width: '100%',
    },
    [theme.breakpoints.only('md')]: {
        fontSize: '1.375rem',
        width: '60%',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.5rem',
    },
})

const Start: FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const navigate = useNavigate()
    const theme = useTheme()

    const handleClick = useCallback(() => {
        stores.appBar.isAuthorized ?
            document
                .querySelector('#boxesSection')
                ?.scrollIntoView({ behavior: 'smooth', block: 'end' })
            :
            void authInBlocto()
    }, [navigate])

    return (
        <Container maxWidth={'lg'}>
            <Grid
                container
                sx={{
                    overflow: 'hidden',
                    width: '100%',
                    pl: 2,
                    pr: 2,
                }}
                direction={isMobile ? 'column-reverse' : 'row'}
                justifyContent={isMobile ? 'start' : 'space-between'}
                alignItems={'center'}
            >
                <Grid item xs={12} sm={6}>
                    <Grid
                        container
                        direction={'column'}
                        alignItems={'space-between'}
                        justifyContent={'center'}
                    >
                        <Grid item>
                            <Typography
                                variant={'h3'}
                                color={'white'}
                                fontFamily={'\'Russo One\', sans-serif'}
                                sx={{
                                    mt: isMobile ? 4 : 1,
                                }}
                            >
                                Collect highlights to support your favorite streamers
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            sx={{
                                [theme.breakpoints.down('md')]: {
                                    textAlign: 'center',
                                },
                            }}
                        >
                            <StartButton
                                onClick={handleClick}
                            >
                                get started
                            </StartButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={5}
                >
                    <Box
                        sx={{
                            [theme.breakpoints.only('sm')]: {
                                width: '60%',
                                mx: 'auto',
                            },
                        }}
                    >
                        <BoxImage boxImagePath={boxPreview} disableBorder/>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Start
