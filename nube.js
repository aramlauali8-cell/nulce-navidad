// Nube: Supabase (datos e imágenes)
// ===== NUBE (Supabase) =====
async function api(ruta, metodo = "GET", cuerpo, extra = {}) {
  const r = await fetch(SUPABASE_URL + "/rest/v1/" + ruta, {method: metodo, headers: {...H, "Content-Type": "application/json", Prefer: "return=representation", ...extra}, body: cuerpo ? JSON.stringify(cuerpo) : undefined});
  const t = await r.text(); if (!r.ok) throw new Error(t || r.status); return t ? JSON.parse(t) : null;
}
const guardarAj = (clave, valor) => api("ajustes?on_conflict=clave", "POST", {clave, valor}, {Prefer: "resolution=merge-duplicates,return=minimal"}).then(() => A[clave] = valor);
async function reducir(f) {
  if (!f.type.startsWith("image/") || f.type === "image/gif") return {b: f, ext: (f.name.split(".").pop() || "bin").toLowerCase()};
  try {
    const im = await createImageBitmap(f), r = Math.min(1, 1280 / Math.max(im.width, im.height)), c = document.createElement("canvas");
    c.width = im.width * r; c.height = im.height * r; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
    const b = await new Promise(ok => c.toBlob(ok, "image/jpeg", .82)); if (!b) throw 0; return {b, ext: "jpg"};
  } catch (e) { return {b: f, ext: "jpg"}; }
}
async function subir(f) {
  if (!K) { alert("Primero conecta Supabase (ver LEEME) para guardar imágenes."); return null; }
  const {b, ext} = await reducir(f), n = Date.now() + Math.random().toString(36).slice(2, 6) + "." + ext;
  try { const r = await fetch(SUPABASE_URL + "/storage/v1/object/medios/" + n, {method: "POST", headers: {...H, "Content-Type": b.type || "application/octet-stream"}, body: b}); if (!r.ok) throw new Error(r.status + " " + (await r.text())); }
  catch (e) { alert("No se pudo subir la imagen: " + e.message); return null; }
  return PUB + n;
}
const borrarArchivo = u => { if (K && u && u.startsWith(PUB)) fetch(SUPABASE_URL + "/storage/v1/object/medios/" + u.slice(PUB.length), {method: "DELETE", headers: H}).catch(() => {}); };
const exigirNube = () => K || (alert("Conecta Supabase para guardar cambios (ver LEEME)."), false);

async function cargar() {
  const ej = () => { productos = PRODUCTOS_INICIALES.map(x => ({id: null, ...x})); slides = SLIDES.map(x => ({id: null, ...x})); };
  if (!K) return ej();
  try {
    const [pr, ca, aj] = await Promise.all([api("producto?select=*&order=id_producto"), api("carrusel?select=*&order=orden,id"), api("ajustes?select=*")]);
    productos = pr.map(x => ({id: x.id_producto, n: x.nombre, d: x.descripcion || "", p: Number(x.precio), s: x.stock, c: x.categoria || "Otros", img: x.imagen_url || ""}));
    slides = ca.map(x => ({id: x.id, img: x.imagen_url || "", emoji: "🎄", titulo: x.titulo || "", texto: x.texto || ""}));
    if (!slides.length) slides = SLIDES.map(x => ({id: null, ...x}));
    aj.forEach(x => A[x.clave] = x.valor);
    if (A.categorias) try { const k = JSON.parse(A.categorias); if (Array.isArray(k) && k.length) { CATS.length = 0; CATS.push(...k); } } catch (e) {}
  } catch (e) { alert("No se pudo conectar con Supabase. Se muestran datos de ejemplo."); ej(); }
}
