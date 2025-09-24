# Dockerfile para la API .NET Core - OPTIMIZADO PARA CACHE
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# PASO 1: Copiar SOLO los archivos de proyecto (para cache de dependencias)
COPY ["ElectiaCore.Web/ElectiaCore.Web.csproj", "ElectiaCore.Web/"]
COPY ["ElectiaCore.Application/ElectiaCore.Application.csproj", "ElectiaCore.Application/"]
COPY ["ElectiaCore.Domain/ElectiaCore.Domain.csproj", "ElectiaCore.Domain/"]
COPY ["ElectiaCore.Infrastructure/ElectiaCore.Infrastructure.csproj", "ElectiaCore.Infrastructure/"]

# PASO 2: Restaurar dependencias (esta capa se cachea si no cambias .csproj)
RUN dotnet restore "ElectiaCore.Web/ElectiaCore.Web.csproj"

# PASO 3: Copiar código fuente (solo se ejecuta si cambias código)
COPY . .

# Build
WORKDIR "/src/ElectiaCore.Web"
RUN dotnet build "ElectiaCore.Web.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "ElectiaCore.Web.csproj" -c Release -o /app/publish

# Runtime
FROM base AS final
WORKDIR /app

# Instalar herramientas de SQL Server para el script de inicialización
RUN apt-get update && apt-get install -y \
    curl \
    apt-transport-https \
    gnupg \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y mssql-tools18 unixodbc-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

# Copiar el script de entrada
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Establecer variables de entorno para Docker
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

ENTRYPOINT ["/app/entrypoint.sh"]
