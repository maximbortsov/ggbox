import React, { FC } from 'react'
import { Box, Stack, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import BuyWithCostButton from '../BuyWithCostButton'
import BoxImage from './BoxImage'
import { GGBox } from '../../entities/GGBox'
import { AssetsPath } from '../../utils/api'
import { StreamerWithPhoto } from '../StreamerWithPhoto'
import { BoxCardType } from '../../utils/enums'
import OpenBoxButton from './OpenBoxButton'


interface LinearProgressWithLabelProps {
    value: number
    total: number
}


const LinearProgressWithLabel: FC<LinearProgressWithLabelProps> = ({ value, total }) => {

    const ratio = value == 0 ? 0 : value / total

    return (
        <Box
            width={'100%'}
            height={4}
            my={1}
            borderRadius={2}
            sx={{
                background: 'rgba(7,44,182,0.33)',
            }}
        >
            <Box
                width={ratio}
                height={4}
                borderRadius={2}
                sx={{
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0px 1px 12px 6px #072CB6',
                }}
            />
        </Box>
    )
}


interface BoxCardProps {
    box: GGBox
    type?: BoxCardType
    onClick(): void
}


const BoxCard: FC<BoxCardProps> = ({ box, onClick, type = BoxCardType.ON_SALE }) => {

    const theme = useTheme()
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

    return (
        <Box
            width={'100%'}
            sx={{
                [theme.breakpoints.down('md')]: {
                    width: '90%',
                    mx: 'auto',
                },
            }}
        >
            <Box
                width={'90%'}
                mx={'auto'}
                onClick={onClick}
                sx={{
                    cursor: 'pointer',
                }}
            >
                <BoxImage boxImagePath={AssetsPath + box.thumbnail} isSoldOut={box.inStock == 0}/>
            </Box>
            <LinearProgressWithLabel value={box.inStock} total={box.total}/>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'end'}
                mt={1}
            >
                <Typography color={'white'} fontSize={isMobile ? '1rem' : '1.25rem'} fontWeight={500}>
                    {box.name}
                </Typography>
                <Typography
                    color={'white'}
                    fontFamily={'Montserrat'}
                    fontSize={'1rem'}
                    fontWeight={200}
                    whiteSpace={'nowrap'}
                >
                    Total:
                    {' '}
                    {box.total}
                </Typography>
            </Stack>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'end'}
            >
                {
                    box.streamers?.length ?
                        <StreamerWithPhoto
                            username={box.streamers[0].name}
                            avatarPath={box.streamers[0].avatar ?? ''}
                        />
                        : <Box/>
                }
                <Typography
                    color={'white'}
                    fontFamily={'Montserrat'}
                    fontSize={'1rem'}
                    fontWeight={200}
                >
                    In stock:
                    {' '}
                    {box.inStock}
                </Typography>
            </Stack>
            {
                (type === BoxCardType.ON_SALE) ?
                    <BuyWithCostButton
                        cost={box.price}
                        onClick={onClick}
                    />
                    :
                    <OpenBoxButton onClick={onClick}/>
            }
        </Box>
    )
}

export default BoxCard
