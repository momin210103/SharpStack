FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Blog.API/Blog.API.csproj Blog.API/
COPY Blog.Application/Blog.Application.csproj Blog.Application/
COPY Blog.Infrastructure/Blog.Infrastructure.csproj Blog.Infrastructure/
COPY Blog.Domain/Blog.Domain.csproj Blog.Domain/

RUN dotnet restore Blog.API/Blog.API.csproj

COPY . .
WORKDIR /src/Blog.API
RUN dotnet publish Blog.API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Blog.API.dll"]
