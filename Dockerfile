# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore project dependencies
COPY ["NexCore.Web.csproj", "./"]
RUN dotnet restore "./NexCore.Web.csproj"

# Copy source and publish
COPY . .
RUN dotnet publish "NexCore.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render-compatible default port
ENV ASPNETCORE_URLS=http://+:10000

ENTRYPOINT ["dotnet", "NexCore.Web.dll"]
