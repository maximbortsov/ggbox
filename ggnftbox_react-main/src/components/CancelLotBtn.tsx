import React from 'react'
import { Box, Typography } from '@mui/material'


const CancelLotBtn: React.FC<{ onClick(): void; cost: number }> = ({ onClick, cost }) => (

    <Box
        width={'100%'}
        mt={2}
        border={'1.5px solid #EEE'}
        borderRadius={1.5}
        textAlign={'center'}
        onClick={onClick}
    >
        <Box
            width={'60%'}
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
                fontSize={'1.2rem'}
                fontWeight={400}
                sx={{
                    userSelect: 'none',
                    msUserSelect: 'none',
                    '&:hover': {
                        fontWeight: 500,
                    },
                }}
            >
                CANCEL LOT
            </Typography>
        </Box>
        <Box
            width={'38%'}
            display={'inline-block'}
            textAlign={'center'}
            borderLeft={'2px solid #EEE'}
            py={0.25}
        >
            <Typography
                color={'white'}
                fontFamily={'Montserrat'}
                fontSize={'1.1rem'}
                fontWeight={500}
                sx={{
                    py: 0,
                    userSelect: 'none',
                    msUserSelect: 'none',
                }}
            >
                {`${cost.toFixed(2)} FUSD`}
            </Typography>
        </Box>
    </Box>
)

export default CancelLotBtn
