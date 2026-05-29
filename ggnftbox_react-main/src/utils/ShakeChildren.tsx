import React, { FC } from 'react'
import { Box } from '@mui/material'


const ShakeChildren: FC<{ shake: boolean }> = (props): JSX.Element => (
    <Box
        sx={{
            animationName: 'shake',
            animationDuration: '1.2s',
            animationFillMode: 'both',
            animationTimingFunction: 'ease-in',
            animationIterationCount: 'infinite',
            animationPlayState: props.shake ? 'running' : 'paused',
            '@keyframes shake': {
                '0%, 80%': {
                    transform: 'translate3d(0, 0, 0)',
                },
                '10%, 30%, 50%, 70%': {
                    transform: 'translate3d(-4px, 4px, 0)',
                },
                '20%, 40%, 60%': {
                    transform: 'translate3d(4px, -4px, 0)',
                },
            },
        }}
    >
        {props.children}
    </Box>
)

export default ShakeChildren