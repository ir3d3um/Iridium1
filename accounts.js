(function(){
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e}
var CFG=window.IR_FIREBASE||{},DEMO=!CFG.apiKey||CFG.apiKey.indexOf("YOUR")>-1;
function mkcode(uid){var h=5381,s=String(uid)+"|ir3d3um";for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;var A="ABCDEFGHJKMNPQRSTUVWXYZ23456789",o="";for(var k=0;k<5;k++){o+=A[h%A.length];h=Math.floor(h/A.length)+(k+1)*7919}return"WELCOME5-"+o}
var user=null,prof={favs:[],alerts:false,profile:{}},arts={},hearts={},cardEls={},mode="in",B=DEMO?demo():fb();

/* ---- backend 1: demo (this device only, used until Firebase is connected) ---- */
function demo(){var K="ir_demo_users",SK="ir_demo_session",cbs=[];
function U(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}}
function W(u){try{localStorage.setItem(K,JSON.stringify(u))}catch(e){}}
function sess(){try{return localStorage.getItem(SK)}catch(e){return null}}
function setS(v){try{v?localStorage.setItem(SK,v):localStorage.removeItem(SK)}catch(e){}}
function emit(){var e=sess();cbs.forEach(function(f){f(e?{uid:e,email:e,name:"",verified:!!(U()[e]||{}).verified}:null)})}
return{init:function(f){cbs.push(f);emit()},
signUp:function(e,p,al){var u=U();e=e.toLowerCase();if(u[e])return Promise.reject({code:"auth/email-already-in-use"});u[e]={pw:p,alerts:!!al,favs:[],enq:[],verified:false,profile:{}};W(u);setS(e);emit();return Promise.resolve()},
signIn:function(e,p){var u=U();e=e.toLowerCase();if(!u[e]||u[e].pw!==p)return Promise.reject({code:"auth/invalid-credential"});setS(e);emit();return Promise.resolve()},
google:function(){return Promise.reject({message:"Google sign-in works on the live site."})},
reset:function(){return Promise.resolve()},
out:function(){setS(null);emit();return Promise.resolve()},
get:function(id){var u=U()[id]||{};return Promise.resolve({favs:u.favs||[],alerts:!!u.alerts,profile:u.profile||{},codeUsed:!!u.codeUsed})},
demoUse:function(id){var u=U();if(u[id]){u[id].codeUsed=true;W(u)}return Promise.resolve()},
saveProfile:function(id,p){var u=U();if(u[id]){u[id].profile=p;W(u)}return Promise.resolve()},
sendVerify:function(){return Promise.resolve()},
refresh:function(){emit();return Promise.resolve()},
demoVerify:function(id){var u=U();if(u[id]){u[id].verified=true;W(u)}emit();return Promise.resolve()},
fav:function(id,a,on){var u=U();if(!u[id])return Promise.resolve();var s=(u[id].favs||[]).filter(function(x){return x!==a});if(on)s.push(a);u[id].favs=s;W(u);return Promise.resolve()},
alerts:function(id,on){var u=U();if(u[id]){u[id].alerts=on;W(u)}return Promise.resolve()},
addEnq:function(id,r){var u=U();if(u[id]){(u[id].enq=u[id].enq||[]).unshift(r);W(u)}return Promise.resolve()},
listEnq:function(id){var u=U()[id]||{};return Promise.resolve(u.enq||[])}}}

/* ---- backend 2: Firebase (free Spark plan) ---- */
function fb(){var base="https://www.gstatic.com/firebasejs/10.12.2/",m=null;
function load(){if(m)return m;m=Promise.all([import(base+"firebase-app.js"),import(base+"firebase-auth.js"),import(base+"firebase-firestore.js")]).then(function(x){var app=x[0].initializeApp(CFG);return{A:x[1],F:x[2],auth:x[1].getAuth(app),db:x[2].getFirestore(app)}});return m}
function ud(f,uid){return f.F.doc(f.db,"users",uid)}
return{init:function(cb){load().then(function(f){f.A.onAuthStateChanged(f.auth,function(u){cb(u?{uid:u.uid,email:u.email,name:u.displayName||"",verified:!!u.emailVerified}:null)})}).catch(function(){cb(null)})},
signUp:function(e,p,al){return load().then(function(f){return f.A.createUserWithEmailAndPassword(f.auth,e,p).then(function(c){return f.A.sendEmailVerification(c.user).catch(function(){}).then(function(){return f.F.setDoc(ud(f,c.user.uid),{email:e,alerts:!!al,favs:[],createdAt:f.F.serverTimestamp()})})})})},
signIn:function(e,p){return load().then(function(f){return f.A.signInWithEmailAndPassword(f.auth,e,p)})},
google:function(){return load().then(function(f){return f.A.signInWithPopup(f.auth,new f.A.GoogleAuthProvider()).then(function(c){return f.F.setDoc(ud(f,c.user.uid),{email:c.user.email},{merge:true})})})},
reset:function(e){return load().then(function(f){return f.A.sendPasswordResetEmail(f.auth,e)})},
out:function(){return load().then(function(f){return f.A.signOut(f.auth)})},
get:function(id){return load().then(function(f){return f.F.getDoc(ud(f,id)).then(function(s){var d=s.exists()?s.data():{};return{favs:d.favs||[],alerts:!!d.alerts,profile:d.profile||{},codeUsed:!!d.codeUsed}})})},
demoUse:function(){return Promise.resolve()},
saveProfile:function(id,p){return load().then(function(f){return f.F.setDoc(ud(f,id),{profile:p},{merge:true})})},
sendVerify:function(){return load().then(function(f){return f.A.sendEmailVerification(f.auth.currentUser)})},
refresh:function(){return load().then(function(f){return f.auth.currentUser.reload().then(function(){var u=f.auth.currentUser;return{uid:u.uid,email:u.email,name:u.displayName||"",verified:!!u.emailVerified}})})},
demoVerify:function(){return Promise.resolve()},
fav:function(id,a,on){return load().then(function(f){return f.F.setDoc(ud(f,id),{favs:on?f.F.arrayUnion(a):f.F.arrayRemove(a)},{merge:true})})},
alerts:function(id,on){return load().then(function(f){return f.F.setDoc(ud(f,id),{alerts:on},{merge:true})})},
addEnq:function(id,r){return load().then(function(f){r.at=f.F.serverTimestamp();return f.F.addDoc(f.F.collection(f.db,"users",id,"enquiries"),r)})},
listEnq:function(id){return load().then(function(f){return f.F.getDocs(f.F.query(f.F.collection(f.db,"users",id,"enquiries"),f.F.orderBy("at","desc"))).then(function(s){return s.docs.map(function(d){var x=d.data();x.at=x.at&&x.at.toDate?x.at.toDate().toISOString():"";return x})})})}}}

/* ---- interface ---- */
var wrap=document.createElement("div");wrap.innerHTML=`
<dialog id="authd" aria-label="Sign in or create an account"><div class="sheet">
<div class="tabs" role="tablist"><button type="button" role="tab" id="tabup">Create account</button><button type="button" role="tab" id="tabin">Sign in</button></div>
<h3 id="ahead">Create an account</h3><p class="hint" id="anote"></p>
<p class="hint" id="ademo" hidden>Preview mode: accounts are kept on this device only until the site is connected to Firebase.</p>
<form id="aform" class="irform"><label>Email<input name="email" type="email" required autocomplete="email"></label>
<label>Password<input name="pw" type="password" required minlength="6" autocomplete="new-password"></label>
<p class="hint" id="asignupnote">Verify your email after signing up to get 5% off your first order.</p>
<label class="chk" id="alertrow"><input type="checkbox" name="alerts"> Tell me about sales and events</label>
<button class="btn block" id="asubmit">Create account</button>
<p class="hint" id="astatus" role="status"></p>
<button type="button" class="textlink" id="aforgot" hidden>Forgot your password?</button>
<button type="button" class="btn ghost block" id="agoogle">Continue with Google</button>
<p class="hint">I keep your email, saved artworks and enquiries only to run your account, and I never share them.</p>
<button type="button" class="btn ghost block" id="aclose2">Close</button></form></div></dialog>
<dialog id="acctd" aria-label="Your account"><div class="sheet"><h3>Your account</h3><p class="hint" id="aemail"></p>
<div id="aver" class="verbox"></div>
<h4>Your details</h4>
<form id="pform" class="irform"><label>Name<input name="pname" autocomplete="name"></label><label>Phone (optional)<input name="pphone" type="tel" autocomplete="tel"></label><label>Country<input name="pcountry" autocomplete="country-name"></label>
<button class="btn" type="submit">Save details</button><p class="hint" id="pstatus" role="status"></p></form>
<label class="chk" style="margin-top:1rem"><input type="checkbox" id="aalerts"> Tell me about sales and events</label>
<h4>Saved artworks</h4><div class="favgrid" id="afavs"></div>
<h4>Your enquiries</h4><ul id="aenq" class="enqlist"></ul>
<div class="acts" style="justify-content:flex-start;margin-top:1.2rem"><button type="button" class="btn ghost" id="asignout">Sign out</button><button type="button" class="btn" id="aclose">Close</button></div></div></dialog>`;
while(wrap.firstChild)document.body.appendChild(wrap.firstChild);
var authd=$("authd"),acctd=$("acctd"),btn=el("a","acct","Sign in");btn.href="#";var slot=$("acctslot")||document.querySelector(".mainnav");if(slot)slot.appendChild(btn);
$("ademo").hidden=!DEMO;$("agoogle").hidden=DEMO;
function nice(x){var c=x&&x.code||"";if(c==="auth/email-already-in-use")return"An account with this email already exists. Try signing in.";
if(/invalid-credential|wrong-password|user-not-found|invalid-login/.test(c))return"That email or password is not right.";
if(c==="auth/weak-password")return"Choose a password of at least 6 characters.";if(c==="auth/popup-closed-by-user")return"";
return(x&&x.message)||"Something went wrong. Please try again."}
function openAuth(note,m){mode=m;$("anote").textContent=note||"";$("astatus").textContent="";var up=m==="up";
$("ahead").textContent=up?"Create an account":"Sign in";$("asubmit").textContent=up?"Create account":"Sign in";
$("asignupnote").hidden=!up;$("alertrow").hidden=!up;$("aforgot").hidden=up;$("aform").pw.autocomplete=up?"new-password":"current-password";
$("tabup").setAttribute("aria-selected",up?"true":"false");$("tabin").setAttribute("aria-selected",up?"false":"true");
if(!authd.open)authd.showModal()}
btn.onclick=function(e){e.preventDefault();user?openAcct():openAuth("","up")};
$("tabup").onclick=function(){openAuth($("anote").textContent,"up")};$("tabin").onclick=function(){openAuth($("anote").textContent,"in")};
$("aclose").onclick=function(){acctd.close()};$("aclose2").onclick=function(){authd.close()};
[authd,acctd].forEach(function(d){d.addEventListener("click",function(e){if(e.target===d)d.close()})});
$("aform").onsubmit=function(e){e.preventDefault();var f=e.target,em=f.email.value.trim(),pw=f.pw.value;$("astatus").textContent="One moment\u2026";
(mode==="up"?B.signUp(em,pw,f.alerts.checked):B.signIn(em,pw)).then(function(){authd.close();f.reset()}).catch(function(x){$("astatus").textContent=nice(x)})};
$("agoogle").onclick=function(){B.google().then(function(){authd.close()}).catch(function(x){$("astatus").textContent=nice(x)})};
$("aforgot").onclick=function(e){e.preventDefault();var em=$("aform").email.value.trim();if(!em){$("astatus").textContent="Type your email above first.";return}
B.reset(em).then(function(){$("astatus").textContent="If that email has an account, a reset link is on its way."}).catch(function(x){$("astatus").textContent=nice(x)})};
$("asignout").onclick=function(){B.out().then(function(){acctd.close()})};
$("aalerts").onchange=function(){prof.alerts=this.checked;if(user)B.alerts(user.uid,this.checked)};

function refresh(){Object.keys(hearts).forEach(function(id){var on=prof.favs.indexOf(id)>-1,h=hearts[id];h.setAttribute("aria-pressed",on?"true":"false");h.title=on?"Saved. Tap to remove":"Save to favourites"})}
document.addEventListener("ir-card",function(e){var a=e.detail.a,c=e.detail.c,id=a.file;arts[id]=a;cardEls[id]=c;
var h=el("button","heart");h.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';h.type="button";h.setAttribute("aria-label","Save "+(a.title||"this artwork")+" to favourites");
h.onclick=function(ev){ev.stopPropagation();if(!user){openAuth("Create an account or sign in to save artworks.","up");return}
var on=prof.favs.indexOf(id)<0;prof.favs=prof.favs.filter(function(x){return x!==id});if(on)prof.favs.push(id);refresh();B.fav(user.uid,id,on)};
(e.detail.m||c).appendChild(h);hearts[id]=h;refresh()});
document.addEventListener("ir-enquiry",function(e){if(user)B.addEnq(user.uid,{piece:e.detail.piece||"",intent:e.detail.intent||"",message:(e.detail.message||"").slice(0,500),at:new Date().toISOString()})});
function tagCode(){document.querySelectorAll(".irform[data-enquiry]").forEach(function(f){var i=f.querySelector("[name=welcome_code]");if(!i){i=document.createElement("input");i.type="hidden";i.name="welcome_code";f.appendChild(i)}
i.value=(user&&user.verified&&!prof.codeUsed)?mkcode(user.uid):"";
var j=f.querySelector("[name=account_email]");if(!j){j=document.createElement("input");j.type="hidden";j.name="account_email";f.appendChild(j)}j.value=user?user.email:"";
var k=f.querySelector("[name=email_verified]");if(!k){k=document.createElement("input");k.type="hidden";k.name="email_verified";f.appendChild(k)}k.value=user?(user.verified?"yes":"no"):"not signed in"})}
function prefill(u){document.querySelectorAll(".irform[data-enquiry] [name=email]").forEach(function(i){if(!i.value)i.value=u.email});
if(u.name)document.querySelectorAll(".irform[data-enquiry] [name=name]").forEach(function(i){if(!i.value)i.value=u.name})}
function verBox(){var b=$("aver");b.innerHTML="";
if(user.verified){b.appendChild(el("strong","","Email verified. Thank you."));
if(prof.codeUsed){b.appendChild(el("p","hint","Your welcome discount has been used on an order. Thank you for buying."));return}
b.appendChild(el("p","hint","Your personal code for 5% off your first order. It works once, for you only:"));b.appendChild(el("code","",mkcode(user.uid)));b.appendChild(el("p","hint","Quote this code in your enquiry when you order. Valid for one order, on the artwork price."));
if(DEMO){var u=el("button","btn ghost","Demo only: mark code as used");u.type="button";u.onclick=function(){B.demoUse(user.uid).then(function(){prof.codeUsed=true;verBox()})};b.appendChild(u)}
return}
b.appendChild(el("strong","","Verify your email to unlock 5% off"));
b.appendChild(el("p","hint","We sent a link to "+user.email+". Click it, then press the button below. Check your spam folder if you cannot find it."));
var c=el("button","btn","I have verified, check now");c.type="button";c.onclick=function(){c.disabled=true;B.refresh().then(function(u){if(u)user=u;verBox()}).catch(function(){}).then(function(){c.disabled=false})};
var s=el("button","btn ghost","Send the link again");s.type="button";s.onclick=function(){B.sendVerify().then(function(){s.textContent="Link sent"}).catch(function(){s.textContent="Please try again in a minute"})};
b.appendChild(c);b.appendChild(s);
if(DEMO){var d=el("button","btn ghost","Demo only: mark as verified");d.type="button";d.onclick=function(){B.demoVerify(user.uid).then(function(){user.verified=true;verBox()})};b.appendChild(d)}}
function fillProfile(){var f=$("pform"),p=prof.profile||{};f.pname.value=p.name||"";f.pphone.value=p.phone||"";f.pcountry.value=p.country||"";$("pstatus").textContent=""}
$("pform").onsubmit=function(e){e.preventDefault();var f=e.target,p={name:f.pname.value.trim(),phone:f.pphone.value.trim(),country:f.pcountry.value.trim()};
prof.profile=p;$("pstatus").textContent="Saving\u2026";B.saveProfile(user.uid,p).then(function(){$("pstatus").textContent="Saved."}).catch(function(){$("pstatus").textContent="Could not save. Please try again."})};
function openAcct(){$("aemail").textContent=user.email;$("aalerts").checked=!!prof.alerts;verBox();fillProfile();var g=$("afavs"),any=0;g.innerHTML="";
prof.favs.forEach(function(id){var a=arts[id];if(!a)return;any=1;var t=el("button","favitem");t.type="button";var i=new Image();i.src=a.thumb||a.file;i.alt="";i.draggable=false;t.appendChild(i);t.appendChild(el("span","",a.title||"Untitled"));
t.onclick=function(){acctd.close();var c=cardEls[id];if(!c){location.href="index.html#shop";return}if(c)c.scrollIntoView({behavior:"smooth",block:"center"})};g.appendChild(t)});
if(!any)g.appendChild(el("p","hint","No saved artworks yet. Tap the heart on an artwork to save it."));
var L=$("aenq");L.innerHTML="";L.appendChild(el("li","hint","Loading\u2026"));
B.listEnq(user.uid).then(function(l){L.innerHTML="";if(!l.length){L.appendChild(el("li","hint","No enquiries yet."));return}
l.forEach(function(r){var li=el("li");li.appendChild(el("strong","",(r.piece||"General enquiry")+" \u00b7 "+(r.intent||"")));li.appendChild(el("span","",(r.at?new Date(r.at).toLocaleDateString():"")+" \u00b7 Sent. I reply by email."));L.appendChild(li)})}).catch(function(){L.innerHTML="";L.appendChild(el("li","hint","Could not load your enquiries."))});
acctd.showModal()}
B.init(function(u){user=u;btn.textContent=u?"Account":"Sign in";
if(u){B.get(u.uid).then(function(p){prof=p;refresh();tagCode();if(p.profile&&p.profile.name)prefill({email:u.email,name:p.profile.name})});prefill(u)}else{prof={favs:[],alerts:false,profile:{}};refresh();tagCode()}});
})();
