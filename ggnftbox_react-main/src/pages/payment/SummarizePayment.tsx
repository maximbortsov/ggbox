import React, { FC, useCallback } from 'react'
import backgroundLines from '../../assets/images/background/bgLinesAboutUs3.png'
import { Button, Stack, Typography, useTheme } from '@mui/material'
import { Pages } from '../../utils/routes'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'


const SummarizePayment: FC = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    const [searchParams] = useSearchParams()
    const isSuccessful = searchParams.get('success') === 'true'

    const handleProceed = useCallback(() => {
        if (isSuccessful) {
            navigate(Pages.PURCHASED_BOXES)
        } else {
            //TODO [10.06.2022]: Repeat purchase
            navigate(Pages.MAIN)
        }
    }, [isSuccessful])

    return (

        <Stack
            overflow={'hidden'}
            textAlign={'center'}
            spacing={4}
            alignItems={'center'}
            sx={{
                backgroundImage: `url(${backgroundLines as string})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                mt: 4,
            }}
        >

            <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={2}
            >

                {
                    isSuccessful ?
                        <CheckCircleOutlineIcon
                            fontSize={'large'}
                            sx={{
                                height: 48,
                                width: 48,
                                color: '#55AE6E',
                            }}
                        />
                        :
                        <CancelOutlinedIcon
                            fontSize={'large'}
                            sx={{
                                height: 48,
                                width: 48,
                                color: '#F44242',
                            }}
                        />
                }

                <Typography variant={'h4'}>
                    {isSuccessful ? 'Successful Payment' : 'Payment Failed'}
                </Typography>
            </Stack>

            <Typography
                variant={'h6'}
                fontFamily={'\'Montserrat\', sans-serif'}
                sx={{
                    maxWidth: '85vw',
                }}
            >
                {
                    isSuccessful ?
                        'Your payment has been completed successfully'
                        :
                        'Payment was unsuccessful'
                }
            </Typography>

            <Button
                variant={'contained'}
                disableElevation
                onClick={handleProceed}
                sx={{
                    width: theme.breakpoints.values.sm * 0.75,
                    maxWidth: '85vw',
                    py: 2,
                    px: 4,
                    mt: 2,
                    background: '#554ADA',
                    borderRadius: 0.5,
                    '&:hover': {
                        background: '#5d53d9',
                    },
                    '&.Mui-disabled': {
                        background: '#36344b',
                    },
                }}
            >
                <Typography
                    fontWeight={600}
                    fontSize={'1.25rem'}
                >
                    {isSuccessful ? 'Continue' : 'Try again'}
                </Typography>
            </Button>
        </Stack>
    )
}

export default SummarizePayment
