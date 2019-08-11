using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace signalRDependency.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimeController : ControllerBase
    {
        private readonly IHubAnimeDispatcher _dispatcher;
        private CustomerDataContext _context;
        public AnimeController(IHubAnimeDispatcher dispatcher, CustomerDataContext context)
        {
            _dispatcher = dispatcher;
            _context = context;
        }
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5     
        [HttpGet("{moveType}/{connectionId}")]
        public async Task<ActionResult> Get(MoveType moveType, string connectionId)
        {
            await this._dispatcher.Move(moveType, connectionId);
            this._context.MoveLog.Add(new MoveLog() { ConnectionId = connectionId, Direction = (int)moveType, CreatedDateTime=DateTime.Now });
            this._context.SaveChanges();
            return Ok();
        }
    }

    public class AnimeHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("GetConnectionId", this.Context.ConnectionId);
        }
    }
}
