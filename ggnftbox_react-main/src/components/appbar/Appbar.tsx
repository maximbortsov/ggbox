import * as React from 'react'
import { FC, useCallback, useEffect, useState } from 'react'
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Stack,
    SvgIcon,
    Theme,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'

import logo from '../../assets/images/logoWhite.svg'
import { Pages } from '../../utils/routes'
import { useNavigate } from 'react-router-dom'
import stores from '../../stores/Stores'
import { observer } from 'mobx-react-lite'
import { ApiSource, AssetsPath } from '../../utils/api'
import { User } from '../../entities/User'
import { plainToInstance } from 'class-transformer'
import { useQuery } from 'react-query'
import { http } from '../../utils/http'
import * as fcl from '@onflow/fcl'
import blocto from '../../assets/icons/companiesLogos/blocto.svg'
import { authInBlocto, fetchFUSDBalance, logOutBlocto } from '../../services/flowService'


interface NavPage {
    name: string
    link: Pages
}


const navPages = [
    {
        name: 'MARKETPLACE',
        link: Pages.MARKETPLACE,
    },
    {
        name: 'NFT BOX',
        link: Pages.BOXES,
    },
    {
        name: 'ABOUT US',
        link: Pages.ABOUT_US,
    },
]

const menuPages = [
    {
        name: 'Profile',
        link: Pages.PROFILE,
    },
    {
        name: 'My boxes',
        link: Pages.PURCHASED_BOXES,
    },
]

const mobileMenuPages = [
    {
        name: 'Profile',
        link: Pages.PROFILE,
    },
    {
        name: 'Marketplace',
        link: Pages.MARKETPLACE,
    },
    {
        name: 'BOX',
        link: Pages.BOXES,
    },
    {
        name: 'My boxes',
        link: Pages.PURCHASED_BOXES,
    },
    {
        name: 'About us',
        link: Pages.ABOUT_US,
    },
]

const GGAppBar: FC = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    const handleOpenNavMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget)
    }, [])

    const handleCloseNavMenu = (link: Pages): void => {
        setAnchorElNav(null)
        navigate(link)
    }

    const handleLogoutNavMenu = useCallback(async () => {
        await logOutBlocto()
        setAnchorElNav(null)
        navigate(Pages.MAIN)
    }, [navigate])

    const navigateToMainPage = useCallback(() => {
        navigate(Pages.MAIN)
    }, [navigate])

    useEffect(() => {
        if (stores.tokenStore.accessToken) {
            stores.appBar.authorize()
        } else {
            stores.appBar.logout()
        }
    }, [stores.tokenStore.accessToken])

    const fetchCurrentUser = async (): Promise<User> => http
        .get(ApiSource + 'user/me')
        .then((res) => plainToInstance(User, res.data))

    const user = useQuery('currentUser', fetchCurrentUser)

    // Авторизованный юзер из Блокто
    const [bloctoUser, setBloctoUser] = useState<any>(null)
    const [balance, setBalance] = useState<number>(0)

    useEffect(() => {
        // Получение залогиненного (в блокто) юзера
        fcl.currentUser.subscribe(setBloctoUser)
    }, [])

    // Авторизоваться / разлогиниться в блокто
    const handleConnectBlocto = async (): Promise<void> => {
        if (bloctoUser?.loggedIn) {
            fcl.currentUser.unauthenticate()
        } else {
            await authInBlocto()
        }
    }

    // обновить баланс после логина / изменения юзера
    useEffect(() => {
        fetchFUSDBalance()
            .then((res) => setBalance(res))
            .catch((e) => console.error(e))
    }, [bloctoUser, stores.appBar.refetchBalance])

    return (
        <AppBar
            position={'static'}
            elevation={0}
            sx={{
                background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%)',
                height: 180,
                [theme.breakpoints.down('md')]: {
                    height: 100,
                },
            }}
        >
            <Container maxWidth={'lg'}>
                <Toolbar disableGutters>
                    {/* Mobile centered logo */}
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        sx={{
                            flexGrow: isMobile ? 1 : 0,
                            cursor: 'pointer',
                        }}
                        onClick={navigateToMainPage}
                    >
                        <SvgIcon
                            component={logo}
                            viewBox={'0 0 137.74 118.43'}
                            sx={{
                                width: 'auto',
                                height: 48,
                                py: 2,
                                px: 0.5,
                                display: 'inline',
                            }}
                        />
                    </Stack>

                    {/* Centered big screed navigation */}
                    {
                        !isMobile &&
                        <Stack
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            spacing={12}
                            sx={{
                                flexGrow: 1,
                            }}
                        >
                            {
                                navPages.map((page: NavPage) => (
                                    <Link
                                        key={page.name}
                                        onClick={(): void => navigate(page.link)}
                                        sx={{
                                            my: 2,
                                            color: 'white',
                                            display: 'block',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Typography>
                                            {page.name}
                                        </Typography>
                                    </Link>
                                ))
                            }
                        </Stack>
                    }

                    {/* PROFILE pic for both pc and mobile*/}
                    <Box flexGrow={0}>
                        {
                            bloctoUser?.loggedIn ?
                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    spacing={2}
                                >
                                    <Typography variant={'h6'} fontFamily={'"Montserrat", sans-serif'}>
                                        {`${balance.toFixed(3)} FUSD`}
                                    </Typography>

                                    <Box>
                                        <Tooltip title={'Menu'}>
                                            <IconButton
                                                sx={{ p: 0 }}
                                                onClick={handleOpenNavMenu}
                                                aria-label={'menu-mobile'}
                                                aria-controls={'menu-appbar'}
                                                aria-haspopup={'true'}
                                            >
                                                <Avatar
                                                    src={AssetsPath + (user.data?.avatar ?? '')}
                                                    alt={'User\'s avatar'}
                                                    sx={{
                                                        border: '0.5px solid #fff',
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            id={'menu-appbar'}
                                            anchorEl={anchorElNav}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElNav)}
                                            onClose={handleCloseNavMenu}
                                            sx={{
                                                mt: 2,
                                                '& .MuiMenu-list': {
                                                    background: (theme: Theme): string => theme.palette.primary.main,
                                                    border: '1px solid #554ADA',
                                                },
                                            }}
                                        >
                                            {
                                                (isMobile ? mobileMenuPages : menuPages).map((page) => (
                                                    <MenuItem
                                                        key={page.name}
                                                        onClick={(): void => handleCloseNavMenu(page.link)}
                                                        sx={{
                                                            ':hover': { background: '#554ADA' },
                                                        }}
                                                    >
                                                        <Typography textAlign={'center'}>
                                                            {page.name}
                                                        </Typography>
                                                    </MenuItem>
                                                ))
                                            }
                                            <MenuItem
                                                onClick={(): void => void handleLogoutNavMenu()}
                                                sx={{
                                                    ':hover': { background: '#554ADA' },
                                                }}
                                            >
                                                <Typography textAlign={'center'}>
                                                    Log out
                                                </Typography>
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                </Stack>
                                :
                                <Button
                                    variant={'contained'}
                                    disableElevation
                                    onClick={(): void => void handleConnectBlocto()}
                                    sx={{
                                        background: '#554ADA',
                                        borderRadius: 1,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        fontFamily: '"Raleway", sans-serif',
                                        ':hover': {
                                            background: '#5d53d9',
                                        },
                                        // долго пытался сделать неоморфизм дизайн на карточки моментов, сдался
                                        boxShadow: '1px 1px 10px #584fce, -1.5px -1.5px 10px #6257e4',
                                    }}
                                >
                                    <SvgIcon component={blocto}/>
                                    <Typography variant={'body2'} fontWeight={'bold'}>
                                        Connect Blocto
                                    </Typography>
                                </Button>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default observer(GGAppBar)