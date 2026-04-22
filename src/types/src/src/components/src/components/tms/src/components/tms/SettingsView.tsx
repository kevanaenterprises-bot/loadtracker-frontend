import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  emailFrom: string;
  emailPassword: string;
}

const SettingsView: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleTestEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      if (response.ok) {
        toast.success('Test email sent successfully!');
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      console.error('Test email error:', error);
      toast.error('Failed to send test email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Email Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Backend Integration</h2>
          <p className="text-gray-600 mb-4">
            This frontend connects to your LoadTracker-Pro-2026 backend at:
          </p>
          <code className="bg-gray-100 p-2 rounded block font-mono text-sm break-all">
            {import.meta.env.VITE_API_URL}
          </code>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Email Configuration</h2>
          <p className="text-gray-600 mb-4">
            Email settings are managed by your backend service. The frontend sends requests 
            to your backend, which handles Outlook SMTP integration.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleTestEmail}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Testing...' : 'Send Test Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
