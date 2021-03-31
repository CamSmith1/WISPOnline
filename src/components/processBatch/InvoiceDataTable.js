import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Button } from "@material-ui/core";


const columns = [
  { field: 'id', headerName: 'TransactionID', width: 200 },
  { field: 'DateProcessed', headerName: 'Date Processed', width: 200 },
  { field: 'TransactionStatus', headerName: 'Transaction Status', width: 200 },
  {field: 'BatchTotal', headerName: 'Batch Total', type: 'number', width: 200},

];

const rows = [

  { id: 1, DateProcessed: '31/03/21', TransactionStatus: 'POSTED', BatchTotal: 500 },
  { id: 2, DateProcessed: '31/03/21', TransactionStatus: 'POSTED', BatchTotal: 7 },
  { id: 3, DateProcessed: '31/03/21', TransactionStatus: 'POSTED', BatchTotal: 32 },
  { id: 4, DateProcessed: '31/03/21', TransactionStatus: 'POSTED', BatchTotal: 66 },
  { id: 5, DateProcessed: '31/03/21', TransactionStatus: 'POSTED', BatchTotal: 5555 },
  { id: 6, DateProcessed: '31/03/21', TransactionStatus: 'POSTED', BatchTotal: 12 },
  { id: 7, DateProcessed: '31/03/21', TransactionStatus: 'POSTED', BatchTotal: 53 },


];

export default function DataTable() {
  return (
    <div style={{ height: '50%', width: '100%' }}>
      <DataGrid rows={rows} columns={columns} checkboxSelection />
      <Button color="primary" variant="contained" component="label">
      Reload
    </Button> 
    <Button color="primary" variant="contained" component="label">
      Process
    </Button> 
    </div>
    
  );
}