import React, { FC } from 'react'
import { GlobalStyles, Theme } from '@mui/material'


const UserGlobalStyles: FC<{ theme: Theme }> = () => (
    <GlobalStyles
        styles={{
            'body': {
                margin: 0,
                backgroundColor: '#080E24',
            },

            '#root': {
                height: '100%',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            },

            // scrollbar
            '&::-webkit-scrollbar': {
                width: 4,
                background: 'transparent',
            },

            '&::-webkit-scrollbar-thumb': {
                width: 4,
                background: '#554ADA',
            },

            '&::-webkit-scrollbar-track': {
                background: 'transparent',
            },

            // Text selection color
            '::selection': {
                background: '#5d53d9',
            },
            '::-moz-selection': {
                background: '#5d53d9',
            },

            // Autocomplete
            '& .MuiAutocomplete-popper': {
                '& .MuiAutocomplete-noOptions': {
                    color: 'white',
                },
            },
            '& .MuiAutocomplete-root': {
                '& .MuiAutocomplete-tag': {
                    background: '#554ADA',
                },
                '& .MuiSvgIcon-root': {
                    color: 'white',
                },
                '& .MuiChip-label': {
                    color: 'white',
                },
                '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                        color: 'white',
                    },
                },
                '& .MuiInput-root': {
                    color: '#fff',
                    '&:before': {
                        borderBottom: '1px solid #fff',
                    },
                    '&:after': {
                        borderBottom: 'none',
                    },
                    '&:hover': {
                        borderBottom: '1px solid #fff',
                    },
                    '&:hover:not(.Mui-disabled):before': {
                        borderBottom: 'none',
                    },
                },
            },
        }}
    />
)

export default UserGlobalStyles
