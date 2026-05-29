import React, { FC } from 'react'
import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import stores from '../../stores/Stores'
import { Currencies } from '../../utils/enums'


const BoxCurrencyPick: FC<{ cost: number | undefined }> = ({ cost }) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleCurrencyPick = (newCurrency?: Currencies): void => {
        setAnchorEl(null)
        if (newCurrency !== undefined)
            stores.boxes.pickCurrency(newCurrency)
    }

    return (
        <Box
            width={'100%'}
            border={'2px solid #554ADA'}
            borderRadius={1.5}
        >
            <Box
                width={'60%'}
                display={'inline-block'}
                textAlign={'center'}
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        '& .MuiTypography-root': {
                            textDecoration: 'underline',
                        },
                    },
                }}
                aria-controls={'basic-menu'}
                aria-haspopup={'true'}
                aria-expanded={open ? 'true' : undefined}
                onClick={(event): void => setAnchorEl(event.currentTarget)}
            >
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                    <Typography
                        color={'white'}
                        fontFamily={'Montserrat'}
                        fontSize={'1.25rem'}
                        fontWeight={400}
                        sx={{
                            userSelect: 'none',
                            msUserSelect: 'none',
                        }}
                    >
                        {
                            stores.boxes.pickedCurrency === Currencies.USD ?
                                'USD'
                                :
                                `${stores.boxes.pickedCurrency}`
                        }
                    </Typography>
                    <KeyboardArrowDownIcon sx={{ color: 'white', fontSize: '1.375rem', ml: 1 }}/>
                </Stack>
            </Box>
            <Box
                width={'38%'}
                display={'inline-block'}
                textAlign={'center'}
                borderLeft={'2px solid #554ADA'}
                py={0.25}
            >
                <Typography
                    color={'white'}
                    fontFamily={'Montserrat'}
                    fontSize={'1.375rem'}
                    fontWeight={500}
                    sx={{
                        verticalAlign: 'middle',
                        userSelect: 'none',
                        msUserSelect: 'none',
                    }}
                >
                    {/*{*/}
                    {/*    stores.boxes.pickedCurrency === Currencies.Eth ?*/}
                    {/*        <img*/}
                    {/*            src={'https://img.icons8.com/color/24/000000/ethereum.png'}*/}
                    {/*            alt={'eth'}*/}
                    {/*            style={{*/}
                    {/*                height: '17px',*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*        :*/}
                    {/*        `${stores.boxes.pickedCurrency} `*/}
                    {/*}*/}
                    {'$ '}
                    {cost}
                </Typography>
            </Box>
            <Menu
                id={'demo-positioned-menu'}
                aria-labelledby={'demo-positioned-button'}
                anchorEl={anchorEl}
                open={open}
                onClose={(): void => handleCurrencyPick(undefined)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{
                    textAlign: 'center',
                    '& .MuiMenu-list': {
                        border: '1px solid #554ADA',
                    },
                }}
            >
                <MenuItem
                    onClick={(): void => handleCurrencyPick(Currencies.USD)}
                    sx={{
                        px: 4,
                        ':hover': { background: '#554ADA' },
                    }}
                >
                    USD
                </MenuItem>
                {/*<MenuItem*/}
                {/*    onClick={(): void => handleCurrencyPick(Currencies.FUSD)}*/}
                {/*    sx={{*/}
                {/*        px: 4,*/}
                {/*        ':hover': { background: '#554ADA' },*/}
                {/*    }}*/}
                {/*>*/}
                {/*    FUSD*/}
                {/*</MenuItem>*/}
                {/*<MenuItem*/}
                {/*    onClick={(): void => handleCurrencyPick(Currencies.Eth)}*/}
                {/*    sx={{*/}
                {/*        px: 4,*/}
                {/*        ':hover': { background: '#554ADA' },*/}
                {/*    }}*/}
                {/*>*/}
                {/*    ETH*/}
                {/*</MenuItem>*/}
                <MenuItem
                    onClick={(): void => handleCurrencyPick(Currencies.GG)}
                    disabled
                    sx={{
                        px: 4,
                        ':hover': { background: '#554ADA' },
                    }}
                >
                    GGNFT
                </MenuItem>
            </Menu>
        </Box>
    )
}

export default BoxCurrencyPick