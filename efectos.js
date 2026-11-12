// Efectos: nieve
// ===== Nieve suave =====
if (!matchMedia("(prefers-reduced-motion:reduce)").matches) for (let i = 0; i < 30; i++) { const s = document.createElement("span"); s.className = "nieve"; s.textContent = ["❄", "❅", "✨", "❆"][i % 4]; s.style.cssText = `left:${Math.random() * 100}vw;font-size:${10 + Math.random() * 12}px;animation-duration:${8 + Math.random() * 10}s;animation-delay:${-Math.random() * 12}s;opacity:${.5 + Math.random() * .4}`; document.body.appendChild(s); }

// ===== Copos al tocar cualquier botón =====
function copos(el) {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span"), ang = Math.random() * Math.PI * 2, d = 28 + Math.random() * 42;
    s.className = "copo"; s.textContent = ["❄", "❅", "❆"][i % 3];
    s.style.cssText = `left:${cx}px;top:${cy}px;--dx:${Math.cos(ang) * d}px;--dy:${Math.sin(ang) * d + 34}px;font-size:${12 + Math.random() * 10}px`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 950);
  }
}
document.addEventListener("click", e => { const b = e.target.closest("button,.btn,.opcion-pago"); if (b) copos(b); }, true);
