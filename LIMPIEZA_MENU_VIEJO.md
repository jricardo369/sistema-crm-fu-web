# Limpieza - Menú Viejo (Workspace-Nav + Submenús separados)

> El menú unificado (drawer acordeón en `app/common/bar`) ya reemplaza al sistema anterior de 2 niveles (`app-nav-menu` de módulos + `workspace-nav` lateral por módulo). Este archivo indica cómo eliminar el código viejo cuando se decida.

## 1. Qué ya está desactivado

- `workspace-nav` oculto vía CSS en `src/styles.scss`:
  ```scss
  .workspace-nav { display: none !important; }
  .workspace { left: 0 !important; }
  ```
- `BarComponent.openNavMenu()` ya no abre `workspaceNavMenuOpened`; siempre abre el drawer unificado.

## 2. Archivos a borrar (cuando ya no se necesite rollback)

```bash
rm -rf src/app/common/workspace-nav
rm -rf src/app/solicitudes/solicitudes-nav
rm -rf src/app/reportes/reportes-nav
rm -rf src/app/planificacion/planificacion-nav
rm -rf src/app/marketing/marketing-nav
rm -rf src/app/administracion-general/general-nav
```

## 3. Código a limpiar

### 3.1 `src/app/app-nav-item.ts`
- Borrar `NAV_MENU_IZQUIERDA_TEMPLATE`, `NAV_MENU_IZQUIERDA_STYLES` y clase `UtilServiceTest`.
- Mantener solo `export class AppBarNavItem` (usado por el menú unificado).

### 3.2 `src/app/common/bar/bar.component.ts`
- Borrar propiedades legacy si ya no se usan en otro lado:
  `filteredModuloItems`, `moduloItems`, `pantallaItems`, `searchBar*`, `searchSections/searchScreens`
- Borrar métodos legacy: `onSearchBarChange()`, `onSearchSectionClick()`, `onSearchScreenClick()`, `onSearchBarFocus()`, `onSearchBarBlur()`, `onNavItemClick()`, `filterChange()` viejo (reemplazado por `filteredMenuGroups` getter).
- Mantener: `menuGroups`, `filteredMenuGroups`, `buildMenuGroups()`, `toggleGroup()`, `isItemActive()`, `onSubItemClick()`.

### 3.3 `src/app/services/util.service.ts`
- Borrar `workspaceNavMenuOpened` y `workspaceNavMenuShortened` (solo servían al `workspace-nav`).

### 3.4 `src/app/app.component.html`
- Borrar `[ngClass]="{shortened: utilService.workspaceNavMenuShortened}"` del `root-wrap`:
  ```html
  <div class="root-wrap"><router-outlet></router-outlet></div>
  ```

### 3.5 `src/styles.scss`
- Borrar bloque `.workspace-nav`, `.workspace-nav button...`, `.workspace-nav.shortened`, `@media (max-width:480px) .workspace-nav` y reglas `.app-nav-menu-panel` antiguas (líneas ~429-543 y ~1575-1720). Mantener solo el bloque `.unified-*` agregado al final.
- Borrar `.workspace` con `left:200px` si ya no se usa; dejar solo `left:0`.

### 3.6 `src/app/common/bar/bar.component.scss`
- Archivo actualmente todo comentado (`/* ... */`). Borrarlo o dejar vacío.

## 4. Verificación tras limpieza

```bash
npm run build
# buscar referencias huérfanas
rg -n "workspace-nav|workspaceNavMenu|UtilServiceTest|NAV_MENU_IZQUIERDA|solicitudes-nav|reportes-nav|planificacion-nav|marketing-nav|general-nav" src
# no debe retornar resultados (excepto este .md)
```

## 5. Orden recomendado
1. Borrar carpetas del paso 2
2. Limpiar `app-nav-item.ts` y `util.service.ts`
3. Limpiar `bar.component.ts` y `app.component.html`
4. Limpiar `styles.scss`
5. Build + test manual con usuarios de distintos roles (MASTER, VOC, INTERVIEWER, etc.) para confirmar permisos.
