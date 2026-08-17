import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my_secret_key_2026";

export const encryptionUtils = {
  encrypt: (data: string) => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  },

  decrypt: (cipherText: string) => {
    try {
      if (!cipherText) return null;

      // Ensure we are working with a URI-decoded string
      const decodedCipherText = decodeURIComponent(cipherText);

      const bytes = CryptoJS.AES.decrypt(decodedCipherText, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedData) {
        console.error("Decryption failed: Empty result (Check your Secret Key)");
        return null;
      }

      try {
        // Try to parse as JSON, if it fails, return as raw string
        return JSON.parse(decryptedData);
      } catch {
        return decryptedData;
      }
    } catch (error) {
      console.error("Decryption Error:", error);
      return null;
    }
  }
};