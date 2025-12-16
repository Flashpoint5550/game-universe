fetch('/games-list').then(r=>r.json()).then(g=>{
 const d=document.getElementById('games');
 g.forEach(x=>d.innerHTML+=`<p><a href="/games/${x}" target="_blank">${x}</a></p>`);
});
