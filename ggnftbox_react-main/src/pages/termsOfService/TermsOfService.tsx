import React, { useCallback, useState } from 'react'
import { Box } from '@mui/system'
import { styled, Tab, TabProps, Tabs, Typography } from '@mui/material'
import Terms from './Terms'
import Privacy from './Privacy'


export const TypographyTitle: React.FC = (props) => (
    <Typography
        mt={4}
        fontSize={'subtitle1'}
        color={'#5d53d9'}
        fontWeight={600}
    >
        {props.children}
    </Typography>
)

export const TypographyText: React.FC = (props) => (
    <Typography
        mt={4}
        fontSize={'body1'}
        color={'white'}
    >
        {props.children}
    </Typography>
)

const TermsTab = styled(Tab)<TabProps>(({ theme }) => ({
    width: '50%',
    fontSize: 18,
    fontWeight: 600,
    padding: 24,
    letterSpacing: 2,
    [theme.breakpoints.down('md')]: {
        fontSize: 14,
        fontWeight: 500,
        padding: 12,
        letterSpacing: 1,
    },
    color: 'white',
    opacity: 0.8,
    '&.Mui-selected': {
        color: '#5d53d9',
        opacity: 1,
    },
}))

const TermsOfService: React.FC = () => {
    const [value, setValue] = useState(0)

    const handleChange = useCallback((event: React.SyntheticEvent, newValue: number): void => {
        setValue(newValue)
    }, [])

    return (
        <Box
            mx={{ xs: 0, lg: 28 }}
            px={{ xs: 4, lg: 8 }}
            color={'white'}
            textAlign={{ xs: 'left', md: 'justify' }}
        >
            <Tabs
                value={value}
                onChange={handleChange}
                variant={'fullWidth'}
                scrollButtons={false}
                sx={{
                    '& .MuiTabs-flexContainer': {
                        width: '100%',
                        justifyContent: 'center',
                    },
                }}
                indicatorColor={'secondary'}
            >
                <TermsTab label={'TERMS OF SERVICE'}/>
                <TermsTab label={'PRIVACY POLICY'}/>
            </Tabs>

            <Terms index={0} value={value}/>
            <Privacy index={1} value={value}/>
        </Box>
    )
}

export default TermsOfService