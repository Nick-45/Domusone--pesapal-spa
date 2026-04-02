import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StatsCard from '../components/Common/StatsCard';
import TenantList from '../components/Admin/TenantList';
import AddTenantModal from '../components/Admin/AddTenantModal';
import InvoiceModal from '../components/Admin/InvoiceModal';
import ApartmentSettings from '../components/Admin/ApartmentSettings';
import TransactionsTable from '../components/Admin/TransactionsTable';
import { generateRentStatement } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';
import styled from 'styled-components';

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const AdminDashboard = () => {
  const [tenants, setTenants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tenantsRes, transactionsRes, statsRes] = await Promise.all([
        axios.get('/.netlify/functions/tenants'),
        axios.get('/.netlify/functions/transactions'),
        axios.get('/.netlify/functions/stats')
      ]);
      setTenants(tenantsRes.data);
      setTransactions(transactionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleExportPDF = async (tenantId) => {
    try {
      const tenant = tenants.find(t => t._id === tenantId);
      const tenantTransactions = transactions.filter(t => t.tenantId === tenantId);
      await generateRentStatement(tenant, tenantTransactions);
      toast.success('PDF generated successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await axios.delete(`/.netlify/functions/tenants/${tenantId}`);
        toast.success('Tenant deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete tenant');
      }
    }
  };

  return (
    <DashboardLayout role="admin">
      <div>
        <h1 style={{ color: '#FF6B35', marginBottom: '30px' }}>Admin Dashboard</h1>
        
        <div className="dashboard-stats">
          <StatsCard title="Total Tenants" value={stats.totalTenants || 0} />
          <StatsCard title="Total Balance" value={`KES ${stats.totalBalance?.toLocaleString() || 0}`} />
          <StatsCard title="Monthly Revenue" value={`KES ${stats.monthlyRevenue?.toLocaleString() || 0}`} />
          <StatsCard title="Apartment Capacity" value={`${stats.occupiedUnits || 0}/${stats.capacity || 0}`} />
        </div>

        <ButtonGroup>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Tenant
          </button>
          <button className="btn-primary" onClick={() => setShowInvoiceModal(true)}>
            Create Invoice
          </button>
          <button className="btn-secondary" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? 'Hide Settings' : 'Apartment Settings'}
          </button>
        </ButtonGroup>

        {showSettings && <ApartmentSettings onUpdate={fetchData} />}

        <div className="card" style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#FF6B35', marginBottom: '20px' }}>Tenants</h2>
          <TenantList 
            tenants={tenants} 
            onExportPDF={handleExportPDF}
            onDelete={handleDeleteTenant}
          />
        </div>

        <div className="card">
          <h2 style={{ color: '#FF6B35', marginBottom: '20px' }}>Recent Transactions</h2>
          <TransactionsTable transactions={transactions} />
        </div>

        {showAddModal && (
          <AddTenantModal 
            onClose={() => setShowAddModal(false)} 
            onSuccess={fetchData}
          />
        )}

        {showInvoiceModal && (
          <InvoiceModal 
            tenants={tenants}
            onClose={() => setShowInvoiceModal(false)} 
            onSuccess={fetchData}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
