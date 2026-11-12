// Pintar: carrusel, catálogo, carrito
// ===== PINTAR =====
function pCarrusel() {
  $("slides").innerHTML = slides.map((s, i) => `<div class="carousel-item ${i === 0 ? "active" : ""}">
   <div class="adm-slide"><button class="btn btn-sm btn-light" data-sed="${i}">✏️ Texto</button><button class="btn btn-sm btn-danger" data-sdel="${i}">🗑</button></div>
   <div class="slide-visual">${s.img ? `<img src="${esc(s.img)}" alt="">` : esc(s.emoji || "🎄")}</div><h2>${esc(s.titulo)}</h2><p class="lead">${esc(s.texto)}</p><a class="btn btn-warning btn-lg" href="#catalogo">Ver productos</a></div>`).join("");
  $("inds").innerHTML = slides.map((s, i) => `<button data-bs-target="#carrusel" data-bs-slide-to="${i}" class="${i === 0 ? "active" : ""}"></button>`).join("");
}
function textoStock(s) { return s <= 0 ? '<span class="stock text-danger">Agotado</span>' : s <= 5 ? `<span class="stock text-warning">¡Quedan ${s}!</span>` : `<span class="stock text-success">Stock: ${s}</span>`; }
const TARJ_NUEVO = '<div class="col-12"><button type="button" class="agregar-card" data-nuevo="1">➕ Agregar producto</button></div>';
function pintar() {
  document.body.classList.toggle("modo-admin", esAdmin);
  $("barraAdmin").classList.toggle("d-none", !esAdmin);
  $("chips").innerHTML = ["Todos", ...CATS.map(c => c[0])].map(c => `<span class="chip-grupo"><button class="chip ${c === filtro ? "on" : ""}" data-chip="${esc(c)}">${c === "Todos" ? "" : emojiDe(c) + " "}${esc(c)}</button>${esAdmin && c !== "Todos" ? `<button class="chip-x" data-delchip="${esc(c)}" title="Quitar botón">✕</button>` : ""}</span>`).join("");
  $("lista").innerHTML = (esAdmin ? TARJ_NUEVO : "") + productos.map((x, k) => (filtro === "Todos" || x.c === filtro) ? `<div class="col-12"><div class="producto">
   ${esAdmin ? `<label class="img img-admin">` : `<div class="img">`}${x.img ? `<img src="${esc(x.img)}" alt="${esc(x.n)}">` : emojiDe(x.c)}${esAdmin ? `<span class="img-hint">📷 Toca para ${x.img ? "cambiar" : "agregar"} foto</span><input type="file" accept="image/*" hidden data-img="${k}"></label>` : `</div>`}
   <div class="info">` + (esAdmin ? `
   <input class="form-control form-control-sm" data-k="${k}" data-f="n" value="${esc(x.n)}" placeholder="Nombre">
   <input class="form-control form-control-sm mt-1" data-k="${k}" data-f="d" value="${esc(x.d)}" placeholder="Descripción">
   <select class="form-select form-select-sm mt-1" data-k="${k}" data-f="c">${CATS.map(c => `<option ${c[0] === x.c ? "selected" : ""}>${c[0]}</option>`).join("")}</select>
   <div class="row g-1 mt-1"><div class="col-6"><label class="small">Precio</label><input type="number" min="0" class="form-control form-control-sm" data-k="${k}" data-f="p" value="${x.p}"></div>
   <div class="col-6"><label class="small">Stock</label><input type="number" min="0" class="form-control form-control-sm" data-k="${k}" data-f="s" value="${x.s}"></div></div>
   <button class="btn btn-danger btn-sm mt-2" data-borrar="${k}">🗑 Quitar</button>` : `
   <h6 class="mb-0">${esc(x.n)}</h6><p class="small mb-1">${esc(x.d)}</p><div class="precio">Bs ${x.p}</div><div class="mb-2">${textoStock(x.s)}</div>
   <div class="cantidad"><button type="button" class="menos" data-menos="${k}" aria-label="Quitar uno">−</button><span class="qty" id="q${k}">${carrito[k] || 0}</span><button type="button" class="mas" data-mas="${k}" aria-label="Agregar uno" ${x.s <= 0 ? "disabled" : ""}>+</button></div>`) + `</div></div></div>` : "").join("") + (esAdmin ? TARJ_NUEVO : "");
  $("inWa").value = wa(); $("textoWa").textContent = "+" + wa(); $("textoRef").textContent = NUMERO_REFERENCIA; $("nombre").textContent = A.nombre || NOMBRE_TIENDA;
  $("linkWa").href = `https://wa.me/${wa()}?text=${encodeURIComponent("Hola, quiero información de " + (A.nombre || NOMBRE_TIENDA))}`;
  $("logoBox").innerHTML = A.logo_url ? `<img src="${esc(A.logo_url)}" alt="Logo">` : "🎄";
  actualizarCarrito();
}
function totales() { let c = 0, t = 0; Object.keys(carrito).forEach(k => { const x = productos[k]; if (x) { c += carrito[k]; t += carrito[k] * x.p; } }); return [c, t]; }
function actualizarCarrito() { const [c, t] = totales(); $("cantCarrito").textContent = c; $("totCarrito").textContent = t; }
async function recargar() { await cargar(); pCarrusel(); pintar(); }
