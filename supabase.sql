-- ===== DULCE NAVIDAD · Supabase (PostgreSQL) =====
-- Supabase > SQL Editor > New query > pega todo > Run (una sola vez).
-- Usa un proyecto de Supabase NUEVO para esta tienda (no mezclar con otras páginas).

create table if not exists proveedor (id_proveedor serial primary key, nombre text not null, telefono text, direccion text);
create table if not exists vendedor  (id_vendedor serial primary key, nombre text not null, apellido text, telefono text, direccion text);
create table if not exists cliente   (id_cliente serial primary key, nombre text not null, apellido text, telefono text);
create table if not exists producto  (
  id_producto serial primary key,
  id_proveedor int references proveedor(id_proveedor) on delete set null,
  nombre text not null, descripcion text, categoria text default 'Otros',
  precio numeric(10,2) not null default 0, stock int not null default 0, imagen_url text);
create table if not exists venta (
  id_venta serial primary key,
  id_cliente int references cliente(id_cliente),
  id_vendedor int references vendedor(id_vendedor),
  fecha timestamptz default now(), total numeric(10,2) default 0,
  metodo_pago text, estado text default 'pendiente');
create table if not exists detalle_venta (
  id_detalle serial primary key,
  id_venta int not null references venta(id_venta) on delete cascade,
  id_producto int references producto(id_producto) on delete set null,
  cantidad int not null check (cantidad > 0), precio_unitario numeric(10,2) not null);
create table if not exists carrusel (id serial primary key, imagen_url text, titulo text, texto text, orden int default 0);
create table if not exists ajustes (clave text primary key, valor text);

alter table proveedor enable row level security;
alter table vendedor enable row level security;
alter table cliente enable row level security;
alter table venta enable row level security;
alter table detalle_venta enable row level security;
alter table producto enable row level security;
alter table carrusel enable row level security;
alter table ajustes enable row level security;

drop policy if exists "producto_todo" on producto;
drop policy if exists "carrusel_todo" on carrusel;
drop policy if exists "ajustes_todo" on ajustes;
create policy "producto_todo" on producto for all using (true) with check (true);
create policy "carrusel_todo" on carrusel for all using (true) with check (true);
create policy "ajustes_todo" on ajustes for all using (true) with check (true);

create or replace function crear_pedido(p_nombre text, p_telefono text, p_metodo text, p_items jsonb)
returns int language plpgsql security definer set search_path = public as $$
declare v_cli int; v_venta int; it jsonb; v_precio numeric; v_cant int; v_total numeric := 0;
begin
  insert into cliente(nombre, telefono) values (left(p_nombre, 80), left(p_telefono, 20)) returning id_cliente into v_cli;
  insert into venta(id_cliente, metodo_pago) values (v_cli, left(p_metodo, 20)) returning id_venta into v_venta;
  for it in select * from jsonb_array_elements(p_items) loop
    v_cant := (it->>'cantidad')::int; v_precio := null;
    select precio into v_precio from producto where id_producto = (it->>'id')::int and stock >= v_cant and v_cant > 0 for update;
    if v_precio is null then raise exception 'Sin stock'; end if;
    insert into detalle_venta(id_venta, id_producto, cantidad, precio_unitario) values (v_venta, (it->>'id')::int, v_cant, v_precio);
    update producto set stock = stock - v_cant where id_producto = (it->>'id')::int;
    v_total := v_total + v_precio * v_cant;
  end loop;
  update venta set total = v_total where id_venta = v_venta;
  return v_venta;
end $$;
grant execute on function crear_pedido(text, text, text, jsonb) to anon;

insert into storage.buckets (id, name, public) values ('medios', 'medios', true) on conflict do nothing;
drop policy if exists "medios_leer" on storage.objects;
drop policy if exists "medios_subir" on storage.objects;
drop policy if exists "medios_borrar" on storage.objects;
create policy "medios_leer" on storage.objects for select using (bucket_id = 'medios');
create policy "medios_subir" on storage.objects for insert with check (bucket_id = 'medios');
create policy "medios_borrar" on storage.objects for delete using (bucket_id = 'medios');

insert into vendedor(nombre, apellido) select 'Dulce', 'Navidad' where not exists (select 1 from vendedor);
insert into producto(nombre, descripcion, categoria, precio, stock)
  select x.n, x.d, x.c, x.p, x.s from (values
   ('Panetón clásico', 'Esponjoso, con frutas confitadas', 'Panetones', 35, 30),
   ('Panetón de chocolate', 'Con chips de chocolate', 'Panetones', 40, 20),
   ('Caja de galletas navideñas', '12 galletas decoradas', 'Galletas', 25, 25),
   ('Galletas de jengibre', 'Bolsa de 10 unidades', 'Galletas', 18, 30),
   ('Bombones y turrones', 'Surtido para compartir', 'Dulces', 30, 15),
   ('Canasta navideña', 'Panetón, galletas y chocolate', 'Otros', 85, 8)) as x(n, d, c, p, s)
  where not exists (select 1 from producto);
insert into carrusel(titulo, texto, orden) select x.t, x.tx, x.o from (values
  ('¡Buenos precios!', 'Productos de San Gabriel, Ferrari, Danafría, Breick y más.', 1),
  ('Pedidos por WhatsApp', 'Elige tus productos y te los llevamos a tu puerta.', 2),
  ('¿Buscas otro producto?', 'Haz tu pedido nuevo y lo conseguimos para ti.', 3)) as x(t, tx, o)
  where not exists (select 1 from carrusel);
