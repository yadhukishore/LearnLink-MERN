export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  export const verifyOTP = (email: string, inputOTP: string, otpStorage: { [email: string]: { otp: string; expires: Date } }): boolean => {
    const storedOTPData = otpStorage[email];
  
  if (!storedOTPData) {
    console.log("No OTP found for email:", email);
    return false;
  }

  const { otp: storedOTP, expires } = storedOTPData;
  
  console.log("Stored OTP:", storedOTP);
  console.log("Input OTP:", inputOTP);
  console.log("OTP Expiration:", expires);

  if (new Date() > expires) {
    console.log("OTP has expired");
    return false;
  }

  return inputOTP === storedOTP;
};