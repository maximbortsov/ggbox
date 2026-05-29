import React, { FC } from 'react'
import { Grid, Skeleton } from '@mui/material'


const BoxesSkeletons: FC = () => (
    <>
        <Grid
            item
            xs={3}
            md={1}
            sx={{
                width: '100%',
            }}
        >
            <Skeleton
                variant={'rectangular'}
                height={350}
                sx={{
                    bgcolor: 'rgba(255,255,255,0.16)',
                }}
            />
        </Grid>
        <Grid
            item
            xs={3}
            md={1}
            sx={{
                width: '100%',
            }}
        >
            <Skeleton
                variant={'rectangular'}
                height={350}
                sx={{
                    bgcolor: 'rgba(255,255,255,0.16)',
                }}
            />
        </Grid>
        <Grid
            item
            xs={3}
            md={1}
            sx={{
                width: '100%',
            }}
        >
            <Skeleton
                variant={'rectangular'}
                height={350}
                sx={{
                    bgcolor: 'rgba(255,255,255,0.16)',
                }}
            />
        </Grid>
    </>
)

export default BoxesSkeletons