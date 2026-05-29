import React, { FC, useCallback } from 'react'
import { Box, Container, Grid, Link, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import telegram from '../assets/icons/companiesLogos/telegram.svg'
import discord from '../assets/icons/companiesLogos/discord.svg'
import { SocialNetworkLink } from './SocialNetworkLink'
import { Pages } from '../utils/routes'


const GGFooter: FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    const handleClickOnDiscord = useCallback(() => {
        window.open('https://discord.gg/jS6YCD5ndy')
    }, [])

    return (
        <Box
            component={'footer'}
            py={4}
            sx={{
                background: 'linear-gradient(0, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%)',
                boxShadow: '0px -5px 40px 15px rgba(48, 27, 116, 0.32);',
            }}
        >
            <Container maxWidth={'lg'}>
                <Grid
                    container
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <Grid item xs={12} md={4}>
                        <Link variant={'body2'} href={'mailto:ggnftbox@yandex.ru'} sx={{ color: '#5AACE6' }}>
                            Contact with us
                            <br/>
                            <br/>
                        </Link>
                        <Typography
                            variant={'caption'}
                            align={'center'}
                            color={'white'}
                            gutterBottom
                        >
                            © 2022 GGNFTBOX. All rights reserved
                            <br/>
                            The site can be used only by persons over 18
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                        my={1}
                    >
                        <Stack direction={'row'} alignItems={'center'} justifyContent={isMobile ? 'start' : 'center'}>
                            {/*<SocialNetworkLink icon={inst} viewBox={'0 0 44 40'}/>*/}
                            <SocialNetworkLink
                                icon={discord}
                                viewBox={'0 0 44 30'}
                                onClick={handleClickOnDiscord}
                            />
                            {/*<SocialNetworkLink icon={twitter} viewBox={'0 0 44 44'}/>*/}
                            <SocialNetworkLink icon={telegram} viewBox={'4 0 44 44'}/>
                        </Stack>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                        textAlign={isMobile ? 'start' : 'center'}
                    >
                        <Link variant={'body2'} href={Pages.TERMS_OF_SERVICE} sx={{ color: '#5AACE6' }}>
                            Terms of use
                        </Link>
                        <br/>
                        <Link variant={'body2'} href={Pages.TERMS_OF_SERVICE} sx={{ color: '#5AACE6' }}>
                            Privacy Policy
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default GGFooter
