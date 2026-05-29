import { GGInputBase } from '../GGInputBase'
import { FormControl, InputAdornment, SxProps, Typography, useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import React, { FC, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import MarketplaceStore from '../../pages/marketplace/MarketplaceStore'
import BoxesStore from '../../pages/boxes/BoxesStore'


const Search: FC<{ sx?: SxProps; store: MarketplaceStore | BoxesStore }> = ({ sx, store }) => {

    const [searchIsFocused, setSearchIsFocused] = useState(false)
    const theme = useTheme()

    const focusIn = useCallback(() => {
        setSearchIsFocused(true)
    }, [])

    const focusOut = useCallback(() => {
        setSearchIsFocused(false)
    }, [])

    return (
        <FormControl
            variant={'standard'}
            sx={{
                mt: 1,
                ...sx,
            }}
        >
            <GGInputBase
                id={'search-input'}
                inputMode={'text'}
                onFocus={focusIn}
                onBlur={focusOut}
                startAdornment={(
                    <InputAdornment
                        position={'start'}
                        sx={{
                            position: 'absolute',
                            left: 16,
                        }}
                    >
                        <SearchIcon style={{ color: 'white' }}/>
                    </InputAdornment>
                )}
                sx={{
                    '& .MuiInputBase-input': {
                        pl: 6,
                        [theme.breakpoints.down('md')]: {
                            width: 'calc(100vw - 32px)',
                            maxWidth: '98vw',
                        },
                    },
                }}
                onChange={(event): void =>
                    store.setSearchPattern(event.target.value)}
            />
            {
                (store.searchPattern === '' && !searchIsFocused) &&
                <Typography
                    fontSize={16}
                    color={'gray'}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 48,
                    }}
                >
                    Search
                </Typography>
            }

        </FormControl>
    )
}

export default observer(Search)