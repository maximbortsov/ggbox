import React from 'react'
import { Box, Grid, SvgIcon, Typography } from '@mui/material'
import ideaLamp from '../../../assets/icons/ideaLamp.svg'
import safeShield from '../../../assets/icons/safeShield.svg'
import microArchitecture from '../../../assets/icons/microArchitecture.svg'


const Advantages: React.FC = () => (
    <Box mb={10}>
        <Typography
            variant={'body1'}
            fontSize={'28px'}
            fontWeight={'bold'}
            textAlign={'center'}
            mb={7}
        >
            {'POWERED BY THE BEST TECH, GGNFTBOX BASED ON THE FLOW BLOCKCHAIN\r'}
        </Typography>
        <Grid container justifyContent={'space-between'}>
            <Grid
                item
                xs={12}
                md={3}
                position={'relative'}
                boxSizing={'border-box'}
                border={'1px solid #554ADA'}
                direction={'column'}
                alignItems={'center'}
            >
                <Box
                    display={'flex'}
                    height={'60px'}
                    width={'60px'}
                    ml={0.5}
                    mt={0.5}
                    mb={2}
                >
                    <SvgIcon
                        style={{
                            margin: 'auto',
                            height: '50px',
                            width: '35px',
                        }}
                        viewBox={'0 0 35 50'}
                        component={ideaLamp}
                    />
                </Box>
                <Typography
                    variant={'body2'}
                    mx={2}
                    mb={5}
                >
                    {'Moments placed on GGNFTBOX are NFTs that ensure the uniqueness of digital collectibles\r'}
                </Typography>
            </Grid>
            <Grid
                item
                xs={12}
                md={3}
                position={'relative'}
                boxSizing={'border-box'}
                border={'1px solid #554ADA'}
                direction={'column'}
                alignItems={'center'}
            >
                <Box
                    display={'flex'}
                    height={'60px'}
                    width={'60px'}
                    ml={0.5}
                    mt={0.5}
                    mb={2}
                >
                    <SvgIcon
                        style={{
                            margin: 'auto',
                            height: '55px',
                            width: '45px',
                        }}
                        viewBox={'0 0 45 55'}
                        component={safeShield}
                    />
                </Box>

                <Typography
                    variant={'body2'}
                    mx={2}
                    mb={5}
                >
                    {'All GGNFTBOX transactions and operations is secured by own smart contract\r'}
                </Typography>
            </Grid>
            <Grid
                item
                xs={12}
                md={3}
                position={'relative'}
                boxSizing={'border-box'}
                border={'1px solid #554ADA'}
                direction={'column'}
                alignItems={'center'}
            >
                <Box
                    display={'flex'}
                    height={'60px'}
                    width={'60px'}
                    ml={0.5}
                    mt={0.5}
                    mb={2}
                >
                    <SvgIcon
                        style={{
                            margin: 'auto',
                            height: '45px',
                            width: '50px',
                        }}
                        viewBox={'0 0 50 45'}
                        component={microArchitecture}
                    />
                </Box>
                <Typography
                    variant={'body2'}
                    mx={2}
                    mb={5}
                >
                    {'GGNFTBOX are the new bridge between streamers and their fandom\r'}
                </Typography>
            </Grid>
        </Grid>
    </Box>
)

export default Advantages
