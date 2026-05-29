import React, { FC, ReactElement, useCallback } from 'react'
import { Autocomplete, Box, Button, Collapse, Stack, SxProps, TextField, Typography } from '@mui/material'
import { GGInput } from '../GGInput'
import { observer } from 'mobx-react-lite'
import MarketplaceStore from '../../pages/marketplace/MarketplaceStore'
import BoxesStore from '../../pages/boxes/BoxesStore'
import { Streamer } from '../../entities/Streamer'
import { ApiSource } from '../../utils/api'
import { plainToInstance } from 'class-transformer'
import { Game } from '../../entities/Game'
import { Tag } from '../../entities/Tag'
import { useQuery } from 'react-query'
import { http } from '../../utils/http'


const FiltersMobile: FC<{ sx?: SxProps; store: MarketplaceStore | BoxesStore }> = ({ sx, store }) => {

    const applyFilters = useCallback(() => {
        store.applyFilters()
    }, [store])

    const clearFilters = useCallback(() => {
        store.clearFilters()
    }, [store])

    const fetchStreamersFilterMobile = async (): Promise<Streamer[]> => http
        .get(ApiSource + 'streamer')
        .then((res) => res.data)
        .then((res) => plainToInstance(Streamer, res as any[]))

    const fetchGamesFilterMobile = async (): Promise<Game[]> => http
        .get(ApiSource + 'game')
        .then((res) => res.data)
        .then((res) => plainToInstance(Game, res as any[]))

    const fetchTagsFilterMobile = async (): Promise<Tag[]> => http
        .get(ApiSource + 'tag')
        .then((res) => res.data)
        .then((res) => plainToInstance(Tag, res as any[]))

    const streamers = useQuery('filterMobileStreamers', fetchStreamersFilterMobile)
    const games = useQuery('filterMobileGames', fetchGamesFilterMobile)
    const tags = useQuery('filterMobileTags', fetchTagsFilterMobile)

    return (
        <Collapse
            in={store.filterMenuOpen}
            sx={{
                overflow: 'hidden',
                mt: 2,
                width: '100%',
                ...sx,
            }}
        >
            <Typography variant={'body1'}>
                Price
            </Typography>

            <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                mt={1}
            >
                <GGInput
                    update={store.setFilterMinPrice}
                    defaultValue={store.filters.minPrice}
                    sx={{
                        mr: 2,
                    }}
                />
                <Typography variant={'body1'}>
                    –
                </Typography>
                <GGInput
                    update={store.setFilterMaxPrice}
                    defaultValue={store.filters.maxPrice}
                    sx={{
                        ml: 2,
                    }}
                />
            </Stack>

            {/* STREAMER */}
            <Autocomplete
                multiple
                options={streamers.data ?? []}
                getOptionLabel={(option: Streamer): string => option.name}
                onChange={((event, value): void => store.setFilterStreamer(value))}
                isOptionEqualToValue={(option, value): boolean => option.name === value.name}
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
                        <Typography variant={'subtitle1'}>
                            {option.name}
                        </Typography>
                    </Box>
                )}
                renderInput={(params): ReactElement => (
                    <TextField
                        variant={'standard'}
                        label={'Streamers'}
                        {...params}
                        sx={{
                            my: 0.5,
                        }}
                    />
                )}
                sx={{
                    my: 1,
                    '& .MuiSvgIcon-root': {
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                            color: 'rgba(255,255,255,1)',
                        },
                    },
                }}
            />

            {/* GAMES */}
            <Autocomplete
                multiple
                options={games.data ?? []}
                getOptionLabel={(option: Game): string => option.name}
                onChange={((event, value): void => store.setFilterGame(value))}
                isOptionEqualToValue={(option, value): boolean => option.name === value.name}
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
                        <Typography variant={'subtitle1'}>
                            {option.name}
                        </Typography>
                    </Box>
                )}
                renderInput={(params): ReactElement => (
                    <TextField
                        variant={'standard'}
                        label={'Games'}
                        {...params}
                        sx={{
                            my: 0.5,
                        }}
                    />
                )}
                sx={{
                    my: 1,
                    '& .MuiSvgIcon-root': {
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                            color: 'rgba(255,255,255,1)',
                        },
                    },
                }}
            />

            {/* TAGS */}
            <Autocomplete
                multiple
                options={tags.data ?? []}
                getOptionLabel={(option: Tag): string => option.name}
                onChange={((event, value): void => store.setFilterTag(value))}
                isOptionEqualToValue={(option, value): boolean => option.name === value.name}
                renderOption={(props, option: Tag): ReactElement => (
                    <Box
                        component={'li'}
                        {...props}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#1b2e73',
                            },
                        }}
                    >
                        <Typography variant={'subtitle1'}>
                            {option.name}
                        </Typography>
                    </Box>
                )}
                renderInput={(params): ReactElement => (
                    <TextField
                        variant={'standard'}
                        label={'Tags'}
                        {...params}
                        sx={{
                            my: 0.5,
                        }}
                    />
                )}
                sx={{
                    my: 1,
                    '& .MuiSvgIcon-root': {
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                            color: 'rgba(255,255,255,1)',
                        },
                    },
                }}
            />

            <Button
                variant={'contained'}
                onClick={applyFilters}
                sx={{
                    mt: 2,
                    py: 1.5,
                    width: '100%',
                    background: '#554ADA',
                    borderRadius: 1,
                    ':hover': {
                        background: '#5d53d9',
                    },
                }}
            >
                <Typography
                    variant={'h6'}
                    fontFamily={'"Raleway", sans-serif'}
                    fontWeight={600}
                >
                    Apply
                </Typography>
            </Button>

            <Button
                variant={'text'}
                onClick={clearFilters}
                sx={{
                    color: 'white',
                    width: '100%',
                    mt: 1,
                    py: 1.5,
                }}
            >
                Clear all
            </Button>
        </Collapse>
    )
}

export default observer(FiltersMobile)