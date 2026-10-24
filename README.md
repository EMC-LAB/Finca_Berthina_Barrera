# Finca Berthina — Sitio web comercial

Sitio web estático, responsivo y organizado con arquitectura SILO real para **Finca Berthina**, Santiago Cuautlalpan, Tepotzotlán, Estado de México.

## Páginas

- `/` Portada
- `/espacios/` y páginas individuales de jardín, salón, capilla y cocina
- `/galeria/` Fotografías reales del inmueble y de eventos
- `/experiencias/` Tipos de evento y costos históricos **pendientes de aprobación**
- `/cotizar/` Preparador de mensaje de cotización. **No envía datos a un servidor**.
- `/disponibilidad/` Calendario consultivo. **NO está sincronizado en tiempo real**.
- `/visita-3d/` Maqueta conceptual interactiva, no a escala
- `/ubicacion/` Enlace a indicaciones de Google Maps

## Publicación en GitHub Pages

En `Settings → Pages → Build and deployment`, seleccionar `Deploy from a branch`, rama `main`, carpeta `/(root)`, y guardar. El sitio previsto es:

https://emc-lab.github.io/Finca_Berthina_Barrera/

Esta dirección debe comprobarse después de activar GitHub Pages; no se puede asumir que esté publicada antes.

## Foto/branding

Los archivos optimizados están en `assets/img/`. Son fotos proporcionadas por administración. La imagen `brand_cover.webp` es una composición de la portada de Facebook y el `logo.webp` es el emblema de capilla elegido. No se incluyeron áreas residenciales privadas como amenidades. Alberca y habitaciones están excluidas de la venta.

## Cotización y WhatsApp

El teléfono oficial todavía no está confirmado. `cotizar/` permite preparar y copiar una solicitud o abrir Facebook para enviarla. **No publicamos el número personal de SIE como número oficial de la finca**. Cuando exista el teléfono, se integra un `wa.me/52...` con el mensaje codificado.

## Disponibilidad

GitHub Pages sirve archivos estáticos, así que por sí solo **no soporta cambios instantáneos de ocupación**. `data/reservas.json` solo debe listar fechas aprobadas por administración con anticipo confirmado. Estructura de ejemplo (no agregar reservas inventadas):

```json
{
  "updated_at": "2026-10-24T12:00:00-06:00",
  "confirmed_bookings": [
    {"date": "AAAA-MM-DD", "status": "confirmada", "anticipo": "aprobado"}
  ]
}
```

Para disponibilidad realmente en tiempo real se debe conectar una base de datos con lectura pública filtrada y un panel privado con autenticación, roles, confirmación de depósito y auditoría de cambios. No exponer datos personales ni llaves secretas en frontend.

## Precios

Las tarifas del documento antiguo `Presentacion_HDA_BARRERA.pdf` se etiquetan **referenciales, no autorizadas**. Gaby y Edgar deben confirmar cifras, aforos, servicios incluidos, plazos y validez antes de comunicarlas como definitivas.

## Operación

Sergio: mantenimiento lunes-sábado 09:00–18:00. Dirección y autorización comercial: Gaby/Edgar con apoyo de Daniel. Personal de eventos, limpieza y servicios especializados se puede contratar externamente.

## Próximas mejoras

- Revisión de aforo y permisos aplicables
- Inventario completo con Sergio, en especial cocina y mobiliario
- Confirmación de contratos, precios y servicios por dirección
- WhatsApp de la finca y calendario con backend real
- Video profesional con permisos de uso de imagen
- Recorrido 3D fiel tras levantamiento topográfico y fotos 360°
