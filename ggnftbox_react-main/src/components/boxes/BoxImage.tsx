import { Container, Theme, useMediaQuery, useTheme } from '@mui/material'
import boxBorder from '../../assets/images/boxBorder.png'
import React, { useCallback, useState } from 'react'
import soldOut from '../../assets/images/soldOut.png'

import * as CSS from 'csstype'


interface BoxImageProps {
    boxImagePath: string
    isSoldOut?: boolean
    disableBorder?: boolean
    alwaysShowBorder?: boolean
}


const BoxImage: React.FC<BoxImageProps> = (props: BoxImageProps) => {

    const [visibility, setVisibility] = useState<CSS.Property.Visibility>(props.alwaysShowBorder ? 'visible' : 'hidden')
    const theme = useTheme()

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    const showBorder = useCallback(() => {
        if (!props.disableBorder)
            setVisibility('visible')
    }, [props.disableBorder])

    const hideBorder = useCallback(() => {
        if (!props.alwaysShowBorder)
            setVisibility('hidden')
    }, [props.alwaysShowBorder])

    return (
        <Container
            onMouseEnter={showBorder}
            onMouseLeave={hideBorder}
            sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${props.boxImagePath})`,
                backgroundPosition: 'center center',
                backgroundSize: '75%',
                [theme.breakpoints.only('xs')]: {
                    backgroundSize: '85%',
                },
                backgroundRepeat: 'no-repeat',
                padding: 0,
                textAlign: 'center',
                position: 'relative',
                opacity: props.isSoldOut && (isMobile || visibility == 'visible') ? 0.7 : 1,
            }}
        >
            {
                props.isSoldOut &&
                <img
                    src={soldOut}
                    alt={'soldOut'}
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        margin: 'auto',
                        width: '65%',
                        height: 'auto',
                        visibility: isMobile ? 'visible' : visibility,
                    }}
                />
            }
            <img
                src={boxBorder}
                alt={'boxBorder'}
                style={{
                    width: '100%',
                    height: 'auto',
                    visibility: visibility,
                }}
            />
        </Container>
    )
}

export default BoxImage
