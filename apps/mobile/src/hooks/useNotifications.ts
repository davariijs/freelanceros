import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

export function useNotifications() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        const urlStr = data?.url;
        if (typeof urlStr === "string") {
          const routePath = urlStr.replace("freelanceos://", "/");
          router.push(routePath as any);
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [router]);
}
