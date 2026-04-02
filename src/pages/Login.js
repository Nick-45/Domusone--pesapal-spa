import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
`;

const Logo = styled.img`
  display: block;
  margin: 0 auto 30px;
  max-width: 150px;
`;

const Title = styled.h1`
  text-align: center;
  color: #FF6B35;
  margin-bottom: 30px;
  font-size: 28px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FF6B35;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #FF6B35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #E55A2B;
    transform: translateY(-2px);
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate(`/${result.role}`);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo src="/logo.png" alt="DOMUSONE" />
        <Title>DOMUSONE</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Login</Button>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
