(function(){
var FORM="https://formspree.io/f/YOUR-FORM-ID";
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e}
var g=$("gallery"),d=$("lb"),im=d.querySelector("img"),enq=$("enq"),cap=$("lbcap"),cur=null;
function track(name,a){try{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:"event/"+name+"/"+(a.title||a.file),title:name+": "+(a.title||a.file),event:true})}catch(e){}}
document.addEventListener("contextmenu",function(e){if(e.target.closest(".gallery,dialog"))e.preventDefault()});
document.addEventListener("dragstart",function(e){if(e.target.tagName==="IMG")e.preventDefault()});
function details(a){var p=[];if(a.medium)p.push(a.medium);if(a.size)p.push(a.size);return p.join(" \u00b7 ")}

/* enquiry forms: popup (per artwork) and inline (contact section) */
function wire(p){var f=$(p+"form"),st=$(p+"status"),buy=$(p+"buy"),it=$(p+"intent");
it.onchange=function(){buy.hidden=it.value!=="buy"};
f.onsubmit=function(e){e.preventDefault();var fd=new FormData(f);function rec(){document.dispatchEvent(new CustomEvent("ir-enquiry",{detail:{piece:fd.get("piece"),intent:it.options[it.selectedIndex].text,message:fd.get("message")}}))}
function fallback(){rec();st.textContent="Sorry, messages cannot be sent right now. Please try again later or message me on Instagram @ir3d3um."}
if(FORM.indexOf("YOUR-FORM-ID")>-1){st.textContent="The contact form is not connected yet. Please message me on Instagram @ir3d3um.";return}
st.textContent="Sending\u2026";
fetch(FORM,{method:"POST",body:fd,headers:{Accept:"application/json"}}).then(function(r){if(!r.ok)throw 0;st.textContent="Thank you. Your message has been sent and I will reply by email.";rec();f.reset();buy.hidden=true;track("sent",cur||{title:"general"})}).catch(function(){fallback()})};
return{st:st,buy:buy,it:it}}
var ed=$("enqd"),pop=wire("e"),inl=wire("c");
function openEnq(a){cur=a;var sold=a.status==="sold";$("epiece").value=a.title||a.file;$("esubj").value="ir3d3um enquiry: "+(a.title||"artwork");
$("etitle").textContent=sold?"Ask about something similar":"Enquire about this original";pop.it.value=sold?"similar":"question";pop.buy.hidden=true;pop.st.textContent="";
if(d.open)d.close();ed.showModal();track("enquire",a)}
$("eclose").onclick=function(){ed.close()};
ed.addEventListener("click",function(e){if(e.target===ed)ed.close()});
document.querySelectorAll("[data-intent]").forEach(function(l){l.addEventListener("click",function(){inl.it.value=l.getAttribute("data-intent");inl.it.onchange()})});

/* sale or event banner (set from the admin page) */
Promise.resolve(window.__SITE||fetch("site.json?"+Date.now()).then(function(r){return r.json()})).then(function(s){if(!s||!s.announcement)return;var b=el("div","banner",s.announcement);b.setAttribute("role","status");var x=el("button","","\u00d7");x.type="button";x.setAttribute("aria-label","Dismiss");x.onclick=function(){b.remove()};b.appendChild(x);document.body.insertBefore(b,document.body.firstChild)}).catch(function(){});

/* gallery */
fetch("artworks.json?"+Date.now()).then(function(r){return r.json()}).then(function(list){
list.forEach(function(a){
var c=el("div","card"),b=el("button"),w=el("span","wm-wrap"),i=new Image(),sold=a.status==="sold";
b.type="button";i.src=a.thumb||a.file;i.alt=a.alt||a.title||"Artwork by ir3d3um";i.loading="lazy";i.draggable=false;
if(a.w&&a.h){i.width=a.w;i.height=a.h}
b.setAttribute("aria-label","Enlarge: "+i.alt);w.appendChild(i);w.appendChild(el("span","wm","ir3d3um"));if(sold)w.appendChild(el("span","soldtag","Sold"));b.appendChild(w);
b.onclick=function(){cur=a;im.src=a.view||a.file;im.alt=i.alt;enq.textContent=sold?"Ask about something similar":"Enquire about this piece";cap.textContent=[a.title,details(a),sold?"Sold":""].filter(Boolean).join(" \u2014 ");d.showModal();track("opened",a)};
c.appendChild(b);
var m=el("div","card-meta");m.appendChild(el("strong","",a.title||"Untitled"));
var d2=details(a);if(d2)m.appendChild(el("span","",d2));
var ps=el("span","",sold?"Sold":(a.price||"Price on request"));m.appendChild(ps);if(!sold)document.dispatchEvent(new CustomEvent("ir-price",{detail:{s:ps,a:a}}));
if(a.description)m.appendChild(el("em","",a.description));
c.appendChild(m);
var e=el("a","card-enq",sold?"Ask about something similar":"Enquire about this original");e.href="#";e.onclick=function(ev){ev.preventDefault();openEnq(a)};c.appendChild(e);
g.appendChild(c);document.dispatchEvent(new CustomEvent("ir-card",{detail:{c:c,a:a}}))})
}).catch(function(){g.textContent="The gallery could not be loaded."});
enq.addEventListener("click",function(ev){ev.preventDefault();ev.stopPropagation();if(cur)openEnq(cur)});
d.addEventListener("click",function(ev){if(ev.target===d||ev.target===im)d.close()});

/* wall preview */
var wall=$("wall"),wc=$("wallcanvas"),wi=0,fi=0,wimg=new Image();
var WALLS=[{n:"Warm plaster",c1:"#d9cfc0",c2:"#c9bda9",floor:"#6b5a48"},{n:"Cafe brick",c1:"#9c5a47",c2:"#7e4636",floor:"#3a2f2a",brick:1},{n:"Dark lounge",c1:"#2e3440",c2:"#222733",floor:"#14161c"}];
var FRAMES=[{n:"Black",c:"#15151a",m:"#f3efe6"},{n:"Oak",c:"#a8794a",m:"#f3efe6"},{n:"White",c:"#f4f4f1",m:"#f3efe6"}];
function frameArt(x,img,cx,cy,aw,F){var ah=aw*(img.naturalHeight||1)/(img.naturalWidth||1),m=Math.max(10,aw*.06),fr=Math.max(8,aw*.035),tw=aw+2*(m+fr),th=ah+2*(m+fr),tx=cx-tw/2,ty=cy-th/2;
x.save();x.shadowColor="#0007";x.shadowBlur=28;x.shadowOffsetY=12;x.fillStyle=F.c;x.fillRect(tx,ty,tw,th);x.restore();
x.fillStyle=F.m;x.fillRect(tx+fr,ty+fr,tw-2*fr,th-2*fr);x.fillStyle="#0000001c";x.fillRect(tx+fr+m-2,ty+fr+m-2,aw+4,ah+4);
x.drawImage(img,tx+fr+m,ty+fr+m,aw,ah);
x.save();x.globalAlpha=.26;x.fillStyle="#fff";x.font="600 "+Math.max(14,aw*.07)+"px Georgia,serif";x.textAlign="center";x.translate(cx,cy);x.rotate(-.5);x.fillText("ir3d3um",0,0);x.restore()}
function drawWall(){var W=1200,H=800;wc.width=W;wc.height=H;var x=wc.getContext("2d"),T=WALLS[wi];
var gr=x.createLinearGradient(0,0,W,H);gr.addColorStop(0,T.c1);gr.addColorStop(1,T.c2);x.fillStyle=gr;x.fillRect(0,0,W,H);
if(T.brick){x.strokeStyle="#00000030";x.lineWidth=2;for(var r=0;r<H*.82;r+=40){x.beginPath();x.moveTo(0,r);x.lineTo(W,r);x.stroke();for(var k=((r/40)%2)*60;k<W;k+=120){x.beginPath();x.moveTo(k,r);x.lineTo(k,r+40);x.stroke()}}}
x.fillStyle=T.floor;x.fillRect(0,H*.82,W,H*.18);x.fillStyle="#0003";x.fillRect(0,H*.82,W,8);
x.fillStyle="#00000038";x.fillRect(W*.2,H*.7,W*.6,H*.12);x.fillStyle="#00000026";x.fillRect(W*.17,H*.64,W*.66,H*.1);
var s=Math.min(W*.3/(wimg.naturalWidth||1),H*.42/(wimg.naturalHeight||1));frameArt(x,wimg,W/2,H*.36,(wimg.naturalWidth||1)*s,FRAMES[fi]);
$("wallname").textContent=T.n+" wall, "+FRAMES[fi].n.toLowerCase()+" frame"}
$("wallbtn").addEventListener("click",function(ev){ev.stopPropagation();if(!cur)return;d.close();wimg=new Image();wimg.onload=drawWall;wimg.src=cur.view||cur.file;wall.showModal();track("wallview",cur)});
$("wnext").onclick=function(){wi=(wi+1)%WALLS.length;drawWall()};
$("fnext").onclick=function(){fi=(fi+1)%FRAMES.length;drawWall()};
$("wclose").onclick=function(){wall.close()};
wall.addEventListener("click",function(ev){if(ev.target===wall)wall.close()});

/* try it in your room: visitor's own photo, never uploaded */
var rd=$("room"),rc=$("roomcanvas"),rimg=null,art=new Image(),pos={x:.5,y:.45},rf=0;
function drawRoom(){var W=1000,H,x=rc.getContext("2d");rc.width=W;
if(rimg){H=Math.round(W*rimg.height/rimg.width);rc.height=H;x.drawImage(rimg,0,0,W,H)}
else{H=rc.height=600;x.fillStyle="#cfcac0";x.fillRect(0,0,W,H);x.fillStyle="#555";x.font="30px Georgia,serif";x.textAlign="center";x.fillText("Choose a photo of your wall",W/2,H/2);return}
if(art.naturalWidth)frameArt(x,art,pos.x*W,pos.y*H,W*($("roomsize").value/100)*.8,FRAMES[rf])}
$("roombtn").addEventListener("click",function(ev){ev.stopPropagation();if(!cur)return;d.close();art=new Image();art.onload=drawRoom;art.src=cur.view||cur.file;drawRoom();rd.showModal();track("roomview",cur)});
$("roomfile").onchange=function(){var f=this.files[0];if(!f)return;var u=URL.createObjectURL(f),i=new Image();i.onload=function(){rimg=i;drawRoom();URL.revokeObjectURL(u)};i.src=u};
$("roomsize").oninput=drawRoom;
$("roomframe").onclick=function(){rf=(rf+1)%FRAMES.length;drawRoom()};
$("roomclose").onclick=function(){rd.close()};
function mv(e){var b=rc.getBoundingClientRect();pos.x=(e.clientX-b.left)/b.width;pos.y=(e.clientY-b.top)/b.height;drawRoom()}
rc.addEventListener("pointerdown",function(e){rc.setPointerCapture(e.pointerId);mv(e);rc.onpointermove=mv});
rc.addEventListener("pointerup",function(){rc.onpointermove=null});
rd.addEventListener("click",function(ev){if(ev.target===rd)rd.close()});
})();
