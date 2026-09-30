"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getPushPublicKey, subscribePush, unsubscribePush } from "@/core/api/admin/push";
import { getExistingSubscription, pushSupported, subscribeToPush } from "@/lib/push";

/** Enable/disable push notifications for the signed-in admin, on this device. */
export function useAdminPush() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!pushSupported()) {
      setReady(true);
      return;
    }
    getExistingSubscription().then((sub) => {
      setSubscription(sub);
      setReady(true);
    });
  }, []);

  const enable = useMutation({
    mutationFn: async () => {
      if (!pushSupported()) throw new Error("This browser doesn't support push notifications.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Notification permission wasn't granted.");
      const publicKey = await getPushPublicKey();
      if (!publicKey) throw new Error("Push isn't configured on the server yet.");
      const sub = await subscribeToPush(publicKey);
      await subscribePush(sub.toJSON());
      return sub;
    },
    onSuccess: (sub) => {
      setSubscription(sub);
      toast.success("Notifications enabled on this device");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const disable = useMutation({
    mutationFn: async () => {
      if (!subscription) return;
      await unsubscribePush(subscription.endpoint);
      await subscription.unsubscribe();
    },
    onSuccess: () => {
      setSubscription(null);
      toast.success("Notifications disabled on this device");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    supported: pushSupported(),
    ready,
    subscribed: !!subscription,
    enable,
    disable,
  };
}
