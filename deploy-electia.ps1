# Electia - Script de Despliegue Automatizado para Windows
# ========================================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "     ELECTIA - DOCKER DEPLOYMENT" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Esta es la solución COMPLETAMENTE AUTOMATIZADA" -ForegroundColor Green
Write-Host "para desplegar Electia en cualquier máquina." -ForegroundColor Green
Write-Host ""

# Verificar que Docker esté instalado
try {
    $dockerVersion = docker --version
    Write-Host " Docker está disponible: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host " Error: Docker no está instalado." -ForegroundColor Red
    Write-Host "Por favor instala Docker Desktop y vuelve a intentar." -ForegroundColor Red
    exit 1
}

# Verificar que Docker Compose esté disponible
try {
    $composeVersion = docker compose version
    Write-Host " Docker Compose disponible" -ForegroundColor Green
} catch {
    Write-Host " Error: Docker Compose no está disponible." -ForegroundColor Red
    exit 1
}

# Verificar que Docker Desktop esté ejecutándose
Write-Host " Verificando si Docker Desktop está ejecutándose..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker daemon no responde"
    }
    Write-Host " Docker Desktop está ejecutándose correctamente" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host " Error: Docker Desktop no está ejecutándose." -ForegroundColor Red
    Write-Host ""
    Write-Host " Para solucionarlo:" -ForegroundColor Yellow
    Write-Host "   1. Abre Docker Desktop desde el menú de inicio" -ForegroundColor White
    Write-Host "   2. Espera a que aparezca 'Engine running' en la interfaz" -ForegroundColor White
    Write-Host "   3. Vuelve a ejecutar este script" -ForegroundColor White
    Write-Host ""
    Write-Host " Si Docker Desktop no se inicia correctamente:" -ForegroundColor Yellow
    Write-Host "   - Reinicia Docker Desktop" -ForegroundColor White
    Write-Host "   - Reinicia tu computadora si es necesario" -ForegroundColor White
    Write-Host "   - Verifica que la virtualización esté habilitada en BIOS" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Detener contenedores existentes
Write-Host " Deteniendo contenedores existentes..." -ForegroundColor Yellow
try {
    docker compose down -v --remove-orphans 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host " No hay contenedores previos que detener" -ForegroundColor Gray
    } else {
        Write-Host " Contenedores detenidos exitosamente" -ForegroundColor Green
    }
} catch {
    Write-Host " No hay contenedores previos que detener" -ForegroundColor Gray
}

Write-Host ""

# Opción de limpieza
$cleanup = Read-Host "Quieres limpiar las imágenes antiguas para forzar rebuild? (y/N)"
if ($cleanup -match '^[Yy]') {
    Write-Host " Limpiando imágenes antiguas..." -ForegroundColor Yellow
    try {
        docker system prune -f 2>&1 | Out-Null
        docker image prune -f 2>&1 | Out-Null
        Write-Host " Limpieza completada" -ForegroundColor Green
    } catch {
        Write-Host " Error durante la limpieza, pero continuando..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host " Construyendo e iniciando servicios..." -ForegroundColor Yellow
Write-Host "Esto puede tomar varios minutos la primera vez." -ForegroundColor Yellow
Write-Host ""

# Construir e iniciar los servicios
Write-Host " Iniciando construcción de servicios..." -ForegroundColor Yellow
Write-Host " (Mostrando output en tiempo real...)" -ForegroundColor Gray
Write-Host ""

try {
    # Primero construir sin detached mode para ver el progreso
    Write-Host " Fase 1: Construyendo imágenes..." -ForegroundColor Cyan
    docker compose build
    
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed durante la construcción de imágenes"
    }
    
    Write-Host ""
    Write-Host " Fase 2: Iniciando servicios en background..." -ForegroundColor Cyan
    $startOutput = docker compose up -d 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " Servicios construidos e iniciados exitosamente!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host " Error al iniciar los servicios:" -ForegroundColor Red
        Write-Host $startOutput -ForegroundColor Red
        throw "Start failed"
    }
} catch {
    Write-Host ""
    Write-Host " Error al construir/iniciar los servicios." -ForegroundColor Red
    Write-Host "Para ver más detalles del error:" -ForegroundColor Yellow
    Write-Host "   docker compose logs" -ForegroundColor White
    Write-Host "   docker compose ps" -ForegroundColor White
    exit 1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host " Todos los servicios iniciados exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host " Estado de los contenedores:" -ForegroundColor Cyan
    docker compose ps
    Write-Host ""
    Write-Host " URLs disponibles:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   API:      http://localhost:5000" -ForegroundColor White
    Write-Host ""
    Write-Host " Para ver los logs en tiempo real:" -ForegroundColor Cyan
    Write-Host "   docker compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host " Esperando a que todos los servicios estén listos..." -ForegroundColor Yellow
    Write-Host "   (Esto puede tomar 1-2 minutos)" -ForegroundColor Yellow
    
    # Esperar un poco para que todo se inicialice
    Start-Sleep -Seconds 30
    
    Write-Host ""
    Write-Host " Electia está listo!" -ForegroundColor Green
    Write-Host "   Abre tu navegador en: http://localhost:3000" -ForegroundColor Yellow
    
    # Opción de abrir automáticamente el navegador
    $openBrowser = Read-Host "Quieres abrir el navegador automáticamente? (Y/n)"
    if ($openBrowser -notmatch '^[Nn]') {
        Start-Process "http://localhost:3000"
    }
    
} else {
    Write-Host ""
    Write-Host " Error al iniciar los servicios." -ForegroundColor Red
    Write-Host "Para ver los logs de error:" -ForegroundColor Yellow
    Write-Host "   docker compose logs" -ForegroundColor White
    exit 1
}
