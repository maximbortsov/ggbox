import React from 'react'
import { Box, Typography } from '@mui/material'


const SaleBtn: React.FC<{ onClick(): void }> = ({ onClick }) => (
    <Box
        width={'100%'}
        mt={2}
        border={'2px solid #554ADA'}
        borderRadius={1.5}
        sx={{
            background: 'linear-gradient(90deg, rgba(93,83,217,1) 0%, rgba(93,83,217,1) 60%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%)',
            backgroundSize: '0%',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            transition: 'all .5s ease-out',
            '&:hover': {
                backgroundSize: '200%',
            },
        }}
    >
        <Box
            width={'100%'}
            borderRadius={1.5}
            display={'inline-block'}
            textAlign={'center'}
            sx={{
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            <Typography
                color={'white'}
                fontSize={'1.25rem'}
                fontWeight={400}
                sx={{
                    userSelect: 'none',
                    msUserSelect: 'none',
                    '&:hover': {
                        fontWeight: 500,
                    },
                }}
            >
                SALE
            </Typography>
        </Box>
    </Box>
)

export default SaleBtn
