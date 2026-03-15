
import { useState, useEffect, useCallback } from 'react';
import { generateAlerts } from '@/services/alertService.js';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await generateAlerts();
      // Add read status locally
      const withStatus = data.map(a => ({ ...a, read: false }));
      setAlerts(withStatus);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    // Optional: set up polling here
    // const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    // return () => clearInterval(interval);
  }, [fetchAlerts]);

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const filterBySeverity = (severity) => {
    if (!severity || severity === 'all') return alerts;
    return alerts.filter(a => a.severity === severity);
  };

  return { alerts, loading, error, markAsRead, filterBySeverity, refresh: fetchAlerts };
};
