import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import Upload from 'src/components/uploadInvoices//upload';

const uploadInvoices = () => (
  <>
    <Helmet>
      <title>Upload Invoices</title>
    </Helmet>
    
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth="lg">
        <Upload />
      </Container>
    </Box>


  
 



  </>
);

export default uploadInvoices;
