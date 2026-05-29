import { observer } from 'mobx-react-lite'
import { FormControl, MenuItem, Select, SelectChangeEvent, Theme, Typography, useMediaQuery } from '@mui/material'
import MarketplaceStore from '../../pages/marketplace/MarketplaceStore'
import { GGInputBase } from '../GGInputBase'
import React, { FC } from 'react'
import BoxesStore from '../../pages/boxes/BoxesStore'
import { Sorts } from '../../utils/enums'


const SortBy: FC<{ sortedStore: MarketplaceStore | BoxesStore }> = ({ sortedStore }) => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    return (
        <>
            {
                !isMobile &&
                <Typography variant={'body1'} pr={2} display={'inline'}>
                    Sort by
                </Typography>
            }
            <FormControl>
                <Select
                    value={sortedStore.sortPattern}
                    onChange={(event: SelectChangeEvent): void =>
                        sortedStore.setSortPattern(event.target.value as Sorts)}
                    input={(
                        <GGInputBase
                            sx={{
                                '& .MuiInputBase-input': {
                                    width: 'unset',
                                },
                                '& .MuiSelect-iconOutlined': {
                                    color: 'white',
                                },
                            }}
                        />
                    )}
                >
                    <MenuItem value={Sorts.Newest}>
                        Newest
                    </MenuItem>
                    <MenuItem value={Sorts.PriceUp}>
                        Price △
                    </MenuItem>
                    <MenuItem value={Sorts.PriceDown}>
                        Price ▽
                    </MenuItem>
                    {/*<MenuItem value={Sorts.LotsUp}>*/}
                    {/*    Lots count △*/}
                    {/*</MenuItem>*/}
                    {/*<MenuItem value={Sorts.LotsDown}>*/}
                    {/*    Lots count ▽*/}
                    {/*</MenuItem>*/}
                </Select>
            </FormControl>
        </>
    )
}

export default observer(SortBy)