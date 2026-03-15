
const PREFIX = 'minisuper_';

export const storageService = {
  set: (key, value) => {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  },
  
  clearAll: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};
