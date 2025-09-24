#!/bin/bash

# Script para inicializar la base de datos ElectiaDB
# Espera a que SQL Server esté listo y luego crea la base de datos

echo "Esperando a que SQL Server esté listo..."

# Esperar hasta que SQL Server esté disponible
until /opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "ElectiaDB123!" -C -Q "SELECT 1" &> /dev/null; do
    echo "SQL Server no está listo aún. Esperando 5 segundos..."
    sleep 5
done

echo "SQL Server está listo. Creando base de datos ElectiaDB..."

# Crear la base de datos
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "ElectiaDB123!" -C -Q "
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'ElectiaDB')
BEGIN
    CREATE DATABASE [ElectiaDB]
    PRINT 'Base de datos ElectiaDB creada exitosamente'
END
ELSE
BEGIN
    PRINT 'Base de datos ElectiaDB ya existe'
END
"

if [ $? -eq 0 ]; then
    echo "Inicialización de base de datos completada exitosamente."
else
    echo "Error durante la inicialización de la base de datos."
    exit 1
fi
