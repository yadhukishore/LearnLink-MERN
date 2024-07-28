import bcrypt from 'bcryptjs';
export const generateRandomPassword = (): string => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  export const generateSimplePassword = (): string => {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  };
  
  export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  };
  
  export const generateAndHashPassword = async (): Promise<{ plainPassword: string; hashedPassword: string }> => {
    const plainPassword = generateSimplePassword();
    const hashedPassword = await hashPassword(plainPassword);
    return { plainPassword, hashedPassword };
  };