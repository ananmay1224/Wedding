// Build Events content dynamically
function buildEvents() {
  const c = document.getElementById('eventsContent');
  if (c.children.length > 0) return;
  const days = [
    { day:"Day One — June 4, 2026", items:[
      {time:"1:30 PM",name:"Check-in & Welcome Lunch",desc:"Arrive at Ramada by Wyndham, Kasauli. Settle into your rooms, relish a welcome lunch, and soak in the refreshing mountain air.",attire:"Casual / Travel comfortable",color:"var(--cream-dark)"},
      {time:"4:30 PM",name:"Mehendi & High Tea",desc:"Join us for a vibrant evening of mehendi, music, and celebration. Adorn your hands with beautiful henna designs while savoring a delightful high tea as we begin the wedding festivities.",attire:"Festive Indian — bright colors, florals, greens and blues welcome",color:"#2D5A3D"},
      {time:"8:00 PM",name:"Sangeet, Cocktails & Dinner",desc:"Get ready for a spirited evening of music, dance performances, and celebration. Enjoy cocktails and dinner as we gather to celebrate and dance the night away!",attire:"Semi-formal / Glamorous Indian or Western — bold, sparkly, statement pieces",color:"#5B2D8E"},
    ]},
    { day:"Day Two — June 5, 2026", items:[
      {time:"9:00 AM",name:"Haldi Ceremony & Lunch",desc:"A colorful turmeric ceremony to bless the bride and groom before the wedding. Partake in a joyful celebration filled with color and laughter, followed by lunch with family and friends.",attire:"Wear yellow or white — clothes you don't mind getting turmeric on!",color:"#F5D66B"},
      {time:"5:30 PM",name:"Wedding Ceremony & Dinner",desc:"The sacred union of Ananmay & Jennifer. Gather with us as we take our vows amidst the beautiful hills of Kasauli, with a celebratory dinner to follow.",attire:"Formal Indian attire — sherwanis, sarees, lehengas, suits",color:"var(--burgundy)"},
    ]},
    { day:"Day Three — June 6, 2026", items:[
      {time:"8:00 AM",name:"Morning Farewell",desc:"A warm, relaxed morning together before we say our goodbyes. Share stories from the celebrations over a leisurely spread.",attire:"Casual / Comfortable",color:"var(--warm-gray)"},
      {time:"11:00 AM",name:"Check-out",desc:"Bid farewell to the mountains. We hope you carry beautiful memories home with you!",attire:null,color:"var(--warm-gray)"},
    ]},
  ];
  days.forEach((day,di) => {
    let h = `<div style="margin-bottom:80px"><div class="reveal" style="text-align:center;margin-bottom:48px"><h3 class="sans" style="font-size:clamp(14px,2.5vw,18px);font-weight:300;color:var(--burgundy);letter-spacing:4px;text-transform:uppercase">${day.day}</h3><div class="ornament"><div class="line" style="background:linear-gradient(90deg,transparent,var(--burgundy));width:26px"></div><div class="diamond" style="border-color:var(--burgundy)"></div><div class="line" style="background:linear-gradient(90deg,var(--burgundy),transparent);width:26px"></div></div></div>`;
    day.items.forEach((ev,ei) => {
      h += `<div class="ev-item reveal delay-${ei+1}" style="display:flex;gap:32px;margin-bottom:40px;align-items:flex-start;flex-wrap:wrap">
        <div class="ev-time" style="min-width:100px;text-align:center;padding:10px 16px;background:var(--cream);border:1px solid var(--cream-dark)"><span class="sans" style="font-size:12px;letter-spacing:2px;color:var(--warm-gray);font-weight:300">${ev.time}</span></div>
        <div style="flex:1;min-width:250px"><h4 class="serif" style="font-size:24px;font-weight:500;color:var(--charcoal);margin-bottom:8px">${ev.name}</h4><p class="sans" style="font-size:16px;color:var(--text-muted);line-height:1.8;font-weight:300;margin-bottom:12px">${ev.desc}</p>${ev.attire ? `<div style="display:flex;align-items:center;gap:8px"><div style="width:12px;height:12px;background:${ev.color};border-radius:2px;border:1px solid rgba(0,0,0,.1)"></div><span class="sans" style="font-size:12px;color:var(--warm-gray);letter-spacing:1px;font-weight:300">${ev.attire}</span></div>` : ''}</div></div>`;
    });
    h += `</div>`;
    c.innerHTML += h;
  });
  setTimeout(initReveals, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('eventsContent')) buildEvents();
});