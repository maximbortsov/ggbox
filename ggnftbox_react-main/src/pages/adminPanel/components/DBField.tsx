import React, { FC } from 'react'
import { Stack, Typography } from '@mui/material'


const DBField: FC<{ label: string; field: string | number | Date }> = ({ label, field }) => (
    <Stack
        direction={'row'}
        alignItems={'baseline'}
        my={1}
    >
        <Typography
            variant={'subtitle2'}
            sx={{
                width: 150,
            }}
        >
            {label}
        </Typography>
        <Typography variant={'subtitle1'}>
            {field}
        </Typography>
    </Stack>
)

export default DBField