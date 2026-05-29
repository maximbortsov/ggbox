import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Autocomplete, Box, Button, Grid, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import { UseQueryResult } from 'react-query'
import DBInput from '../components/DBInput'
import { Play } from '../../../entities/Play'
import { ApiSource } from '../../../utils/api'
import { validate } from 'class-validator'
import { GGBox } from '../../../entities/GGBox'
import { Nft } from '../../../entities/Nft'
import { CreateNftDto } from '../../../dto/CreateNftDto'
import { instanceToPlain } from 'class-transformer'
import { http } from '../../../utils/http'


interface ManageNftProps {
    plays: UseQueryResult<Play[], any>
    boxes: UseQueryResult<GGBox[], any>
}


const ManageNft: FC<ManageNftProps> = ({ boxes, plays }) => {

    const [currentPlay, setCurrentPlay] = useState<Play | null>(null)
    const [currentNft, setCurrentNft] = useState<Nft | null>(null)

    const handleUnpickPlay = useCallback(() => {
        setCurrentPlay(null)
    }, [])

    const [nftAmount, setNftAmount] = useState<number>(10)
    const [box, setBox] = useState<GGBox | null>(null)

    const handleCreatePlay = (): void => {
        const nftDto = new CreateNftDto()

        if (currentPlay?.id === undefined) return
        nftDto.play = { connect: { id: currentPlay.id } }

        if (box?.id === undefined) return
        nftDto.box = { connect: { id: box.id } }

        for (let serialNumber = 1; serialNumber <= nftAmount; serialNumber++) {
            nftDto.serialNumber = serialNumber

            console.log(nftDto)

            void validate(nftDto)
                .then((errors) => {
                    if (errors.length > 0) {
                        for (const error of errors) {
                            console.error(error.constraints)
                        }
                    } else {
                        http
                            .post(ApiSource + 'nft', instanceToPlain(nftDto))
                            .then((res) => {
                                console.log(res)
                            })
                            .catch((error) => {
                                console.info('in catch:')
                                console.error(error.data.message)
                            })
                    }
                })
        }
        refetchNfts()
    }

    const refetchNfts = (): void => {
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
                xs={3}
                sx={{
                    height: '100%',
                    borderRight: '1px solid #fff',
                }}
            >
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
            {/* All nfts list*/}
            <Grid
                item
                xs={3}
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
                        + add Nfts
                    </Typography>
                </Button>
                {/*<List*/}
                {/*    sx={{*/}
                {/*        height: 'calc(100vh - 180px - 76px - 145px)',*/}
                {/*        overflowY: 'scroll',*/}
                {/*        scrollbarWidth: '4px',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {*/}
                {/*        plays.isSuccess &&*/}
                {/*        plays.data.map((play: Play) => (*/}
                {/*            <ListItem*/}
                {/*                button*/}
                {/*                onClick={(): void => {*/}
                {/*                    setCurrentPlay(play)*/}
                {/*                    console.log(play)*/}
                {/*                }}*/}
                {/*                selected={currentPlay === play}*/}
                {/*                key={play.id}*/}
                {/*            >*/}
                {/*                <ListItemText*/}
                {/*                    primary={play.name}*/}
                {/*                    secondary={play.streamer?.name + ' at ' + play.game?.name}*/}
                {/*                    sx={{*/}
                {/*                        '& .MuiTypography-root': {*/}
                {/*                            color: 'white',*/}
                {/*                        },*/}
                {/*                    }}*/}
                {/*                />*/}
                {/*            </ListItem>*/}
                {/*        ))*/}
                {/*    }*/}
                {/*</List>*/}
            </Grid>
            <Grid
                item
                xs={6}
                sx={{
                    height: 'calc(100vh - 180px - 145px)',
                    overflowY: 'scroll',
                }}
            >
                <Box px={4}>
                    {/* current nft params */}
                    {
                        currentNft !== null &&
                        <Box>
                            {/*<DBField label={'ID'} field={currentPlay.id}/>*/}
                            {/*<DBField label={'Name'} field={currentPlay.name}/>*/}
                            {/*<DBField label={'Streamer'} field={currentPlay.streamer?.name ?? ''}/>*/}
                            {/*<DBField label={'Description'} field={currentPlay.desc ?? ''}/>*/}
                            {/*<DBField label={'Nft number'} field={currentPlay.nftNum}/>*/}
                            {/*<DBField label={'Rarity'} field={currentPlay.rarity}/>*/}
                            {/*<DBField label={'Created at'} field={currentPlay.createdAt}/>*/}
                            {/*<DBField label={'Lowest ask'} field={currentPlay.lowestAsk}/>*/}
                            {/*<DBField label={'Top sale'} field={currentPlay.topSale}/>*/}
                            {/*<GGBox mt={2}>*/}
                            {/*    <ReactPlayer*/}
                            {/*        url={AssetsPath + currentPlay.link}*/}
                            {/*        width={'75%'}*/}
                            {/*        height={'75%'}*/}
                            {/*        controls*/}
                            {/*    />*/}
                            {/*</GGBox>*/}
                            {/*<Button*/}
                            {/*    variant={'outlined'}*/}
                            {/*    onClick={handleDeletePlay}*/}
                            {/*    sx={{*/}
                            {/*        width: '100%',*/}
                            {/*        mt: 2,*/}
                            {/*        color: 'white',*/}
                            {/*        borderColor: 'white',*/}
                            {/*        borderRadius: 1,*/}
                            {/*        fontSize: '1rem',*/}
                            {/*        textTransform: 'none',*/}
                            {/*        fontFamily: '"Montserrat", sans-serif',*/}
                            {/*        ':hover': {*/}
                            {/*            borderColor: '#d5d4d4',*/}
                            {/*        },*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    Delete play*/}
                            {/*</Button>*/}
                        </Box>
                    }
                    {/* create new nfts */}
                    {
                        currentPlay !== null &&
                        <Stack direction={'column'}>
                            <Typography
                                variant={'h5'}
                                fontFamily={'"Montserrat", sans-serif'}
                                sx={{
                                    pb: 2,
                                }}
                            >
                                Add nfts
                            </Typography>
                            <DBInput
                                label={'Nft amount'}
                                data={nftAmount}
                                setData={setNftAmount}
                                inputType={'int'}
                            />
                            <Autocomplete
                                options={boxes.isSuccess ? boxes.data : []}
                                getOptionLabel={(option: GGBox): string => option.name}
                                isOptionEqualToValue={(option, value): boolean => option.name === value.name}
                                value={box}
                                onChange={(event: any, newValue: GGBox | null): void => {
                                    setBox(newValue)
                                }}
                                renderOption={(props, option: GGBox): ReactElement => (
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
                                        label={'Box'}
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
                                {`Add ${nftAmount} nfts`}
                            </Button>
                        </Stack>
                    }
                </Box>
            </Grid>
        </Grid>
    )
}

export default ManageNft