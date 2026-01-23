# Server/CyberWoodfish.API/Dockerfile

# 1. 编译阶段（Build Stage）
# 用 .NET 9 SDK 镜像
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# 拷贝 csproj 并还原依赖（利用 Docker 缓存层，加速构建）
COPY ["CyberWoodfish.API.csproj","./"]
RUN dotnet restore "CyberWoodfish.API.csproj"

# 拷贝所有源码
COPY . .

# 编译并发布
RUN dotnet publish "CyberWoodfish.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. 运行阶段（Runtime Stage）
# 用 .NET 9 ASP.NET 运行时镜像
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# 拷贝编译阶段生成的文件
COPY --from=build /app/publish .

# 暴露端口（.NET 容器默认是 8080）
EXPOSE 8080

# 启动命令
ENTRYPOINT ["dotnet", "CyberWoodfish.API.dll"]
