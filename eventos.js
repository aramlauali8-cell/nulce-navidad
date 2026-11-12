// Eventos: catálogo, carrusel y modo administrador
// ===== CLICS =====
$("chips").addEventListener("click", async e => {
  const x = e.target.closest("[data-delchip]");
  if (x) {
    const i = CATS.findIndex(c => c[0] === x.dataset.delchip);
    if (i < 0 || !exigirNube() || !confirm("¿Quitar el botón \"" + CATS[i][0] + "\"? Los productos no se borran.")) return;
    const [rm] = CATS.splice(i, 1);
    try { await guardarAj("categorias", JSON.stringify(CATS)); if (filtro === rm[0]) filtro = "Todos"; pintar(); aviso("✅ Botón quitado"); } catch (er) { CATS.splice(i, 0, rm); alert("Error: " + er.message); }
    return;
  }
  const b = e.target.closest("[data-chip]"); if (b) { filtro = b.dataset.chip; pintar(); }
});
$("btnNuevaCat").addEventListener("click", async () => {
  if (!exigirNube()) return;
  const n = (prompt("Nombre del nuevo botón (ej: Chocolates)") || "").trim(); if (!n) return;
  if (n.toLowerCase() === "todos" || CATS.some(c => c[0].toLowerCase() === n.toLowerCase())) { aviso("Ese botón ya existe."); return; }
  const em = (prompt("Emoji del botón (opcional)", "🎁") || "").trim() || "🎁";
  CATS.push([n, em]);
  try { await guardarAj("categorias", JSON.stringify(CATS)); pintar(); aviso("✅ Botón agregado"); } catch (er) { CATS.pop(); alert("Error: " + er.message); }
});
$("lista").addEventListener("click", async e => {
  const bt = e.target.closest("[data-mas],[data-menos],[data-borrar]"); if (!bt) return;
  const mas = bt.dataset.mas, menos = bt.dataset.menos, b = bt.dataset.borrar;
  if (mas !== undefined) { if ((carrito[mas] || 0) < productos[mas].s) { carrito[mas] = (carrito[mas] || 0) + 1; setQ(mas); actualizarCarrito(); aviso("🛒 Presione el carrito para finalizar la transacción"); } else aviso("No hay más stock de este producto."); }
  if (menos !== undefined && carrito[menos]) { carrito[menos]--; if (!carrito[menos]) delete carrito[menos]; setQ(menos); actualizarCarrito(); }
  if (b !== undefined && exigirNube() && confirm("¿Quitar este producto?")) { try { await api("producto?id_producto=eq." + productos[b].id, "DELETE"); borrarArchivo(productos[b].img); carrito = {}; await recargar(); } catch (er) { alert("Error: " + er.message); } }
});
$("lista").addEventListener("change", async e => {
  const k = e.target.dataset.k, f = e.target.dataset.f, im = e.target.dataset.img;
  if (!exigirNube()) return;
  try {
    if (k !== undefined) {
      const v = (f === "p" || f === "s") ? Math.max(0, Number(e.target.value) || 0) : e.target.value, col = {n: "nombre", d: "descripcion", p: "precio", s: "stock", c: "categoria"}[f];
      await api("producto?id_producto=eq." + productos[k].id, "PATCH", {[col]: v}); productos[k][f] = v; actualizarCarrito(); aviso("✅ Guardado"); if (f === "c") pintar();
    }
    if (im !== undefined && e.target.files[0]) {
      aviso("Subiendo..."); const u = await subir(e.target.files[0]); if (!u) return;
      await api("producto?id_producto=eq." + productos[im].id, "PATCH", {imagen_url: u}); borrarArchivo(productos[im].img); productos[im].img = u; pintar(); aviso("✅ Imagen guardada");
    }
  } catch (er) { alert("Error al guardar: " + er.message); }
});
$("slides").addEventListener("click", async e => {
  const d = e.target.dataset.sdel, ed = e.target.dataset.sed;
  if (!exigirNube()) return;
  try {
    if (d !== undefined && slides[d].id && confirm("¿Quitar esta diapositiva?")) { await api("carrusel?id=eq." + slides[d].id, "DELETE"); borrarArchivo(slides[d].img); await recargar(); }
    if (ed !== undefined && slides[ed].id) { const t = prompt("Título", slides[ed].titulo); if (t === null) return; const x = prompt("Texto", slides[ed].texto); if (x === null) return; await api("carrusel?id=eq." + slides[ed].id, "PATCH", {titulo: t, texto: x}); await recargar(); }
  } catch (er) { alert("Error: " + er.message); }
});
$("lista").addEventListener("click", e => { if (e.target.closest("[data-nuevo]")) $("btnNuevo").click(); });
$("btnNuevo").addEventListener("click", async () => { if (!exigirNube()) return; try { await api("producto", "POST", {nombre: "Nuevo producto", descripcion: "Descripción", precio: 0, stock: 0, categoria: CATS.some(c => c[0] === filtro) ? filtro : "Otros"}); await recargar(); aviso("✅ Producto agregado: toca su foto para ponerle imagen", 3500); } catch (er) { alert("Error: " + er.message); } });
$("upSlide").addEventListener("change", async e => {
  const f = e.target.files[0]; if (!f || !exigirNube()) return;
  const t = prompt("Título de la diapositiva", "¡Feliz Navidad!"); if (t === null) return;
  const x = prompt("Texto corto", "Dulces para compartir en familia."); if (x === null) return;
  aviso("Subiendo..."); const u = await subir(f); if (!u) return;
  try { await api("carrusel", "POST", {imagen_url: u, titulo: t, texto: x, orden: slides.length + 1}, {Prefer: "return=minimal"}); await recargar(); aviso("✅ Agregada"); } catch (er) { alert("Error: " + er.message); }
  e.target.value = "";
});
$("upLogo").addEventListener("change", async e => {
  const f = e.target.files[0]; if (!f || !exigirNube()) return;
  aviso("Subiendo..."); const u = await subir(f); if (!u) return;
  try { borrarArchivo(A.logo_url); await guardarAj("logo_url", u); pintar(); aviso("✅ Logo cambiado"); } catch (er) { alert("Error: " + er.message); }
  e.target.value = "";
});
$("btnGuardarWa").addEventListener("click", async () => { const v = $("inWa").value.replace(/\D/g, ""); if (!v || !exigirNube()) return; try { await guardarAj("whatsapp", v); pintar(); aviso("✅ Número guardado"); } catch (er) { alert("Error: " + er.message); } });

// ===== ADMIN: 2 códigos (1-9 y luego 9-1) =====
function abrirAdmin() { paso = 1; $("pasoAdmin").textContent = "Paso 1 de 2: ingresa tu código"; $("btnEntrar").textContent = "Continuar"; $("inCodigo").value = ""; $("errCodigo").textContent = ""; modalAdmin.show(); }
$("btnAdmin").addEventListener("click", e => { e.preventDefault(); abrirAdmin(); });
function entrar() {
  const v = $("inCodigo").value;
  if (paso === 1) {
    if (v === CODIGO_ADMIN_1) { paso = 2; $("inCodigo").value = ""; $("errCodigo").textContent = ""; $("pasoAdmin").textContent = "Paso 2 de 2: código de verificación"; $("btnEntrar").textContent = "Entrar"; $("inCodigo").focus(); }
    else $("errCodigo").textContent = "Código incorrecto";
  } else if (v === CODIGO_ADMIN_2) { esAdmin = true; modalAdmin.hide(); pintar(); location.hash = "#catalogo"; }
  else $("errCodigo").textContent = "Código de verificación incorrecto";
}
$("btnEntrar").addEventListener("click", entrar);
$("inCodigo").addEventListener("keydown", e => { if (e.key === "Enter") entrar(); });
$("btnSalir").addEventListener("click", () => { esAdmin = false; pintar(); });
