"use client";

import { storeConfig } from "@/config/store";
import { useLanguage } from "@/lib/useLanguage";

export function AnnouncementBar() {
  const { isRtl } = useLanguage();

  return (
    <div className="bg-accent px-4 py-2 text-center text-[12.5px] font-medium text-white">
      {isRtl ? (
        <>
          ارسال رایگان محلی در <b className="font-bold">{storeConfig.cityFa}</b> برای سفارش‌های بالای{" "}
          <span className="font-mono">${storeConfig.freeDeliveryThreshold}</span> · تحویل حضوری در همان روز
        </>
      ) : (
        <>
          Free local delivery in <b className="font-bold">{storeConfig.city}</b> on orders over{" "}
          <span className="font-mono">${storeConfig.freeDeliveryThreshold}</span> · Same-day in-store
          pickup
        </>
      )}
    </div>
  );
}
