// Local swap points — replace before launch for a new city/store.
export const storeConfig = {
  name: "DevOps Target",
  nameFa: "دیواپس تارگت",
  city: "Springfield",
  cityFa: "اسپرینگفیلد",
  tagline: "Springfield's computer store",
  taglineFa: "فروشگاه کامپیوتر اسپرینگفیلد",
  address: {
    line1: "128 Market Street",
    city: "Springfield",
    region: "IL",
    postalCode: "62701",
    country: "US",
  },
  phone: "(555) 019-2847",
  phoneHref: "+15550192847",
  email: "hello@devopstarget.example",
  hours: [
    {
      days: "Mon–Sat",
      time: "9am–7pm",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      days: "Sun",
      time: "11am–5pm",
      dayOfWeek: ["Sunday"],
      opens: "11:00",
      closes: "17:00",
    },
  ],
  hoursSummary: "Mon–Sat 9am–7pm · Sun 11am–5pm",
  hoursSummaryFa: "دوشنبه تا شنبه ۹ صبح تا ۷ عصر · یکشنبه ۱۱ صبح تا ۵ عصر",
  freeDeliveryThreshold: 99,
  mapQuery: "128 Market Street, Springfield",
  social: {
    instagram: "https://instagram.com/devopstarget",
    facebook: "https://facebook.com/devopstarget",
  },
} as const;

export type StoreConfig = typeof storeConfig;
