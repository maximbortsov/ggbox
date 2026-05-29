import React, { FC } from 'react'
import { Avatar, Stack, Typography } from '@mui/material'
import { AssetsPath } from '../utils/api'


export const StreamerWithPhoto: FC<{ avatarPath?: string; username: string }> = ({ avatarPath, username }) => (
    <Stack direction={'row'} py={0.25}>
        <Avatar
            src={AssetsPath + avatarPath}
            sx={{ width: 24, height: 24, mr: 1 }}
        />
        <Typography
            variant={'body1'}
            fontWeight={300}
        >
            @
            {username}
        </Typography>
    </Stack>
)