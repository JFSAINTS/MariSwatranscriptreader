# Script para instalar dependencias después de que Node.js esté disponible

Write-Host "🔄 Verificando Node.js..." -ForegroundColor Cyan

# Esperar a que npm esté disponible
$maxAttempts = 20
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✅ npm $npmVersion encontrado" -ForegroundColor Green
        break
    }
    $attempt++
    Write-Host "⏳ Esperando npm... intento $attempt/$maxAttempts" -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ No se encontró npm después de $maxAttempts intentos" -ForegroundColor Red
    Write-Host "Por favor reinicia PowerShell e intenta de nuevo" -ForegroundColor Yellow
    exit 1
}

# Cambiar a directorio del proyecto
Set-Location D:\MariSwaAppZ\legacy

Write-Host "`n📦 Instalando dependencias..." -ForegroundColor Cyan
Write-Host "Esto puede tomar 2-5 minutos..." -ForegroundColor Yellow

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Instalación completada!" -ForegroundColor Green
    Write-Host "`n🚀 Para iniciar el servidor, ejecuta:" -ForegroundColor Cyan
    Write-Host "npm run dev" -ForegroundColor White
    Write-Host "`nO presiona Enter para iniciarlo ahora..." -ForegroundColor Yellow

    $response = Read-Host
    if ($response -eq "" -or $response -eq "s" -or $response -eq "S") {
        npm run dev
    }
} else {
    Write-Host "`n❌ Error durante la instalación" -ForegroundColor Red
    exit 1
}
