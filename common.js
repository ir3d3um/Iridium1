(function(){
function $(i){return document.getElementById(i)}
var mb=document.querySelector(".menu-btn"),nav=document.querySelector(".mainnav");
if(mb&&nav){mb.onclick=function(){var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",o?"true":"false")}}
var here=(location.pathname.split("/").pop()||"index.html");
document.querySelectorAll(".mainnav a").forEach(function(a){if(a.getAttribute("href")===here)a.setAttribute("aria-current","page")});
document.addEventListener("contextmenu",function(e){if(e.target.closest(".media,dialog .frame,canvas"))e.preventDefault()});
document.addEventListener("dragstart",function(e){if(e.target.tagName==="IMG")e.preventDefault()});
fetch("site.json?"+Date.now()).then(function(r){return r.json()}).then(function(s){if(!s||!s.announcement)return;var b=document.createElement("div");b.className="banner";b.setAttribute("role","status");b.textContent=s.announcement;var x=document.createElement("button");x.type="button";x.setAttribute("aria-label","Dismiss");x.textContent="×";x.onclick=function(){b.remove()};b.appendChild(x);document.body.insertBefore(b,document.body.firstChild)}).catch(function(){});
var gc=window.IR_GOATCOUNTER;if(gc){var s=document.createElement("script");s.async=true;s.src="https://gc.zgo.at/count.js";s.setAttribute("data-goatcounter","https://"+gc+".goatcounter.com/count");document.head.appendChild(s)}
window.irTrack=function(name,label){try{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:"event/"+name+"/"+label,title:name+": "+label,event:true})}catch(e){}};
})();
