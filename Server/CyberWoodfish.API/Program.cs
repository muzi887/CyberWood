// Server/CyberWoodfish.API/Program.cs
using CyberWoodfish.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. 服务注册区 (Services)
// ==========================================

// 添加注册器服务（支持 StatsController）
builder.Services.AddControllers();

// 添加 API 文档生成器（Swagger）
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 注册数据库上下文
// 在服务容器（builder.Services）里添加一个数据库上下文（AddDbContext）
// 类型为 WoodfishContext，配置是SQLite，连接字符串去 appsettings.json 里找 "DefaultConnection"
builder.Services.AddDbContext<WoodfishContext>(options => 
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 注册跨域服务（CORS）
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVueApp",
    policy =>
    {
        // 允许所有来源、所有方法、所有头
        // 生产环境通常会限制具体的域名，但在开发环境这样最省事
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// ==========================================
// 2. 中间件管道区 (Middleware Pipeline)
// 注意：这里的顺序非常重要！
// ==========================================

// 配置 Swagger UI （可发模式下可见）
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

// 启用跨域
app.UseCors("AllowVueApp");

// 启用鉴权
app.UseAuthorization();

// 映射控制器（让 StatsController 生效）
app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
