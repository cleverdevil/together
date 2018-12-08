import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

const ShortcutTable = ({ title, keys }) => (
  <div>
    <Typography
      variant="subtitle1"
      style={{ borderBottom: '1px solid', paddingLeft: 24 }}
    >
      {title}
    </Typography>
    <Table style={{ marginBottom: 40 }}>
      <TableBody>
        {keys.map(key => (
          <TableRow key={`key-row-${title}-${key.name}`}>
            <TableCell style={{ width: '15em' }}>{key.name}</TableCell>
            <TableCell>
              {key.shortcuts.map(key => (
                <Chip
                  key={`key-row-${title}-${key.name}-key-${key}`}
                  label={key}
                  style={{ marginRight: 10 }}
                />
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)

export default ShortcutTable
