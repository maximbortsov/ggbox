import { Box, Dialog, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import stores from '../../../stores/Stores'
import { ApiSource } from '../../../utils/api'
import { useMutation } from 'react-query'
import { LoadingButton } from '@mui/lab'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { http } from '../../../utils/http'


interface ImageDialog {
    open: boolean
    onClose(): void
}


const ImageDialog: React.FC<ImageDialog> = ({ open, onClose }) => {

    const [selectedFile, setSelectedFile] = useState<File | ''>('')
    const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const updateProfileAvatar = async (): Promise<void> => {
        const formData = new FormData()
        formData.append('data', '{}')
        formData.append('file', selectedFile)
        http
            .patch(ApiSource + 'user', formData)
            .then(() => {
                window.location.reload()
            })
            .then(() => {
                setLoading(false)
            })
            .catch((error) => {
                console.error(error.data)
                stores.snackbars.showErrorSnackbar(error.data.message)
                setLoading(false)
            })
    }

    const userProfileMutation = useMutation(updateProfileAvatar)

    const handleSetReference = useCallback((input) => {
        setFileInput(input)
    }, [])

    const handleFileSelected = useCallback((event) => {
        console.log(event.target.files[0])
        setSelectedFile(event.target.files[0])
    }, [])

    const handleImageClick = useCallback(() => {
        fileInput?.click()
    }, [fileInput])

    const handleButtonClick = useCallback(() => {
        if (selectedFile == '') {
            fileInput?.click()
        } else {
            selectedFile.name
            userProfileMutation.mutate()
            setLoading(true)
        }
    }, [fileInput, selectedFile, userProfileMutation])


    const buttonText = (): string => {
        if (loading) return ' '
        if (selectedFile == '') return 'SELECT IMAGE'
        return 'SAVE'
    }

    return (
        <Dialog
            open={open}
            maxWidth={'sm'}
            fullWidth
            onClose={onClose}
            scroll={'paper'}
            sx={{
                zIndex: (theme): number => theme.zIndex.drawer + 1,
                '& .MuiDialog-paper': {
                    borderRadius: 4,
                    background: 'transparent',
                },
            }}
        >
            <Stack
                sx={{
                    maxHeight: '80vh',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    p: 6,
                    background: '#15204A',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        width: 1,
                        height: 1,
                    }}
                >
                    {
                        selectedFile !== '' ?
                            <img
                                alt={'Choose image'}
                                src={URL.createObjectURL(selectedFile)}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                onClick={handleImageClick}
                            />
                            :
                            <Typography
                                mb={2}
                                fontSize={18}
                                textAlign={'center'}
                                mx={'auto'}
                            >
                                Please upload a photo for your account.
                                We support JPG, GIF or PNG files.
                            </Typography>
                    }
                </Box>
                <input
                    type={'file'}
                    accept={'image/png, image/gif, image/jpeg'}
                    ref={handleSetReference}
                    style={{ display: 'none' }}
                    onChange={handleFileSelected}
                />
                <LoadingButton
                    disableElevation
                    variant={'contained'}
                    loading={loading}
                    endIcon={selectedFile == '' && <FileUploadOutlinedIcon fontSize={'large'}/>}
                    onClick={handleButtonClick}
                    sx={{
                        px: 6,
                        py: 1,
                        mt: 4,
                        background: '#554ADA',
                        borderRadius: 0.5,
                        '& .MuiCircularProgress-root': {
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
                    <Typography variant={'h5'} fontWeight={600} fontFamily={'\'Montserrat\', sans-serif'}>
                        {buttonText()}
                    </Typography>
                </LoadingButton>
            </Stack>
        </Dialog>
    )
}

export default observer(ImageDialog)