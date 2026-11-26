(function(){
var KEY="ir_cur",RK="ir_rates",rates=null,cur="INR";
var LIST=["INR","USD","EUR","GBP","AUD","CAD","AED","SGD","JPY","CHF"];
var REG={US:"USD",DE:"EUR",FR:"EUR",IT:"EUR",ES:"EUR",NL:"EUR",IE:"EUR",AT:"EUR",BE:"EUR",PT:"EUR",FI:"EUR",GR:"EUR",GB:"GBP",AU:"AUD",CA:"CAD",AE:"AED",SG:"SGD",JP:"JPY",CH:"CHF",IN:"INR"};
function guess(){try{var l=(navigator.language||"en-IN").split("-")[1];return REG[(l||"").toUpperCase()]||"USD"}catch(e){return"USD"}}
try{cur=localStorage.getItem(KEY)||guess()}catch(e){cur=guess()}
if(LIST.indexOf(cur)<0)cur="INR";
function load(){try{var c=JSON.parse(localStorage.getItem(RK));if(c&&Date.now()-c.t<864e5)return Promise.resolve(c.r)}catch(e){}
return fetch("https://open.er-api.com/v6/latest/INR").then(function(r){return r.json()}).then(function(j){if(!j||!j.rates)throw 0;try{localStorage.setItem(RK,JSON.stringify({t:Date.now(),r:j.rates}))}catch(e){}return j.rates})}
function inr(txt){if(!txt||/request/i.test(txt))return null;var m=String(txt).replace(/,/g,"").match(/(\d+(?:\.\d+)?)/);return m?parseFloat(m[1]):null}
function fmt(n,c){try{return new Intl.NumberFormat("en",{style:"currency",currency:c,maximumFractionDigits:n<100?2:0}).format(n)}catch(e){return c+" "+Math.round(n)}}
function conv(a){var v=inr(a.price);if(v==null||!rates||cur==="INR"||!rates[cur])return"";return"about "+fmt(v*rates[cur],cur)}
function apply(){document.querySelectorAll("[data-price]").forEach(function(s){s.textContent=s._c()})}
function init(){
var slot=document.getElementById("curslot");if(slot){var lab=document.createElement("label");lab.className="cur";lab.appendChild(document.createTextNode("Prices in"));var sel=document.createElement("select");sel.setAttribute("aria-label","Show approximate prices in");
LIST.forEach(function(c){var o=document.createElement("option");o.value=c;o.textContent=c;if(c===cur)o.selected=true;sel.appendChild(o)});
sel.onchange=function(){cur=sel.value;try{localStorage.setItem(KEY,cur)}catch(e){}apply()};lab.appendChild(sel);slot.appendChild(lab)}
load().then(function(r){rates=r;apply()}).catch(function(){})}
document.addEventListener("ir-price",function(e){var s=e.detail.s,a=e.detail.a;s.setAttribute("data-price","1");s._c=function(){var c=conv(a);return a.price?(c?a.price+"  \u00b7  "+c:a.price):"Price on request"};s.textContent=s._c()});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
