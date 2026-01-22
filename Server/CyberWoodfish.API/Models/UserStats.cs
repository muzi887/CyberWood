// Server/CyberWoodfish.API/Models/UserStats.cs

using System.ComponentModel.DataAnnotations;

namespace CyberWoodfish.API.Models
{
  // 这个类将来会变成数据库里的一张表，表名通常叫 "UserStats"
  public class UserStats
  {
    // [Key] 告诉 EF Core：这是主键（Primary Key），唯一的身份证号
    // 这里的 int Id 会自增（1, 2, 3...）
    [Key]
    public int Id { get; set; }
    public int Merit { get; set; }
    public int Luck { get; set; }
    public int Wisdom { get; set; }

    // 记录最后一次敲木鱼的时间（以后数据同步时很有用）
    public DateTime LastUpdated { get; set; } = DateTime.Now;
  }
}