
import { ApiError } from '../types/common';

export const formatApiError = (error: any): ApiError => {
  if (error?.response?.data) {
    return {
      code: error.response.status,
      message: error.response.data.message || 'An error occurred',
      data: error.response.data.data
    };
  }
  
  return {
    code: 500,
    message: error.message || 'Unknown error occurred'
  };
};
