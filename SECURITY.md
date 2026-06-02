# 🔒 Guía de Seguridad - API Keys y Credenciales

## ⚠️ IMPORTANTE: Nunca Commitear API Keys

Las API keys, tokens y credenciales **NUNCA** deben estar en el código fuente ni ser commiteadas a GitHub.

---

## 📋 Variables de Entorno Requeridas

### Para Desarrollo Local

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# YouTube API Configuration
VITE_YOUTUBE_API_KEY=tu_api_key_aqui

# Google Cloud Vision (si se usa)
VITE_GOOGLE_VISION_API_KEY=tu_api_key_aqui
```

### Archivo `.env.example`

Este archivo **SÍ está commiteado** en GitHub y sirve como template. Los usuarios lo copiarán y completarán con sus propias keys.

---

## 🔐 Cómo Obtener API Keys

### YouTube Data API v3

1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto
3. Habilita "YouTube Data API v3"
4. Ve a "Credenciales" → "Crear credencial"
5. Selecciona "API key" → Copia la key
6. (Opcional) Restringe la key a tu dominio

### Google Cloud Vision API

1. Ve a: https://console.cloud.google.com/
2. Habilita "Cloud Vision API"
3. Crea una credencial de API key
4. Restringe a tus dominios

---

## ✅ Checklist de Seguridad

- [ ] Nunca commitar archivos `.env`
- [ ] Nunca commitar archivos `.env.local`
- [ ] Usar variables de entorno via `import.meta.env.VITE_*`
- [ ] Agregar `.env` a `.gitignore`
- [ ] Proporcionar `.env.example` como template
- [ ] Documentar qué variables se necesitan
- [ ] Regenerar/revocar keys si fueron expuestas
- [ ] Usar HTTPS en producción
- [ ] Restringir API keys a dominios específicos

---

## 🛡️ Si una API Key fue Expuesta

1. **Inmediatamente**: Revocar la key en Google Cloud Console
2. **Generar nueva**: Crear una nueva API key
3. **Actualizar localmente**: Actualizar tu archivo `.env.local`
4. **Notificar**: Si fue pusheada a GitHub público, considera revocarla globalmente

---

## 📦 Despliegue en Producción

### GitHub Pages (Web)

Las variables de entorno en GitHub Pages se pueden configurar mediante:

1. **GitHub Secrets** (para CI/CD):
   - Settings → Secrets and variables → Actions
   - Crear `VITE_YOUTUBE_API_KEY`
   - Usar en workflows

2. **Alternativa**: Usar un backend privado que maneje las API keys

### Android APK

- Las keys en APK son visibles (dexdump puede extraer strings)
- **Solución**: Usar un backend servidor que maneje las API keys
- El APK hace requests al servidor, no directamente a APIs externas

---

## 🔄 Cómo Usar en Vite

```typescript
// ✅ CORRECTO
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

// ❌ INCORRECTO - Nunca hardcodear
const apiKey = 'AIzaSyDoKpVJfgsBcC_5DyJve0M3LUnoqTXb8r8';

// ✅ Con fallback y warning
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
if (!apiKey) {
  console.warn('API key not configured. Set VITE_YOUTUBE_API_KEY environment variable.');
}
```

---

## 📝 Documentación

- [Vite - Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Google Cloud - API Key Security](https://cloud.google.com/docs/authentication/api-keys)
- [GitHub - Managing sensitive data](https://docs.github.com/en/code-security/secret-scanning)

---

**Última actualización**: 2026-06-02
**Status**: ✅ Seguridad implementada
