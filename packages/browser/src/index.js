import './index.css';
import { Pouchlite } from './lib/lite.js';

const users = Pouchlite('userstestklghkb');
const messages = users.use('messages');

messages.change(c=>{
  console.log(c,"change")
});
console.log(users);

document.querySelector('#root').innerHTML = `
<div class="content">
  <h1>Vandilla Rsbuild</h1>
  <p>Start bu</p>
  <button id='btn'>ck</button>
</div>
`;

const btn = document.querySelector('button');
btn.onclick = async () => {
const btn = document.querySelector('button');

};
//todo attachments
