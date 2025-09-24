#!/bin/bash

echo "=========================================="
echo "    🚀 ELECTIA - DOCKER DEPLOYMENT"
echo "=========================================="
echo "Esta es la solución COMPLETAMENTE AUTOMATIZADA"
echo "para desplegar Electia en cualquier máquina."
echo ""

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado."
    echo "Por favor instala Docker Desktop y vuelve a intentar."
    exit 1
fi

# Verificar que Docker Compose esté disponible
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose no está disponible."
    exit 1
fi

echo "✅ Docker está disponible."
echo ""

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker compose down -v --remove-orphans
echo ""

# Limpiar imágenes antiguas (opcional)
read -p "¿Quieres limpiar las imágenes antiguas para forzar rebuild? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Limpiando imágenes antiguas..."
    docker system prune -f
    docker image prune -f
fi

echo ""
echo "🔨 Construyendo e iniciando servicios..."
echo "Esto puede tomar varios minutos la primera vez."
echo ""

# Construir e iniciar los servicios
if docker compose up --build -d; then
    echo ""
    echo "✅ ¡Todos los servicios iniciados exitosamente!"
    echo ""
    echo "📊 Estado de los contenedores:"
    docker compose ps
    echo ""
    echo "🌐 URLs disponibles:"
    echo "   Frontend: http://localhost:3000"
    echo "   API:      http://localhost:5000"
    echo ""
    echo "📝 Para ver los logs en tiempo real:"
    echo "   docker compose logs -f"
    echo ""
    echo "⏳ Esperando a que todos los servicios estén listos..."
    echo "   (Esto puede tomar 1-2 minutos)"
    
    # Esperar un poco para que todo se inicialice
    sleep 30
    
    echo ""
    echo "🎉 ¡Electia está listo!"
    echo "   Abre tu navegador en: http://localhost:3000"
    
else
    echo ""
    echo "❌ Error al iniciar los servicios."
    echo "Para ver los logs de error:"
    echo "   docker compose logs"
    exit 1
fi
