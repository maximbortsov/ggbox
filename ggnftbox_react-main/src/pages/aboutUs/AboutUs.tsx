import React from 'react'
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material'
import backgroundLines1 from '../../assets/images/background/bgLinesAboutUs1.png'
import backgroundLines2 from '../../assets/images/background/bgLinesAboutUs2.png'
import backgroundLines3 from '../../assets/images/background/bgLinesAboutUs3.png'
import backgroundLines4 from '../../assets/images/background/bgLinesAboutUs4.png'
import playBtn from '../../assets/icons/playbtn.svg'
import boxPreview from '../../assets/images/boxPreview.png'
import BoxImage from '../../components/boxes/BoxImage'
import Advantages from './components/Advantages'
import AboutUsArticle from './components/AboutUsArticle'
import poliDi from '../../assets/images/aboutUs/poliDi.png'
import OurPartners from './components/OurPartners'
import JoinUs from './components/JoinUs'
import LogoAboutUs from '../../assets/images/aboutUs/logoAboutUs.png'
import LogoAboutUsBack from '../../assets/images/aboutUs/logoAboutUsBack.png'
import AboutUsVideoPlay from './components/AboutUsVideoPlay'
import stores from '../../stores/Stores'
import unforgettableMoments from '../../assets/images/aboutUs/unforgettableMoments.png'
import '../../assets/css/animation.css'


const AboutUsPage: React.FC = () => (
    <Container fixed>
        <img
            src={backgroundLines1}
            alt={'bg'}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                overflow: 'hidden',
                objectFit: 'cover',
                zIndex: -1,
            }}
        />
        <img
            src={backgroundLines2}
            alt={'bg'}
            style={{
                position: 'absolute',
                left: 0,
                top: '921px',
                width: '100%',
                overflow: 'hidden',
                objectFit: 'cover',
                zIndex: -1,
            }}
        />
        <img
            src={backgroundLines3}
            alt={'bg'}
            style={{
                position: 'absolute',
                left: 0,
                top: '1215px',
                width: '100%',
                overflow: 'hidden',
                objectFit: 'cover',
                zIndex: -1,
            }}
        />
        <img
            src={backgroundLines4}
            alt={'bg'}
            style={{
                position: 'absolute',
                left: 0,
                top: '200%',
                width: '100%',
                overflow: 'hidden',
                objectFit: 'cover',
                zIndex: -1,
            }}
        />
        <Typography
            variant={'h4'}
            align={'center'}
            sx={{ mt: 5, mb: 6 }}
            fontWeight={'900'}
        >
            {'ABOUT US\r'}
        </Typography>
        <Stack alignItems={'center'}>
            <AboutUsArticle
                title={'GGNFTBOX'}
                text={
                    [
                        'GGNFTBOX is a blockchain-based NFT marketplace that provides fair and trust approach to increase value ' +
                        'of streaming content.',
                        'We give opportunities to all streamers, gamers, bloggers to monetize their content and earn money.',
                        'Their fans can collect, earn and trade highlights',
                    ]
                }
                imageComponent={(
                    <Box
                        width={'90%'}
                        position={'relative'}
                        ml={'auto'}
                        sx={{
                            animation: 'logoMove 5000ms linear infinite',
                            transition: 'all 0.3s linear',
                            '& .logoBack': {
                                opacity: 0,
                            },
                            '&:hover': {
                                transform: 'translate(0, -30px)',
                                '& .logoBack': {
                                    opacity: 1,
                                    transform: 'translate(0, 60px)',
                                },
                            },
                        }}
                    >
                        <img
                            className={'logoBack'}
                            src={LogoAboutUsBack}
                            width={'100%'}
                            height={'100%'}
                            alt={'aboutUsWinWin'}
                            style={{ transition: 'all 0.3s linear', position: 'absolute' }}
                        />
                        <img
                            src={LogoAboutUs}
                            width={'100%'}
                            height={'100%'}
                            alt={'aboutUsWinWin'}
                            style={{ transition: 'all 0.3s linear' }}
                        />
                    </Box>
                )}
            />
            <AboutUsArticle
                title={'YOUR FAVORITE CREATORS'}
                text={
                    [
                        'The best creators on Twitch and Youtube join the GGNFTBOX.',
                        'No matter that games or genres you enjoy, chances are your favorite creators are already' +
                        ' here',
                    ]
                }
                imageComponent={(
                    <Box width={'70%'}>
                        <BoxImage boxImagePath={boxPreview} alwaysShowBorder/>
                    </Box>
                )}
                isImageLeft
            />
            <AboutUsArticle
                title={'UNFORGETTABLE MOMENTS'}
                widthImage={7}
                text={['GGNFTBOX turns the highlights into digital collectibles that you can be proud and show everyone']}
                // later we can add video component in imageComponent prop
                imageComponent={(
                    <Box
                        sx={{
                            position: 'relative',
                        }}
                        ml={'auto'}
                    >
                        <div
                            style={{
                                'top': '50%',
                                'zIndex': 1,
                                'transform': 'translate(0%, -50%) scale(0.7)',
                                'position': 'absolute',
                            }}
                        >
                            <img src={unforgettableMoments} alt={'none'}/>
                            <SvgIcon
                                component={playBtn}
                                style={{
                                    border: 'none',
                                    position: 'absolute',
                                    height: '15px',
                                    width: '15px',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    zIndex: 6,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                position: 'relative',
                                zIndex: 3,
                            }}
                        >
                            <img
                                style={{
                                    boxSizing: 'border-box',
                                    border: '1px solid #FFFFFF',
                                    margin: 'auto',
                                }}
                                src={unforgettableMoments}
                                alt={'none'}
                            />
                            <SvgIcon
                                component={playBtn}
                                style={{
                                    border: 'none',
                                    position: 'absolute',
                                    height: '28px',
                                    width: '28px',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    zIndex: 6,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                'zIndex': 1,
                                'top': '50%',
                                'right': 0,
                                'transform': 'translate(0%, -50%) scale(0.7)',
                                'position': 'absolute',
                            }}
                        >
                            <img src={unforgettableMoments} alt={'none'}/>
                            <SvgIcon
                                component={playBtn}
                                style={{
                                    border: 'none',
                                    position: 'absolute',
                                    height: '15px',
                                    width: '15px',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    zIndex: 6,
                                }}
                            />
                        </div>
                    </Box>
                )}
            />
            <AboutUsArticle
                title={'UNIQUE COLLECTIONS'}
                text={
                    [
                        'Highlights collectibles have different rarity tiers: COMMON, RARE, LEGENDARY.',
                        'Become a top collector after buying of demanded NFT BOX when they drop',
                    ]
                }
                imageComponent={(
                    <Box width={'70%'}>
                        <AboutUsVideoPlay play={stores.aboutUs.uniqueCollectionPlay}/>
                    </Box>
                )}
                isImageLeft
            />
            <AboutUsArticle
                title={'WIN-WIN'}
                text={
                    [
                        'Whenever you trade the moments, a small percentage of the revenue return ' +
                        'to the creators and promote their growth',
                    ]
                }
                imageComponent={(
                    <Box
                        width={'70%'}
                        position={'relative'}
                        ml={'auto'}
                        sx={{
                            animation: 'logoMove 6000ms linear infinite',
                            transition: 'all 0.3s linear',
                            '&:after': {
                                content: '""',
                                width: '101%',
                                height: '101%',
                                position: 'absolute',
                                left: '-10px',
                                top: '-10px',
                                background: '#554ADA',
                                zIndex: -2,
                            },
                            '&:hover': {
                                transform: 'translate(-10px, -10px)',
                                '& img': {
                                    transform: 'translate(20px, 20px)',
                                },
                            },
                        }}
                    >
                        <img
                            src={poliDi}
                            width={'100%'}
                            height={'100%'}
                            alt={'aboutUsWinWin'}
                            style={{ transition: 'all 0.3s linear' }}
                        />
                    </Box>
                )}
            />
            <Advantages/>
            <OurPartners/>
            <JoinUs/>
        </Stack>

    </Container>
)

export default AboutUsPage
