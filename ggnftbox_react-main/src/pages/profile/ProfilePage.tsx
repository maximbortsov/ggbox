import React, { FC, useCallback, useEffect, useState } from 'react'
import {
    Box,
    Container,
    Grid,
    IconButton,
    styled,
    Tab,
    TabProps,
    Tabs,
    Theme,
    Tooltip,
    useMediaQuery,
} from '@mui/material'
import ProfileData from './components/ProfileDataTab'
import MyNftsTab from './components/MyNftsTab'
import OnSaleTab from './components/OnSaleTab'
import stores from '../../stores/Stores'
import { useNavigate } from 'react-router-dom'
import { getProfileInfo } from '../../services/userService'
import { Pages } from '../../utils/routes'
import { observer } from 'mobx-react-lite'
import ProfileInfo from './components/ProfileInfo'
import GuideDialog from './components/GuideDialog'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { authInBlocto } from '../../services/flowService'


const ProfileTab = styled(Tab)<TabProps>(({ theme }) => ({
    width: 140,
    color: 'white',
    '&:after': {
        content: '""',
        width: 140,
        height: 2,
        transition: 'all 0.2s linear',
        background: 'linear-gradient(270deg, #554ADA, #F34297)',
        opacity: 0,
    },
    '&.Mui-selected': {
        color: 'white',
        '&:after': {
            opacity: 1,
        },
    },
}))

const ProfilePage: FC = () => {
    const [page, setPage] = useState(0)
    const [guideOpen, setGuideOpen] = useState(false)

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const navigate = useNavigate()

    const handleChange = useCallback((event: React.SyntheticEvent, newValue: number): void => {
        setPage(newValue)
    }, [])

    const closeGuide = useCallback(() => {
        setGuideOpen(false)
        localStorage.setItem('firstVisit', 'false')
    }, [])

    const openGuide = useCallback(() => {
        setGuideOpen(true)
    }, [])

    const tabs = (
        <Tabs
            value={page}
            onChange={handleChange}
            variant={'scrollable'}
            scrollButtons={false}
            allowScrollButtonsMobile
            sx={{
                '& .MuiTabs-flexContainer': {
                    justifyContent: { xs: 'start', sm: 'center' },
                },
            }}
            TabScrollButtonProps={{ sx: { color: 'white' } }}
        >
            <ProfileTab
                label={'My moments'}
            />
            <ProfileTab
                label={'On sale'}
            />
            <ProfileTab
                label={'Profile data'}
            />
        </Tabs>
    )

    useEffect(() => {
        const firstVisit = localStorage.getItem('firstVisit')
        if (!firstVisit || firstVisit === '-1') {
            openGuide()
        }

        if (stores.tokenStore.accessToken) {
            getProfileInfo()
                .then((response) => {
                    if (response.statusCode === 401) {
                        return response.message === 'Confirm your email first' ?
                            navigate(Pages.SIGN_UP)
                            :
                            authInBlocto()
                    }

                    stores.profile.updateUserInfo(response)
                })
                .catch((err) => {
                    console.error(err)
                })
        } else {
            console.log('please auth')
            void authInBlocto()
        }
    }, [])

    return (
        <>
            <Container
                maxWidth={'lg'}
                sx={{
                    mt: isMobile ? 0 : -8,
                    mb: isMobile ? 0 : 8,
                }}
            >
                <Grid container spacing={6}>
                    <Grid
                        item
                        xs={12}
                        md={4}
                        lg={3}
                    >
                        <Box position={'relative'}>
                            <ProfileInfo/>
                            <Box
                                position={'absolute'}
                                top={8}
                                right={8}
                            >
                                <Tooltip arrow title={'Help'}>
                                    <IconButton
                                        onClick={openGuide}
                                    >
                                        <QuestionMarkIcon
                                            fontSize={'medium'}
                                            sx={{
                                                color: 'white',
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Grid>

                    {
                        isMobile &&
                        <Grid item xs={12}>
                            {tabs}
                        </Grid>
                    }

                    <Grid
                        item
                        xs={12}
                        md={8}
                        lg={9}
                    >
                        {!isMobile && tabs}
                        <MyNftsTab value={page} index={0}/>
                        <OnSaleTab value={page} index={1}/>
                        <ProfileData value={page} index={2}/>
                    </Grid>
                </Grid>
            </Container>
            <GuideDialog open={guideOpen} closeDialog={closeGuide}/>
        </>
    )

}

export default observer(ProfilePage)
