# 🚀 Guía de Despliegue - MariSwatranscriptreader

## Configuración de GitHub Pages

El proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

### Requisitos Previos

1. **Repositorio**: El proyecto debe estar en GitHub
2. **GitHub Pages**: Debe estar habilitado en los settings del repositorio

### Configuración de GitHub Pages

Para que el despliegue automático funcione, sigue estos pasos:

#### 1. Habilitar GitHub Pages

1. Ve a: **Settings → Pages** de tu repositorio
2. En "Source", selecciona: **Deploy from a branch**
3. En la rama, selecciona: **gh-pages**
4. En la carpeta, selecciona: **/ (root)**
5. Haz clic en **Save**

**Nota:** La rama `gh-pages` se crea automáticamente por el workflow de GitHub Actions, no necesitas crearla manualmente.

#### 2. (Alternativo) Usar GitHub Actions como fuente

Si prefieres la configuración moderna:

1. Ve a: **Settings → Pages**
2. En "Source", selecciona: **GitHub Actions**
3. El workflow detectará automáticamente la configuración

### Flujo de Despliegue Automático

```
┌─────────────────────────────────┐
│   Push a branch 'main'          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  GitHub Actions se ejecuta      │
│  - Instala dependencias         │
│  - Compila con npm run build    │
│  - Genera carpeta dist/         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Despliega a GitHub Pages       │
│  - Sube dist/ a gh-pages        │
│  - Disponible en 1-2 minutos    │
└─────────────────────────────────┘
```

### URL de Despliegue

**URL pública**: `https://JFSAINTS.github.io/MariSwatranscriptreader/`

La URL se basa en:
- **Usuario/Org**: `JFSAINTS`
- **Nombre del repo**: `MariSwatranscriptreader`
- **Base path**: `/MariSwatranscriptreader/`

### Monitorear el Despliegue

1. Ve a: **Actions** en tu repositorio
2. Busca el workflow: **"Deploy to GitHub Pages"**
3. Haz clic en el último run
4. Verifica el estado (✅ si es éxito, ❌ si falló)

### Solucionar Problemas

#### Erro: "Workflow not found"
- Verifica que `.github/workflows/deploy.yml` existe en el repositorio
- Haz push nuevamente para trigger el workflow

#### Error: "GitHub Pages disabled"
- Ve a Settings → Pages y habilita GitHub Pages
- Selecciona `gh-pages` como rama de origen

#### Los cambios no aparecen en la web
- Espera 1-2 minutos después de hacer push
- Limpia la caché del navegador (Ctrl+Shift+Del)
- Verifica en la tab "Actions" que el workflow completó exitosamente

#### Manifest o SW.js devuelven 404
- Verifica que `vite.config.ts` tiene `base: "/MariSwatranscriptreader/"`
- Ejecuta `npm run build` localmente y verifica que `dist/manifest.webmanifest` existe
- El workflow debería generar estos archivos automáticamente

### Variables de Entorno en Production

Si necesitas variables de entorno en GitHub Pages:

1. Ve a: **Settings → Secrets and variables → Actions**
2. Haz clic en **New repository secret**
3. Agrega `VITE_YOUTUBE_API_KEY` si la usas
4. En el workflow (`.github/workflows/deploy.yml`), usaría:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_YOUTUBE_API_KEY: ${{ secrets.VITE_YOUTUBE_API_KEY }}
```

**Nota**: Los secrets NO son necesarios para YouTube API en este proyecto (usamos detección de links, no API calls directas).

### Despliegue Manual

Si necesitas desplegar manualmente sin hacer push:

1. Ve a: **Actions → Deploy to GitHub Pages**
2. Haz clic en: **Run workflow**
3. Selecciona **main** como rama
4. Haz clic en **Run workflow**

El workflow se ejecutará inmediatamente.

---

## Comandos Locales

```bash
# Compilar para producción
npm run build

# Previsualizar build local
npm run preview

# Desarrollar localmente
npm run dev
```

---

**Última actualización**: 2026-06-02
**Status**: ✅ Workflow configurado y listo
