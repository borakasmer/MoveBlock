using Microsoft.EntityFrameworkCore;

public class CustomerDataContext : DbContext
{
    public CustomerDataContext(DbContextOptions<CustomerDataContext> options) : base(options)
    {
    }

    public DbSet<MoveLog> MoveLog { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlServer("Server=tcp:10.211.55.9,1433;Initial Catalog=Customer;User ID=sa;Password=*****;");        
    }
}