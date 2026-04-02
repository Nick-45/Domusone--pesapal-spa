import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 260px;
  background: white;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  padding: 20px;
`;

const Logo = styled.img`
  width: 100%;
  max-width: 150px;
  margin-bottom: 30px;
`;

const NavItem = styled.div`
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#FF6B35' : '#666'};
  background: ${props => props.active ? '#FFF4E6' : 'transparent'};

  &:hover {
    background: #FFF4E6;
    color: #FF6B35;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #FF6B35;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DashboardLayout = ({ children, role }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = role === 'admin' 
    ? ['Dashboard', 'Tenants', 'Transactions', 'Settings']
    : ['Dashboard', 'Payments', 'History'];

  return (
    <Layout>
      <Sidebar>
        <Logo src="/logo.png" alt="DOMUSONE" />
        {navItems.map(item => (
          <NavItem key={item}>{item}</NavItem>
        ))}
      </Sidebar>
      <MainContent>
        <Header>
          <h2>DOMUSONE - {role === 'admin' ? 'Admin Panel' : 'Tenant Portal'}</h2>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </Header>
        {children}
      </MainContent>
    </Layout>
  );
};

export default DashboardLayout;
