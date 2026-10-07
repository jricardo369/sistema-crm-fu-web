# Mejoras Visuales en Detalle de Solicitud

> Archivo de plan UI/UX para `src/app/solicitudes/solicitud/solicitud.component.*`
> Decisiones usuario: alcance = solo reordenar y agrupar / dolor = acomodo más ergonómico / modo = ver + editar.

## 1. Diagnóstico (auditoría heurística)

Archivo principal: `src/app/solicitudes/solicitud/solicitud.component.html:1-1022`
Lógica: `src/app/solicitudes/solicitud/solicitud.component.ts:1-1300`
Estilos: `src/app/solicitudes/solicitud/solicitud.component.css:1-375`
Modelo: `src/model/solicitud.ts:1-79`
Hijos: `src/app/solicitudes/eventos-solicitud/eventos-solicitud.component.html:1-97`, `src/app/solicitudes/movimientos-solicitud/movimientos-solicitud.component.html:1-61`

1. Todo en 1 scroll, 3 columnas planas de 340px (`html:76-454`) con ~28 campos sin agrupar: Customer, Last Names, Type, Additional, Phone+Validate, Email, Birth Date, Gender, Amount, Language, Type Interview, Address, State, Referral, Comments, Scales, External, Partner, Case number, Assigned clinician, doble buscador abogado + ficha.
2. Sin jerarquía: `importantNotes (html:86-92)` solo texto rojo, `Due Date (html:64-67)` duplicado en header y sidebar (`html:740-759`), checkboxes Waiver/Signed/Consent/Verificación (`html:713-739`) perdidos al final.
3. Header saturado: `experimental-menu (html:6-70)` con 3-4 badges + Refresh File + Due Date con estilos inline, rompe en pantallas chicas.
4. Sidebar `content-right (html:496-1012)` de 280px mezcla info (Responsible, Creation Date, CaseMgr, Scale, Clinician, Editor, File/Payment Status) con ~20 botones de acción condicionales por rol/estatus (`html:767-999`). Save Changes (`html:463-468`) se pierde en scroll.
5. Bloque abogado confuso: doble autocomplete mail/firm (`html:330-361`) + links Add new lawyer / Add email (`html:367-374`) + ficha (`html:392-407`). Parecen duplicados.
6. Eventos/Payments/Adjuntos apilados vertical (`html:472-494`) alargan infinito.
7. Deuda visual: ~80 `style="..."` inline, 3 sistemas de botón `.btn/.btn-color/.btn-icon`, `setTimeout 2000ms` para fechas (`solicitud.component.ts:423-436`).

## 2. Objetivo ergonómico

- Menos scroll, encontrar en <5s: Cliente, Estatus, Due Date, Responsables, Acciones.
- Lectura por defecto, edición bajo demanda.
- Sin cambiar servicios ni lógica de roles/estatus, solo reordenar y agrupar.

## 3. Plan Fase 1 — Agrupación ergonómica (mismo componente)

- [ ] Header sticky resumen en 1 línea: `File #ID + badge Estatus + Due Date + 3 fechas Intv.` con tooltip y colapso. Quitar estilos inline de `html:6-70`.
- [ ] Content-left a cards/acordeón `mat-expansion-panel`:
  1. `Client`: Name, Last, Phone+Validate, Email, Birth, Gender, Address, State.
  2. `Case`: Type, Additional, Language, Type Interview, Referral, Day of crime, Scales, Case number, Amount.
  3. `Lawyer`: un solo buscador con toggle Mail/Firm + ficha + coupon. Reutilizar `abogadoControl/abogadoControlFirm`, `lawyerFirm/lawyerName/lawyerPhone/lawyerSyn`.
  4. `History`: tabs `Events / Payments / Attachments` en vez de stack vertical `html:472-494`.
- [ ] `importantNotes` -> `mat-card warning` con icono arriba del acordeón, no texto suelto.
- [ ] Sidebar derecha sticky 280px: arriba `Status + Team + Due Date + Compliance`, abajo `Actions` agrupadas por rol en sección colapsable. `Save Changes` sticky bottom.
- [ ] Responsive: `.column { max-width:340px }` -> `grid: repeat(auto-fit,minmax(280px,1fr))`.

## 4. Plan Fase 2 — Ver + Editar

- [ ] Modo `lectura` por defecto con definition list (label gris 12px / valor 14px), botón `Edit`.
- [ ] Al editar mostrar inputs actuales con `*ngIf="modoEdicion"`. Mantener `ngModel` y `guardarCambios()` / `guardarCambiosClosed()` sin cambios.
- [ ] Lawyer y Scales en lectura como chips, no inputs vacíos.
- [ ] Checkboxes Waiver/Signed/Consent/Verificación agrupados en card `Compliance` solo visible en edición o con icono check en lectura.

## 5. Plan Fase 3 — Pulido sin riesgo

- [ ] Mover inline styles a `solicitud.component.css`, unificar a `.btn-color`.
- [ ] Eliminar doble Due Date, unificar datepickers a `mat-datepicker` (`fechaNacimientoMat/fechaDeCrimenMat/dueDateMat`).
- [ ] Unificar paginación Eventos y empty states Payments.
- [ ] Quitar `setTimeout 2000ms` en `obtenerSolicitud()`, asignar fechas con `convertirAFechaMat` directo.

## 6. Criterios de aceptación

- Detalle abre en modo lectura, sin scroll horizontal en 1366px y 768px.
- Cliente/caso/abogado localizables en 1 clic de acordeón/tab.
- Acciones por rol siguen funcionando igual (solo reagrupadas).
- Sin regresión en `crearSolicitud`, `guardarCambios`, `siguienteProceso`, `envioInterviewer*`, `cambiarEstatusSolicitud`.
