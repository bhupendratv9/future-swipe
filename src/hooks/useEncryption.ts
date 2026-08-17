import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.NEXT_PUBLIC_ENCRYPTION_KEY || "my_secret_key_future_swipe_2026";

export const useEncryption = () => {
  const encrypt = (data:string) => {
    const stringData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
  };

  const decrypt = (cipherText: string) => {
    try {
      // Check if cipherText is valid
      if (!cipherText) {
        console.log("Invalid cipherText provided");
        return null;
      }

      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      // Check if decryption actually produced data
      if (!decryptedData) {
        console.log("Decryption produced empty result - likely wrong key");
        return null;
      }

      // Validate JSON before parsing
      if (decryptedData.trim() === '') {
        console.log("Decrypted data is empty string");
        return null;
      }

      return JSON.parse(decryptedData);
    } catch (error) {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);

      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.log("Decryption failed:", errorMessage);

      console.log("Decrypted string:", decryptedData || "undefined");

      return null;
    }
  };

  return { encrypt, decrypt };
};