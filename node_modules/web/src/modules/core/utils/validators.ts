
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const re = /^\+?[\d\s-]{10,15}$/;
  return re.test(phone);
};

export const isValidTaxId = (taxId: string): boolean => {
  // Basic RFC validation for Mexico (12 or 13 chars)
  const re = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
  return re.test(taxId);
};
