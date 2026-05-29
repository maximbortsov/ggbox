import React from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Pages } from '../../../utils/routes'


interface FromPlaysToMarketplaceLinkProps {
    titleText: string
    text: string
}


const FromPlaysToMarketplaceLink: React.FC<FromPlaysToMarketplaceLinkProps> = ({ titleText, text }) => {
    const navigate = useNavigate()
    const theme = useTheme()
    return (
        <Box
            mt={16}
            display={'flex'}
            flexDirection={'column'}
        >
            <Typography
                mb={2}
                fontSize={'24px'}
                fontWeight={'bold'}
                variant={'body1'}
                textAlign={'center'}
                mx={'auto'}
            >
                {titleText}
            </Typography>
            <Typography
                mb={2}
                fontSize={'18px'}
                textAlign={'center'}
                mx={'auto'}
            >
                {text}
            </Typography>
            <Button
                variant={'contained'}
                disableElevation
                onClick={(): void => navigate(Pages.MARKETPLACE)}
                sx={{
                    width: theme.breakpoints.values.sm * 0.75,
                    maxWidth: '85vw',
                    py: 2,
                    px: 4,
                    mt: 4,
                    mx: 'auto',
                    mb: 4,
                    border: '2px solid #554ADA',
                }}
            >
                <Typography
                    fontWeight={600}
                    fontSize={'1.25rem'}
                >
                    GO TO MARKETPLACE
                </Typography>
            </Button>
        </Box>
    )
}

export default FromPlaysToMarketplaceLink
