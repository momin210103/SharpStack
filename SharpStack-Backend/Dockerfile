FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Blog.API/Blog.API.csproj Blog.API/
COPY Blog.Application/Blog.Application.csproj Blog.Application/
COPY Blog.Infrastructure/Blog.Infrastructure.csproj Blog.Infrastructure/
COPY Blog.Domain/Blog.Domain.csproj Blog.Domain/

RUN dotnet restore "Blog.API/Blog.API.csproj"

COPY . .
WORKDIR /src/Blog.API
RUN dotnet build Blog.API.csproj -c Release -o /app/build

FROM build AS publish 
RUN dotnet publish Blog.API.csproj -c Release -o /app/publish /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet","Blog.API.dll"]
