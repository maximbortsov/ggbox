import React, { FC, useCallback, useState } from 'react'
import backgroundLines from '../../assets/images/background/bgLinesAboutUs3.png'
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, Stack, Typography, useTheme } from '@mui/material'
import stores from '../../stores/Stores'
import { GGInputBase } from '../../components/GGInputBase'
import { Pages } from '../../utils/routes'
import { useNavigate } from 'react-router-dom'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'
import { Errors } from '../../utils/enums'


const NewPassword: FC = () => {

    const navigate = useNavigate()
    const theme = useTheme()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<Errors | null>(null)

    const handleClickShowPassword = useCallback(() => {
        setShowPassword((prevState) => !prevState)
    }, [])

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault()
    }

    const handleChangePassword = useCallback(() => {
        const match = stores.resetPassword.passwordRepeat === stores.resetPassword.password
        if (!match) {
            setError(Errors.PASSWORDS_DONT_MATCH)
        } else {
            navigate(Pages.AUTH)
        }
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
                RESET PASSWORD
            </Typography>
            <Stack
                direction={'column'}
                alignItems={'center'}
                mt={4}
            >
                <FormControl
                    variant={'standard'}
                    error={error !== null}
                    onFocus={resetError}
                    sx={{
                        mt: 2,
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
                        New password
                    </InputLabel>
                    <GGInputBase
                        autoFocus
                        inputMode={'text'}
                        type={showPassword ? 'text' : 'password'}
                        error={error !== null}
                        onChange={(event): void =>
                            stores.resetPassword.setPassword(event.target.value)}
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
                </FormControl>
                <FormControl
                    variant={'standard'}
                    error={error !== null}
                    onFocus={resetError}
                    sx={{
                        mt: 2,
                    }}
                >
                    <InputLabel
                        shrink
                        htmlFor={'pass-again-input'}
                        sx={{
                            fontSize: '1.5rem',
                            pl: 1,
                            '&.Mui-focused': {
                                color: 'white',
                            },
                        }}
                    >
                        Repeat new password
                    </InputLabel>
                    <GGInputBase
                        id={'pass-again-input'}
                        inputMode={'text'}
                        type={showPassword ? 'text' : 'password'}
                        error={error !== null}
                        onChange={(event): void =>
                            stores.resetPassword.setPasswordRepeat(event.target.value)}
                        onKeyDown={(event): void => {
                            if (event.code === 'Enter') {
                                handleChangePassword()
                            }
                        }}
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
                        error === Errors.PASSWORDS_DONT_MATCH &&
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
            <Button
                variant={'contained'}
                disableElevation
                onClick={handleChangePassword}
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
                    Change password
                </Typography>
            </Button>
        </Box>
    )
}

export default NewPassword
