import 'core-js/stable';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
import 'regenerator-runtime/runtime';
import { logout } from './logout.js';
import { login } from './login.js';
import { displayMap } from './mapbox.js';
import {updateSettings} from './updateSettings.js';
import bookTour from './stripe.js';

document.addEventListener('DOMContentLoaded', () => {


  const loginForm=document.querySelector('.form--login');
  const mapbox = document.getElementById('map');
  const logOutBtn=document.querySelector('.nav__el--logout');
  const userDataForm = document.querySelector('.form-user-data');
  const userPasswordForm = document.querySelector('.form-user-password');
  const bookBtn=document.getElementById('book-tour');
  if(loginForm){
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      login(email, password);
    });
  }

  //mapbox ellenorzes
  if(mapbox){
    const locations=JSON.parse(mapbox.dataset.locations);
    displayMap(locations);
  }

  if(logOutBtn) logOutBtn.addEventListener('click',logout);

  if(userDataForm) userDataForm.addEventListener('submit',e=>{
    e.preventDefault();
    const form= new FormData();
    form.append('name',document.getElementById('name').value);
    form.append('email',document.getElementById('email').value);
    form.append('image',document.getElementById('photo').files[0]);
    for (let [key, value] of form.entries()) {
      console.log(`${key}: ${value}`);
    }
    updateSettings(form,'data');
  });

  if(userPasswordForm) userPasswordForm.addEventListener('submit',e=>{
    e.preventDefault();



    const passwordCurrent=document.getElementById('password-current').value;
    const password=document.getElementById('password').value;
    const passwordConfirm=document.getElementById('password-confirm').value;

    updateSettings({passwordCurrent,password,passwordConfirm},'password');
  });

  if (bookBtn) {
    bookBtn.addEventListener('click', async (event) => {
      event.target.textContent = 'Processing...';
      const tourId = event.target.dataset.tourId;
      try {
        await bookTour(tourId);
        console.log('Booking completed!');
      } catch (err) {
        console.error('Booking failed:', err);
      }
    });
  }



});