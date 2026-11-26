(function(){
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var g=$("grid");if(!g)return;
var lb=$("lb"),im=lb.querySelector("img"),cap=$("lbcap"),enq=$("lbenq"),cur=null;
function track(n,a){if(window.irTrack)window.irTrack(n,a.title||a.file)}
function name(a,i){return a.title||("Artwork no. "+(i+1))}
function details(a){return [a.medium,a.size].filter(Boolean).join(" · ")}
function enquireUrl(a,i){var sold=a.status==="sold";return "contact.html?artwork="+encodeURIComponent(name(a,i))+"&intent="+(sold?"similar":"buy")}

fetch("artworks.json?"+Date.now()).then(function(r){return r.json()}).then(function(list){
  var n=$("count");if(n)n.textContent=list.length+" artworks";
  list.forEach(function(a,i){
    a._name=name(a,i);var sold=a.status==="sold";
    var c=el("article","card"),m=el("div","media"),b=el("button","open"),img=new Image();
    b.type="button";b.setAttribute("aria-label","View "+a._name+" larger");
    img.src=a.thumb||a.file;img.alt=a.alt||a._name;img.loading="lazy";img.draggable=false;if(a.w&&a.h){img.width=a.w;img.height=a.h}
    b.appendChild(img);m.appendChild(b);m.appendChild(el("span","wm","ir3d3um"));if(sold)m.appendChild(el("span","soldtag","Sold"));
    b.onclick=function(){cur=a;cur._i=i;im.src=a.view||a.file;im.alt=img.alt;cap.textContent=[a._name,details(a)].filter(Boolean).join(" — ");
      enq.textContent=sold?"Ask about a similar artwork":"Enquire about this artwork";enq.href=enquireUrl(a,i);lb.showModal();track("opened",a)};
    c.appendChild(m);
    var info=el("div","info");info.appendChild(el("h3","",a._name));
    var d=details(a);if(d)info.appendChild(el("p","meta",d));
    var p=el("p","price"+(sold?" sold":""),sold?"Sold":(a.price||"Price on request"));info.appendChild(p);
    var row=el("div","btnrow"),e=el("a","btn ghost small block",sold?"Ask about similar":"Enquire");e.href=enquireUrl(a,i);e.onclick=function(){track("enquire",a)};
    row.appendChild(e);info.appendChild(row);c.appendChild(info);g.appendChild(c);
    if(!sold)document.dispatchEvent(new CustomEvent("ir-price",{detail:{s:p,a:a}}));
    document.dispatchEvent(new CustomEvent("ir-card",{detail:{c:c,m:m,a:a}}));
  });
}).catch(function(){g.textContent="The artworks could not be loaded. Please refresh the page."});

function closer(d){d.addEventListener("click",function(e){if(e.target===d)d.close()});var x=d.querySelector(".closex");if(x)x.onclick=function(){d.close()}}
[lb,$("wall"),$("room")].forEach(closer);
im.addEventListener("click",function(){lb.close()});

/* frame drawing shared by wall and room previews */
var FRAMES=[{n:"black",c:"#15151a",m:"#f3efe6"},{n:"oak",c:"#a8794a",m:"#f3efe6"},{n:"white",c:"#f4f4f1",m:"#f3efe6"}];
function frameArt(x,img,cx,cy,aw,F){var ah=aw*(img.naturalHeight||1)/(img.naturalWidth||1),m=Math.max(10,aw*.06),fr=Math.max(8,aw*.035),tw=aw+2*(m+fr),th=ah+2*(m+fr),tx=cx-tw/2,ty=cy-th/2;
  x.save();x.shadowColor="#0007";x.shadowBlur=28;x.shadowOffsetY=12;x.fillStyle=F.c;x.fillRect(tx,ty,tw,th);x.restore();
  x.fillStyle=F.m;x.fillRect(tx+fr,ty+fr,tw-2*fr,th-2*fr);x.fillStyle="#0000001c";x.fillRect(tx+fr+m-2,ty+fr+m-2,aw+4,ah+4);
  x.drawImage(img,tx+fr+m,ty+fr+m,aw,ah);
  x.save();x.globalAlpha=.24;x.fillStyle="#fff";x.font="600 "+Math.max(14,aw*.07)+"px Georgia,serif";x.textAlign="center";x.translate(cx,cy);x.rotate(-.5);x.fillText("ir3d3um",0,0);x.restore()}

/* see it on a wall */
var wall=$("wall"),wc=$("wallcanvas"),wi=0,fi=0,wimg=new Image();
var WALLS=[{n:"Warm plaster",c1:"#d9cfc0",c2:"#c9bda9",floor:"#6b5a48"},{n:"Cafe brick",c1:"#9c5a47",c2:"#7e4636",floor:"#3a2f2a",brick:1},{n:"Dark lounge",c1:"#2e3440",c2:"#222733",floor:"#14161c"}];
function drawWall(){var W=1200,H=800;wc.width=W;wc.height=H;var x=wc.getContext("2d"),T=WALLS[wi];
  var gr=x.createLinearGradient(0,0,W,H);gr.addColorStop(0,T.c1);gr.addColorStop(1,T.c2);x.fillStyle=gr;x.fillRect(0,0,W,H);
  if(T.brick){x.strokeStyle="#00000030";x.lineWidth=2;for(var r=0;r<H*.82;r+=40){x.beginPath();x.moveTo(0,r);x.lineTo(W,r);x.stroke();for(var k=((r/40)%2)*60;k<W;k+=120){x.beginPath();x.moveTo(k,r);x.lineTo(k,r+40);x.stroke()}}}
  x.fillStyle=T.floor;x.fillRect(0,H*.82,W,H*.18);x.fillStyle="#0003";x.fillRect(0,H*.82,W,8);
  x.fillStyle="#00000038";x.fillRect(W*.2,H*.7,W*.6,H*.12);x.fillStyle="#00000026";x.fillRect(W*.17,H*.64,W*.66,H*.1);
  var s=Math.min(W*.3/(wimg.naturalWidth||1),H*.42/(wimg.naturalHeight||1));frameArt(x,wimg,W/2,H*.36,(wimg.naturalWidth||1)*s,FRAMES[fi]);
  $("wallname").textContent=T.n+" wall, "+FRAMES[fi].n+" frame"}
$("wallbtn").onclick=function(){if(!cur)return;lb.close();wimg=new Image();wimg.onload=drawWall;wimg.src=cur.view||cur.file;wall.showModal();track("wallview",cur)};
$("wnext").onclick=function(){wi=(wi+1)%WALLS.length;drawWall()};
$("fnext").onclick=function(){fi=(fi+1)%FRAMES.length;drawWall()};

/* try it in your room: the visitor's photo stays on their device */
var rd=$("room"),rc=$("roomcanvas"),rimg=null,art=new Image(),pos={x:.5,y:.42},rf=0;
function drawRoom(){var W=1000,H,x=rc.getContext("2d");rc.width=W;
  if(rimg){H=Math.round(W*rimg.height/rimg.width);rc.height=H;x.drawImage(rimg,0,0,W,H)}
  else{H=rc.height=600;x.fillStyle="#cfcac0";x.fillRect(0,0,W,H);x.fillStyle="#555";x.font="30px Georgia,serif";x.textAlign="center";x.fillText("Choose a photo of your wall",W/2,H/2);return}
  if(art.naturalWidth)frameArt(x,art,pos.x*W,pos.y*H,W*($("roomsize").value/100)*.8,FRAMES[rf])}
$("roombtn").onclick=function(){if(!cur)return;lb.close();art=new Image();art.onload=drawRoom;art.src=cur.view||cur.file;drawRoom();rd.showModal();track("roomview",cur)};
$("roomfile").onchange=function(){var f=this.files[0];if(!f)return;var u=URL.createObjectURL(f),i=new Image();i.onload=function(){rimg=i;drawRoom();URL.revokeObjectURL(u)};i.src=u};
$("roomsize").oninput=drawRoom;
$("roomframe").onclick=function(){rf=(rf+1)%FRAMES.length;drawRoom()};
function mv(e){var b=rc.getBoundingClientRect();pos.x=(e.clientX-b.left)/b.width;pos.y=(e.clientY-b.top)/b.height;drawRoom()}
rc.addEventListener("pointerdown",function(e){rc.setPointerCapture(e.pointerId);mv(e);rc.onpointermove=mv});
rc.addEventListener("pointerup",function(){rc.onpointermove=null});
})();
