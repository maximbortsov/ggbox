import React, { FC, useEffect, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid'
import stores from '../../stores/Stores'
import { Lot } from '../../entities/Lot'
import { useQueryClient } from 'react-query'
import { Pages } from '../../utils/routes'
import { useNavigate } from 'react-router-dom'
import { User } from '../../entities/User'
import BuyBtn from './BuyBtn'
import CancelBtn from './CancelBtn'


interface FormattedLot {
    id: string
    serialNumber: string
    seller: string
    price: number
    playId: string
    sellerAddress: string
    nftFlowId: string
    isOwner: boolean
}

const columns: GridColDef[] = [
    {
        field: 'serialNumber',
        headerName: '#',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
    },
    {
        field: 'seller',
        headerName: 'Owner',
        flex: 10,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
    },
    {
        field: 'price',
        headerName: 'Price',
        type: 'number',
        flex: 5,
        align: 'center',
        headerAlign: 'center',
        renderHeader: (params: GridColumnHeaderParams): JSX.Element => (
            <Typography
                variant={'h6'}
                fontWeight={500}
                fontFamily={'"Montserrat", sans-serif'}
            >
                {params.colDef.headerName}
            </Typography>
        ),
        renderCell: (params: GridRenderCellParams): string => `${Number(params.value).toFixed(3)} ${stores.marketplace.pickedCurrency}`,
    },
    {
        field: 'buyBtn',
        headerName: '',
        type: 'number',
        flex: 5,
        align: 'center',
        headerAlign: 'center',
        cellClassName: 'aboba',
        sortable: false,
        renderCell: (params: GridRenderCellParams): JSX.Element => (
            params.row.isOwner ?
                <CancelBtn
                    nftFlowId={params.row.nftFlowId}
                />
                :
                <BuyBtn
                    price={params.row.price}
                    sellerAddress={params.row.sellerAddress}
                    nftFlowId={params.row.nftFlowId}
                    playId={params.row.playId}
                />
        ),
    },
]

export const PlayLots: FC<{ lots?: Lot[]; playId: string }> = ({ lots, playId = [] }) => {

    const [formattedLots, setFormattedLots] = useState<FormattedLot[]>([])
    const navigate = useNavigate()

    const queryClient = useQueryClient()
    const user = queryClient.getQueryData('currentUser') as User

    useEffect(() => {
        const temp: FormattedLot[] = []
        if (lots) {
            for (const lot of lots) {
                temp.push({
                    serialNumber: lot.nft?.serialNumber ?? '-1',
                    seller: lot.seller?.username ?? 'anonymous',
                    sellerAddress: lot.seller?.flowWallet ?? '-',
                    nftFlowId: lot.nft?.flowID ?? '-',
                    price: lot.price,
                    id: lot.id,
                    playId: playId as string, // Думает, что это never[]
                    isOwner: lot.seller?.flowWallet === user?.flowWallet,
                })
            }
        }
        setFormattedLots(temp)
    }, [lots, playId, user?.flowWallet])

    return (
        <>
            <Box
                width={'100%'}
                height={'100%'}
            >
                {
                    formattedLots.length > 0 ?
                        <DataGrid
                            autoHeight
                            columns={columns}
                            rows={formattedLots}
                            rowHeight={48}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableColumnMenu
                            disableColumnFilter
                            disableSelectionOnClick
                            sx={{
                                border: 'none',
                                '& .MuiIconButton-root': {
                                    color: 'white',
                                },
                                '& .MuiIconButton-root.Mui-disabled': {
                                    color: 'white',
                                },
                                '& .aboba': {
                                    borderBottom: 'none',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    borderImage: 'linear-gradient(to right, #FFF 76%, rgba(0,0,0,0) 24%) 100% 1;',
                                },
                                '& .MuiTablePagination-select': {
                                    color: 'white',
                                },
                                '& .MuiSelect-icon': {
                                    color: 'white',
                                },
                                '.MuiDataGrid-cell:focus': {
                                    outline: 'none',
                                },
                                '& .MuiDataGrid-columnSeparator--sideRight': {
                                    visibility: 'hidden',
                                },
                            }}
                        />
                        :
                        <Stack height={'100%'} alignItems={'center'} justifyContent={'center'}>
                            <Typography
                                fontWeight={'bold'}
                                variant={'body1'}
                            >
                                No one is selling this moment!
                            </Typography>
                            <Typography
                                mt={1}
                                variant={'body2'}
                            >
                                Open an NFT BOX and place your NFTs on marketplace!
                            </Typography>
                            {/* TODO: убрать ссылку на поли ди */}
                            <Button
                                variant={'contained'}
                                disableElevation
                                onClick={(): void => navigate(Pages.BOXES + '?box=b16d74f7-4311-40f3-8836-d42f5b59376f')}
                                sx={{
                                    maxWidth: '85vw',
                                    mt: 2,
                                    py: 2,
                                    px: 8,
                                    border: '2px solid #554ADA',
                                    background: '#554ADA',
                                    borderRadius: 0.5,
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
                                    fontSize={'1.25rem'}
                                >
                                    GO TO BOX
                                </Typography>
                            </Button>
                        </Stack>
                }
            </Box>
        </>
    )
}