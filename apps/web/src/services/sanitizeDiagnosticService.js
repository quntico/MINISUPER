
export const sanitizeDiagnostic = (diagnostic) => {
  if (!diagnostic) return diagnostic;
  
  const sanitized = JSON.parse(JSON.stringify(diagnostic));
  
  const sensitiveKeys = [
    'password', 'token', 'secret', 'key', 'credentials', 
    'email', 'phone', 'apikey', 'auth', 'hash', 'salt',
    'creditcard', 'card', 'stripe', 'paypal'
  ];

  const removeSensitive = (obj) => {
    if (typeof obj !== 'object' || obj === null) return;
    
    for (let k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        const lowerKey = k.toLowerCase();
        const isSensitive = sensitiveKeys.some(sensitive => lowerKey.includes(sensitive));
        
        if (isSensitive) {
          obj[k] = '[REDACTED]';
        } else if (typeof obj[k] === 'object') {
          removeSensitive(obj[k]);
        }
      }
    }
  };

  removeSensitive(sanitized);
  return sanitized;
};
