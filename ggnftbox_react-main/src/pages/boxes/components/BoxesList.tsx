import React, { FC, useCallback, useEffect } from 'react'
import { Grid, Theme, useMediaQuery } from '@mui/material'
import stores from '../../../stores/Stores'
import { observer } from 'mobx-react-lite'
import BoxDrawer from '../../../components/boxes/BoxDrawer'
import BoxDialog from '../../../components/boxes/BoxDialog'
import BoxCard from '../../../components/boxes/BoxCard'
import { GGBox } from '../../../entities/GGBox'
import { ApiSource } from '../../../utils/api'
import { plainToInstance } from 'class-transformer'
import { useQuery } from 'react-query'
import BoxesSkeletons from '../../../components/boxes/BoxesSkeletons'
import { http } from '../../../utils/http'
import { useSearchParams } from 'react-router-dom'


const BoxesList: FC = () => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const [searchParams, setSearchParams] = useSearchParams()
    const boxId = searchParams.get('box')

    const handleOpenBox = (box: GGBox): void => {
        stores.boxes.openBoxInfo(box.id)
        setSearchParams({ box: box.id }, {
            state: {
                ignoreScrolling: true,
            },
        })
    }

    const closeBoxInfo = useCallback(() => {
        stores.boxes.closeBoxInfo()
        setSearchParams(``, {
            state: {
                ignoreScrolling: true,
            },
        })
    }, [])

    const fetchBoxesMarketplace = async (): Promise<GGBox[]> => http
        .get(ApiSource + 'box', { params: { ...stores.boxes.filters, include: ['streamers', 'games'] } })
        .then((res) => res.data)
        .then((res) => plainToInstance(GGBox, res as any[]))

    const boxes = useQuery('boxesMarketplace', fetchBoxesMarketplace)

    useEffect(() => {
        void boxes.refetch()
        if (boxId) {
            stores.boxes.openBoxInfo(boxId)
        }
    }, [stores.boxes.refetch])

    return (
        <>
            <Grid
                container
                justifyContent={'start'}
                alignItems={'center'}
                maxWidth={'100%'}
                columns={3}
                rowSpacing={{ xs: 6, md: 0 }}
                columnSpacing={{ xs: 0, md: 3 }}
            >
                {
                    boxes.isLoading &&
                    <BoxesSkeletons/>
                }
                {
                    boxes.isSuccess &&
                    boxes.data
                        .filter((box: GGBox) => box.name.toLowerCase().includes(stores.boxes.searchPattern.toLowerCase()))
                        .map((box) => (
                            <Grid
                                item
                                xs={3}
                                md={1}
                                key={box.id}
                            >
                                <BoxCard
                                    box={box}
                                    onClick={(): void => handleOpenBox(box)}
                                />
                            </Grid>
                        ))
                }
            </Grid>
            {
                stores.boxes.isBoxInfoOpen && isMobile &&
                <BoxDrawer
                    open={stores.boxes.isBoxInfoOpen}
                    boxId={stores.boxes.pickedBoxId}
                    onClose={closeBoxInfo}
                />
            }
            {
                stores.boxes.isBoxInfoOpen && !isMobile &&
                <BoxDialog
                    open={stores.boxes.isBoxInfoOpen}
                    boxId={stores.boxes.pickedBoxId}
                    onClose={closeBoxInfo}
                />
            }
        </>
    )
}

export default observer(BoxesList)