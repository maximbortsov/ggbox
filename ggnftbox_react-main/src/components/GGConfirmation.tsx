import { Button, Dialog, Stack, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { LoadingButton } from '@mui/lab'


interface GGConfirmationProps {
    open: boolean
    title: string
    message: string
    isLoading?: boolean
    onClose(): void
    onConfirm(): void
}


const GGConfirmation: React.FC<GGConfirmationProps> =
    ({
         open,
         title,
         message,
         isLoading,
         onClose,
         onConfirm,
     }) => {

        const handleClose = useCallback(() => {
            onClose()
        }, [onClose])

        const handleConfirm = useCallback(() => {
            onConfirm()
        }, [onConfirm])

        return (
            <Dialog
                open={open}
                maxWidth={'sm'}
                fullWidth
                scroll={'paper'}
                onClose={handleClose}
                sx={{
                    zIndex: (theme): number => theme.zIndex.drawer + 1,
                    '& .MuiDialog-paper': {
                        borderRadius: 4,
                        background: 'transparent',
                    },
                }}
            >
                <Stack
                    direction={'column'}
                    spacing={2}
                    sx={{
                        maxHeight: '50vh',
                        p: 4,
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        background: '#15204A',
                        position: 'relative',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        fontSize={24}
                        fontWeight={700}
                        sx={{
                            textTransform: 'uppercase',
                            width: 1,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            width: 1,
                        }}
                    >
                        {message}
                    </Typography>
                    <Stack
                        direction={'row'}
                        justifyContent={'center'}
                        spacing={3}
                    >
                        <Button
                            onClick={handleClose}
                            sx={{
                                px: 6,
                                py: 1,
                                border: '2px solid #554ADA',
                                borderRadius: 0.5,
                            }}
                        >
                            <Typography
                                fontWeight={600}
                            >
                                Cancel
                            </Typography>
                        </Button>
                        <LoadingButton
                            loading={isLoading}
                            onClick={handleConfirm}
                            sx={{
                                px: 6,
                                py: 1,
                                background: '#554ADA',
                                borderRadius: 0.5,
                                '& .MuiCircularPro  gress-root': {
                                    color: 'white',
                                },
                                '&.Mui-disabled': {
                                    background: 'rgba(85,74,218,0.35)',
                                },
                                ':hover': {
                                    background: '#5d53d9',
                                },
                            }}
                        >
                            <Typography
                                fontWeight={600}
                            >
                                {isLoading ? ' ' : 'OK'}
                            </Typography>
                        </LoadingButton>
                    </Stack>
                </Stack>
            </Dialog>
        )
    }

export default observer(GGConfirmation)