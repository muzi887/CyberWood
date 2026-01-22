// Server/CyberWoodfish.API/Data/WoodfishContext.cs
using Microsoft.EntityFrameworkCore;
using CyberWoodfish.API.Models; // 引用 UserStats

namespace CyberWoodfish.API.Data
{
  // 继承DbContext，这就具备了操作数据库的能力
  public class WoodfishContext: DbContext
  {
    // 构造函数：接受外部传进来的配置并把它传给父类
    public WoodfishContext(DbContextOptions<WoodfishContext> options) :base(options)
    {
      
    }
    // 告诉 EF Core：数据库里有一张表叫 "UserStats"，里面存的数据结构就是 UserStats 类
    public DbSet<UserStats> UserStats { get; set; }
  }
}