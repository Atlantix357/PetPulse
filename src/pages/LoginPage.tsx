import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
