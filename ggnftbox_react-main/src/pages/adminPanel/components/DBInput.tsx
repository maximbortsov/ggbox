import React, { FC } from 'react'
import { TextField } from '@mui/material'


interface DBInputProps {
    label: string
    data: any
    inputType?: string
    setData(any): React.SetStateAction<any>
}


const DBInput: FC<DBInputProps> = ({ label, data, setData, inputType }) => (
    <TextField
        variant={'standard'}
        label={label}
        value={data}
        onChange={(event): void => {
            switch (inputType) {
                case 'int': {
                    setData(parseInt(event.target.value))
                    return
                }
                case 'float': {
                    setData(parseFloat(event.target.value))
                    return
                }
                default: {
                    setData(event.target.value)
                    return
                }
            }
        }}
        sx={{
            my: 0.5,
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
                '&.Mui-focused': {
                    borderBottom: '1.5px solid #fff',
                },
            },
        }}
    />
)

export default DBInput