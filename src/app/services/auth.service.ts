import { Injectable } from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
token:string ="37f563a1u06f11fbc0eefed226fc6b3be31128b" /** register and get your token at duphlux.com */
  constructor(
    private http : HTTP
  ) { }

  nativePost2(url:string,requestBody:any){
    this.http.setDataSerializer('json')
    return new Promise ((resolve,reject)=>{
      console.log("DEBUG data " + requestBody)
      this.http.post(url,requestBody,{token:this.token,'Content-type':'application/json'}
       )
       .then(response => {          
          try {
            console.log(response)
            response.data = JSON.parse(response.data);
            resolve(response.data);
            console.log(response.data);
          } catch(e) {
            reject(e)
            console.error('JSON parsing error');
          }
       })
       .catch(response => {
         // prints 403
         console.log(response.status);
         // prints Permission denied
         console.log(response.error);
       });
    })
  }
}
