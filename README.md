# Surveillance Socks Co. — test site

Test website for **48436 Digital Forensics, Assignment Part 2 (Web Analytics)**.
A fictional two-product shop, built so that a single visit can be followed from the
browser's cookie store, through the network request, to the analytics server's record.

## Files

| File | What it is |
|---|---|
| `index.html` | Home / product listing |
| `product-a.html` | Product page — Everyday Crew Sock (SOCK-A, $14.95) |
| `product-b.html` | Product page — Merino Hiker Sock (SOCK-B, $29.95) |
| `cart.html` | Cart |
| `checkout.html` | Checkout form (submits nowhere) |
| `thanks.html` | Order confirmation |
| `style.css` | Styling |
| `analytics.js` | **The only file you edit.** Analytics IDs and event tracking. |

## Setup

Open `analytics.js` and fill in the top four lines:

```js
var GA4_MEASUREMENT_ID = "G-XXXXXXXXXX";
var CLARITY_PROJECT_ID = "abcdefghij";
var MATOMO_URL         = "http://192.168.1.50:8080/";
var MATOMO_SITE_ID     = "1";
```

Leave a value as `""` and that platform won't load, so you can bring them online one at a time.

## Deploying to GitHub Pages

1. Create a free GitHub account and a new **public** repository.
2. Upload every file in this folder (Add file → Upload files → drag them in → Commit).
3. Settings → Pages → Source: `main`, folder `/ (root)` → Save.
4. Wait a minute or two. The site appears at `https://<username>.github.io/<repo>/`.

## Events

Each event is sent to GA4 and Matomo at the same time, so the same action can be
compared across platforms. Clarity records sessions automatically.

| Event | Fires when |
|---|---|
| `page_view` | Any page loads |
| `view_item` | A product page loads |
| `add_to_cart` | "Add to cart" is clicked |
| `begin_checkout` | "Proceed to checkout" is clicked |
| `purchase` | "Place order" is submitted |

Every event also logs to the browser console with an `[analytics]` prefix, which is
useful for screenshots showing an event firing.

## A path worth walking for screenshots

`index` → `product-a` → add to cart → `cart` → `checkout` → `thanks`

That produces a complete funnel with a purchase at the end. Walk it once, then walk a
second path that stops at `cart.html` so there is an abandonment to point at.

## Note

Nothing on this site is real and the checkout form submits nowhere. No data entered
into it leaves the browser. Do not enter real personal or payment details.
