using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using signalRDependency.Controllers;

public class HubAnimeDispatcher : IHubAnimeDispatcher
{
    private readonly IHubContext<AnimeHub> _hubContext;
    public HubAnimeDispatcher(IHubContext<AnimeHub> hubContext)
    {
        _hubContext=hubContext;
    }

    public async Task Move(MoveType moveType,string connectionId)
    {
        await this._hubContext.Clients.All.SendAsync("MoveBlock",moveType,connectionId);          
    }
}