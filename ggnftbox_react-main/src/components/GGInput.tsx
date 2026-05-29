import React, { FC } from 'react'
import { FormControl, Input, InputAdornment, SxProps } from '@mui/material'


interface GGInputProps {
    defaultValue: number
    sx?: SxProps
    update(value: string): void
}


export const GGInput: FC<GGInputProps> = ({ update, defaultValue, sx }) => (
    <FormControl
        variant={'standard'}
        sx={{ ...sx }}
    >
        {/*<GGInputBase*/}
        {/*    autoFocus*/}
        {/*    defaultValue={defaultValue}*/}
        {/*    onChange={(event): void =>*/}
        {/*        update(event.target.value)}*/}
        {/*    sx={{*/}
        {/*        width: '100%',*/}
        {/*    }}*/}
        {/*    endAdornment={*/}
        {/*        <InputAdornment position={'end'}>*/}
        {/*            FUSD*/}
        {/*        </InputAdornment>*/}
        {/*    }*/}
        {/*/>*/}
        <Input
            value={defaultValue}
            autoFocus
            type={'number'}
            onChange={(event): void =>
                update(event.target.value)}
            endAdornment={
                <InputAdornment position={'end'}>
                    FUSD
                </InputAdornment>
            }
            inputProps={{
                min: 0,
                max: 99999,
                step: '1.0',
                inputMode: 'numeric',
                type: 'number',
                style: {
                    textAlign: 'center',
                    border: 'none',
                },
            }}
            sx={{
                width: '90%',
                color: 'white',
                fontFamily: 'Montserrat',
                fontSize: '1rem',
                fontWeight: 400,
                borderBottom: '1px solid white',
                '.MuiTypography-root': {
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontSize: '1rem',
                    fontWeight: 400,
                },
            }}
        />
    </FormControl>
)