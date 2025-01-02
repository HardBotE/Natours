import 'core-js/stable';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
import 'regenerator-runtime/runtime';
import { logout } from './logout.js';
import { login } from './login.js';
import { displayMap } from './mapbox.js';


document.addEventListener('DOMContentLoaded', () => {


  const loginForm=document.querySelector('.form');
  const mapbox = document.getElementById('map');
  const logOutBtn=document.querySelector('.nav__el--logout');

  if(loginForm){
    console.log('mizu');
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;


      console.log(email,password);
      login(email, password);
    });
  }



  //mapbox ellenorzes

  if(mapbox){
    const locations=JSON.parse(mapbox.dataset.locations);
    displayMap(locations);
  }



  if(logOutBtn) logOutBtn.addEventListener('click',logout);
})