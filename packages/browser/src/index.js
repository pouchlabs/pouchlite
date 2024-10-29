import './index.css';
import { Pouchlite } from "./lib/lite.js";

let users = Pouchlite("userstestklghkb");
let messages = users.use("messages");

messages.change()



document.querySelector('#root').innerHTML = `
<div class="content">
  <h1>Vandilla Rsbuild</h1>
  <p>Start bu</p>
  <button id='btn'>ck</button>
</div>
`;

let btn = document.querySelector('button');
btn.onclick=async ()=>{
 
}