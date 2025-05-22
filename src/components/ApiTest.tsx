import { useEffect, useState } from 'react';
import { products } from '../services/api';

const ApiTest = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await products.getAll();
        setData(response.data);
        setStatus('success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('error');
      }
    };

    testApiConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
      
      {status === 'loading' && (
        <div className="text-blue-600">Testing API connection...</div>
      )}
      
      {status === 'error' && (
        <div className="text-red-600">
          <p>Error connecting to API:</p>
          <pre className="mt-2 p-2 bg-red-50 rounded">{error}</pre>
        </div>
      )}
      
      {status === 'success' && (
        <div className="text-green-600">
          <p>API connection successful!</p>
          <pre className="mt-2 p-2 bg-green-50 rounded overflow-auto max-h-60">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 