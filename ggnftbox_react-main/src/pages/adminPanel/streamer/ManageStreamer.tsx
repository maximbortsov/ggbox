import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Autocomplete, Box, Button, Divider, Grid, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import { User } from '../../../entities/User'
import { UseQueryResult } from 'react-query'
import DBField from '../components/DBField'
import DBInput from '../components/DBInput'
import { Streamer } from '../../../entities/Streamer'
import UserInfo from '../user/UserInfo'
import { CreateStreamerDto } from '../../../dto/CreateStreamerDto'
import { validate } from 'class-validator'
import { ApiSource } from '../../../utils/api'
import { instanceToPlain } from 'class-transformer'
import { http } from '../../../utils/http'


interface ManageStreamerProps {
    users: UseQueryResult<User[], any>
    streamers: UseQueryResult<Streamer[], any>
}


const ManageStreamer: FC<ManageStreamerProps> = ({ streamers, users }) => {

    const [currentStreamer, setCurrentStreamer] = useState<Streamer | null>(null)

    const handleUnpickStreamer = useCallback(() => {
        setCurrentStreamer(null)
    }, [])

    const [username, setUsername] = useState<string>('')
    const [desc, setDesc] = useState<string>('')
    const [user, setUser] = useState<User | null>(null)

    const handleCreateStreamer = (): void => {
        const streamerDto = new CreateStreamerDto()
        streamerDto.desc = desc
        streamerDto.name = username
        streamerDto.twitchLink = 'https://twitch.tv/' + username.toLowerCase()

        if (user?.id === undefined) return
        streamerDto.user.connect.id = user.id

        void validate(streamerDto)
            .then((errors) => {
                if (errors.length > 0) {
                    for (const error of errors) {
                        console.error(error.constraints)
                    }
                } else {
                    http
                        .post(ApiSource + 'streamer/', instanceToPlain(streamerDto))
                        .then((res) => {
                            console.log(res)
                            refetchStreamers()
                        })
                        .catch((error) => {
                            console.info('in catch:')
                            console.error(error.data.message)
                        })
                }
            })
    }

    const handleDeleteStreamer = (): void => {
        if (currentStreamer) {
            const streamerId = currentStreamer.id
            http
                .delete(ApiSource + 'streamer/' + streamerId.toString())
                .then((res) => {
                    console.log(res)
                    refetchStreamers()
                })
                .catch((error) => {
                    console.info('in catch:')
                    console.error(error.data.message)
                })
        }
    }

    const refetchStreamers = (): void => {
        void streamers.refetch()
    }

    return (
        <Grid
            container
            sx={{
                height: 'calc(100vh - 180px - 145px)',
            }}
        >
            {/* All streamers list */}
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
                    onClick={handleUnpickStreamer}
                    sx={{
                        color: 'white',
                        width: '100%',
                        py: 2,
                    }}
                >
                    <Typography variant={'subtitle1'}>
                        + new Streamer
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
                        streamers.isSuccess &&
                        streamers.data.map((streamer: Streamer) => (
                            <ListItem
                                button
                                onClick={(): void => {
                                    setCurrentStreamer(streamer)
                                    console.log(streamer)
                                }}
                                selected={currentStreamer === streamer}
                                key={streamer.name}
                            >
                                <ListItemText
                                    primary={streamer.name}
                                    secondary={streamer.user?.email}
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
            <Grid
                item
                xs={8}
                sx={{
                    height: 'calc(100vh - 180px - 145px)',
                    overflowY: 'scroll',
                }}
            >
                <Box px={4}>
                    {/* streamer info */}
                    {
                        currentStreamer !== null &&
                        <Box>
                            <DBField label={'ID'} field={currentStreamer.id}/>
                            <DBField label={'Twitch username'} field={currentStreamer.name}/>
                            <DBField label={'Description'} field={currentStreamer.desc ?? '-'}/>
                            <DBField label={'Twitch link'} field={currentStreamer.twitchLink ?? '-'}/>
                            <Divider/>
                            <DBField label={'GG username'} field={currentStreamer.user?.username ?? '-'}/>
                            <DBField label={'GG email'} field={currentStreamer.user?.email ?? '-'}/>
                            <DBField label={'GG balance'} field={currentStreamer.user?.balance ?? '-'}/>
                            <Button
                                variant={'outlined'}
                                onClick={handleDeleteStreamer}
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
                                Delete streamer
                            </Button>
                        </Box>
                    }
                    {/* create new streamer */}
                    {
                        currentStreamer === null &&
                        <Stack direction={'column'}>
                            <Typography
                                variant={'h5'}
                                fontFamily={'"Montserrat", sans-serif'}
                                sx={{
                                    pb: 2,
                                }}
                            >
                                New streamer
                            </Typography>
                            <DBInput label={'Twitch username'} data={username} setData={setUsername}/>
                            <DBInput label={'Description'} data={desc} setData={setDesc}/>
                            <Autocomplete
                                options={users.isSuccess ? users.data : []}
                                getOptionLabel={(option): string => option.username}
                                isOptionEqualToValue={(option, value): boolean => option.username === value.username}
                                value={user}
                                onChange={(event: any, newValue: User | null): void => {
                                    setUser(newValue)
                                }}
                                renderOption={(props, option): ReactElement => (
                                    <Box
                                        component={'li'}
                                        {...props}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#1b2e73',
                                            },
                                        }}
                                    >
                                        <Typography variant={'body1'}>
                                            {option.username}
                                            , $
                                            {option.balance}
                                        </Typography>
                                    </Box>
                                )}
                                renderInput={(params): ReactElement => (
                                    <TextField
                                        variant={'standard'}
                                        label={'User'}
                                        {...params}
                                        sx={{
                                            my: 0.5,
                                            '& .MuiInputLabel-root': {
                                                '&.Mui-focused': {
                                                    color: 'white',
                                                },
                                            },
                                            '& .MuiInput-root': {
                                                color: '#fff',
                                                '&:before': {
                                                    borderBottom: '1px solid #fff',
                                                },
                                                '&.Mui-focused': {
                                                    borderBottom: '1.5px solid #fff',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            />
                            {
                                user !== null &&
                                <Box mt={2} overflow={'scrollY'}>
                                    <Typography variant={'body2'}>
                                        GG user info
                                    </Typography>
                                    <Divider/>
                                    <UserInfo user={user}/>
                                </Box>
                            }
                            <Button
                                variant={'outlined'}
                                onClick={handleCreateStreamer}
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
                                Create streamer
                            </Button>
                        </Stack>
                    }
                </Box>
            </Grid>
        </Grid>
    )
}

export default ManageStreamer