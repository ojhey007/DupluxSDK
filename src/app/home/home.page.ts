import { Component } from '@angular/core';
import { IDuphluxVerification } from '../Interfaces/duphlux-verification-interface';
import { IStatusChecker } from '../Interfaces/duphlux-status-checker';
import { DuphluxService } from '../services/duphlux.service';
import { UUIDServiceService } from '../services/uuidservice.service';
import { IUserPhoneNumber } from '../Interfaces/user-phone-number';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  submitted:boolean = false;
  quickStatusChecker:boolean;
  duphluxCredentials : IDuphluxVerification = {
    phone_number:'',
    //user's phone number
    timeout:54000,
    // set session time-out
    transaction_reference:'',
    // a unique user ID
    redirect_url:'http://www.google.com'
    // in your own case use your redirect url if you'd like to verify via web
  }
  verifyNumber: IStatusChecker = {"transaction_reference":""};

  credentials: IUserPhoneNumber={"phone_number":""}

  constructor(
    private duphluxService : DuphluxService,
    private uuidService : UUIDServiceService,
    private authService : AuthService
  ) {}




  verifyPhoneNumber( form: NgForm){
    this.submitted = true
    if (form.valid) {
     this.duphluxService.loader();
     let url = 'https://duphlux.com/webservice/authe/verify.json'
      this.uuidService.createUUID().then((uid:string)=>{
      this.duphluxCredentials.transaction_reference = uid
      this.verifyNumber.transaction_reference = uid
      this.duphluxCredentials.phone_number = `${this.credentials.phone_number}`;
      console.log(this.duphluxCredentials);
      this.authService.post(url,this.duphluxCredentials).then((resp:any)=>{
        this.duphluxService.hideLoader();
        let apiFeedBack = resp
        if(apiFeedBack.PayLoad.status == true){
       this.duphluxService.duphluxAlert(this.duphluxCredentials.phone_number,apiFeedBack.PayLoad.data.number);
       this.statusChecker();   
        }
        console.log(apiFeedBack.PayLoad.data.number) 
        console.log(apiFeedBack.PayLoad.status)
      });
      })
  }
    
  }

private statusChecker(){
  setInterval(()=>{
  this.duphluxService.getStoredData('dialerLauched').then((val)=>{
   let dialerLauched = val;
   if(dialerLauched){ /** if dialer has been lauched start checking for the status  */
    let url = 'https://duphlux.com/webservice/authe/status.json'
      this.authService.post(url,this.verifyNumber).then((resp:any)=>{
        console.log(this.verifyNumber)
        let duphluxResp = resp
        console.log(duphluxResp.PayLoad.data.verification_status)  /*** check if verified. */
       if(duphluxResp.PayLoad.data.verification_status == "verified"){    /*** if verified, set this value to true to so it stops checking */
         setTimeout(() => {
         this.quickStatusChecker = true
         this.duphluxService.customSuccessAlert("Phone Number Verified Successfully");  /*** show success alert  */
         // this.router.naviagate(['your-page']) /**upon successful redirect to any page of yours. Congrats you've just successfully verified a number using Duphlux sdk !  */
         }, 4500);
         this.duphluxService.clearStoredData('dialerLauched');
       }
     })
   }
  })
},3500)
}

}
