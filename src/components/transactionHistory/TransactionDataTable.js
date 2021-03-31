import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'id', headerName: 'TransactionID', width: 70 },
  { field: 'DateProcessed', headerName: 'Date Processed', width: 130 },
  { field: 'TransactionStatus', headerName: 'Transaction Status', width: 130 },
  {field: 'BatchTotal', headerName: 'Batch Total', type: 'number', width: 90},

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
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
}