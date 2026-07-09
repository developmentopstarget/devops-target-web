import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Reports false on the server and on the client's first (hydration) render,
// then true afterwards — lets client-only state (localStorage, next-themes)
// settle before it's read, without a setState-in-effect hydration flash.
export function useMounted() {
  return useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);
}
