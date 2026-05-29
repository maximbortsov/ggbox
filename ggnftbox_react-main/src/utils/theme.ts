import { createTheme, responsiveFontSizes } from '@mui/material'
import '../assets/css/fonts.css'


let theme = createTheme({
    palette: {
        primary: {
            main: '#080E24',
        },
        secondary: {
            main: '#5d53d9',
        },
    },
    typography: {
        h1: {
            fontFamily: '\'Russo One\', sans-serif',
            textTransform: 'uppercase',
        },
        h2: {
            fontFamily: '\'Russo One\', sans-serif',
            textTransform: 'uppercase',
        },
        h3: {
            fontFamily: '\'Russo One\', sans-serif',
            textTransform: 'uppercase',
        },
        h4: {
            fontFamily: '\'Russo One\', sans-serif',
            textTransform: 'uppercase',
        },
        h5: {
            fontFamily: '\'Russo One\', sans-serif',
        },
        h6: {
            fontFamily: '\'Russo One\', sans-serif',
        },
        subtitle1: {
            fontFamily: '\'Montserrat\', sans-serif',
        },
        subtitle2: {
            fontFamily: '\'Montserrat\', sans-serif',
        },
        body1: {
            fontFamily: '\'Montserrat\', sans-serif',
        },
        body2: {
            fontFamily: '\'Montserrat\', sans-serif',
        },
        allVariants: {
            color: '#FFF',
        },
    },
    components: {
        MuiMenu: {
            styleOverrides: {
                list: {
                    background: '#080E24',
                    border: '1px solid #FFF',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    ':hover': { background: '#554ADA' },
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(18,31,79,0.5)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#142357',
                        '&:hover': {
                            backgroundColor: '#1b2e73',
                        },
                    },
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#142357',
                },
            },
        },
        MuiSkeleton: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255,255,255,0.16)',
                },
            },
        },
    },
})

theme = responsiveFontSizes(theme)

export default theme
