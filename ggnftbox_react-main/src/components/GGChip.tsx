import React, { FC } from 'react'
import { Box, Stack, SxProps, Typography } from '@mui/material'


interface GGChipProps {
    tag: string
    gameLogoPath?: string | null
    isActive?: boolean
    sx?: SxProps
}


export const GGChip: FC<GGChipProps> = ({ tag, gameLogoPath, isActive = true, sx }) => (
    <Box
        px={3}
        py={0.5}
        borderRadius={1}
        sx={{
            background: isActive ? '#554ADA' : 'transparent',
            border: isActive ? 'none' : '1px solid #fff',
            ...sx,
        }}
    >
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
            {/*{*/}
            {/*    gameLogoPath &&*/}
            {/*    <SvgIcon*/}
            {/*        component={AssetsPath + gameLogoPath}*/}
            {/*        viewBox={'0 0 48 48'}*/}
            {/*        style={{*/}
            {/*            width: 16,*/}
            {/*            height: 16,*/}
            {/*        }}*/}
            {/*    />*/}
            {/*}*/}
            <Typography variant={'body2'}>
                {tag}
            </Typography>
        </Stack>
    </Box>
)