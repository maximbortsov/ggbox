import React, { FC, useCallback, useState } from 'react'
import { Box, Button, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { UseQueryResult } from 'react-query'
import DBField from '../components/DBField'
import DBInput from '../components/DBInput'
import { Game } from '../../../entities/Game'
import { validate } from 'class-validator'
import { ApiSource } from '../../../utils/api'
import { CreateGameDto } from '../../../dto/CreateGameDto'
import { CreateGameDataDto } from '../../../dto/CreateGameDataDto'
import { http } from '../../../utils/http'


const ManageGame: FC<{ games: UseQueryResult<Game[], any> }> = ({ games }) => {

    const [currentGame, setCurrentGame] = useState<Game | null>(null)

    const handleUnpickGame = useCallback(() => {
        setCurrentGame(null)
    }, [])

    const [name, setName] = useState<string>('')

    const handleCreateGame = (): void => {
        const gameDataDto = new CreateGameDataDto()
        gameDataDto.name = name

        void validate(gameDataDto)
            .then((errors) => {
                if (errors.length > 0) {
                    for (const error of errors) {
                        console.error(error.constraints)
                    }
                } else {
                    const formData = new FormData()
                    const createGameDto = new CreateGameDto(gameDataDto)
                    formData.append('data', JSON.stringify(createGameDto.data))
                    formData.append('file', '')

                    http
                        .post(
                            ApiSource + 'game',
                            formData,
                            { headers: { 'Content-Type': 'multipart/form-data' } },
                        )
                        .then((res) => {
                            console.log(res)
                            refetchGames()
                        })
                        .catch((error) => {
                            console.info('in catch:')
                            console.error(error.data.message)
                        })
                }
            })
    }

    const handleDeleteGame = (): void => {
        if (currentGame) {
            const gameId = currentGame.id
            http
                .delete(ApiSource + 'game/' + gameId.toString())
                .then((res) => {
                    console.log(res)
                    refetchGames()
                })
                .catch((error) => {
                    console.info('in catch:')
                    console.error(error.data.message)
                })
        }

    }

    const refetchGames = (): void => {
        void games.refetch()
    }

    return (
        <Grid
            container
            sx={{
                height: 'calc(100vh - 180px - 145px)',
            }}
        >
            {/* All games list */}
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
                    onClick={handleUnpickGame}
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
                        games.isSuccess &&
                        games.data.map((game: Game) => (
                            <ListItem
                                button
                                onClick={(): void => {
                                    setCurrentGame(game)
                                    console.log(game)
                                }}
                                selected={currentGame === game}
                                key={game.id}
                            >
                                <ListItemText
                                    primary={game.name}
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
                    {/* game info */}
                    {
                        currentGame !== null &&
                        <>
                            <DBField label={'Game name'} field={currentGame.name}/>
                            <Button
                                variant={'outlined'}
                                onClick={handleDeleteGame}
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
                                Delete game
                            </Button>
                        </>
                    }
                    {/* create new game */}
                    {
                        currentGame === null &&
                        <Stack direction={'column'}>
                            <Typography
                                variant={'h5'}
                                fontFamily={'"Montserrat", sans-serif'}
                                sx={{
                                    pb: 2,
                                }}
                            >
                                New game
                            </Typography>
                            <DBInput label={'Game name'} data={name} setData={setName}/>
                            <Button
                                variant={'outlined'}
                                onClick={handleCreateGame}
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
                                Create game
                            </Button>
                        </Stack>
                    }
                </Box>
            </Grid>
        </Grid>
    )
}

export default ManageGame