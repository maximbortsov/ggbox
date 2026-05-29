import React, { FC } from 'react'
import Start from './components/Start'
import Plays from './components/Plays'
import BoxesSection from './components/Boxes'
import HowItWorks from './components/HowItWorks'
import backgroundLines from '../../assets/images/background/bgLines1.png'
import { Box } from '@mui/material'


const Main: FC = () => (
    <Box overflow={'hidden'}>
        <img
            src={backgroundLines}
            alt={'bg'}
            style={
                {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    overflowX: 'hidden',
                    overflowY: 'visible',
                    objectFit: 'cover',
                    zIndex: -1,
                }
            }
        />
        <Start/>
        <HowItWorks/>
        <Plays/>
        <BoxesSection/>
    </Box>
)

export default Main
