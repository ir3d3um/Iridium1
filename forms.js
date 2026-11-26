(function(){
var EP=window.IR_FORM_ENDPOINT||"",MAX=5*1024*1024;
var q=new URLSearchParams(location.search);
function hid(f,n,v){var i=f.querySelector('[name="'+n+'"]');if(!i){i=document.createElement("input");i.type="hidden";i.name=n;f.appendChild(i)}i.value=v}
document.querySelectorAll("form.irform[data-enquiry]").forEach(function(f){
  var st=f.querySelector(".formstatus"),it=f.querySelector("[name=intent]"),buy=f.querySelector(".buyfields"),art=f.querySelector("[name=artwork]");
  if(q.get("artwork")&&art)art.value=q.get("artwork");
  if(q.get("intent")&&it&&it.tagName==="SELECT"&&it.querySelector('option[value="'+q.get("intent")+'"]'))it.value=q.get("intent");
  function tog(){if(buy&&it)buy.hidden=it.value!=="buy"}
  if(it&&it.tagName==="SELECT"){it.addEventListener("change",tog);tog()}
  f.method="POST";f.enctype="multipart/form-data";f.action=EP;f.acceptCharset="UTF-8";
  hid(f,"_captcha","false");hid(f,"_template","table");
  hid(f,"_next",new URL("thanks.html",location.href).href);
  var hp=document.createElement("input");hp.type="text";hp.name="_honey";hp.tabIndex=-1;hp.autocomplete="off";hp.style.display="none";f.appendChild(hp);
  f.addEventListener("submit",function(e){
    function say(t,bad){if(st){st.textContent=t;st.classList.toggle("bad",!!bad)}}
    if(!EP){e.preventDefault();say("Messages cannot be sent right now. Please message me on Instagram @ir3d3um.",1);return}
    var size=0;f.querySelectorAll("input[type=file]").forEach(function(x){for(var k=0;k<x.files.length;k++)size+=x.files[k].size});
    if(size>MAX){e.preventDefault();say("That photo is too large. Please attach one under 5 MB.",1);return}
    var what=it?(it.tagName==="SELECT"?it.options[it.selectedIndex].text:it.value):"Enquiry";
    hid(f,"_subject","ir3d3um: "+what+(art&&art.value?" – "+art.value:""));
    document.dispatchEvent(new CustomEvent("ir-enquiry",{detail:{piece:art?art.value:"",intent:what,message:(f.querySelector("[name=message]")||{}).value||""}}));
    if(window.irTrack)window.irTrack("sent",what);
    var b=f.querySelector("button[type=submit],button:not([type])");if(b){b.disabled=true;b.textContent="Sending…"}
  });
});
})();
