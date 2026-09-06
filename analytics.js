/* ============================================================
   48436 Digital Forensics - Web Analytics test site
   ANALYTICS CONFIGURATION - this is the ONLY file you edit.

   Put your IDs in the three lines below. Leave a value as an
   empty string ("") and that platform simply won't load, so you
   can bring them online one at a time.
   ============================================================ */

var GA4_MEASUREMENT_ID = "G-MYGZ36PQS2";        // e.g. "G-XXXXXXXXXX"   (Google Analytics 4)
var CLARITY_PROJECT_ID = "ye0soh2bta";        // e.g. "abcdefghij"     (Microsoft Clarity)
var MATOMO_URL         = "";        // e.g. "http://192.168.1.50:8080/"
var MATOMO_SITE_ID     = "1";       // Matomo site ID, usually 1

/* ------------------------------------------------------------
   Nothing below here needs changing.
   ------------------------------------------------------------ */

// ---------- Google Analytics 4 ----------
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }

if (GA4_MEASUREMENT_ID) {
  var ga = document.createElement("script");
  ga.async = true;
  ga.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_MEASUREMENT_ID;
  document.head.appendChild(ga);
  gtag("js", new Date());
  gtag("config", GA4_MEASUREMENT_ID);
}

// ---------- Matomo ----------
var _paq = window._paq = window._paq || [];
if (MATOMO_URL) {
  _paq.push(["enableLinkTracking"]);
  _paq.push(["setTrackerUrl", MATOMO_URL + "matomo.php"]);
  _paq.push(["setSiteId", MATOMO_SITE_ID]);
  var mt = document.createElement("script");
  mt.async = true;
  mt.src = MATOMO_URL + "matomo.js";
  document.head.appendChild(mt);
}

// ---------- Microsoft Clarity ----------
if (CLARITY_PROJECT_ID) {
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
}

/* ============================================================
   SHOP LOGIC + EVENT TRACKING
   Every event below is sent to GA4 and Matomo at the same time,
   so the same visitor action can be compared across platforms.
   ============================================================ */

var CURRENCY = "AUD";

function readCart() {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
  catch (e) { return []; }
}
function writeCart(items) {
  try { localStorage.setItem("cart", JSON.stringify(items)); } catch (e) {}
  paintCartCount();
}
function cartTotal() {
  return readCart().reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
}
function paintCartCount() {
  var n = readCart().reduce(function (s, i) { return s + i.qty; }, 0);
  var el = document.getElementById("cart-count");
  if (el) el.textContent = n;
}

// Fired on a product page load
function trackViewItem(id, name, price) {
  gtag("event", "view_item", {
    currency: CURRENCY, value: price,
    items: [{ item_id: id, item_name: name, price: price, quantity: 1 }]
  });
  _paq.push(["setEcommerceView", id, name, "Socks", price]);
  console.log("[analytics] view_item", id, name, price);
}

function addToCart(id, name, price) {
  var items = readCart();
  var found = items.filter(function (i) { return i.id === id; })[0];
  if (found) { found.qty += 1; } else { items.push({ id: id, name: name, price: price, qty: 1 }); }
  writeCart(items);

  gtag("event", "add_to_cart", {
    currency: CURRENCY, value: price,
    items: [{ item_id: id, item_name: name, price: price, quantity: 1 }]
  });
  _paq.push(["addEcommerceItem", id, name, "Socks", price, 1]);
  _paq.push(["trackEcommerceCartUpdate", cartTotal()]);
  console.log("[analytics] add_to_cart", id, name, price);

  var btn = event && event.target;
  if (btn && btn.tagName === "BUTTON") {
    var old = btn.textContent;
    btn.textContent = "Added";
    setTimeout(function () { btn.textContent = old; }, 1200);
  }
}

function trackBeginCheckout() {
  var items = readCart();
  gtag("event", "begin_checkout", {
    currency: CURRENCY, value: cartTotal(),
    items: items.map(function (i) {
      return { item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty };
    })
  });
  _paq.push(["trackEvent", "Checkout", "begin_checkout", "", cartTotal()]);
  console.log("[analytics] begin_checkout", cartTotal());
}

function completePurchase(e) {
  if (e) e.preventDefault();
  var items = readCart();
  var total = cartTotal();
  var orderId = "TEST-" + Date.now();

  gtag("event", "purchase", {
    transaction_id: orderId, currency: CURRENCY, value: total,
    items: items.map(function (i) {
      return { item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty };
    })
  });
  items.forEach(function (i) {
    _paq.push(["addEcommerceItem", i.id, i.name, "Socks", i.price, i.qty]);
  });
  _paq.push(["trackEcommerceOrder", orderId, total]);
  console.log("[analytics] purchase", orderId, total);

  try { localStorage.setItem("lastOrder", orderId); localStorage.removeItem("cart"); } catch (err) {}
  window.location.href = "thanks.html";
  return false;
}

document.addEventListener("DOMContentLoaded", function () {
  paintCartCount();
  // Matomo page view fires last, so any setEcommerceView call from the page is included.
  if (MATOMO_URL) _paq.push(["trackPageView"]);
});
