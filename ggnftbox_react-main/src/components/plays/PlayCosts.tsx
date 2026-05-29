import React, { FC } from 'react'
import { Stack, SxProps, Typography } from '@mui/material'
import { Currencies } from '../../utils/enums'


interface PlayCostsProps {
    lowestPrice: number | undefined | null
    highestPrice: number | undefined | null
    currency: Currencies
    sx?: SxProps
}


export const PlayCosts: FC<PlayCostsProps> = ({ lowestPrice, highestPrice, currency, sx }) => (
    <>
        <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            spacing={4}
            sx={{
                ...sx,
            }}
        >
            <Typography
                variant={'h6'}
                fontFamily={'\'Montserrat\', sans-serif'}
            >
                Lowest ask
            </Typography>
            <Typography
                variant={'h5'}
                fontFamily={'\'Montserrat\', sans-serif'}
                fontWeight={500}
            >
                {/*{*/}
                {/*    currency === Currencies.Eth ?*/}
                {/*        <img src={'https://img.icons8.com/color/24/000000/ethereum.png'} alt={'eth'}/>*/}
                {/*        :*/}
                {/*    `${currency} `*/}
                {/*}*/}
                {lowestPrice?.toFixed(2) ?? '-'}
                {' FUSD'}
            </Typography>
        </Stack>
        <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mt={1}
            sx={{
                ...sx,
            }}
        >
            <Typography
                variant={'h6'}
                fontFamily={'\'Montserrat\', sans-serif'}
            >
                Top sale
            </Typography>
            <Typography
                variant={'h5'}
                fontFamily={'\'Montserrat\', sans-serif'}
                fontWeight={500}
            >
                {/*{*/}
                {/*    currency === Currencies.Eth ?*/}
                {/*        <img src={'https://img.icons8.com/color/24/000000/ethereum.png'} alt={'eth'}/>*/}
                {/*        :*/}
                {/*    `${currency} `*/}
                {/*}*/}
                {highestPrice?.toFixed(2) ?? '-'}
                {' FUSD'}
            </Typography>
        </Stack>
    </>
)