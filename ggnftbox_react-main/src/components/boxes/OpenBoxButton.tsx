import React from 'react'
import { Box, Typography } from '@mui/material'


const OpenBoxButton: React.FC<{ onClick(): void }> = ({ onClick }) => (
    <Box
        width={'100%'}
        mt={2}
        border={'2px solid #554ADA'}
        borderRadius={1.5}
        textAlign={'center'}
        sx={{
            cursor: 'pointer',
        }}
        onClick={onClick}
    >
        <Typography
            color={'white'}
            fontSize={'1.2rem'}
            fontWeight={400}
            sx={{
                py: 0.75,
                userSelect: 'none',
                msUserSelect: 'none',
                '&:hover': {
                    fontWeight: 500,
                },
            }}
        >
            OPEN BOX
        </Typography>
    </Box>
)

export default OpenBoxButton
