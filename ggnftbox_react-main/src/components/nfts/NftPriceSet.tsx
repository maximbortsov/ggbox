import React, { ChangeEvent, Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import { Box, Input, InputAdornment, Typography } from '@mui/material'


interface NftPriceSetProps {
    price: number
    setPrice: Dispatch<SetStateAction<number>>
}


const NftPriceSet: FC<NftPriceSetProps> = ({ price, setPrice }) => {
    const [isInput, setIsInput] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>(price.toString())
    const [numberInput, setNumberInput] = useState<HTMLInputElement | null>(null)

    const handleSetReference = useCallback((input) => {
        setNumberInput(input)
    }, [])

    const handlePriceClick = useCallback(() => {
        numberInput?.click()
        numberInput?.focus()
    }, [numberInput])

    const handleInputOpen = () => {
        setIsInput(true)
        setInputValue(price.toString())
    }

    const handleInputClose = () => {
        setIsInput(false)
    }

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
        const value = parseFloat(event.target.value)
        if (value > 99999) {
            setPrice(99999)
            return
        }
        if (!isNaN(value) && value > 0) {
            setPrice(value)
        } else {
            setPrice(0)
        }
    }, [setPrice])

    return (

        <Box
            width={'100%'}
            border={'2px solid #554ADA'}
            borderRadius={1.5}
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Box
                width={'100%'}
                textAlign={'center'}
                py={0.25}
                onClick={handleInputOpen}
            >
                {
                    isInput ?
                        <Input
                            value={inputValue}
                            autoFocus
                            type={'number'}
                            onChange={handleInputChange}
                            onBlur={handleInputClose}
                            endAdornment={
                                <InputAdornment position={'end'}>
                                    FUSD
                                </InputAdornment>
                            }
                            inputProps={{
                                min: 0.1,
                                max: 99999,
                                step: '0.1',
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
                                fontSize: '1.375rem',
                                fontWeight: 500,
                                '.MuiTypography-root': {
                                    color: 'white',
                                    fontFamily: 'Montserrat',
                                    fontSize: '1.375rem',
                                    fontWeight: 500,
                                },
                            }}
                        />
                        :
                        <Typography
                            color={'white'}
                            fontFamily={'Montserrat'}
                            fontSize={'1.375rem'}
                            fontWeight={500}
                            onClick={handlePriceClick}
                            align={'center'}
                            sx={{
                                width: '100%',
                                cursor: 'text',
                                userSelect: 'none',
                                msUserSelect: 'none',
                                overflow: 'hidden',
                            }}
                        >
                            {`${price} FUSD`}
                        </Typography>
                }
            </Box>
        </Box>
    )
}

export default NftPriceSet