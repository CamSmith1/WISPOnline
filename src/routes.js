import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import UploadInvoices from 'src/pages/UploadInvoices';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import Settings from 'src/pages/Settings';
import TransactionHistory from 'src/pages/TransactionHistory';
import ProcessBatch from 'src/pages/processBatch';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'upload', element: <UploadInvoices /> },
      { path: 'transactionhistory', element: <TransactionHistory /> },
      { path: 'processBatch', element: <ProcessBatch /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
    
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
