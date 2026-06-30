import * as React from "react";
import * as LocalAuthentication from "expo-local-authentication";

interface UseBiometricsResult {
  isCompatible: boolean;
  hasRecords: boolean;
  authenticateUser: (promptMessage: string) => Promise<boolean>;
}

export function useBiometrics(): UseBiometricsResult {
  const [isCompatible, setIsCompatible] = React.useState<boolean>(false);
  const [hasRecords, setHasRecords] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function checkDeviceHardware() {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsCompatible(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setHasRecords(enrolled);
      }
    }

    checkDeviceHardware();
  }, []);

  const authenticateUser = async (promptMessage: string): Promise<boolean> => {
    if (!isCompatible || !hasRecords) return false;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
        cancelLabel: "Cancel",
      });

      return result.success;
    } catch (error) {
      console.error("Biometric authentication failed:", error);
      return false;
    }
  };

  return { isCompatible, hasRecords, authenticateUser };
}
