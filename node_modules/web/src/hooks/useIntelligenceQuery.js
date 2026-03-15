
import { useState } from 'react';
import { processQuery } from '@/services/ai/aiService.js';

export const useIntelligenceQuery = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  const askQuestion = async (question) => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await processQuery(question);
      
      const historyItem = {
        id: Date.now(),
        question,
        timestamp: new Date(),
        success: response.success
      };
      
      setQueryHistory(prev => [historyItem, ...prev].slice(0, 10));
      setResult(response);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => setResult(null);

  return { result, loading, error, queryHistory, askQuestion, clearResult };
};
