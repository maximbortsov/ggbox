import 'reflect-metadata'
import React from 'react'
import ReactDOM from 'react-dom'
import * as fcl from '@onflow/fcl'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './pages/main/Main'
import { Pages } from './utils/routes'
import { Box, ThemeProvider } from '@mui/material'
import theme from './utils/theme'
import GGAppBar from './components/appbar/Appbar'
import ProfilePage from './pages/profile/ProfilePage'
import MarketplacePage from './pages/marketplace/Marketplace'
import BoxesPage from './pages/boxes/Boxes'
import Deposit from './pages/deposit/Deposit'
import AboutUs from './pages/aboutUs/AboutUs'
import GGFooter from './components/Footer'
import UserGlobalStyles from './utils/UserGlobalStyles'
import NewPassword from './pages/resetPassword/NewPassword'
import { QueryClient, QueryClientProvider } from 'react-query'
// import AdminPanel from './pages/adminPanel/AdminPanel'
import { ReactQueryDevtools } from 'react-query/devtools'
import ScrollToTop from './utils/ScrollToTop'
import VerifyEmail from './pages/verifyEmail/VerifyEmail'
import GGSnackbar from './components/GGSnackbar'
import Error404 from './pages/404/404'
import TermsOfService from './pages/termsOfService/TermsOfService'
import SummarizePayment from './pages/payment/SummarizePayment'
import PurchasedBoxes from './pages/boxes/MyBoxes'
import { accountProofResolver } from './services/flowService'


const queryClient = new QueryClient()

fcl.config()
    .put('flow.network', 'testnet')
    .put('accessNode.api', 'https://rest-testnet.onflow.org')
    .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
    .put('app.detail.title', 'GGNFTBOX')
    .put('app.detail.icon', 'https://sun9-50.userapi.com/impf/DuZBXnkPYtzQqrH0hYpQ9t2kaBbp0dAW48UWqQ/yj1dhMlp5gU.jpg?size=1520x1402&quality=96&sign=feb63f710c8901d49f72b1888bffbf9a&type=album')
    .put('0xGGCORE', '0x61da1a7a40700bf4')
    .put('0xGGMARKETFEE', '0x61da1a7a40700bf4')
    .put('0xGGMARKET', '0x61da1a7a40700bf4')
    .put('0xGGMETADATA', '0x61da1a7a40700bf4')
    .put('0xGGINFLUENCERSYSTEM', '0x61da1a7a40700bf4')
    .put('0xFUNGIBLETOKEN', '0x9a0766d93b6608b7')
    .put('0xNFTADDRESS', '0x631e88ae7f1d7c20')
    .put('0xFUSD', '0xe223d8a629e49c68')
    .put('0xMETADATAVIEWS', '0x631e88ae7f1d7c20')
    .put('fcl.accountProof.resolver', accountProofResolver)

ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <UserGlobalStyles theme={theme}/>
                <BrowserRouter>
                    <GGAppBar/>
                    <ScrollToTop>
                        <Box flex={1}>
                            <Routes>
                                <Route path={Pages.MAIN} element={<Main/>}/>
                                <Route path={Pages.PROFILE} element={<ProfilePage/>}/>
                                <Route path={Pages.MARKETPLACE} element={<MarketplacePage/>}/>
                                <Route path={Pages.BOXES} element={<BoxesPage/>}/>
                                <Route path={Pages.DEPOSIT} element={<Deposit/>}/>
                                <Route path={Pages.ABOUT_US} element={<AboutUs/>}/>
                                {/*<Route path={Pages.SIGN_UP} element={<SignUp/>}/>*/}
                                {/*<Route path={Pages.AUTH} element={<Auth/>}/>*/}
                                {/*<Route path={Pages.RESET_PASSWORD} element={<ResetPassword/>}/>*/}
                                <Route path={Pages.SET_NEW_PASSWORD} element={<NewPassword/>}/>
                                {/*<Route path={Pages.ADMIN_PANEL} element={<AdminPanel/>}/>*/}
                                <Route path={Pages.VERIFY_EMAIL} element={<VerifyEmail/>}/>
                                <Route path={Pages.PAYMENT_SUMMARY} element={<SummarizePayment/>}/>
                                <Route path={Pages.PURCHASED_BOXES} element={<PurchasedBoxes/>}/>
                                <Route path={Pages.TERMS_OF_SERVICE} element={<TermsOfService/>}/>
                                <Route path={'*'} element={<Error404/>}/>
                            </Routes>
                        </Box>
                    </ScrollToTop>
                    <GGFooter/>
                    <GGSnackbar/>
                    <ReactQueryDevtools/>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById('root'),
)
