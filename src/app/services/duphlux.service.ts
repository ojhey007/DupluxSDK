import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage} from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DuphluxService {

  constructor(
    private callNumber : CallNumber,
    private storage : Storage,
    private loadCtrl : LoadingController
  ) { }



  duphluxAlert(phonenumber:any,authnumber:any){
  let timerInterval:any
  Swal.fire({
    title: 'Mobile Number Verification',
    customClass:'duphluxAlert',
    showConfirmButton:false,
    html:
    '<p>' +'Make a call from your mobile number ' + phonenumber + '</p>' +
      '<p>' + 'Dial the toll free number below' + '</p>' +
      '<h4 id="standardPhoneNumb">' + authnumber + '</h4><br/>' + 
      '<strong></strong> seconds left.<br/><br/>' +
      '<button id="auth">' + 'Call to authenticate' + '</button><br/> '+
      '<h6>'+'Powered by duphlux'+'</h6>',
    timer: 900000,
    onBeforeOpen: () => {
      const content = Swal.getContent()
      const $ = content.querySelector.bind(content)
      const auth = $('#auth')
      const authnumb = $('#standardPhoneNumb')
  
      auth.addEventListener('click', () => {
        this.verifyPhoneNumber(authnumber);
      })
      authnumb.addEventListener('click',()=>{
        this.verifyPhoneNumber(authnumber);
      })
      timerInterval = setInterval(() => {
        Swal.getContent().querySelector('strong')
          .textContent = (Swal.getTimerLeft() / 1000)
            .toFixed(0)
      }, 100)
    },
    onClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result)=>{
    switch(result.dismiss){ /** if timed-out dismiss and show error alert */ 
      case Swal.DismissReason.timer: 
      this.expiredTimer(); 
    }
  })
  }

 async loader(){
  let loader = await this.loadCtrl.create({
      duration:10000,
      message: 'Please wait...'
    })
    await loader.present();
  }

  hideLoader(){
    this.loadCtrl.dismiss();
  }

  customSuccessAlert(message:string){
    Swal.fire({
      type: 'success',
      title: 'Successful',
      width:270,
      backdrop:false,
      text: `${message}`,
      customClass:'swalCss',
      showConfirmButton:false,
      timer:4000
    })
    }

  getStoredData(key:string){
    return new Promise((resolve, reject)=>{
      this.storage.get(key).then((val=>{
        resolve(val)
      })),
      (err:any)=>{
        reject(err);
      }

    })
  }

  clearStoredData(key:string){
    return new Promise((resolve, reject)=>{
      this.storage.remove(key).then((val=>{
        resolve(val)
      })),
      (err:any)=>{
        reject(err);
      }

    })
  }

  private storeDailerlauched(isLauched:boolean){
    this.storage.set('dialerLauched',isLauched) 
  }
  
  private async expiredTimer(){ 
    Swal.fire({
      type: 'error',
      title: 'Verification Error',
      width:270,
      backdrop:false,
      text: 'Request session expired, please retry.',
      customClass:'swalCss',
      confirmButtonText:'Ok',
    })
  }
  
  
  private verifyPhoneNumber(phonenumber:any){
    this.callNumber.callNumber(phonenumber,true).then(res =>
      this.storeDailerlauched(true) /**set to true to notify the app that the dialer just got lauched */
      );
  }
  

 

}
