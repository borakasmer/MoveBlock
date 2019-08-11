import { Component, ViewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { BlockService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'signalR Küp Oynatmaca';
  _hubConnection: HubConnection;
  _connectionId: string;
  signalRServiceIp: string = "http://localhost:1923/animeHub";

  SQUARE_SIZE: string = "50";
  MOVEMENT_STEP: string = "3";
  requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

  direction: number = 12; // stop
  @ViewChild('square', { static: false }) square;

  public constructor(private service: BlockService) { }

  public ngAfterViewInit() {
    //var square = document.getElementById("square");  
    this.square.nativeElement.style.top = "0";
    this.square.nativeElement.style.left = "0";
    this.square.nativeElement.style.height = this.SQUARE_SIZE;
    this.square.nativeElement.style.width = this.SQUARE_SIZE;
  }

  public ngOnInit(): void {
    //debugger;
    let _direction: number = this.direction;

    var _this = this;
    //let _moveSquare = this.moveSquare;

    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.signalRServiceIp}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this._hubConnection.start().then(
      () => console.log("Hub Connection Start"))
      .catch(err => console.log(err));

    this._hubConnection.on('GetConnectionId', (connectionId: string) => {
      this._connectionId = connectionId;
      //alert(`ConnectionID:${this._connectionId}`);
      console.log("ConnectionID :" + connectionId);
    });

    this._hubConnection.on('MoveBlock', (commandId: number, connectionId: string) => {
      if (connectionId != _this._connectionId) {
        console.log("Move Block :" + commandId);
        this.direction = commandId;
        _this.requestAnimationFrame(_this.moveSquare.bind(_this));
      }
    });

    window.onkeydown = function (event) {
      if (event.keyCode >= 37 && event.keyCode <= 40) { // is an arrow key     
        _this.direction = event.keyCode;
      }
      //_this.moveSquare();      
      _this.requestAnimationFrame(_this.moveSquare.bind(_this));
      //_this._hubConnection.invoke("Move", _this.direction, _this._connectionId);      
      _this.service.moveBlock(_this.direction, _this._connectionId)
    };
  }

  public moveSquare(): void {
    var left = parseInt(this.square.nativeElement.style.left, 10);
    var top = parseInt(this.square.nativeElement.style.top, 10);
    var right = left + parseInt(this.SQUARE_SIZE);
    var bottom = top + parseInt(this.SQUARE_SIZE);
    console.log("Direction :" + this.direction);
    switch (this.direction) {
      case 37: // left
        if (left > 0) {
          this.square.nativeElement.style.left = left - parseInt(this.MOVEMENT_STEP) + 'px';
          this.requestAnimationFrame(this.moveSquare.bind(this));
        }
        break;
      case 38: // up
        if (top > 0) {
          this.square.nativeElement.style.top = top - parseInt(this.MOVEMENT_STEP) + 'px';
          this.requestAnimationFrame(this.moveSquare.bind(this));
        }
        break;
      case 39: //right
        if (right < document.documentElement.clientWidth) {
          this.square.nativeElement.style.left = left + parseInt(this.MOVEMENT_STEP) + 'px';
          this.requestAnimationFrame(this.moveSquare.bind(this));
        }
        break;
      case 40: // down
        if (bottom < document.documentElement.clientHeight-80) {
          this.square.nativeElement.style.top = top + parseInt(this.MOVEMENT_STEP) + 'px';
          this.requestAnimationFrame(this.moveSquare.bind(this));
        }
        break;
      default:
        break;
    }
  }

}
