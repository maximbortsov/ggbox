import React, { FC, useState } from 'react'
import { Box, Button, Dialog, MobileStepper, SvgIcon, Typography, useTheme } from '@mui/material'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import blocto from '../../../assets/icons/companiesLogos/blocto.svg'
import stores from '../../../stores/Stores'


const GuideDialog: FC<{ open: boolean; closeDialog(): void }> = ({ open, closeDialog }) => {
    const [activeStep, setActiveStep] = useState<number>(0)
    const theme = useTheme()

    const handleNext = (): void => {
        if (activeStep === 3) {
            closeDialog()
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
        }
    }

    const handleBack = (): void => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    return (
        <Dialog
            open={open}
            sx={{
                zIndex: (theme): number => theme.zIndex.drawer + 1,
                '& .MuiDialog-paper': {
                    borderRadius: 4,
                    background: '#15204A',
                    p: 2,
                    textAlign: 'center',
                },
            }}
        >
            <GuideStep step={activeStep}/>
            <MobileStepper
                steps={4}
                variant={'dots'}
                activeStep={activeStep}
                nextButton={(
                    <Button
                        size={'small'}
                        onClick={handleNext}
                        disabled={activeStep === 4}
                        sx={{
                            color: 'white',
                            '&.Mui-disabled': {
                                color: 'rgba(255,255,255,0.3)',
                            },
                        }}
                    >
                        {activeStep === 3 ? 'Finish' : `Next`}
                        <KeyboardArrowRight/>
                    </Button>
                )}
                backButton={(
                    <Button
                        size={'small'}
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        sx={{
                            color: 'white',
                            '&.Mui-disabled': {
                                color: 'rgba(255,255,255,0.3)',
                            },
                        }}
                    >
                        <KeyboardArrowLeft/>
                        Back
                    </Button>
                )}
                sx={{
                    position: 'relative',
                    background: 'transparent',
                    '.MuiMobileStepper-dots .MuiMobileStepper-dot': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                    },
                    '.MuiMobileStepper-dots .MuiMobileStepper-dotActive': {
                        backgroundColor: '#5d53d9',
                    },
                }}
            />
        </Dialog>
    )
}

const GuideStep: FC<{ step: number }> = ({ step }) => {
    switch (step) {
        case 0: {
            return (
                <Box>
                    <Typography variant={'h4'}>
                        Hello on GGNFTBOX!
                    </Typography>
                    <Typography variant={'subtitle1'} mt={2}>
                        To start working with GG NFT you have to do the following steps.
                    </Typography>

                    <Typography variant={'body1'} mt={1}>
                        Connect your Blocto wallet by pressing this button in your profile:
                    </Typography>
                    <Button
                        variant={'contained'}
                        disableElevation
                        onClick={(): void => {
                            stores.snackbars.showSuccessSnackbar('Yes, this way!')
                        }}
                        sx={{
                            background: '#554ADA',
                            borderRadius: 1,
                            mx: 'auto',
                            mt: 2,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            fontFamily: '"Raleway", sans-serif',
                            ':hover': {
                                background: '#5d53d9',
                            },
                        }}
                    >
                        <SvgIcon component={blocto}/>
                        <Typography variant={'body2'} fontWeight={'bold'}>
                            CONNECT BLOCTO
                        </Typography>
                    </Button>
                </Box>
            )
        }
        case 1: {
            return (
                <Box>
                    <Typography variant={'subtitle1'}>
                        GGNFTBOX is working on the Testnet now, so to top up your account you have to:
                    </Typography>
                    <Typography variant={'body1'} mt={1}>
                        1) Go to profile
                    </Typography>
                    <Typography variant={'body1'}>
                        2) Copy you wallet address
                    </Typography>
                    <Typography variant={'body1'} my={0.5}>
                        3) Press the
                        <Button
                            variant={'contained'}
                            disableElevation
                            sx={{
                                background: '#554ADA',
                                borderRadius: 1,
                                mx: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                fontFamily: '"Raleway", sans-serif',
                                ':hover': {
                                    background: '#5d53d9',
                                },
                            }}
                        >
                            <Typography variant={'body2'} fontWeight={'bold'}>
                                Top up testnet FUSD
                            </Typography>
                        </Button>
                        button
                    </Typography>
                    <Typography variant={'body1'}>
                        4) Fund your account with FUSD
                    </Typography>
                </Box>
            )
        }
        case 2: {
            return (
                <Box>
                    <Typography variant={'body1'}>
                        To get and store GG NFT, we need to configure your Flow account
                    </Typography>
                    <Typography variant={'body1'} mt={1}>
                        {`You can do it manually in profile, or we'll do it for you before you seal any transaction`}
                    </Typography>
                </Box>
            )
        }
        case 3: {
            return (
                <Box>
                    <Typography variant={'body1'}>
                        To buy boxes we use third party service
                    </Typography>
                    <Typography
                        variant={'subtitle1'}
                        my={1}
                        onClick={(): void => {
                            window.open('https://payeer.com/auth/?register=yes', '_blank')
                        }}
                        sx={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        Payeer.com
                    </Typography>
                    <Typography variant={'body1'} mt={1}>
                        You have to create account and fund it via you credit or debit card. We recommend to do it before box purchase.
                    </Typography>
                </Box>
            )
        }
    }

    return <Box/>
}

export default GuideDialog