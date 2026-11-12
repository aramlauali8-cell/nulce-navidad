// Pedido: carrito y pedido nuevo (WhatsApp)
// ===== PEDIDO (guarda cliente, venta y detalle en la base) =====
$("btnCarrito").addEventListener("click", () => {
  const [c, t] = totales(); let h = "";
  if (!c) h = "<p>Aún no agregaste productos.</p>";
  else { Object.keys(carrito).forEach(k => { const x = productos[k]; if (x) h += `<div class="d-flex justify-content-between border-bottom py-1"><span>${carrito[k]} × ${esc(x.n)}</span><b>Bs ${carrito[k] * x.p}</b></div>`; }); h += `<div class="d-flex justify-content-between py-1"><b>Total</b><b>Bs ${t}</b></div>`; }
  $("detalle").innerHTML = h; elegirPago("Efectivo"); modalPedido.show();
});
function elegirPago(p) {
  pagoSel = p;
  document.querySelectorAll(".opcion-pago").forEach(b => b.classList.toggle("on", b.dataset.pago === p));
  $("cajaQR").classList.toggle("d-none", p !== "QR" || !QR_IMAGEN);
  $("cajaQR").innerHTML = (p === "QR" && QR_IMAGEN) ? `<img src="${esc(QR_IMAGEN)}" alt="QR de pago" style="max-width:220px;width:100%;border-radius:12px"><div class="small mt-1">Escanea y paga, luego envía tu comprobante 🎁</div>` : "";
}
$("opcionesPago").addEventListener("click", e => { const b = e.target.closest(".opcion-pago"); if (b) elegirPago(b.dataset.pago); });

$("btnEnviar").addEventListener("click", async () => {
  const [c, t] = totales(), pago = pagoSel;
  if (!c) { alert("Agrega productos al carrito primero."); return; }
  const w = window.open("", "_blank"); let id = "";
  if (K) {
    try { id = await api("rpc/crear_pedido", "POST", {p_nombre: "Cliente web", p_telefono: "-", p_metodo: pago, p_items: Object.keys(carrito).map(k => ({id: productos[k].id, cantidad: carrito[k]}))}); }
    catch (er) { if (w) w.close(); alert("No se pudo registrar el pedido (¿sin stock?). Intenta de nuevo."); await recargar(); return; }
  }
  let msg = `🎄✨ *PEDIDO NAVIDEÑO* ✨🎄${id ? " (N° " + id + ")" : ""}\n🎅 Hola, quiero hacer este pedido:\n\n`;
  Object.keys(carrito).forEach(k => {
    const x = productos[k], q = carrito[k];
    msg += `🎁 *${x.n}*\n    Cantidad: ${q} × Bs ${x.p} = *Bs ${q * x.p}*\n`;
  });
  msg += `\n⭐ *TOTAL: Bs ${t}*\n${pago === "QR" ? "📲" : "💵"} Forma de pago: *${pago === "QR" ? "QR" : "Efectivo"}*\n\n❄️ ¡Gracias y Feliz Navidad! 🎅🎄`;
  const url = `https://wa.me/${wa()}?text=${encodeURIComponent(msg)}`;
  if (w) w.location.href = url; else location.href = url;
  carrito = {}; modalPedido.hide(); await recargar();
});

// ===== PEDIDO NUEVO (producto que no está en el catálogo) =====
$("btnNuevoPedido").addEventListener("click", () => {
  const d = $("nuevoDesc").value.trim(), n = $("nuevoNombre").value.trim();
  if (!d) { aviso("Escribe qué producto quieres."); return; }
  const msg = `🆕 *PEDIDO NUEVO*\n${n ? "👤 Nombre: " + n + "\n" : ""}📝 Producto: ${d}`;
  window.open(`https://wa.me/${wa()}?text=${encodeURIComponent(msg)}`, "_blank");
  $("nuevoDesc").value = ""; $("nuevoNombre").value = "";
});
