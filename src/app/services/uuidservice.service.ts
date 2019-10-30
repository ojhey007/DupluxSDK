import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UUIDServiceService {

  constructor() { }


  createUUID(){
    return new Promise ((resolve,reject)=>{
     let dt = new Date().getTime();
     let uuid = 'xxxxxxxx-xxxx-6xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
         let r = (dt + Math.random()*16)%16 | 0;
         dt = Math.floor(dt/16);
         return (c=='x' ? r :(r&0x3|0x8)).toString(16);
     });
     resolve (uuid),
     (err:any)=>{
       reject(err);
     }

    })  
}

}
