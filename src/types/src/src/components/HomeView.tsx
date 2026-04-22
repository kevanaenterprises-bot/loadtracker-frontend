import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadDetailsModal from './tms/LoadDetailsModal';

interface Load {
  id: string;
  customerName: string;
  origin: string;
  destination: string;
  rate: number;
  status: 'pending' | 'in-transit' | 'delivered';
}

const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock loads data - in real app, fetch from backend
  const mockLoads: Load[] = [
    {
      id: 'LOAD-001',
      customerName: 'ABC Logistics',
      origin: 'Los Angeles, CA',
      destination: 'Chicago, IL',
      rate: 2500,
      status: 'pending'
    },
    {
      id: 'LOAD-002', 
      customerName: 'XYZ Transport',
      origin: 'Dallas, TX',
      destination: 'Miami, FL', 
      rate: 1800,
      status: 'in-transit'
    }
  ];

  const handleLoadClick = (load: Load) => {
    setSelectedLoad(load);
    setIsModalOpen(true);
  };

  const handleEmailTest = async () => {
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
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">LoadTracker Pro 2026</h1>
        <div className="flex space-x-4">
          <button 
            onClick={handleEmailTest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Email
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Settings
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Active Loads</h2>
        <div className="space-y-4">
          {mockLoads.map((load) => (
            <div 
              key={load.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleLoadClick(load)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{load.customerName}</h3>
                  <p className="text-sm text-gray-600">{load.origin} → {load.destination}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${load.rate.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    load.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    load.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {load.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedLoad && (
        <LoadDetailsModal
          load={selectedLoad}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HomeView;
