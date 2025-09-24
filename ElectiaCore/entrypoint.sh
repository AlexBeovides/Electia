#!/bin/bash
set -e

echo "=== Electia API Entrypoint Script ==="
echo "Waiting for SQL Server to be ready..."

# Esperar a que SQL Server esté disponible
until /opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "ElectiaDB123!" -C -Q "SELECT 1" &> /dev/null
do
  echo "Waiting for SQL Server..."
  sleep 3
done

echo "SQL Server is ready!"

echo "Starting the API application..."
echo "The application will automatically create database and apply migrations..."

# Ejecutar la aplicación (la app manejará la creación de DB y migraciones)
exec dotnet ElectiaCore.Web.dll
