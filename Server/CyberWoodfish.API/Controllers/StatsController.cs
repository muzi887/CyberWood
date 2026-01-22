// Server/CyberWoodfish.API/Controllers/StatsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyberWoodfish.API.Data;
using CyberWoodfish.API.Models;

namespace CyberWoodfish.API.Controllers
{
  // [APIController] 表示这是一个专门写API 的控制器（会自动处理 JSON 序列化等）
  // [Route] 定义访问路径：api/[controller] 会变成 api/stats
  [Route("api/[controller]")]
  [ApiController]
  public class StatsController: ControllerBase
  {
    private readonly WoodfishContext _context;

    // 依赖注入(DI)：在 Program.cs 里注册过了，ASP.NET Core 会自动把数据库连接送进来。
    public StatsController(WoodfishContext context)
    {
      _context = context;
    }

    // 定义 API 接口

    // 获取数据接口
    // GET: api/stats
    [HttpGet]
    public async Task<ActionResult<UserStats>> GetStats()
    {
      // 异步编程
      // 查数据库第一条数据
      var stats = await _context.UserStats.FirstOrDefaultAsync(); // _context.UserStats 是 EF Core 提供的功能
      if (stats == null)
      {
        return new UserStats { Id = 1, Merit = 0, Luck = 0, Wisdom = 0 };
      }
      return stats;
    }

    // 更新数据接口
    // POST: api/stats
    [HttpPost]
    public async Task<ActionResult<UserStats>> UpdateStats(UserStats newStats)
    {
      var dbStats = await _context.UserStats.FirstOrDefaultAsync();
      if(dbStats == null)
      {
        newStats.Id = 1;
        _context.UserStats.Add(newStats);
      }
      else
      {
        dbStats.Merit = newStats.Merit;
        dbStats.Luck = newStats.Luck;
        dbStats.Wisdom = newStats.Wisdom;
        dbStats.LastUpdated = DateTime.Now;
      }

      // 写入数据库
      await _context.SaveChangesAsync();

      return Ok(newStats);
    }
  }
}