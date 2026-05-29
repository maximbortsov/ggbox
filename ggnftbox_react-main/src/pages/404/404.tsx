import React, { FC, useCallback } from 'react'
import backgroundLines from '../../assets/images/background/bgLinesAboutUs3.png'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { Pages } from '../../utils/routes'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'


const Error404: FC = () => {

    const navigate = useNavigate()
    const theme = useTheme()

    const handleNavigateToMain = useCallback(() => {
        navigate(Pages.MAIN)
    }, [navigate])

    return (
        <Box
            overflow={'hidden'}
            textAlign={'center'}
            sx={{
                backgroundImage: `url(${backgroundLines as string})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                [theme.breakpoints.down('md')]: {
                    mt: 6,
                },
            }}
        >
            <Typography variant={'h3'}>
                :(
            </Typography>
            <Typography variant={'h3'} mt={2}>
                This page is lost.
            </Typography>
            <Box mt={4}>
                <Typography variant={'h6'} fontFamily={'\'Montserrat\', sans-serif'}>
                    {`We've explored deep and wide,`}
                </Typography>
                <Typography variant={'h6'} fontFamily={'\'Montserrat\', sans-serif'}>
                    {`but we can't find the page you were looking for.`}
                </Typography>
            </Box>

            <Button
                variant={'contained'}
                disableElevation
                onClick={handleNavigateToMain}
                sx={{
                    width: theme.breakpoints.values.sm * 0.75,
                    maxWidth: '85vw',
                    py: 2,
                    px: 4,
                    mt: 8,
                    background: '#554ADA',
                    borderRadius: 0.5,
                    ':hover': {
                        background: '#5d53d9',
                    },
                }}
            >
                <Typography
                    fontWeight={600}
                    fontSize={'1.25rem'}
                >
                    Back to the main page
                </Typography>
            </Button>
        </Box>
    )
}

export default observer(Error404)
