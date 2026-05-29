import React from 'react'
import { TypographyTitle } from './TermsOfService'
import { Typography } from '@mui/material'


const Privacy: React.FC<{ index: number; value: number }> = ({ index, value }) => {

    if (value !== index) return null

    return (
        <>
            <TypographyTitle>
                PRIVACY POLICY
            </TypographyTitle>

            <Typography
                fontWeight={600}
                fontSize={'body1'}
                color={'white'}
            >
                Section under construction
            </Typography>
        </>
    )
}

export default Privacy