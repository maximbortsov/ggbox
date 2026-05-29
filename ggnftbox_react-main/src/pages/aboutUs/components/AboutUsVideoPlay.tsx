import React, { useCallback, useState } from 'react'
import { Box } from '@mui/material'
import ReactPlayer from 'react-player'
import '../../../assets/css/animation.css'
import { CollectionPlay } from '../AbousUsStore'


interface AboutUsVideoPlay {
    play: CollectionPlay
}


const AboutUsVideoPlay: React.FC<AboutUsVideoPlay> = ({ play }) => {
    const [isPlaying, setIsPlaying] = useState(false)

    const playVideo = useCallback(() => {
        setIsPlaying(true)
    }, [])

    const pauseVideo = useCallback(() => {
        setIsPlaying(false)
    }, [])
    return (
        <Box
            onMouseEnter={playVideo}
            onMouseLeave={pauseVideo}
            position={'relative'}
            style={{
                background: '#080E24',
            }}
        >
            <div
                style={{
                    background: 'linear-gradient(270deg,#F34297 0%,#554ADA 89%,#554ADA 100%)',
                    width: 'calc(100% + 10px)',
                    height: 'calc(100% + 10px)',
                    position: 'absolute',
                    transition: 'all 0.2s',
                    transform: isPlaying ? 'scale(1.02) translate(-5px,-5px)' : 'translate(-5px,-5px)',
                    zIndex: '-3',
                }}
            />
            <div
                style={{
                    width: '50%',
                    height: '50%',
                    transform: 'translate(-100%, -100%)',
                    zIndex: '-2',
                    position: 'absolute',
                    background: !isPlaying ? 'inherit' : 'none',
                    transition: 'all 0.2s',
                    animation: 'firstDivMove 6000ms linear infinite',
                }}
            />
            <div
                style={{
                    width: '50%',
                    height: '50%',
                    transform: 'translate(-100%, 200%)',
                    zIndex: '-2',
                    position: 'absolute',
                    background: !isPlaying ? 'inherit' : 'none',
                    animation: 'secondDivMove 6000ms linear infinite',
                }}
            />
            <div
                style={{
                    width: '50%',
                    height: '50%',
                    transform: 'translate(calc(200% - 2px), 100%)',
                    zIndex: '-2',
                    position: 'absolute',
                    background: !isPlaying ? 'inherit' : 'none',
                    animation: 'thirdDivMove 6000ms linear infinite',
                }}
            />
            <div
                style={{
                    width: '50%',
                    height: '50%',
                    transform: 'translate(200%, -100%)',
                    zIndex: '-2',
                    position: 'absolute',
                    background: !isPlaying ? 'inherit' : 'none',
                    animation: 'fourDivMove 6000ms linear infinite',
                }}
            />
            <ReactPlayer
                url={'https://ggnftbox.mypinata.cloud/ipfs/bafybeie5h7cbfihc75lfirefhijrt6f4xzxdvmsdhhkgpxmtgdeiryvsni'}
                width={'100%'}
                height={'100%'}
                playing={isPlaying}
                volume={0}
            />
        </Box>
    )
}

export default AboutUsVideoPlay
