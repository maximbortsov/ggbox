import React, { FC, useCallback, useState } from 'react'
import { Box, Button, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { User } from '../../../entities/User'
import { ApiSource } from '../../../utils/api'
import { UseQueryResult } from 'react-query'
import { validate } from 'class-validator'
import { CreateUserDataDto } from '../../../dto/CreateUserDataDto'
import DBInput from '../components/DBInput'
import UserInfo from './UserInfo'
import { CreateUserDto } from '../../../dto/CreateUserDto'
import { http } from '../../../utils/http'


const ManageUser: FC<{ users: UseQueryResult<User[], any> }> = ({ users }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [image, setImage] = useState<File | null>(null)

    const handleUnpickUser = useCallback(() => {
        setCurrentUser(null)
    }, [])

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleCreateUser = (): void => {
        const userDataDto = new CreateUserDataDto()
        userDataDto.username = username
        userDataDto.email = email
        userDataDto.password = password
        userDataDto.roles = ['user']

        void validate(userDataDto)
            .then((errors) => {
                    if (errors.length > 0) {
                        for (const error of errors) {
                            console.error(error.constraints)
                        }
                    } else {
                        const formData = new FormData()
                        const createUserDto = new CreateUserDto(userDataDto)
                        formData.append('data', JSON.stringify(createUserDto.data))
                        if (image) {
                            formData.append('file', image as Blob)
                        } else {
                            formData.append('file', createUserDto.file)
                        }

                        http
                            .post(
                                ApiSource + 'user',
                                formData,
                                { headers: { 'Content-Type': 'multipart/form-data' } },
                            )
                            .then((res) => {
                                console.log(res)
                                refetchUsers()
                            })
                            .catch((error) => {
                                console.info('in catch:')
                                console.error(error.data.message)
                            })
                    }
                },
            )
    }

    const handleDeleteUser = (): void => {
        if (currentUser) {
            const userId = currentUser.id
            http
                .delete(ApiSource + 'user/' + userId.toString())
                .then((res) => {
                    console.log(res)
                    refetchUsers()
                })
                .catch((error) => {
                    console.info('in catch:')
                    console.error(error.data.message)
                })
        }

    }

    const refetchUsers = (): void => {
        void users.refetch()
    }

    return (
        <Grid
            container
            sx={{
                height: 'calc(100vh - 180px - 145px)',
            }}
        >
            {/* All users list */}
            <Grid
                item
                xs={4}
                sx={{
                    height: '100%',
                    borderRight: '1px solid #fff',
                }}
            >
                <Button
                    variant={'text'}
                    onClick={handleUnpickUser}
                    sx={{
                        color: 'white',
                        width: '100%',
                        py: 2,
                    }}
                >
                    <Typography variant={'subtitle1'}>
                        + new user
                    </Typography>
                </Button>
                <List
                    sx={{
                        height: 'calc(100vh - 180px - 76px - 145px)',
                        overflowY: 'scroll',
                        scrollbarWidth: '4px',
                    }}
                >
                    {
                        users.isSuccess &&
                        users.data.map((user: User) => (
                            <ListItem
                                button
                                onClick={(): void => {
                                    setCurrentUser(user)
                                    console.log(user)
                                }}
                                selected={currentUser === user}
                                key={user.id}
                            >
                                <ListItemText
                                    primary={user.username}
                                    secondary={user.email}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        },
                                    }}
                                />
                            </ListItem>
                        ))
                    }
                </List>
            </Grid>
            <Grid item xs={8}>
                <Box px={4}>
                    {/* user info */}
                    <UserInfo user={currentUser}/>
                    {
                        currentUser !== null &&
                        <Button
                            variant={'outlined'}
                            onClick={handleDeleteUser}
                            sx={{
                                mt: 2,
                                color: 'white',
                                borderColor: 'white',
                                borderRadius: 1,
                                fontSize: '1rem',
                                textTransform: 'none',
                                fontFamily: '"Montserrat", sans-serif',
                                ':hover': {
                                    borderColor: '#d5d4d4',
                                },
                            }}
                        >
                            Delete user
                        </Button>
                    }
                    {/* create new user */}
                    {
                        currentUser === null &&
                        <Stack direction={'column'}>
                            <Typography
                                variant={'h5'}
                                fontFamily={'"Montserrat", sans-serif'}
                                sx={{
                                    pb: 2,
                                }}
                            >
                                New user
                            </Typography>
                            <DBInput label={'Login'} data={username} setData={setUsername}/>
                            <DBInput label={'Email'} data={email} setData={setEmail}/>
                            <DBInput label={'Password'} data={password} setData={setPassword}/>
                            <label htmlFor={'uploadAvatar'}>
                                <input
                                    id={'uploadAvatar'}
                                    accept={'image/png'}
                                    type={'file'}
                                    onChange={(event): void => {
                                        if (event.target.files !== null) {
                                            setImage(event.target.files[0])
                                        }
                                    }}
                                    style={{
                                        display: 'none',
                                    }}
                                />
                                <Button
                                    variant={'contained'}
                                    component={'span'}
                                    disableElevation
                                    sx={{
                                        width: '100%',
                                        mt: 2,
                                        background: '#554ADA',
                                        borderRadius: 1,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        fontFamily: '"Montserrat", sans-serif',
                                        ':hover': {
                                            background: '#5d53d9',
                                        },
                                    }}
                                >
                                    Upload user avatar
                                </Button>
                            </label>
                            <Button
                                variant={'outlined'}
                                onClick={handleCreateUser}
                                sx={{
                                    mt: 2,
                                    color: 'white',
                                    borderColor: 'white',
                                    borderRadius: 1,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    fontFamily: '"Montserrat", sans-serif',
                                    ':hover': {
                                        borderColor: '#d5d4d4',
                                    },
                                }}
                            >
                                Create user
                            </Button>
                        </Stack>
                    }
                </Box>
            </Grid>
        </Grid>
    )
}

export default ManageUser