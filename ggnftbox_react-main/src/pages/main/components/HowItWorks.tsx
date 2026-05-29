import React, { FC, useCallback } from 'react'
import { Box, Button, Container, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import styled from '@emotion/styled'
import theme from '../../../utils/theme'
import { useNavigate } from 'react-router-dom'
import { Pages } from '../../../utils/routes'
import stores from '../../../stores/Stores'
import { authInBlocto } from '../../../services/flowService'


const HowStep: FC<{ step: number; text: string }> = ({ step, text }) => (
    <Box>
        <Typography
            color={'#080E24'}
            fontFamily={'\'Calibri\', sans-serif'}
            fontSize={'15rem'}
            fontWeight={600}
            textAlign={'center'}
            lineHeight={1}
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                paddingRight: 1,
                paddingTop: 1,
                zIndex: -1,
                textShadow: '-1px -1px 0 #554ADA, 1px -1px 0 #554ADA, -1px 1px 0 #554ADA, 1px 1px 0 #554ADA',
            }}
        >
            {step}
        </Typography>
        <Typography
            color={'#080E24'}
            fontFamily={'\'Calibri\', sans-serif'}
            fontSize={'15rem'}
            fontWeight={600}
            textAlign={'center'}
            lineHeight={1}
            style={{
                marginLeft: 16,
                marginTop: 10,
                textShadow: '-1px -1px 0 #554ADA, 1px -1px 0 #554ADA, -1px 1px 0 #554ADA, 1px 1px 0 #554ADA',
                userSelect: 'none',
            }}
        >
            {step}
        </Typography>
        <Typography
            color={'white'}
            width={'85%'}
            textAlign={'center'}
            sx={{
                marginLeft: 'auto',
                marginRight: 'auto',
            }}
        >
            {text}
        </Typography>
    </Box>
)

const ActionButton = styled(Button)(() => ({
    borderRadius: 3,
    width: '100%',
    whiteSpace: 'nowrap',
    fontFamily: '\'Raleway\', sans-serif',
    fontWeight: 500,
    color: '#fff',
    marginTop: theme.spacing(6),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    background: 'linear-gradient(90deg, rgba(85,74,218,1) 0%, rgba(244,64,148,1) 100%)',
    [theme.breakpoints.only('xs')]: {
        fontSize: '1rem',
    },
    [theme.breakpoints.only('sm')]: {
        fontSize: '1.125rem',
    },
    [theme.breakpoints.only('md')]: {
        fontSize: '1.375rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.5rem',
    },
}))

const HowItWorks: FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const navigate = useNavigate()

    const navigateToAuth = useCallback(() => {
        stores.appBar.isAuthorized ?
            navigate(Pages.BOXES)
            :
            void authInBlocto()
    }, [navigate])

    const navigateToAboutUs = useCallback(() => {
        navigate(Pages.ABOUT_US)
    }, [navigate])

    return (
        <Container maxWidth={'lg'} sx={{ marginTop: isMobile ? '20%' : '5%' }}>
            <Grid container direction={'row'} justifyContent={'space-between'}>
                <Grid item>
                    <Typography
                        variant={'h4'}
                        color={'white'}
                        fontFamily={'\'Russo One\', sans-serif'}
                    >
                        How it works
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant={'h6'}
                        color={'white'}
                        fontFamily={'\'Russo One\', sans-serif'}
                        onClick={navigateToAboutUs}
                        sx={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                    >
                        Learn more
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container
                direction={'row'}
                sx={{
                    overflow: 'hidden',
                    width: '100%',
                    pl: 2,
                    pr: 2,
                }}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ position: 'relative' }}
                >
                    <HowStep step={1} text={'Buy NFT BOX'}/>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ position: 'relative' }}
                >
                    <HowStep step={2} text={'Open your NFT BOX and get moments'}/>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ position: 'relative' }}
                >
                    <HowStep step={3} text={'Trade your moments on MARKETPLACE and support streamers'}/>
                </Grid>
            </Grid>
            <ActionButton
                onClick={navigateToAuth}
            >
                {
                    isMobile
                        ? 'Open your NFT BOX'
                        : 'Open your NFT BOX and get unique moments'
                }
            </ActionButton>
        </Container>
    )
}

export default HowItWorks
