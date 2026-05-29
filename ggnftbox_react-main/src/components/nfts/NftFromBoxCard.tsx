import React, { FC, useCallback, useState } from 'react'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import ReactPlayer from 'react-player'
import { AssetsPath } from '../../utils/api'
import { rarityColor } from '../../utils/colors'
import { Nft } from '../../entities/Nft'
import { GGChip } from '../GGChip'
import { Play } from '../../entities/Play'
import { Edition } from '../../entities/Edition'


export const NftFromBoxCard: FC<{ nft: Nft }> = ({ nft }) => {

    const edition = nft.edition ?? new Edition()
    const play = edition.play ?? new Play()
    const descLimit = 20
    const isLimit = play.desc && play.desc.length > descLimit

    const [videoStyle, setVideoStyle] = useState({
        border: '3px solid transparent',
        borderImage: '',
        borderImageSlice: 1,
    })
    const [isShowMoreShown, setIsShowMoreShown] = useState(true)
    const [rotation, setRotation] = useState(0)

    const handleShowMore = useCallback(() => {
        setIsShowMoreShown(!isShowMoreShown)
    }, [isShowMoreShown])

    const playVideo = useCallback(() => {
        setVideoStyle({
            border: '3px outset transparent',
            borderImage: 'linear-gradient(90deg, rgba(85,74,218,1) 0%, rgba(244,64,148,1) 100%)',
            borderImageSlice: 1,
        })

        setRotation(7)
        setTimeout(() => {
            setRotation(0)
        }, 400)
    }, [])

    const pauseVideo = useCallback(() => {
        setVideoStyle({
            border: '3px solid transparent',
            borderImage: '',
            borderImageSlice: 1,
        })
        setRotation(0)
    }, [])

    const getRarityColor = useCallback((): string => rarityColor(edition.rarity), [edition.rarity])

    return (
        <Box
            sx={{
                p: 4,
                background: '#080E24',
                borderRadius: 2,
                boxShadow: '13px 13px 29px #050917, -13px -13px 29px #0b1331;',
            }}
        >
            <Box
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
                    onPlay={playVideo}
                    onPause={pauseVideo}
                    controls
                    style={{
                        display: 'flex',
                        aspectRatio: '16/9',
                        objectFit: 'contain',
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
                    {'# '}
                    {nft.serialNumber}
                    {' / '}
                    {edition.maxMintSize}
                </Typography>
            </Stack>

            <Box
                width={'100%'}
                textAlign={'start'}
                mx={0.75}
            >
                <Typography variant={'subtitle1'} mt={2}>
                    Description
                </Typography>
                <Typography variant={'body2'}>
                    {play.desc}
                </Typography>
            </Box>

            <Stack
                direction={'row'}
                spacing={2}
                mt={2}
                mx={0.75}
            >
                {
                    nft.edition?.play?.tags?.map((tag) =>
                        <GGChip key={tag.id} tag={tag.name}/>,
                    )
                }
            </Stack>
        </Box>
    )
}
