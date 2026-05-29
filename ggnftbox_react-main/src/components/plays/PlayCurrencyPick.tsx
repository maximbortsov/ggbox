import { List, ListItem, ListItemButton, ListItemText, Theme, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material'
import React, { FC } from 'react'
import stores from '../../stores/Stores'
import { observer } from 'mobx-react-lite'
import { Currencies } from '../../utils/enums'


const PlayCurrencyPick: FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    return (
        isMobile ?
            // TODO: fix Uncaught TypeError: newValue.splice is not a function
            <ToggleButtonGroup
                value={stores.marketplace.pickedCurrency}
                onChange={
                    (event: React.MouseEvent<HTMLElement>, currency: Currencies): void =>
                        stores.marketplace.pickCurrency(currency)
                }
                sx={{
                    '& .MuiToggleButton-root': {
                        px: 3.25,
                        '&.Mui-selected': {
                            background: '#5d53d9',
                            color: 'white',
                        },
                        '&.Mui-disabled': {
                            background: 'transparent',
                            borderColor: '#5d53d9',
                            color: 'whitesmoke',
                        },
                    },
                }}
            >
                {/*<ToggleButton*/}
                {/*    value={Currencies.USD}*/}
                {/*    sx={{*/}
                {/*        color: 'white',*/}
                {/*        borderColor: '#5d53d9',*/}
                {/*        background: 'transparent',*/}
                {/*        '&:hover': {*/}
                {/*            background: '#5d53d9',*/}
                {/*            color: 'white',*/}
                {/*        },*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Typography variant={'h6'} fontFamily={'\'Montserrat\', sans-serif'}>*/}
                {/*        USD*/}
                {/*    </Typography>*/}
                {/*</ToggleButton>*/}
                {/*<ToggleButton*/}
                {/*    value={Currencies.Eth}*/}
                {/*    sx={{*/}
                {/*        color: 'white',*/}
                {/*        borderColor: '#5d53d9',*/}
                {/*        background: 'transparent',*/}
                {/*        '&:hover': {*/}
                {/*            background: '#5d53d9',*/}
                {/*            color: 'white',*/}
                {/*        },*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Typography variant={'h6'} fontFamily={'\'Montserrat\', sans-serif'}>*/}
                {/*        ETH*/}
                {/*    </Typography>*/}
                {/*</ToggleButton>*/}
                <ToggleButton
                    value={Currencies.FUSD}
                    sx={{
                        color: 'white',
                        borderColor: '#5d53d9',
                        background: 'transparent',
                        '&:hover': {
                            background: '#5d53d9',
                            color: 'white',
                        },
                    }}
                >
                    <Typography variant={'h6'} fontFamily={'\'Montserrat\', sans-serif'}>
                        FUSD
                    </Typography>
                </ToggleButton>
                <ToggleButton
                    value={Currencies.GG}
                    sx={{
                        color: 'white',
                        borderColor: '#5d53d9',
                        background: 'transparent',
                        '&:hover': {
                            background: '#5d53d9',
                            color: 'white',
                        },
                    }}
                >
                    <Typography variant={'h6'} fontFamily={'\'Montserrat\', sans-serif'} sx={{ color: 'gray' }}>
                        $GG
                    </Typography>
                </ToggleButton>

            </ToggleButtonGroup>
            :
            <List
                sx={{
                    border: '1px solid #554ADA',
                    py: 0,
                    '& .MuiListItem-root': {
                        textAlign: 'center',
                        ':hover': {
                            background: 'rgba(255,255,255,0.11)',
                        },
                        '&.Mui-selected': {
                            background: '#5d53d9',
                        },
                    },
                    '& .MuiListItemButton-root': {
                        py: 0.5,
                        px: 3,
                    },
                }}
            >
                {/*<ListItem*/}
                {/*    disablePadding*/}
                {/*    selected={stores.marketplace.pickedCurrency === Currencies.USD}*/}
                {/*>*/}
                {/*    <ListItemButton onClick={(): void => stores.marketplace.pickCurrency(Currencies.USD)}>*/}
                {/*        <ListItemText primary={'USD'}/>*/}
                {/*    </ListItemButton>*/}
                {/*</ListItem>*/}
                {/*<ListItem*/}
                {/*    disablePadding*/}
                {/*    selected={stores.marketplace.pickedCurrency === Currencies.Eth}*/}
                {/*>*/}
                {/*    <ListItemButton onClick={(): void => stores.marketplace.pickCurrency(Currencies.Eth)}>*/}
                {/*        <ListItemText primary={'ETH'}/>*/}
                {/*    </ListItemButton>*/}
                {/*</ListItem>*/}
                <ListItem
                    disablePadding
                    selected={stores.marketplace.pickedCurrency === Currencies.FUSD}
                >
                    <ListItemButton onClick={(): void => stores.marketplace.pickCurrency(Currencies.FUSD)}>
                        <ListItemText primary={'FUSD'}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding selected={stores.marketplace.pickedCurrency === Currencies.GG}>
                    <ListItemButton disabled>
                        <ListItemText primary={'$GG'}/>
                    </ListItemButton>
                </ListItem>
            </List>

    )
}

export default observer(PlayCurrencyPick)