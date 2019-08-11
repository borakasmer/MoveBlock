using System;

[Serializable]
public class MoveLog 
{
    public int ID { get; set; }
    public string ConnectionId { get; set; }
    public int Direction { get; set; }
    public DateTime CreatedDateTime { get; set; }   
}