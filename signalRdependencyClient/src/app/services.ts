import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BlockService {
    baseUrl = "http://localhost:1923/api/anime/";
    constructor(private httpClient: HttpClient) { }
    moveBlock(commandId: number, connectionId: string) {      
        this.httpClient.get(this.baseUrl + `${commandId}/${connectionId}`).subscribe((res) => {
            //console.log(`Move:${commandId}`);
        });
    }

}