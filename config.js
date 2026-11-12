// ===== CONFIGURACIÓN (edita aquí) =====
const NOMBRE_TIENDA = "Dulce Navidad";
const WHATSAPP_INICIAL = "59171931264";   // WhatsApp de pedidos (591 = Bolivia + 71931264)
const NUMERO_REFERENCIA = "77579228";     // número de referencia (se muestra en Contacto)
const QR_IMAGEN = "";                     // opcional: ruta de tu imagen QR de pago, ej: "qr.png"
const CODIGO_ADMIN_1 = "100409";       // primera contraseña
const CODIGO_ADMIN_2 = "251208";       // segunda contraseña
const SUPABASE_URL = "";                  // pega tu Project URL (sin / al final)
const SUPABASE_KEY = "";                  // pega tu clave anon public (empieza con eyJ)

// Datos de ejemplo: se usan mientras no conectes Supabase.
const CATS = [["Panetones", "🎄"], ["Galletas", "🍪"], ["Dulces", "🍬"], ["Otros", "🎁"]]; // botones del catálogo (en modo admin puedes agregar más)
const SLIDES = [
  { img: "", emoji: "🎄", titulo: "¡Buenos precios!", texto: "Productos de San Gabriel, Ferrari, Danafría, Breick y más." },
  { img: "", emoji: "🎁", titulo: "Pedidos por WhatsApp", texto: "Elige tus productos y te los llevamos a tu puerta." },
  { img: "", emoji: "🛍️", titulo: "¿Buscas otro producto?", texto: "Haz tu pedido nuevo y lo conseguimos para ti." }
];
const PRODUCTOS_INICIALES = [
  { n: "Panetón clásico", d: "Esponjoso, con frutas confitadas", p: 35, s: 30, c: "Panetones", img: "" },
  { n: "Panetón de chocolate", d: "Con chips de chocolate", p: 40, s: 20, c: "Panetones", img: "" },
  { n: "Caja de galletas navideñas", d: "12 galletas decoradas", p: 25, s: 25, c: "Galletas", img: "" },
  { n: "Galletas de jengibre", d: "Bolsa de 10 unidades", p: 18, s: 30, c: "Galletas", img: "" },
  { n: "Bombones y turrones", d: "Surtido para compartir", p: 30, s: 15, c: "Dulces", img: "" },
  { n: "Canasta navideña", d: "Panetón, galletas y chocolate", p: 85, s: 8, c: "Otros", img: "" }
];
