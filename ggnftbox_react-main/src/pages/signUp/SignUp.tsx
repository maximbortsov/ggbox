import React, { FC, useCallback, useState } from 'react'
import backgroundLines from '../../assets/images/background/bgLinesAboutUs3.png'
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    Stack,
    Typography,
    useTheme,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import stores from '../../stores/Stores'
import { GGInputBase } from '../../components/GGInputBase'
import { Pages } from '../../utils/routes'
import { useNavigate } from 'react-router-dom'
import { Errors } from '../../utils/enums'
import { RegisterDataDto } from '../../dto/RegisterDataDto'
import { validate } from 'class-validator'
import { http } from '../../utils/http'
import { LoginDto } from '../../dto/LoginDto'
import { useMutation } from 'react-query'


const SignUp: FC = () => {

    const navigate = useNavigate()
    const theme = useTheme()
    const [checked, setChecked] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [emailError, setEmailError] = useState<Errors | null>(null)
    const [loginError, setLoginError] = useState<Errors | null>(null)
    const [passwordError, setPasswordError] = useState<Errors | null>(null)
    const [termsError, setTermsError] = useState<Errors | null>(null)

    const handleClickShowPassword = useCallback(() => {
        setShowPassword((prevState) => !prevState)
    }, [])

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault()
    }

    const handleSignIn = useCallback(() => {
        navigate(Pages.AUTH)
    }, [navigate])

    const resetLoginError = useCallback(() => {
        setLoginError(null)
    }, [])

    const resetEmailError = useCallback(() => {
        setEmailError(null)
    }, [])

    const resetPasswordError = useCallback(() => {
        setPasswordError(null)
    }, [])

    const resetTermsError = useCallback(() => {
        setTermsError(null)
    }, [])

    const handleLoginMutation = async (loginDataDto: LoginDto) => {
        http.post(
            'auth/login',
            loginDataDto,
        )
            .then((res) => {
                console.log(res)
                stores.auth.signIn()
                stores.tokenStore.updateAccessToken(res.data.accessToken)
                stores.tokenStore.updateRefreshToken(res.data.refreshToken)
                navigate(Pages.VERIFY_EMAIL, { state: { email: stores.signUp.email } })
            })
            .catch((error) => {
                console.error(error.data)
                stores.snackbars.showErrorSnackbar(error.data.message)
            })
    }

    const loginMutation = useMutation(handleLoginMutation)

    const handleRegisterMutation = async (registerDataDto: RegisterDataDto): Promise<void> => {
        const formData = new FormData()
        formData.append('data', JSON.stringify(registerDataDto))
        formData.append('file', '')
        http.post(
            'auth/register',
            formData,
        )
            .then((res) => {
                const loginDto = new LoginDto()
                loginDto.email = stores.signUp.email
                loginDto.password = stores.signUp.password
                loginMutation.mutate(loginDto)
                stores.snackbars.closeSnackbar()
            })
            .catch((error) => {
                if (error.data.message === 'Username is already taken') {
                    setLoginError(Errors.LOGIN_ALREADY_EXIST)
                } else if (error.data.message === 'Email is already taken') {
                    setEmailError(Errors.EMAIL_ALREADY_EXIST)
                }
                console.error(error.data)
                stores.snackbars.showErrorSnackbar(error.data.message)
            })
    }

    const registerMutation = useMutation(handleRegisterMutation)

    const handleSignUp = (): void => {

        // Check passwords
        if (stores.signUp.password !== stores.signUp.repeatPassword) {
            setPasswordError(Errors.PASSWORDS_DONT_MATCH)
            stores.snackbars.showErrorSnackbar(`Passwords don't match`)
            return
        } else {
            setPasswordError(null)
        }

        // Check terms
        if (!checked) {
            setTermsError(Errors.TERMS_DONT_EXIST)
            stores.snackbars.showErrorSnackbar('Please, agree with Terms of Service and Privacy policy')
            return
        } else {
            setTermsError(null)
        }

        const registerDataDto = new RegisterDataDto()
        registerDataDto.email = stores.signUp.email
        registerDataDto.username = stores.signUp.login
        registerDataDto.password = stores.signUp.password

        stores.snackbars.showProgressSnackbar()
        void validate(registerDataDto)
            .then(async (errors) => {
                    if (errors.length > 0) {
                        console.log(errors)
                        for (const error of errors) {
                            if (error.constraints?.isEmail) {
                                setEmailError(Errors.INCORRECT_EMAIL)
                                stores.snackbars.showErrorSnackbar('Invalid email')
                                return
                            } else if (error.constraints?.maxLength) {
                                stores.snackbars.showErrorSnackbar('Email is too long')
                                setEmailError(Errors.MAX_LENGTH)
                            } else if (error.constraints?.minLength) {
                                stores.snackbars.showErrorSnackbar('Password must be longer than 8 characters')
                                setPasswordError(Errors.WEAK_PASSWORD)
                            }
                            console.error(error.constraints)
                        }
                    } else {
                        registerMutation.mutate(registerDataDto)
                    }
                },
            )

    }

    const handleTermsCheck = useCallback(() => {
        setChecked((prevState) => !prevState)
        resetTermsError()
    }, [resetTermsError])

    return (
        <Stack
            direction={'column'}
            alignItems={'center'}
            sx={{
                mt: -6,
                pb: 6,
                overflow: 'hidden',
                backgroundImage: `url(${backgroundLines as string})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                [theme.breakpoints.down('md')]: {
                    mt: 2,
                },
            }}
        >
            <Typography variant={'h3'}>
                SIGN UP
            </Typography>
            <Stack
                direction={'column'}
                alignItems={'center'}
            >
                <FormControl
                    variant={'standard'}
                    error={loginError !== null}
                    onFocus={resetLoginError}
                    sx={{
                        mt: 1,
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
                        Login
                    </InputLabel>
                    <GGInputBase
                        autoFocus
                        inputMode={'text'}
                        error={loginError !== null}
                        onChange={(event): void =>
                            stores.signUp.updateLogin(event.target.value)}
                    />
                    {
                        loginError === Errors.LOGIN_ALREADY_EXIST &&
                        <Typography
                            variant={'body1'}
                            color={'error'}
                            align={'right'}
                        >
                            This login already taken
                        </Typography>
                    }
                </FormControl>
                <FormControl
                    variant={'standard'}
                    error={emailError !== null}
                    onFocus={resetEmailError}
                    sx={{
                        mt: 2,
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
                        inputMode={'email'}
                        error={emailError !== null}
                        onChange={(event): void =>
                            stores.signUp.updateEmail(event.target.value)}
                    />
                    {
                        emailError === Errors.INCORRECT_EMAIL &&
                        <Typography
                            variant={'body1'}
                            color={'error'}
                            align={'right'}
                        >
                            Incorrect email
                        </Typography>
                    }
                    {
                        emailError === Errors.EMAIL_ALREADY_EXIST &&
                        <Typography
                            variant={'body1'}
                            color={'error'}
                            align={'right'}
                        >
                            This email already taken
                        </Typography>
                    }
                </FormControl>
                <FormControl
                    variant={'standard'}
                    error={passwordError !== null}
                    onFocus={resetPasswordError}
                    sx={{
                        mt: 2,
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
                        Password
                    </InputLabel>
                    <GGInputBase
                        inputMode={'text'}
                        type={showPassword ? 'text' : 'password'}
                        error={passwordError !== null}
                        onChange={(event): void =>
                            stores.signUp.updatePassword(event.target.value)}
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
                    {
                        passwordError === Errors.WEAK_PASSWORD &&
                        <Typography
                            variant={'body1'}
                            color={'error'}
                            align={'right'}
                        >
                            Weak password
                        </Typography>
                    }
                </FormControl>
                <FormControl
                    variant={'standard'}
                    error={passwordError !== null}
                    onFocus={resetPasswordError}
                    onKeyDown={(event): void => {
                        if (event.code === 'Enter') {
                            handleSignUp()
                        }
                    }}
                    sx={{
                        mt: 2,
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
                        Repeat password
                    </InputLabel>
                    <GGInputBase
                        inputMode={'text'}
                        type={showPassword ? 'text' : 'password'}
                        error={passwordError !== null}
                        onChange={(event): void =>
                            stores.signUp.updateRepeatPassword(event.target.value)}
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
                    {
                        passwordError === Errors.PASSWORDS_DONT_MATCH &&
                        <Typography
                            variant={'body1'}
                            color={'error'}
                            align={'right'}
                        >
                            Passwords don&apos;t match
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
            {/*    OR SIGN UP WITH*/}
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
            <Box
                sx={{
                    width: theme.breakpoints.values.sm * 0.75,
                    maxWidth: '85vw',
                }}
            >
                <FormControlLabel
                    label={(
                        <Typography>
                            I agree the Terms of
                            {' '}
                            <Link
                                variant={'body2'}
                                target={'_blank'}
                                href={Pages.TERMS_OF_SERVICE}
                                sx={{
                                    fontSize: 'inherit',
                                    color: '#5AACE6',
                                }}
                            >
                                Service and Privacy Policy
                            </Link>
                        </Typography>
                    )}
                    checked={checked}
                    onChange={handleTermsCheck}
                    control={(
                        <Checkbox
                            sx={{
                                color: termsError === Errors.TERMS_DONT_EXIST ? 'red' : 'white',
                                '&.Mui-checked': {
                                    color: 'white',
                                },
                            }}
                        />
                    )}
                    sx={{ mt: 2 }}
                />
            </Box>
            <Button
                variant={'contained'}
                disableElevation
                onClick={handleSignUp}
                sx={{
                    width: theme.breakpoints.values.sm * 0.75,
                    maxWidth: '85vw',
                    py: 2,
                    px: 4,
                    mt: 2,
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
                    SIGN UP
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
        </Stack>
    )
}

export default SignUp
