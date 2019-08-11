using System.Threading.Tasks;

public interface IHubAnimeDispatcher
{
    Task Move( MoveType moveType,string connectionId);
}