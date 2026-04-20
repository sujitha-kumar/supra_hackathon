import React from 'react';
import { AuthLayout, LoginForm } from '../components/auth';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
