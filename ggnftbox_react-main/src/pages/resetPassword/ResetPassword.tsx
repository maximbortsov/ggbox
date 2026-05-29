import React, { FC, useCallback, useState } from 'react'
import backgroundLines from '../../assets/images/background/bgLinesAboutUs3.png'
import { Box, Button, FormControl, InputLabel, Stack, Typography, useTheme } from '@mui/material'
import stores from '../../stores/Stores'
import { GGInputBase } from '../../components/GGInputBase'
import { Pages } from '../../utils/routes'
import { useNavigate } from 'react-router-dom'
import { Errors } from '../../utils/enums'


const ResetPassword: FC = () => {

    const navigate = useNavigate()
    const theme = useTheme()
    const [error, setError] = useState<Errors | null>(null)
    const [sent, setSent] = useState(false)

    const handleReset = useCallback(() => {
        const isEmail = stores.resetPassword.email
            .toLowerCase()
            .match(
                // eslint-disable-next-line max-len
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            )
        if (!isEmail) {
            setError(Errors.INCORRECT_EMAIL)
        } else {
            // if (smth) {
            //     // if email doesnt exist
            //     setError(Errors.NON_EXISTING_EMAIL)
            // }
            setError(null)
            setSent(true)
        }

        console.log('link sent')
    }, [])

    const handleSignIn = useCallback(() => {
        navigate(Pages.AUTH)
    }, [navigate])

    const resetError = useCallback(() => {
        setError(null)
    }, [])

    return (
        <Box
            overflow={'hidden'}
            textAlign={'center'}
            sx={{
                backgroundImage: `url(${backgroundLines as string})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                [theme.breakpoints.down('md')]: {
                    mt: 4,
                },
            }}
        >
            <Typography variant={'h3'}>
                FORGOT PASSWORD
            </Typography>
            <Stack
                direction={'column'}
                alignItems={'center'}
            >
                <Typography variant={'body2'}>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Enter your email address and we'll send you recover link
                </Typography>
                <FormControl
                    variant={'standard'}
                    error={error !== null}
                    onKeyDown={(event): void => {
                        if (event.code === 'Enter') {
                            handleReset()
                        }
                    }}
                    sx={{
                        mt: 6,
                    }}
                >
                    <InputLabel
                        shrink
                        sx={{
                            fontSize: '1.5rem',
                            pl: 1,
                            '&.Mui-focused': {
                                color: 'white',
                            },
                        }}
                    >
                        Email
                    </InputLabel>
                    <GGInputBase
                        autoFocus
                        inputMode={'email'}
                        error={error !== null}
                        onChange={(event): void => {
                            stores.resetPassword.setEmail(event.target.value)
                        }}
                        onFocus={resetError}
                    />
                    {
                        error === Errors.INCORRECT_EMAIL &&
                        <Typography
                            variant={'body1'}
                            color={'error'}
                            align={'right'}
                        >
                            Incorrect email
                        </Typography>
                    }
                    {
                        error === Errors.NON_EXISTING_EMAIL &&
                        <Typography
                            variant={'body2'}
                            color={'error'}
                            align={'right'}
                        >
                            This email does not have an existing account
                        </Typography>
                    }
                    {
                        sent &&
                        <Typography
                            variant={'body1'}
                            mt={2}
                        >
                            {'A password reset link has been sent to '}
                            {stores.resetPassword.email}
                        </Typography>
                    }
                </FormControl>
            </Stack>
            <Button
                variant={'contained'}
                disableElevation
                disabled={sent}
                onClick={handleReset}
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
                    Remind me
                </Typography>
            </Button>
            <Stack
                direction={'row'}
                spacing={1}
                justifyContent={'center'}
                mt={1}
                mb={4}
            >
                <Typography variant={'body2'}>
                    Already have an account?
                </Typography>
                <Typography
                    variant={'body2'}
                    onClick={handleSignIn}
                    sx={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        '&:hover': {
                            color: '#5d53d9',
                        },
                    }}
                >
                    Sign in
                </Typography>
            </Stack>
        </Box>
    )
}

export default ResetPassword
