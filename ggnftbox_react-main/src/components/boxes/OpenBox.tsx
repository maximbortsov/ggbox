import React, { FC, useCallback, useState } from 'react'
import ReactPlayer from 'react-player'
import { Box, Button, Dialog, Grid, Stack, Theme, Typography, useMediaQuery, Zoom } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Pages } from '../../utils/routes'
import stores from '../../stores/Stores'
import { NftFromBoxCard } from '../nfts/NftFromBoxCard'
import { Nft } from '../../entities/Nft'
import { GGBox } from '../../entities/GGBox'
import { AssetsPath } from '../../utils/api'


const OpenBox: FC<{ handleClose(): void; box: GGBox; nfts: Nft[] }> = ({ handleClose, box, nfts }) => {

    const navigate = useNavigate()
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const [videoIsShown, setVideoIsShown] = useState<boolean>(false)

    const videoUrl = box.openVideo
    const mobileVideoUrl = box.openMobileVideo

    const onVideoEnded = useCallback(() => {
        setVideoIsShown(true)
    }, [])

    const handleNavigateBack = useCallback(() => {
        handleClose()
    }, [handleClose])

    const handleNavigateToProfile = useCallback(() => {
        navigate(Pages.PROFILE)
        stores.main.closeBoxInfo()
        stores.boxes.closeBoxInfo()
    }, [navigate])

    return (
        <Dialog
            open
            fullScreen
        >
            <Box
                width={'100%'}
                height={'100%'}
                sx={{
                    background: 'rgb(8,13,41)',
                    // overflow: isMobile ? 'scroll' : 'hidden',
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {
                    !videoIsShown ?
                        <ReactPlayer
                            playing
                            url={AssetsPath + (isMobile ? mobileVideoUrl : videoUrl)}
                            width={'100%'}
                            height={'100%'}
                            controls={false}
                            onEnded={onVideoEnded}
                            style={{
                                objectPosition: 'center center',
                            }}
                        />
                        :
                        <Box
                            width={{ xs: 1, lg: 0.8 }}
                            height={1}
                            textAlign={'center'}
                        >
                            <Zoom in={videoIsShown} style={{ transitionDelay: '250ms' }}>
                                <Typography
                                    variant={'h4'}
                                    mt={4}
                                    pb={4}
                                    sx={{
                                        width: '100%',
                                    }}
                                >
                                    Congratulations!
                                </Typography>
                            </Zoom>
                            <Grid
                                container
                                justifyContent={'space-between'}
                                rowSpacing={{ xs: 6, md: 0 }}
                                columnSpacing={{ xs: 0, md: 3 }}
                                py={4}
                                sx={{
                                    width: '100%',
                                    overflow: 'hidden',
                                    ':last-of-type': {
                                        pr: 0.5,
                                    },
                                }}
                            >
                                {
                                    nfts.map((nft) => (
                                        <Grid
                                            key={nft.id}
                                            item
                                            xs={12}
                                            md={4}
                                        >
                                            <Zoom in={videoIsShown} style={{ transitionDelay: '1000ms' }}>
                                                <Box>
                                                    <NftFromBoxCard
                                                        nft={nft}
                                                    />
                                                </Box>
                                            </Zoom>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                            <Stack
                                direction={isMobile ? 'column' : 'row'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                spacing={4}
                                mt={5}
                                pb={12}
                            >
                                <Button
                                    variant={'outlined'}
                                    onClick={handleNavigateBack}
                                    // onClick={() => stores.appBar.authorize()}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        borderRadius: 1,
                                        px: 3,
                                        py: 1,
                                        ':hover': {
                                            borderColor: '#d5d4d4',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant={'h4'}
                                        fontFamily={'"Montserrat", sans-serif'}
                                        fontWeight={500}
                                        textTransform={'none'}
                                    >
                                        Back to box
                                    </Typography>
                                </Button>
                                <Button
                                    variant={'contained'}
                                    disableElevation
                                    onClick={handleNavigateToProfile}
                                    sx={{
                                        background: '#554ADA',
                                        borderRadius: 1,
                                        px: 3,
                                        py: 1,
                                        ':hover': {
                                            background: '#5d53d9',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant={'h4'}
                                        fontFamily={'"Montserrat", sans-serif'}
                                        fontWeight={500}
                                        textTransform={'none'}
                                    >
                                        Watch moments in Profile
                                    </Typography>
                                </Button>
                            </Stack>
                        </Box>
                }
            </Box>
        </Dialog>
    )
}

export default OpenBox
