export const validEmail = (email: any): boolean => {
  if (!validString(email)) return false;

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export const validPassword = (password: any): boolean => {
  if (!validString(password)) return false;

  // minimum 8 characters, at least one letter and one number
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
};

export const validString = (str: any): boolean => {
  if (typeof str !== 'string') return false;
  if (str.trim() === '') return false;
  return true;
};