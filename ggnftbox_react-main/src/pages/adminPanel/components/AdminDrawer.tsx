import React, { FC } from 'react'
import { Drawer, List, ListItem, ListItemText } from '@mui/material'
import stores from '../../../stores/Stores'
import { observer } from 'mobx-react-lite'


const AdminDrawer: FC = () => (
    <Drawer
        variant={'permanent'}
        sx={{
            display: 'block',
            '& .MuiDrawer-paper': {
                background: '#080E24',
                boxSizing: 'border-box',
                width: 250,
                height: 'calc(100vh - 180px - 145px)',
                mt: 22.5,
                borderRight: '1px solid #fff',
            },
        }}
        open
    >
        <List>
            {
                stores.admin.drawerSections.map((section) => (
                    <ListItem
                        button
                        selected={section === stores.admin.currentSection}
                        onClick={(): void => stores.admin.setCurrentSection(section)}
                        key={section}
                    >
                        <ListItemText primary={section}/>
                    </ListItem>
                ))
            }
        </List>
    </Drawer>
)

export default observer(AdminDrawer)