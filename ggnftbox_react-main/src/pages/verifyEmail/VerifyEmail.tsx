import React, { FC, useCallback } from 'react'
import backgroundLines from '../../assets/images/background/bgLinesAboutUs3.png'
import { Button, Stack, Typography, useTheme } from '@mui/material'
import { Pages } from '../../utils/routes'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { ApiSource } from '../../utils/api'
import { http } from '../../utils/http'
import stores from '../../stores/Stores'
import { useMutation, useQueryClient } from 'react-query'
import { User } from '../../entities/User'


const VerifyEmail: FC = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    const [searchParams] = useSearchParams()
    const isVerified = searchParams.get('success') === 'true'
    const isFailed = searchParams.get('success') === 'false'
    const queryClient = useQueryClient()

    const titleText = (): string => {
        if (isVerified) return 'Successful Verification'
        if (isFailed) return 'Verification Failed'
        return 'Email Confirmation'
    }

    const messageText = (): string => {
        if (isVerified) return 'The email address for your account has been successfully verified'
        if (isFailed) return 'Error occurred in verification of your email address'
        return 'Please, check your email for the confirmation link to complete registration'
    }

    const buttonText = (): string => {
        if (isVerified) return 'Continue'
        if (isFailed) return 'Try again'
        return 'Send again'
    }

    const resendConfirmationLink = async (): Promise<void> => {
        const query = queryClient.getQueryState('currentUser')
        const email = query?.status == 'success' ? (query.data as User).email : null
        console.log(email)
        stores.snackbars.showProgressSnackbar()
        if (email) {
            void http
                .get(ApiSource + 'email-confirmation/resend-confirmation-link' + `?email=${email}`)
                .then(() => {
                    stores.snackbars.showInfoSnackbar(`Confirmation link has been sent to ${email}`)
                })
                .catch((error) => {
                    console.error(error.data)
                    stores.snackbars.showErrorSnackbar('Something went wrong')
                })
        } else {
            stores.snackbars.showErrorSnackbar('Email not defined')
        }
    }

    const emailResendLinkMutation = useMutation(resendConfirmationLink)

    const handleProceed = useCallback(() => {
        if (isVerified) {
            navigate(Pages.MAIN)
        } else {
            emailResendLinkMutation.mutate()
        }
    }, [isVerified, navigate])

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
                    isVerified &&
                    <CheckCircleOutlineIcon
                        fontSize={'large'}
                        sx={{
                            height: 48,
                            width: 48,
                            color: '#55AE6E',
                        }}
                    />
                }
                {
                    isFailed &&
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
                    {titleText()}
                </Typography>
            </Stack>

            <Typography
                variant={'h6'}
                fontFamily={'\'Montserrat\', sans-serif'}
                sx={{
                    maxWidth: '85vw',
                }}
            >
                {messageText()}
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
                    {buttonText()}
                </Typography>
            </Button>
        </Stack>
    )
}

export default VerifyEmail
