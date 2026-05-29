import React, { FC, useCallback, useMemo, useState } from 'react'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import ReactPlayer from 'react-player'
import BuyWithCostButton from '../BuyWithCostButton'
import SaleBtn from '../SaleBtn'
import CancelLotBtn from '../CancelLotBtn'
import { Play } from '../../entities/Play'
import { AssetsPath } from '../../utils/api'
import { rarityColor } from '../../utils/colors'
import { Currencies } from '../../utils/enums'
import { Edition } from '../../entities/Edition'


export interface PlayCardProps {
    play: Play
    type?: 'sale' | 'cancel' | 'default'
    onClick(): void
}


export const PlayCard: FC<PlayCardProps> = ({ play, onClick, type }) => {

    const edition = useMemo(() => play.editions ? play.editions[0] : new Edition(), [play.editions])
    const [isPlaying, setIsPlaying] = useState(false)
    const [videoStyle, setVideoStyle] = useState({
        border: '3px solid transparent',
        borderImage: '',
        borderImageSlice: 1,
    })

    const [rotation, setRotation] = useState(0)

    const playVideo = useCallback(() => {
        setIsPlaying(true)
        setVideoStyle({
            border: '3px solid transparent',
            borderImage: 'linear-gradient(90deg, rgba(85,74,218,1) 0%, rgba(244,64,148,1) 100%)',
            borderImageSlice: 1,
        })

        setRotation(7)
        setTimeout(() => {
            setRotation(0)
        }, 400)
    }, [])

    const pauseVideo = useCallback(() => {
        setIsPlaying(false)
        setVideoStyle({
            border: '3px solid transparent',
            borderImage: '',
            borderImageSlice: 1,
        })
        setRotation(0)
    }, [])

    const handleClick = useCallback(() => {
        pauseVideo()
        onClick()
    }, [onClick, pauseVideo])

    const getRarityColor = useCallback((): string => rarityColor(edition.rarity), [edition])

    let actionButton: JSX.Element = (
        <BuyWithCostButton
            cost={play.lowestAsk}
            currency={Currencies.FUSD}
            onClick={onClick}
        />
    )

    switch (type) {
        case 'sale': {
            actionButton = (
                <SaleBtn
                    onClick={onClick}
                />
            )
            break
        }
        case 'cancel': {
            actionButton = (
                <CancelLotBtn
                    cost={play.lowestAsk ?? 0}
                    onClick={onClick}
                />
            )
            break
        }
    }

    return (
        <Box
            width={'100%'}
            sx={{
                perspective: '400px',
                transformStyle: 'preserve-3d',
            }}
        >
            <Box
                onMouseEnter={playVideo}
                onMouseLeave={pauseVideo}
                onClick={handleClick}
                sx={{
                    transition: 'all 1s ease-in',
                    transform: `rotate3d(${play.nftNum ?? 0 % 2 == 0 ? 1 : -1},-1,0,${rotation}deg)`,
                    cursor: 'pointer',
                    ...videoStyle,
                }}
            >
                <ReactPlayer
                    url={play.pinataUrl}
                    width={'100%'}
                    height={'100%'}
                    playing={isPlaying}
                    volume={0}
                    style={{
                        display: 'flex',
                        aspectRatio: '16/9',
                        objectFit: 'cover',
                    }}
                />
            </Box>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                mt={1.5}
                mx={0.75}
            >
                <Typography color={'white'} fontSize={'1rem'}>
                    {play.name}
                </Typography>
                <Typography
                    color={getRarityColor}
                    fontFamily={'Montserrat'}
                    fontSize={'1rem'}
                    fontWeight={300}
                >
                    ●
                    {' '}
                    {edition.rarity}
                </Typography>
            </Stack>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                mt={0.5}
                mx={0.75}
            >
                <Stack direction={'row'} alignItems={'center'}>
                    <Avatar
                        src={AssetsPath + play.streamer?.avatar}
                        sx={{
                            width: 28,
                            height: 28,
                            marginRight: 1,
                        }}
                    />
                    <Typography color={'white'} fontWeight={300} fontSize={'1rem'}>
                        @
                        {play.streamer?.name}
                    </Typography>
                </Stack>
                <Typography color={'white'} fontWeight={300} fontSize={'1rem'}>
                    # /
                    {' '}
                    {edition.maxMintSize}
                </Typography>
            </Stack>
            {actionButton}
        </Box>
    )
}
