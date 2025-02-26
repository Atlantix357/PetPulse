import React, { useState } from 'react';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      setError('Failed to reset password. Please check if the email is correct.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="neon" className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-secondary">Reset Password</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-900 bg-opacity-30 border border-green-500 rounded-md">
          <p className="text-green-500 text-sm">{message}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          icon={<Mail size={18} />}
        />
        
        <Button
          type="submit"
          fullWidth
          isLoading={loading}
        >
          Reset Password
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <Link to="/login" className="inline-flex items-center text-secondary hover:text-secondary-light transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Login
        </Link>
      </div>
    </Card>
  );
};

export default ForgotPasswordForm;
