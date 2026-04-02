import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/Layout/DashboardLayout';
import PaymentModal from '../components/Tenant/PaymentModal';
import TransactionHistory from '../components/Tenant/TransactionHistory';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const ProfileSection = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const ProfileCard = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ProfilePic = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #FF6B35;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const BalanceCard = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BalanceAmount = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-top: 10px;
`;

const Button = styled.button`
  background: #FF6B35;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;

  &:hover {
    background: #E55A2B;
    transform: translateY(-2px);
  }
`;

const TenantDashboard = () => {
  const [tenant, setTenant] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tenantRes, transactionsRes] = await Promise.all([
        axios.get('/.netlify/functions/tenant/profile'),
        axios.get('/.netlify/functions/tenant/transactions')
      ]);
      setTenant(tenantRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    fetchData();
  };

  if (!tenant) return <div>Loading...</div>;

  return (
    <DashboardLayout role="tenant">
      <div>
        <h1 style={{ color: '#FF6B35', marginBottom: '30px' }}>Welcome, {tenant.name}</h1>
        
        <ProfileSection>
          <ProfileCard>
            <ProfilePic src={tenant.profilePicture || '/default-avatar.png'} alt={tenant.name} />
            <ProfileInfo>
              <h3>{tenant.name}</h3>
              <p>Room: {tenant.roomNumber}</p>
              <p>Phone: {tenant.phoneNumber}</p>
              <p>Apartment: {tenant.apartment}</p>
            </ProfileInfo>
          </ProfileCard>
          
          <BalanceCard>
            <div>Current Balance</div>
            <BalanceAmount>KES {tenant.balance?.toLocaleString() || 0}</BalanceAmount>
            <Button onClick={() => setShowPayment(true)}>Make Payment</Button>
          </BalanceCard>
        </ProfileSection>

        <div className="card">
          <h2 style={{ color: '#FF6B35', marginBottom: '20px' }}>Transaction History</h2>
          <TransactionHistory transactions={transactions} />
        </div>

        {showPayment && (
          <PaymentModal 
            tenant={tenant}
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;
