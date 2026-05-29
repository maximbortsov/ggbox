import { InputBase, styled } from '@mui/material'


export const GGInputBase = styled(InputBase)(({ theme, error }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 1,
        border: (error) ? '1px solid #f00' : '1px solid #fff',
        backgroundColor: 'transparent',
        position: 'relative',
        boxSizing: 'border-box',
        fontSize: 16,
        height: 48,
        color: 'white',
        width: theme.breakpoints.values.sm * 0.75,
        maxWidth: '85vw',
        padding: '10px 12px',
        transition: theme.transitions.create([
            'border-width',
        ]),
        '&:focus': {
            border: '1.5px solid #fff',
        },
        '&.Mui-disabled': {
            '-webkitTextFillColor': '#FFFFFF',
        },
    },
}))
