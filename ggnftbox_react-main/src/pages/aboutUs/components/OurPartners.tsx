import React from 'react'
import { Box, Grid, SvgIcon, Typography } from '@mui/material'
import UwimLogo from '../../../assets/images/partners/uwimLogo.svg'
import TusurLogo from '../../../assets/images/partners/tusurLogo.svg'
import FlowVerseLogo from '../../../assets/images/partners/flowVerse.svg'


const OurPartners: React.FC = () => (
    <Box mb={10} width={'100%'}>
        <Typography
            variant={'body1'}
            fontSize={'28px'}
            fontWeight={'bold'}
            textAlign={'center'}
            sx={{ mb: 7 }}
        >
            {'OUR PARTNERS\r'}
        </Typography>
        <Grid container justifyContent={'center'}>
            <Grid
                item
                xs={12}
                md={3}
                display={'flex'}
            >
                <SvgIcon
                    style={{
                        margin: 'auto',
                        height: '130px',
                        width: '122px',
                    }}
                    viewBox={'0 0 122 130'}
                    component={UwimLogo}
                />
            </Grid>
            <Grid
                item
                xs={12}
                md={4}
                display={'flex'}
            >
                <SvgIcon
                    style={{
                        margin: 'auto',
                        height: '101%',
                        width: '101%',
                    }}
                    viewBox={'0 0 414 105'}
                    component={FlowVerseLogo}
                />
            </Grid>
            <Grid
                item
                xs={12}
                md={3}
                display={'flex'}
            >
                <SvgIcon
                    style={{
                        margin: 'auto',
                        height: '126px',
                        width: '138px',
                    }}
                    viewBox={'0 0 138 126'}
                    component={TusurLogo}
                />
            </Grid>
        </Grid>
    </Box>
)

export default OurPartners
