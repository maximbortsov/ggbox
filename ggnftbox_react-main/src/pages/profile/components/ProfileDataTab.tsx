import React, { ChangeEvent, createRef, useCallback, useEffect, useState } from 'react'
import { Button, FormControl, Grid, InputAdornment, InputLabel, Stack, SvgIcon, Theme, Typography, useMediaQuery } from '@mui/material'
import { GGInputBase } from '../../../components/GGInputBase'
import stores from '../../../stores/Stores'
import EditIcon from '@mui/icons-material/Edit'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { updateUserData } from '../../../services/userService'
import { observer } from 'mobx-react-lite'


interface ProfileDataProps {
    index: number
    value: number
}


const ProfileDataTab: React.FC<ProfileDataProps> = (props: ProfileDataProps) => {
    const { value, index, ...other } = props
    const [username, setUsername] = useState<string>(stores.profile.username)
    const [isUsernameEditable, setIsUsernameEditable] = useState<boolean>(false)
    const usernameLabelRef = createRef<HTMLLabelElement>()
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    useEffect(() => {
        setUsername(stores.profile.username)
    }, [stores.profile.username])

    const handleChangeUsername = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.currentTarget.value)
        stores.profile.updateUsername(event.currentTarget.value)
    }, [])

    const handleEditUsername = useCallback(() => {
        setIsUsernameEditable(!isUsernameEditable)
    }, [isUsernameEditable])

    // const handleEnterCurrentPassword = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    //     stores.profile.updateCurrentPassword(event.target.value)
    // }, [])
    //
    // const handleEnterNewPassword = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    //     stores.profile.updateNewPassword(event.target.value)
    // }, [])
    //
    // const handleEnterRepeatNewPassword = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    //     stores.profile.updateRepeatNewPassword(event.target.value)
    // }, [])

    useEffect(() => {
        usernameLabelRef.current?.click()
    }, [isUsernameEditable, usernameLabelRef])

    const handleSaveChangesClick = useCallback((): void => {
        // if (stores.profile.newPassword) {
        //     if (stores.profile.newPassword !== stores.profile.repeatNewPassword) {
        //         stores.snackbars.showErrorSnackbar(`Passwords don't match`)
        //         return
        //     } else {
        //         updateUserData(username, stores.profile.newPassword)
        // }
        // } else {
        updateUserData(username)
        // }
    }, [username])

    return (
        <div
            hidden={value !== index}
            {...other}
        >
            {
                value === index && (
                    <Grid
                        container
                    >
                        <Grid
                            item
                            container
                            flexDirection={'column'}
                            xs={12}
                            md={6}
                            alignItems={isMobile ? 'center' : 'start'}
                        >

                            <FormControl
                                variant={'standard'}
                                sx={{
                                    mt: 2,
                                    '& .MuiInputBase-root': {
                                        mb: 2,
                                    },
                                    position: 'relative',
                                }}
                            >
                                <InputLabel
                                    shrink
                                    ref={usernameLabelRef}
                                    htmlFor={'username-input'}
                                    sx={{
                                        fontSize: '1.5rem',
                                        pl: 1,
                                        '&.Mui-focused': {
                                            color: 'white',
                                        },
                                    }}
                                >
                                    Username
                                </InputLabel>
                                <GGInputBase
                                    id={'username-input'}
                                    autoFocus
                                    disabled={!isUsernameEditable}
                                    value={username}
                                    inputMode={'text'}
                                    onChange={handleChangeUsername}
                                    endAdornment={(
                                        <InputAdornment
                                            position={'end'}
                                            sx={{
                                                position: 'absolute',
                                                right: 16,
                                            }}
                                        >
                                            <SvgIcon
                                                onClick={handleEditUsername}
                                                component={isUsernameEditable ? EditIcon : EditOutlinedIcon}
                                                sx={{
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </InputAdornment>
                                    )}
                                />

                            </FormControl>

                            {/*<Stack*/}
                            {/*    my={2}*/}
                            {/*    sx={{*/}
                            {/*        width: (theme) => theme.breakpoints.values.sm * 0.75,*/}
                            {/*        maxWidth: '85vw',*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <Typography mt={4}>*/}
                            {/*        CHANGE PASSWORD*/}
                            {/*    </Typography>*/}
                            {/*</Stack>*/}

                            {/*<FormControl*/}
                            {/*    variant={'standard'}*/}
                            {/*    sx={{*/}
                            {/*        '& .MuiInputBase-root': {*/}
                            {/*            mb: 4,*/}
                            {/*        },*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <InputLabel*/}
                            {/*        shrink*/}
                            {/*        htmlFor={'currentPassword-input'}*/}
                            {/*        sx={{*/}
                            {/*            fontSize: '1.5rem',*/}
                            {/*            pl: 1,*/}
                            {/*            '&.Mui-focused': {*/}
                            {/*                color: 'white',*/}
                            {/*            },*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        Current password*/}
                            {/*    </InputLabel>*/}
                            {/*    <GGInputBase*/}
                            {/*        id={'currentPassword-input'}*/}
                            {/*        type={'password'}*/}
                            {/*        onChange={handleEnterCurrentPassword}*/}
                            {/*    />*/}
                            {/*</FormControl>*/}

                            {/* Новый пароль !*/}
                            {/*<FormControl*/}
                            {/*    variant={'standard'}*/}
                            {/*    sx={{*/}
                            {/*        '& .MuiInputBase-root': {*/}
                            {/*            mb: 4,*/}
                            {/*        },*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <InputLabel*/}
                            {/*        shrink*/}
                            {/*        htmlFor={'newPassword-input'}*/}
                            {/*        sx={{*/}
                            {/*            fontSize: '1.5rem',*/}
                            {/*            pl: 1,*/}
                            {/*            '&.Mui-focused': {*/}
                            {/*                color: 'white',*/}
                            {/*            },*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        New password*/}
                            {/*    </InputLabel>*/}
                            {/*    <GGInputBase*/}
                            {/*        id={'newPassword-input'}*/}
                            {/*        type={'password'}*/}
                            {/*        onChange={handleEnterNewPassword}*/}
                            {/*    />*/}
                            {/*</FormControl>*/}
                            {/*<FormControl*/}
                            {/*    variant={'standard'}*/}
                            {/*    sx={{*/}
                            {/*        '& .MuiInputBase-root': {*/}
                            {/*            mb: 4,*/}
                            {/*        },*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <InputLabel*/}
                            {/*        shrink*/}
                            {/*        htmlFor={'currentPassword-input'}*/}
                            {/*        sx={{*/}
                            {/*            fontSize: '1.5rem',*/}
                            {/*            pl: 1,*/}
                            {/*            '&.Mui-focused': {*/}
                            {/*                color: 'white',*/}
                            {/*            },*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        Repeat new password*/}
                            {/*    </InputLabel>*/}
                            {/*    <GGInputBase*/}
                            {/*        id={'repeatNewPassword-input'}*/}
                            {/*        type={'password'}*/}
                            {/*        onChange={handleEnterRepeatNewPassword}*/}
                            {/*    />*/}
                            {/*</FormControl>*/}

                            <Stack>
                                <Button
                                    variant={'contained'}
                                    disableElevation
                                    onClick={handleSaveChangesClick}
                                    sx={{
                                        width: (theme) => theme.breakpoints.values.sm * 0.75,
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
                                        SAVE CHANGES
                                    </Typography>
                                </Button>
                                <Button
                                    variant={'contained'}
                                    disableElevation
                                    onClick={handleSaveChangesClick}
                                    sx={{
                                        width: (theme) => theme.breakpoints.values.sm * 0.75,
                                        maxWidth: '85vw',
                                        py: 2,
                                        px: 4,
                                        mt: 4,
                                        mb: 4,
                                        border: '2px solid #554ADA',
                                    }}
                                >
                                    <Typography
                                        fontWeight={600}
                                        fontSize={'1.25rem'}
                                    >
                                        CANCEL
                                    </Typography>
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid
                            item
                            container
                            flexDirection={'column'}
                            xs={12}
                            md={6}
                            alignItems={'center'}
                        />
                    </Grid>
                )
            }
        </div>
    )
}
export default observer(ProfileDataTab)
