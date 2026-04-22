import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Load {
  id: string;
  customerName: string;
  origin: string;
  destination: string;
  rate: number;
  status: 'pending' | 'in-transit' | 'delivered';
}

interface LoadDetailsModalProps {
  load: Load;
  isOpen: boolean;
  onClose: () => void;
}

const LoadDetailsModal: React.FC<LoadDetailsModalProps> = ({ load, isOpen, onClose }) => {
  const [isSending, setIsSending] = useState(false);
  const [emailType, setEmailType] = useState<'invoice' | 'test'>('invoice');

  const handleSendEmail = async () => {
    if (!isOpen) return;
    
    setIsSending(true);
    try {
      const endpoint = emailType === 'invoice' ? '/send-invoice' : '/test-email';
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          loadId: load.id,
          test: emailType === 'test'
        })
      });
      
      if (response.ok) {
        toast.success(`Email ${emailType === 'invoice' ? 'invoice' : 'test'} sent successfully!`);
        onClose();
      } else {
        throw new Error(`Failed to send ${emailType} email`);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      toast.error(`Failed to send ${emailType} email`);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Load Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Load ID</label>
              <p className="mt-1 text-gray-900">{load.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <p className="mt-1 text-gray-900">{load.customerName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Route</label>
              <p className="mt-1 text-gray-900">{load.origin} → {load.destination}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Rate</label>
              <p className="mt-1 font-semibold text-green-600">${load.rate.toLocaleString()}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${
                load.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                load.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {load.status.replace('-', ' ')}
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="invoice"
                  checked={emailType === 'invoice'}
                  onChange={(e) => setEmailType(e.target.value as any)}
                  className="mr-2"
                />
                Invoice Email
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="test"
                  checked={emailType === 'test'}
                  onChange={(e) => setEmailType(e.target.value as any)}
                  className="mr-2"
                />
                Test Email
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSending ? 'Sending...' : `Send ${emailType === 'invoice' ? 'Invoice' : 'Test'}`}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadDetailsModal;
