import { storeConfig } from "@/config/store";

export function AnnouncementBar() {
  return (
    <div className="bg-accent px-4 py-2 text-center text-[12.5px] font-medium text-white">
      Free local delivery in <b className="font-bold">{storeConfig.city}</b> on orders over{" "}
      <span className="font-mono">${storeConfig.freeDeliveryThreshold}</span> · Same-day in-store
      pickup
    </div>
  );
}
