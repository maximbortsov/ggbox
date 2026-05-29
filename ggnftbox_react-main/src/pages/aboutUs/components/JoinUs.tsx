import React from 'react'
import { Box, Typography } from '@mui/material'


const JoinUs: React.FC = () => (
    <Box mb={10} width={'100%'}>
        <Typography
            variant={'body1'}
            textAlign={'center'}
            fontSize={'28px'}
            fontWeight={'bold'}
            sx={{ mb: 7 }}
        >
            {'Join the $GGNFT revolution\r'}
        </Typography>
        <Typography variant={'body2'} mb={2}>
            {'To be the origin of a new era\r'}
        </Typography>
        <Typography variant={'body2'} mb={2}>
            {'GGNFTBOX launched in January 2022 and plans to IDO in Q3 of 2022\r'}
        </Typography>
        <Typography variant={'body2'} mb={2}>
            {'We`re here to bring the revolution in streaming and gaming industry\r'}
        </Typography>
    </Box>
)

export default JoinUs
