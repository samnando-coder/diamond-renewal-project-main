const company = "kR28FWHdJXS2PRP38KMUSALg";
const url = `https://api.salonized.com/widget_api/companies/${company}`;

const res = await fetch(url, {
  headers: {
    accept: "application/json",
  },
});

if (!res.ok) {
  console.error("Request failed", res.status, res.statusText);
  process.exit(1);
}

const data = await res.json();

// Print a focused subset to help discover voucher/giftcard configuration.
const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]));

const companyData = data?.company ?? data;

console.log(
  JSON.stringify(
    {
      keys: Object.keys(companyData ?? {}).sort(),
      company: pick(companyData ?? {}, [
        "id",
        "name",
        "slug",
        "currency",
        "language",
        "locale",
        "has_vouchers",
        "vouchers_enabled",
        "voucher_enabled",
        "giftcards_enabled",
        "gift_cards_enabled",
        "features",
        "widget",
        "settings",
        "urls",
      ]),
    },
    null,
    2
  )
);

