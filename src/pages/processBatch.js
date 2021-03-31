import { Helmet } from 'react-helmet';
import DataTable from 'src/components/processBatch//InvoiceDataTable';

const processBatch = () => (
  <>
    <Helmet>
      <title>Process Batch Invoices</title>
    </Helmet>
<DataTable/>
  </>
);

export default processBatch;
