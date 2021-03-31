import { Helmet } from 'react-helmet';
import DataTable from 'src/components/transactionHistory//TransactionDataTable';
import { DataGrid } from '@material-ui/data-grid';


const transactionHistory = () => (
  <>
    <Helmet>
      <title>Transaction History</title>
    </Helmet>
<DataTable/>
  </>
);

export default transactionHistory;
