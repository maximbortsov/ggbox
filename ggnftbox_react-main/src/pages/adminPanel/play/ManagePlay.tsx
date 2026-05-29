import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Autocomplete, Box, Button, Grid, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import { UseQueryResult } from 'react-query'
import DBField from '../components/DBField'
import DBInput from '../components/DBInput'
import { Streamer } from '../../../entities/Streamer'
import { Game } from '../../../entities/Game'
import { Play } from '../../../entities/Play'
import { ApiSource } from '../../../utils/api'
import ReactPlayer from 'react-player'
import { validate } from 'class-validator'
import { CreatePlayDto } from '../../../dto/CreatePlayDto'
import { CreatePlayDataDto } from '../../../dto/CreatePlayDataDto'
import { http } from '../../../utils/http'


interface ManagePlayProps {
    plays: UseQueryResult<Play[], any>
    streamers: UseQueryResult<Streamer[], any>
    games: UseQueryResult<Game[], any>
}


const ManagePlay: FC<ManagePlayProps> = ({ streamers, games, plays }) => {

    const [currentPlay, setCurrentPlay] = useState<Play | null>(null)

    const handleUnpickPlay = useCallback(() => {
        setCurrentPlay(null)
    }, [])

    const [name, setName] = useState<string>('')
    const [desc, setDesc] = useState<string>('')
    const [streamer, setStreamer] = useState<Streamer | null>(null)
    const [game, setGame] = useState<Game | null>(null)
    const [video, setVideo] = useState<File | null>(null)
    const [videoFilePath, setVideoFilePath] = useState<string | null>(null)

    const handleCreatePlay = (): void => {
        const playDataDto = new CreatePlayDataDto()
        playDataDto.name = name
        playDataDto.desc = desc

        if (streamer?.id === undefined) return
        playDataDto.streamer = { connect: { id: streamer.id } }

        if (game?.id === undefined) return
        playDataDto.game = { connect: { id: game.id } }

        void validate(playDataDto)
            .then((errors) => {
                if (errors.length > 0) {
                    for (const error of errors) {
                        console.error(error.constraints)
                    }
                } else {
                    const formData = new FormData()
                    const createPlayDto = new CreatePlayDto(playDataDto, video as File)

                    formData.append('data', JSON.stringify(createPlayDto.data))
                    formData.append('video', createPlayDto.video as Blob)

                    http
                        .post(
                            ApiSource + 'play',
                            formData,
                            { headers: { 'Content-Type': 'multipart/form-data' } },
                        )
                        .then((res) => {
                            console.log(res)
                            refetchPlays()
                        })
                        .catch((error) => {
                            console.info('in catch:')
                            console.error(error.data.message)
                        })
                }
            })
    }

    const handleDeletePlay = (): void => {
        if (currentPlay) {
            const playId = currentPlay.id
            http
                .delete(ApiSource + 'play/' + playId.toString())
                .then((res) => {
                    console.log(res)
                    refetchPlays()
                })
                .catch((error) => {
                    console.info('in catch:')
                    console.error(error.data.message)
                })
        }

    }

    const refetchPlays = (): void => {
        void plays.refetch()
    }

    return (
        <Grid
            container
            sx={{
                height: 'calc(100vh - 180px - 145px)',
            }}
        >
            {/* All plays list */}
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
                    onClick={handleUnpickPlay}
                    sx={{
                        color: 'white',
                        width: '100%',
                        py: 2,
                    }}
                >
                    <Typography variant={'subtitle1'}>
                        + new Play
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
                        plays.isSuccess &&
                        plays.data.map((play: Play) => (
                            <ListItem
                                button
                                onClick={(): void => {
                                    setCurrentPlay(play)
                                    console.log(play)
                                }}
                                selected={currentPlay === play}
                                key={play.id}
                            >
                                <ListItemText
                                    primary={play.name}
                                    secondary={play.streamer?.name + ' at ' + play.game?.name}
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
                    {/* play info */}
                    {
                        currentPlay !== null &&
                        <Box>
                            <DBField label={'ID'} field={currentPlay.id}/>
                            <DBField label={'Name'} field={currentPlay.name}/>
                            <DBField label={'Streamer'} field={currentPlay.streamer?.name ?? ''}/>
                            <DBField label={'Description'} field={currentPlay.desc}/>
                            <DBField label={'Nft number'} field={currentPlay.nftNum ?? -1}/>
                            {/*<DBField label={'Rarity'} field={currentPlay.rarity}/>*/}
                            <DBField label={'Created at'} field={currentPlay.createdAt}/>
                            <DBField label={'Lowest ask'} field={currentPlay.lowestAsk ?? -1}/>
                            <DBField label={'Top sale'} field={currentPlay.topSale ?? -1}/>
                            <Box mt={2}>
                                <ReactPlayer
                                    url={currentPlay.pinataUrl}
                                    width={'75%'}
                                    height={'75%'}
                                    controls
                                />
                            </Box>
                            <Button
                                variant={'outlined'}
                                onClick={handleDeletePlay}
                                sx={{
                                    width: '100%',
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
                                Delete play
                            </Button>
                        </Box>
                    }
                    {/* create new play */}
                    {
                        currentPlay === null &&
                        <Stack direction={'column'}>
                            <Typography
                                variant={'h5'}
                                fontFamily={'"Montserrat", sans-serif'}
                                sx={{
                                    pb: 2,
                                }}
                            >
                                New Play
                            </Typography>
                            <DBInput label={'Name*'} data={name} setData={setName}/>
                            <DBInput label={'Description'} data={desc} setData={setDesc}/>
                            <Autocomplete
                                options={streamers.isSuccess ? streamers.data : []}
                                getOptionLabel={(option: Streamer): string => option.name}
                                isOptionEqualToValue={(option, value): boolean => option.name === value.name}
                                value={streamer}
                                onChange={(event: any, newValue: Streamer | null): void => {
                                    setStreamer(newValue)
                                }}
                                renderOption={(props, option: Streamer): ReactElement => (
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
                                            {option.name}
                                        </Typography>
                                    </Box>
                                )}
                                renderInput={(params): ReactElement => (
                                    <TextField
                                        variant={'standard'}
                                        label={'Streamer'}
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
                            <Autocomplete
                                options={games.isSuccess ? games.data : []}
                                getOptionLabel={(option: Game): string => option.name}
                                isOptionEqualToValue={(option, value): boolean => option.name === value.name}
                                value={game}
                                onChange={(event: any, newValue: Game | null): void => {
                                    setGame(newValue)
                                }}
                                renderOption={(props, option: Game): ReactElement => (
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
                                            {option.name}
                                        </Typography>
                                    </Box>
                                )}
                                renderInput={(params): ReactElement => (
                                    <TextField
                                        variant={'standard'}
                                        label={'Game'}
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
                            <label htmlFor={'uploadPlay'}>
                                <input
                                    id={'uploadPlay'}
                                    accept={'video/mp4'}
                                    type={'file'}
                                    onChange={(event): void => {
                                        if (event.target.files !== null) {
                                            setVideo(event.target.files[0])
                                            setVideoFilePath(URL.createObjectURL(event.target.files[0]))
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
                                    Upload video*
                                </Button>
                            </label>
                            <Typography variant={'body2'} mt={1}>
                                Предпросмотр:
                            </Typography>
                            {
                                videoFilePath && video &&
                                <ReactPlayer
                                    controls
                                    url={videoFilePath}
                                    width={'100%'}
                                    height={'100%'}
                                />
                            }
                            <Button
                                variant={'outlined'}
                                onClick={handleCreatePlay}
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
                                Create play
                            </Button>
                        </Stack>
                    }
                </Box>
            </Grid>
        </Grid>
    )
}

export default ManagePlay