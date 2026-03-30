# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia os arquivos de projeto e restaura as dependências
COPY ["NexCore.Web.csproj", "./"]
RUN dotnet restore "./NexCore.Web.csproj"

# Copia o restante dos arquivos e compila
COPY . .
RUN dotnet publish "NexCore.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Estágio Final (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Variável de ambiente para o Render (ele usa a porta 10000 por padrão)
ENV ASPNETCORE_URLS=http://+:10000

ENTRYPOINT ["dotnet", "NexCore.Web.dll"]