import React, { FC, useCallback, useState } from 'react'
import backgroundLines from '../../assets/images/background/bgLinesAboutUs3.png'
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, Stack, Typography, useTheme } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import stores from '../../stores/Stores'
import { GGInputBase } from '../../components/GGInputBase'
import { Pages } from '../../utils/routes'
import { useNavigate } from 'react-router-dom'
import { Errors } from '../../utils/enums'
import SuccessfulPayment from '../../components/dialogs/SuccessfulPayment'
import { observer } from 'mobx-react-lite'
import { LoginDto } from '../../dto/LoginDto'
import { validate } from 'class-validator'
import { http } from '../../utils/http'
import { useMutation } from 'react-query'


const Auth: FC = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<Errors | null>(null)

    const navigate = useNavigate()
    const theme = useTheme()

    const handleClickShowPassword = useCallback(() => {
        setShowPassword((prevState) => !prevState)
    }, [])

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault()
    }

    const handleLoginMutation = async (loginDataDto: LoginDto) => {
        http.post(
            'auth/login',
            loginDataDto,
        )
            .then((res) => {
                console.log(res)
                if (res.data.statusCode === 401) {
                    if (res.data.message === 'Confirm your email first') {
                        stores.snackbars.showErrorSnackbar('Confirm your email first')
                        setError(Errors.NON_CONFIRMED_EMAIL)
                    } else if (res.data.message === 'Invalid credentials') {
                        stores.snackbars.showErrorSnackbar('Invalid credentials')
                        setError(Errors.WRONG_PASSWORD)
                    } else {
                        stores.snackbars.showErrorSnackbar(res.data.message)
                        console.log(res.data.message)
                    }
                } else {
                    stores.auth.signIn()
                    stores.tokenStore.updateAccessToken(res.data.accessToken)
                    stores.tokenStore.updateRefreshToken(res.data.refreshToken)
                    stores.snackbars.closeSnackbar()
                    navigate(Pages.MAIN)
                }
            })
            .catch((error) => {
                if (error.data.message === 'Invalid credentials') {
                    stores.snackbars.showErrorSnackbar('Invalid credentials')
                    setError(Errors.WRONG_PASSWORD_OR_EMAIL)
                } else if (error.data.message === 'No User found') {
                    stores.snackbars.showErrorSnackbar('User with this email not found')
                    setError(Errors.WRONG_PASSWORD_OR_EMAIL)
                }
                console.info('in catch:')
                console.error(error.data)
            })
    }

    const loginMutation = useMutation(handleLoginMutation)

    const handleSignIn = (): void => {
        stores.snackbars.showProgressSnackbar()
        const loginDataDto = new LoginDto()
        loginDataDto.email = stores.auth.email
        loginDataDto.password = stores.auth.password

        void validate(loginDataDto)
            .then(async (errors) => {
                if (errors.length > 0) {
                    for (const error of errors) {
                        if (error.constraints?.isEmail) {
                            stores.snackbars.showErrorSnackbar('Invalid email')
                            setError(Errors.INCORRECT_EMAIL)
                        } else if (error.constraints?.maxLength) {
                            stores.snackbars.showErrorSnackbar('Email is too long')
                            setError(Errors.MAX_LENGTH)
                        }
                        console.error(error.constraints)
                    }
                } else {
                    loginMutation.mutate(loginDataDto)
                }
            })
    }

    const handleSignUp = useCallback(() => {
        navigate(Pages.SIGN_UP)
    }, [navigate])

    const handleForgotPassword = useCallback(() => {
        navigate(Pages.RESET_PASSWORD)
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
                SIGN IN
            </Typography>
            <Stack
                direction={'column'}
                alignItems={'center'}
            >
                <FormControl
                    variant={'standard'}
                    error={error === Errors.INCORRECT_EMAIL || error === Errors.NON_EXISTING_EMAIL}
                    onFocus={resetError}
                    sx={{
                        mt: 1,
                    }}
                >
                    <InputLabel
                        shrink
                        htmlFor={'email-input'}
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
                        id={'email-input'}
                        autoFocus
                        error={error === Errors.INCORRECT_EMAIL || error === Errors.NON_EXISTING_EMAIL}
                        inputMode={'email'}
                        onChange={(event): void =>
                            stores.auth.updateEmail(event.target.value)}
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
                        error === Errors.NON_CONFIRMED_EMAIL &&
                        <Typography
                            variant={'body2'}
                            color={'error'}
                            align={'right'}
                        >
                            Please, confirm your email.
                        </Typography>
                    }
                    {
                        error === Errors.MAX_LENGTH &&
                        <Typography
                            variant={'body2'}
                            color={'error'}
                            align={'right'}
                        >
                            Email must be shorter than 256 characters.
                        </Typography>
                    }
                </FormControl>
                <FormControl
                    variant={'standard'}
                    error={error === Errors.WRONG_PASSWORD}
                    onFocus={resetError}
                    onKeyDown={(event): void => {
                        if (event.code === 'Enter') {
                            handleSignIn()
                        }
                    }}
                    sx={{
                        mt: 2,
                        position: 'relative',
                    }}
                >
                    <InputLabel
                        shrink
                        htmlFor={'pass-input'}
                        sx={{
                            fontSize: '1.5rem',
                            pl: 1,
                            '&.Mui-focused': {
                                color: 'white',
                            },
                        }}
                    >
                        Password
                    </InputLabel>
                    <GGInputBase
                        id={'pass-input'}
                        inputMode={'text'}
                        type={showPassword ? 'text' : 'password'}
                        error={error === Errors.WRONG_PASSWORD}
                        onChange={(event): void =>
                            stores.auth.updatePassword(event.target.value)}
                        sx={{
                            '& .MuiInputBase-input': {
                                pr: 6,
                            },
                        }}
                        endAdornment={(
                            <InputAdornment
                                position={'end'}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                }}
                            >
                                <IconButton
                                    aria-label={'toggle password visibility'}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge={'end'}
                                    sx={{ color: 'white' }}
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        )}
                    />
                    <Box
                        position={'absolute'}
                        right={0}
                        onClick={handleForgotPassword}
                    >
                        <Typography
                            variant={'body2'}
                            sx={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: '#5d53d9',
                                },
                            }}
                        >
                            Forgot password?
                        </Typography>
                    </Box>
                    {
                        error === Errors.WRONG_PASSWORD &&
                        <Typography
                            variant={'body2'}
                            color={'error'}
                            align={'right'}
                        >
                            Wrong password
                        </Typography>
                    }
                    {
                        error === Errors.WRONG_PASSWORD_OR_EMAIL &&
                        <Typography
                            variant={'body2'}
                            color={'error'}
                            align={'right'}
                        >
                            Wrong password or email
                        </Typography>
                    }
                </FormControl>
            </Stack>
            {/*<Typography*/}
            {/*    variant={'subtitle1'}*/}
            {/*    fontWeight={500}*/}
            {/*    mt={4}*/}
            {/*    sx={{ textTransform: 'uppercase' }}*/}
            {/*>*/}
            {/*    OR LOG IN WITH*/}
            {/*</Typography>*/}
            {/*<Stack*/}
            {/*    direction={'row'}*/}
            {/*    alignItems={'center'}*/}
            {/*    justifyContent={'center'}*/}
            {/*    spacing={3}*/}
            {/*>*/}
            {/*    <SocialNetworkLink icon={google} viewBox={'0 0 31 31'}/>*/}
            {/*    <SocialNetworkLink icon={discord} viewBox={'0 0 44 30'}/>*/}
            {/*    <SocialNetworkLink icon={twitch} viewBox={'0 0 30 31'}/>*/}
            {/*</Stack>*/}
            <Button
                variant={'contained'}
                disableElevation
                onClick={handleSignIn}
                sx={{
                    width: theme.breakpoints.values.sm * 0.75,
                    maxWidth: '85vw',
                    py: 2,
                    px: 4,
                    mt: 4,
                    background: '#554ADA',
                    borderRadius: 0.5,
                    ':hover': {
                        background: '#5d53d9',
                    },
                }}
            >
                <Typography
                    fontWeight={600}
                    fontSize={'1.25rem'}
                >
                    SIGN IN
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
                    New to GGNFTBOX?
                </Typography>
                <Typography
                    variant={'body2'}
                    onClick={handleSignUp}
                    sx={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        '&:hover': {
                            color: '#5d53d9',
                        },
                    }}
                >
                    Sign up
                </Typography>
            </Stack>
            <SuccessfulPayment/>
        </Box>
    )
}

export default observer(Auth)
