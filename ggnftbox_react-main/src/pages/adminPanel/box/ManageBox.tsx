import React, { FC, useCallback, useState } from 'react'
import { Box, Button, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { UseQueryResult } from 'react-query'
import DBField from '../components/DBField'
import DBInput from '../components/DBInput'
import { ApiSource, AssetsPath } from '../../../utils/api'
import { GGBox } from '../../../entities/GGBox'
import { prettyDateTime } from '../../../utils/date'
import BoxImage from '../../../components/boxes/BoxImage'
import { CreateBoxDto } from '../../../dto/CreateBoxDto'
import { validate } from 'class-validator'
import { CreateBoxDataDto } from '../../../dto/CreateBoxDataDto'
import { http } from '../../../utils/http'
import { LoadingButton } from '@mui/lab'
import stores from '../../../stores/Stores'


interface ManageBoxProps {
    boxes: UseQueryResult<GGBox[], any>
}


const ManageBox: FC<ManageBoxProps> = ({ boxes }) => {

    const [currentBox, setCurrentBox] = useState<GGBox | null>(null)

    const handleUnpickBox = useCallback(() => {
        setCurrentBox(null)
    }, [])

    const [name, setName] = useState<string>('')
    const [desc, setDesc] = useState<string>('')
    const [size, setSize] = useState<number>(3)
    const [price, setPrice] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)
    const [image, setImage] = useState<File | null>(null)

    const [video, setVideo] = useState<File | null>(null)
    const [mobileVideo, setMobileVideo] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [mobileLoading, setMobileLoading] = useState<boolean>(false)

    const handleVideoSelected = useCallback((event) => {
        console.log(event.target.files[0])
        if (event.target.files[0] !== null) {
            setVideo(event.target.files[0])
        }
    }, [])

    const handleMobileVideoSelected = useCallback((event) => {
        console.log(event.target.files[0])
        if (event.target.files[0] !== null) {
            setMobileVideo(event.target.files[0])
        }
    }, [])

    const handleUploadVideo = (): void => {
        console.log(video)
        if (video === null) {
            return
        }
        const formData = new FormData()
        formData.append('file', video)
        setLoading(true)
        http
            .patch(ApiSource + 'box/' + currentBox?.id + '/open-video',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((res) => {
                console.log(res.data)
                setLoading(false)
                setVideo(null)
                stores.snackbars.showSuccessSnackbar('Uploaded mobile video')
            })
            .catch((error) => {
                console.error(error.data.message)
            })
    }

    const handleUploadMobileVideo = (): void => {
        console.log(mobileVideo)
        if (mobileVideo === null) {
            return
        }
        const formData = new FormData()
        formData.append('file', mobileVideo)
        setMobileLoading(true)
        http
            .patch(ApiSource + 'box/' + currentBox?.id + '/open-mobile-video',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((res) => {
                console.log(res.data)
                setMobileLoading(false)
                setMobileVideo(null)
                stores.snackbars.showSuccessSnackbar('Uploaded mobile video')
            })
            .catch((error) => {
                console.error(error.data.message)
            })
    }

    const handleSaveChanges = (): void => {
        handleUploadVideo()
        handleUploadMobileVideo()
    }

    const handleCreateBox = (): void => {

        const boxDataDto = new CreateBoxDataDto()
        boxDataDto.name = name
        boxDataDto.size = size
        boxDataDto.total = total
        boxDataDto.price = price
        boxDataDto.desc = desc

        const date = new Date()
        date.setMinutes(date.getMinutes() + 5)
        boxDataDto.startSaleAt = date
        boxDataDto.endSaleAt = new Date(2023, 0, 1)

        void validate(boxDataDto)
            .then((errors) => {
                if (errors.length > 0) {
                    for (const error of errors) {
                        console.error(error.constraints)
                    }
                } else {
                    const formData = new FormData()
                    const dto = new CreateBoxDto(boxDataDto, image as File)

                    formData.append('data', JSON.stringify(dto.data))
                    formData.append('file', image as Blob)

                    http
                        .post(
                            ApiSource + 'box',
                            formData,
                            { headers: { 'Content-Type': 'multipart/form-data' } },
                        )
                        .then((res) => {
                            console.log('in response:')
                            console.log(res)
                            refetchBoxes()
                        })
                        .catch((error) => {
                            console.info('in catch:')
                            console.error(error.data.message)
                        })
                }
            })
    }

    const handleDeleteBox = (): void => {
        if (currentBox) {
            const boxId = currentBox.id
            http
                .delete(ApiSource + 'box/' + boxId.toString())
                .then((res) => {
                    console.log(res)
                    refetchBoxes()
                })
                .catch((error) => {
                    console.info('in catch:')
                    console.error(error.data.message)
                })
        }

    }

    const refetchBoxes = (): void => {
        void boxes.refetch()
    }

    return (
        <Grid
            container
            sx={{
                height: 'calc(100vh - 180px - 145px)',
            }}
        >
            {/* All boxes list */}
            <Grid
                item
                xs={4}
                sx={{
                    height: '100%',
                    borderRight: '1px solid #fff',
                }}
            >
                <Button
                    variant={'text'}
                    onClick={handleUnpickBox}
                    sx={{
                        color: 'white',
                        width: '100%',
                        py: 2,
                    }}
                >
                    <Typography variant={'subtitle1'}>
                        + new Box
                    </Typography>
                </Button>
                <List
                    sx={{
                        height: 'calc(100vh - 180px - 76px - 145px)',
                        overflowY: 'scroll',
                        scrollbarWidth: '4px',
                    }}
                >
                    {
                        boxes.isSuccess &&
                        boxes.data.map((box: GGBox) => (
                            <ListItem
                                button
                                onClick={(): void => {
                                    setCurrentBox(box)
                                    console.log(box)
                                }}
                                selected={currentBox === box}
                                key={box.id}
                            >
                                <ListItemText
                                    primary={box.name}
                                    secondary={box.inStock.toString() + ' in stock, ' + box.total.toString() + ' total'}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        },
                                    }}
                                />
                            </ListItem>
                        ))
                    }
                </List>
            </Grid>
            <Grid
                item
                xs={8}
                sx={{
                    height: 'calc(100vh - 180px - 145px)',
                    overflowY: 'scroll',
                }}
            >
                <Box px={4}>
                    {/* box info */}
                    {
                        currentBox !== null &&
                        <Box>
                            <DBField label={'ID'} field={currentBox.id}/>
                            <DBField label={'Name'} field={currentBox.name}/>
                            <DBField label={'Price'} field={'$' + currentBox.price.toString()}/>
                            <DBField label={'Size'} field={'contain ' + currentBox.size.toString() + ' NFTs'}/>
                            <DBField label={'Total'} field={currentBox.total.toString() + ' boxes'}/>
                            <DBField label={'In stock'} field={currentBox.inStock.toString() + ' boxes remain'}/>
                            <DBField label={'Start sale'} field={prettyDateTime(currentBox.startSaleAt)}/>
                            <DBField label={'End sale'} field={prettyDateTime(currentBox.endSaleAt)}/>
                            <Box width={'50%'} pt={2} mx={'auto'}>
                                <BoxImage boxImagePath={AssetsPath + currentBox.thumbnail} alwaysShowBorder/>
                            </Box>
                            <Stack
                                spacing={2}
                            >

                                <Stack
                                    direction={'row'}
                                    spacing={2}
                                    alignItems={'center'}
                                >
                                    <label htmlFor={'uploadVideo'}>
                                        <input
                                            id={'uploadVideo'}
                                            accept={'video/*'}
                                            type={'file'}
                                            onChange={handleVideoSelected}
                                            style={{
                                                display: 'none',
                                            }}
                                        />
                                        <Button
                                            variant={'contained'}
                                            component={'span'}
                                            disableElevation
                                            sx={{
                                                background: '#554ADA',
                                                borderRadius: 1,
                                                fontSize: '1rem',
                                                textTransform: 'none',
                                                fontFamily: '"Montserrat", sans-serif',
                                                ':hover': {
                                                    background: '#5d53d9',
                                                },
                                            }}
                                        >
                                            Upload video
                                        </Button>
                                    </label>

                                    <Typography>
                                        {video ? video.name : 'Not chosen'}
                                    </Typography>
                                </Stack>
                                <Stack
                                    direction={'row'}
                                    spacing={2}
                                    alignItems={'center'}
                                >
                                    <label htmlFor={'uploadMobileVideo'}>
                                        <input
                                            id={'uploadMobileVideo'}
                                            accept={'video/*'}
                                            type={'file'}
                                            onChange={handleMobileVideoSelected}
                                            style={{
                                                display: 'none',
                                            }}
                                        />
                                        <Button
                                            variant={'contained'}
                                            component={'span'}
                                            disableElevation
                                            sx={{
                                                background: '#554ADA',
                                                borderRadius: 1,
                                                fontSize: '1rem',
                                                textTransform: 'none',
                                                fontFamily: '"Montserrat", sans-serif',
                                                ':hover': {
                                                    background: '#5d53d9',
                                                },
                                            }}
                                        >
                                            Upload mobile video
                                        </Button>
                                    </label>
                                    <Typography>
                                        {mobileVideo ? mobileVideo.name : 'Not chosen'}
                                    </Typography>
                                </Stack>
                                <Stack
                                    direction={'row'}
                                    spacing={2}
                                    alignItems={'center'}
                                >
                                    <Button
                                        variant={'outlined'}
                                        onClick={handleDeleteBox}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            borderRadius: 1,
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            fontFamily: '"Montserrat", sans-serif',
                                            ':hover': {
                                                borderColor: '#d5d4d4',
                                            },
                                        }}
                                    >
                                        Delete box
                                    </Button>

                                    <LoadingButton
                                        loading={loading || mobileLoading}
                                        onClick={handleSaveChanges}
                                        sx={{
                                            color: 'white',
                                            background: '#554ADA',
                                            borderRadius: 1,
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            fontFamily: '"Montserrat", sans-serif',
                                            ':hover': {
                                                background: '#5d53d9',
                                            },
                                        }}
                                    >
                                        Save changes
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        </Box>
                    }
                    {/* create new box */}
                    {
                        currentBox === null &&
                        <Stack direction={'column'}>
                            <Typography
                                variant={'h5'}
                                fontFamily={'"Montserrat", sans-serif'}
                                sx={{
                                    pb: 2,
                                }}
                            >
                                New Box
                            </Typography>
                            <DBInput label={'Name'} data={name} setData={setName}/>
                            <DBInput label={'Desc'} data={desc} setData={setDesc}/>
                            <DBInput
                                label={'Price'}
                                data={price}
                                setData={setPrice}
                                inputType={'float'}
                            />
                            <DBInput
                                label={'Size'}
                                data={size}
                                setData={setSize}
                                inputType={'int'}
                            />
                            <DBInput
                                label={'Total'}
                                data={total}
                                setData={setTotal}
                                inputType={'int'}
                            />
                            <label htmlFor={'uploadBox'}>
                                <input
                                    id={'uploadBox'}
                                    accept={'image/png'}
                                    type={'file'}
                                    onChange={(event): void => {
                                        if (event.target.files !== null) {
                                            setImage(event.target.files[0])
                                        }
                                    }}
                                    style={{
                                        display: 'none',
                                    }}
                                />
                                <Button
                                    variant={'contained'}
                                    component={'span'}
                                    disableElevation
                                    sx={{
                                        width: '100%',
                                        mt: 2,
                                        background: '#554ADA',
                                        borderRadius: 1,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        fontFamily: '"Montserrat", sans-serif',
                                        ':hover': {
                                            background: '#5d53d9',
                                        },
                                    }}
                                >
                                    Upload box image
                                </Button>
                            </label>
                            <Button
                                variant={'outlined'}
                                onClick={handleCreateBox}
                                sx={{
                                    mt: 2,
                                    color: 'white',
                                    borderColor: 'white',
                                    borderRadius: 1,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    fontFamily: '"Montserrat", sans-serif',
                                    ':hover': {
                                        borderColor: '#d5d4d4',
                                    },
                                }}
                            >
                                Create box
                            </Button>
                        </Stack>
                    }
                </Box>
            </Grid>
        </Grid>
    )
}

export default ManageBox