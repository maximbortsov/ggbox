import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { Currencies } from '../utils/enums'


interface BuyWithCostButtonProps {
    cost?: number | null
    currency?: Currencies
    onClick(): void
}


const BuyWithCostButton: FC<BuyWithCostButtonProps> = ({ cost, onClick, currency = Currencies.USD }) => (
    <Box
        width={'100%'}
        mt={1.5}
        border={'2px solid #554ADA'}
        borderRadius={1.5}
        sx={{
            background: 'linear-gradient(90deg, rgba(93,83,217,1) 0%, rgba(93,83,217,1) 60%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%)',
            backgroundSize: '0%',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            transition: 'all .25s ease-out',
            '&:hover': {
                backgroundSize: '100%',
            },
        }}
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
                BUY
            </Typography>
        </Box>
        <Box
            width={'38%'}
            display={'inline-block'}
            textAlign={'center'}
            borderLeft={'2px solid #554ADA'}
            py={0.25}
        >
            <Typography
                color={'white'}
                fontFamily={'Montserrat'}
                fontSize={cost ? '1.1rem' : '1rem'}
                fontWeight={cost ? 500 : 300}
                sx={{
                    py: cost ? 0.65 : 0.75,
                    userSelect: 'none',
                    msUserSelect: 'none',
                }}
            >
                {
                    cost
                        ? currency === Currencies.USD ? `$ ${cost}` : `${cost.toFixed(2)} ${currency}`
                        : 'No lots'
                }
            </Typography>
        </Box>
    </Box>
)

export default BuyWithCostButton
