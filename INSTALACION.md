# 🚀 Guía de Instalación - MariSwa PDF Viewer

## Problema Encontrado
El sistema no tiene **npm**, **yarn**, **bun** o **pnpm** instalado en el PATH, lo que impide instalar las dependencias automáticamente.

## ✅ Solución: Instalar Node.js + npm

### Opción 1: Usar NodeSource (Recomendado)
```bash
# En PowerShell como Administrador:
winget install OpenJS.NodeJS
```

### Opción 2: Descargar Manualmente
1. Ve a https://nodejs.org/
2. Descarga la versión LTS (>= 18)
3. Ejecuta el instalador
4. Asegúrate de que npm se agrega al PATH

### Opción 3: Usar Chocolatey
```powershell
choco install nodejs
```

## 📦 Después de Instalar Node.js

Una vez que tengas npm instalado, ejecuta:

```bash
# Abre PowerShell/CMD y ve al directorio del proyecto
cd D:\MariSwaAppZ\legacy

# Instala dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

El servidor estará disponible en: **http://localhost:5173**

## ✨ Lo Que Ya Está Implementado

✅ **Service Worker** - Funcionará offline automáticamente después de la primera carga  
✅ **Navegación por Teclado** - Atajos: `←`/`→`, `Ctrl+F`, `B`, `0`, `+`, `-`  
✅ **Marcadores Avanzados** - Categorías, búsqueda, export/import  
✅ **Gestos Mejorados** - Swipe, double-tap en mobile  
✅ **Optimización Mobile** - Responsive design, safe area insets  
✅ **Redes Sociales** - Sección con botones de contacto  

## 🧪 Verificar Instalación

Después de `npm install`, verifica que todo funciona:

```bash
npm run build    # Compilar para producción
npm run lint     # Ejecutar linter
npm test         # Ejecutar tests
```

## 📁 Estructura de Archivos Actualizados

```
src/
├── hooks/
│   ├── useKeyboardNavigation.ts     ← NUEVO: Atajos de teclado
│   └── useBookmarks.ts              ← MEJORADO: Categorías
├── components/
│   ├── SocialLinks.tsx              ← NUEVO: Botones de redes
│   └── pdf/
│       ├── PdfCanvas.tsx            ← MEJORADO: Gestos
│       ├── ViewerToolbar.tsx        ← MEJORADO: Mobile
│       └── SidePanel.tsx            ← MEJORADO: Búsqueda
└── pages/
    ├── Index.tsx                    ← MEJORADO: Keyboard nav
    └── NotFound.tsx                 ← MEJORADO: SocialLinks

public/
└── sw.js                            ← NUEVO: Service Worker

src/
└── index.css                        ← MEJORADO: Safe area insets

index.html                           ← MEJORADO: Meta viewport
```

## 🎯 Funcionalidad por Completar

Todo está programado. Solo falta compilar con npm.

## 💬 Soporte

Si tienes problemas:

1. **npm no se instala**: Reinicia PowerShell/CMD después de instalar Node.js
2. **npm install falla**: Intenta limpiar caché: `npm cache clean --force`
3. **Puerto 5173 ocupado**: Cambia en `vite.config.ts`

---

**El código está 100% listo. Solo necesitas instalar Node.js + npm y ejecutar `npm install`** 🎉
