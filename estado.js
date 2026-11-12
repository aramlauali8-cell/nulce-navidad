// Estado y utilidades
// ===== ESTADO =====
const $ = id => document.getElementById(id);
const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const K = !!(SUPABASE_URL && SUPABASE_KEY);
const H = {apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY};
const PUB = SUPABASE_URL + "/storage/v1/object/public/medios/";
const emojiDe = c => (CATS.find(x => x[0] === c) || ["", "🎁"])[1];
let productos = [], slides = [], A = {}, carrito = {}, esAdmin = false, filtro = "Todos", paso = 1, pagoSel = "Efectivo";
const wa = () => (A.whatsapp || WHATSAPP_INICIAL).replace(/\D/g, "");
const modalAdmin = new bootstrap.Modal($("modalAdmin")), modalPedido = new bootstrap.Modal($("modalPedido"));
let _av;
function aviso(t, ms = 2000) { let d = $("aviso"); if (!d) { d = document.createElement("div"); d.id = "aviso"; d.style.cssText = "position:fixed;left:50%;bottom:78px;transform:translateX(-50%);background:#000d;color:#fff;padding:9px 16px;border-radius:20px;z-index:2000;max-width:90vw;text-align:center;font-weight:700;font-size:.9rem"; document.body.appendChild(d); } d.textContent = t; d.style.display = "block"; clearTimeout(_av); _av = setTimeout(() => d.style.display = "none", ms); }
function setQ(k) { const q = $("q" + k); if (q) q.textContent = carrito[k] || 0; }
