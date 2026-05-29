import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Grid, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import { useQuery, UseQueryResult } from 'react-query'
import DBInput from '../components/DBInput'
import { Play } from '../../../entities/Play'
import { ApiSource } from '../../../utils/api'
import { validate } from 'class-validator'
import { Nft } from '../../../entities/Nft'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { Lot } from '../../../entities/Lot'
import { CreateLotDto } from '../../../dto/CreateLotDto'
import { http } from '../../../utils/http'


interface ManageLotProps {
    plays: UseQueryResult<Play[], any>
}


const ManageLot: FC<ManageLotProps> = ({ plays }) => {

    const [currentPlay, setCurrentPlay] = useState<Play | null>(null)
    const [currentLot, setCurrentLot] = useState<Lot | null>(null)
    const handleUnpickLot = useCallback(() => {
        setCurrentLot(null)
    }, [])

    const [price, setPrice] = useState<number>(10)
    const [nft, setNft] = useState<Nft | null>(null)

    const fetchAdminPlayLots = async (): Promise<Lot[]> => {
        if (currentPlay)
            return http
                .get(ApiSource + 'play/' + currentPlay.id, { params: { include: 'lots' } })
                .then((res) => res.data.lots)
                .then((res) => plainToInstance(Lot, res as any[]))
        else
            return []
    }
    const fetchAdminPlayNfts = async (): Promise<Nft[]> => {
        if (currentPlay)
            return http
                .get(ApiSource + 'play/' + currentPlay.id, { params: { include: 'nfts' } })
                .then((res) => res.data.nfts)
                .then((res) => plainToInstance(Nft, res as any[]))
        else
            return []
    }
    const playLots = useQuery('adminPlayLots', fetchAdminPlayLots)
    const playNfts = useQuery('adminPlayNfts', fetchAdminPlayNfts)
    useEffect(() => {
        void playLots.refetch()
        void playNfts.refetch()
    }, [currentPlay])

    const handleCreateLot = (): void => {
        const lotDto = new CreateLotDto()
        lotDto.price = price

        if (nft?.id === undefined) return
        lotDto.nft = { connect: { id: nft.id } }

        void validate(lotDto)
            .then((errors) => {
                if (errors.length > 0) {
                    for (const error of errors) {
                        console.error(error.constraints)
                    }
                } else {
                    http
                        .post('lot', instanceToPlain(lotDto))
                        .then((res) => {
                            console.log(res)
                            void playLots.refetch()
                        })
                        .catch((error) => {
                            console.info('in catch:')
                            console.error(error.data.message)
                        })
                }
            })
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
            {/* Play lots list*/}
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
                    onClick={handleUnpickLot}
                    sx={{
                        color: 'white',
                        width: '100%',
                        py: 2,
                    }}
                >
                    <Typography variant={'subtitle1'}>
                        + add new Lot
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
                        playLots.isSuccess &&
                        playLots.data.map((lot: Lot) => (
                            <ListItem
                                button
                                onClick={(): void => {
                                    setCurrentLot(lot)
                                    console.log(lot)
                                }}
                                selected={currentLot === lot}
                                key={lot.id}
                            >
                                <ListItemText
                                    primary={(lot.seller?.username ?? 'Seller') + ', $' + lot.price.toString()}
                                    secondary={'Buyer - ' + (lot.buyer?.username ?? 'null')}
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
                xs={6}
                sx={{
                    height: 'calc(100vh - 180px - 145px)',
                    overflowY: 'scroll',
                }}
            >
                <Box px={4}>
                    {/* current lot params */}
                    {
                        currentLot !== null &&
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
                    {/* create new lot */}
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
                                Add lot
                            </Typography>
                            <DBInput
                                label={'Price'}
                                data={price}
                                setData={setPrice}
                                inputType={'int'}
                            />
                            <Autocomplete
                                options={playNfts.isSuccess ? playNfts.data : []}
                                getOptionLabel={(option): string => option.serialNumber.toString() + ', ' + (option.owner?.username ?? '')}
                                isOptionEqualToValue={(option, value): boolean => option.serialNumber === value.serialNumber}
                                value={nft}
                                onChange={(event: any, newValue: Nft | null): void => {
                                    setNft(newValue)
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
                                            #
                                            {option.serialNumber}
                                            {', owner - '}
                                            {option.owner?.username ?? ''}
                                        </Typography>
                                    </Box>
                                )}
                                renderInput={(params): ReactElement => (
                                    <TextField
                                        variant={'standard'}
                                        label={'Nft'}
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
                                onClick={handleCreateLot}
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
                                Add lot
                            </Button>
                        </Stack>
                    }
                </Box>
            </Grid>
        </Grid>
    )
}

export default ManageLot