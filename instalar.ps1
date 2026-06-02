# Script de Instalación Automática - MariSwa PDF Viewer
# Ejecutar como Administrador

Write-Host "🚀 MariSwa PDF Viewer - Script de Instalación" -ForegroundColor Cyan

# Verificar si Node.js está instalado
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
$npmVersion = npm --version 2>$null

if ($nodeVersion -and $npmVersion) {
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm $npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js o npm no está instalado" -ForegroundColor Red
    Write-Host "`n📥 Instalando Node.js con winget..." -ForegroundColor Yellow

    try {
        winget install OpenJS.NodeJS -y
        Write-Host "✅ Node.js instalado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  No se pudo instalar con winget. Por favor:" -ForegroundColor Yellow
        Write-Host "1. Ve a https://nodejs.org/" -ForegroundColor White
        Write-Host "2. Descarga Node.js LTS" -ForegroundColor White
        Write-Host "3. Ejecuta el instalador" -ForegroundColor White
        Write-Host "4. Vuelve a ejecutar este script" -ForegroundColor White
        exit 1
    }
}

# Cambiar al directorio del proyecto
Write-Host "`n📂 Cambiando a directorio del proyecto..." -ForegroundColor Yellow
Set-Location $PSScriptRoot

# Instalar dependencias
Write-Host "`n📚 Instalando dependencias..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error durante la instalación" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Instalación completada!" -ForegroundColor Green

# Preguntar si iniciar el servidor
Write-Host "`n¿Deseas iniciar el servidor de desarrollo?" -ForegroundColor Cyan
$response = Read-Host "Escribe 's' para sí, cualquier otra cosa para no"

if ($response -eq 's') {
    Write-Host "`n🎉 Iniciando servidor de desarrollo..." -ForegroundColor Green
    Write-Host "Abre el navegador en: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "`nAtajos útiles:" -ForegroundColor Yellow
    Write-Host "  ←/→ = Navegar páginas" -ForegroundColor White
    Write-Host "  Ctrl+F = Buscar" -ForegroundColor White
    Write-Host "  B = Bookmark" -ForegroundColor White
    Write-Host "  0 = Reset zoom" -ForegroundColor White
    Write-Host "`nPresiona Ctrl+C para detener el servidor`n" -ForegroundColor Yellow

    npm run dev
} else {
    Write-Host "`n✅ Instalación lista. Para iniciar el servidor:" -ForegroundColor Green
    Write-Host "npm run dev" -ForegroundColor Cyan
}
