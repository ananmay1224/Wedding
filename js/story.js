// Build Our Story — full-bleed chapters
function buildStory() {
  const c = document.getElementById('storyContent');
  if (c.children.length > 0) return;

  const orn = (light) => {
    const col = light ? 'var(--gold-light)' : 'var(--gold)';
    return `<div class="ornament"><div class="line" style="background:linear-gradient(90deg,transparent,${col})"></div><div class="diamond" style="border-color:${col}"></div><div class="line" style="background:linear-gradient(90deg,${col},transparent)"></div></div>`;
  };

  let h = '';

  // ── Chapter 1: Two Worlds ──
  h += `<div class="sc"><div style="background:var(--ivory);padding:100px 24px 80px">
    <div class="reveal" style="text-align:center;margin-bottom:60px;max-width:700px;margin-left:auto;margin-right:auto">
      <p class="script" style="font-size:clamp(30px,5vw,48px);color:var(--gold);line-height:1.4;margin-bottom:20px">We each crossed an ocean to find each other.</p>
      ${orn(false)}
      <p class="sans" style="font-size:16px;color:var(--text-muted);line-height:1.9;font-weight:300;margin-top:8px">From completely different parts of the world—China and India—we each set out on a journey to the United States, unaware that along the way we would take our first step toward something truly special.</p>
    </div>
    <div class="sc-split reveal delay-2">
      <div style="text-align:center">
        <span class="sc-label">Jennifer · China</span>
        <img src="Pictures/little-jenny-4.jpg" alt="Little Jennifer" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark);margin-bottom:12px" loading="lazy">
        <div style="width:58%;margin:0 auto"><img src="Pictures/little-Jenny-1.jpg" alt="Baby Jennifer" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark)" loading="lazy"></div>
      </div>
      <div style="text-align:center">
        <span class="sc-label">Ananmay · India</span>
        <img src="Pictures/little-ananmay-3.jpg" alt="Little Ananmay" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark);margin-bottom:6px" loading="lazy">
        <p class="sc-caption">Dreaming big, even then.</p>
        <div style="width:58%;margin:12px auto 0"><img src="Pictures/little-ananmay-1.jpg" alt="Young Ananmay" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark)" loading="lazy"></div>
      </div>
    </div>
  </div></div>`;

  // ── Chapter 2: Champaign, Illinois ──
  h += `<div class="sc"><div style="background:var(--cream);padding:100px 24px;text-align:center">
    <div class="reveal" style="max-width:680px;margin:0 auto">
      <span class="sc-label">Champaign, Illinois · January 2022</span>
      <h2 class="serif" style="font-size:clamp(28px,5vw,44px);font-weight:300;color:var(--charcoal);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Champaign, Illinois</h2>
      ${orn(false)}
      <p class="sans" style="font-size:16px;color:var(--text-muted);line-height:1.9;font-weight:300">St. Patrick was truly a Saint. Our first meeting happened on one of the craziest days at UIUC—Unofficial St. Patrick's Day. What began as one brief, slightly intoxicated conversation unexpectedly sparked everything that followed. From ECON classes to pottery classes in Chicago, we stayed in touch and kept the fun alive.</p>
    </div>
  </div></div>`;

  // ── Chapter 3: The Night Everything Changed (full-bleed) ──
  h += `<div class="sc sc-bleed reveal">
    <div class="sc-bleed-bg"><img src="Pictures/concert-back.jpeg" alt="Northcoast Music Festival" loading="lazy"></div>
    <div class="sc-bleed-overlay" style="background:linear-gradient(180deg,rgba(44,36,32,.35) 0%,rgba(44,36,32,.75) 100%)"></div>
    <div class="sc-bleed-content">
      <p class="script" style="font-size:clamp(36px,6vw,60px);color:rgba(232,217,160,.95);margin-bottom:16px;line-height:1.3;text-shadow:0 2px 12px rgba(0,0,0,.5)">Brightest Lights</p>
      <span style="font-family:'Jost',sans-serif;font-size:11px;letter-spacing:4px;color:rgba(255,255,255,.85);text-transform:uppercase;font-weight:300;display:block;margin-bottom:36px;text-shadow:0 1px 6px rgba(0,0,0,.6)">Northcoast Music Festival · September 2023</span>
      <h2 class="serif" style="font-size:clamp(26px,4.5vw,42px);font-weight:300;color:var(--cream);letter-spacing:2px;text-transform:uppercase;margin-bottom:24px">The Night Everything Changed</h2>
      <p class="sans" style="font-size:16px;color:rgba(255,255,255,.72);line-height:1.9;font-weight:300;margin-bottom:48px">Who asks a girl to a music festival on our first real outing? That would be me. Neither of us quite knew what we were saying yes to at the time, but it turned out to be more than just a beautiful day—it became a turning point for us. We began the day surrounded by the hype of EDM beats and ended it holding hands as Lane 8 had us deep in our feelings. The Uber ride home left us both wondering what life might be like together.</p>
      <div style="width:200px;margin:0 auto;transform:rotate(-2.5deg)">
        <div class="polaroid"><img src="Pictures/northcoast-selfie.jpg" alt="Northcoast selfie" loading="lazy" style="aspect-ratio:3/4;object-fit:cover"></div>
      </div>
    </div>
  </div>`;

  // ── Chapter 4: Windy City, Warm Hearts ──
  h += `<div class="sc"><div style="background:var(--ivory);padding:100px 24px 80px">
    <div style="max-width:1100px;margin:0 auto">
      <div class="reveal" style="text-align:center;margin-bottom:56px;max-width:700px;margin-left:auto;margin-right:auto">
        <span class="sc-label">Chicago, Illinois · October 24, 2023</span>
        <h2 class="serif" style="font-size:clamp(28px,5vw,44px);font-weight:300;color:var(--charcoal);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Windy City, Warm Hearts</h2>
        ${orn(false)}
        <p class="sans" style="font-size:16px;color:var(--text-muted);line-height:1.9;font-weight:300">What followed was a wonderful chapter of dating in the Windy City. From German-style Christmas markets to all-you-can-eat sushi and hotpot, we left no culinary adventure unexplored. Almost every night turned into a movie night, and of course, nothing would have been complete without the monster cat, Lucifer.</p>
      </div>
      <div class="sc-split reveal delay-1" style="margin-bottom:40px">
        <img src="Pictures/chicago-standing.jpg" alt="Chicago" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark)" loading="lazy">
        <img src="Pictures/christmas.jpeg" alt="Christmas market" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark)" loading="lazy">
      </div>
      <div class="reveal delay-2" style="display:flex;justify-content:center;align-items:flex-start;margin-bottom:40px;padding:20px 0">
        <div class="polaroid" style="transform:rotate(-4deg);width:180px;flex-shrink:0"><img src="Pictures/bar-goofy.jpeg" alt="Bar night" loading="lazy" style="aspect-ratio:3/4;object-fit:cover"></div>
        <div class="polaroid" style="transform:rotate(1.5deg);width:180px;flex-shrink:0;margin-left:-24px;margin-top:-16px;position:relative;z-index:2"><img src="Pictures/bar-love.jpeg" alt="Bar night" loading="lazy" style="aspect-ratio:3/4;object-fit:cover"></div>
        <div class="polaroid" style="transform:rotate(4deg);width:180px;flex-shrink:0;margin-left:-24px;margin-top:8px;position:relative;z-index:1"><img src="Pictures/bar-kiss.jpeg" alt="Bar night" loading="lazy" style="aspect-ratio:3/4;object-fit:cover"></div>
      </div>
      <div class="reveal delay-3" style="display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap">
        <img src="Pictures/monster-lucifer.jpeg" alt="Lucifer the cat" style="width:110px;height:110px;object-fit:cover;border-radius:50%;border:2px solid var(--gold-light);flex-shrink:0" loading="lazy">
        <p class="sans" style="font-size:13px;color:var(--text-muted);font-style:italic;font-weight:300">ft. Lucifer, the monster cat</p>
      </div>
    </div>
  </div></div>`;

  // ── Chapter 5: Worlds Apart (text only) ──
  h += `<div class="sc"><div style="background:var(--cream-dark);padding:100px 24px;text-align:center">
    <div class="reveal" style="max-width:680px;margin:0 auto">
      <div style="width:40px;height:1px;background:var(--gold);opacity:.35;margin:0 auto 40px"></div>
      <span class="sc-label" style="color:var(--warm-gray)">January 2024 — 2026</span>
      <h2 class="serif" style="font-size:clamp(28px,5vw,44px);font-weight:300;color:var(--charcoal);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Worlds Apart</h2>
      ${orn(false)}
      <p class="sans" style="font-size:16px;color:var(--text-muted);line-height:1.9;font-weight:300">I eventually had to leave our beautiful life in Chicago and return to India. What followed was an aching, nearly three-year stretch of long distance. There were many tears and countless emotional moments, but we carried on. We found ways to keep our bond alive—playing Call of Duty together and streaming movies on our cozy little Discord server. Somehow, we always found a way to keep going, because we both knew it was worth it.</p>
      <div style="width:40px;height:1px;background:var(--gold);opacity:.35;margin:40px auto 0"></div>
    </div>
  </div></div>`;

  // ── Interlude: Family Dinner bleed ──
  h += `<div class="sc sc-bleed reveal" style="min-height:55vh;align-items:flex-end">
    <div class="sc-bleed-bg"><img src="Pictures/fam-dinner.jpg" alt="Family dinner in India" loading="lazy" style="object-position:center 50%"></div>
    <div class="sc-bleed-overlay" style="background:linear-gradient(180deg,rgba(44,36,32,.1) 0%,rgba(44,36,32,.65) 100%)"></div>
    <div class="sc-bleed-content" style="padding:40px 24px 48px">
      <p class="sans" style="font-size:11px;letter-spacing:4px;color:rgba(255,255,255,.8);text-transform:uppercase;font-weight:300;text-shadow:0 1px 6px rgba(0,0,0,.6)">Gurgaon, India · December 2024</p>
    </div>
  </div>`;

  // ── Chapter 6: A Journey Into His Roots ──
  h += `<div class="sc">
    <div style="background:var(--ivory);padding:60px 24px 80px">
      <div style="max-width:1100px;margin:0 auto">
        <div class="reveal" style="text-align:center;margin-bottom:48px;max-width:700px;margin-left:auto;margin-right:auto">
          <span class="sc-label">Gurgaon, India · December 2024</span>
          <h2 class="serif" style="font-size:clamp(28px,5vw,44px);font-weight:300;color:var(--charcoal);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">A Journey Into His Roots</h2>
          ${orn(false)}
          <p class="sans" style="font-size:16px;color:var(--text-muted);line-height:1.9;font-weight:300">After 12 months apart, we were finally reunited in India. Jennifer got her first real taste of butter chicken and met my family—let's just say all the aunties definitely approved. We spent the winter cozied up in Gurgaon, making sure to explore the incredible world of Indian food, which naturally sparked the age-old debate: Indian food or Chinese food?</p>
        </div>
        <div class="sc-grid-4 reveal delay-1">
          <img src="Pictures/home-couch.jpeg" alt="Family home" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark)" loading="lazy">
          <img src="Pictures/suit-saari.jpeg" alt="Indian event" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark)" loading="lazy">
          <img src="Pictures/raji-mehendi.jpg" alt="Mehendi event" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark)" loading="lazy">
          <img src="Pictures/amby-haldi.jpg" alt="Haldi ceremony" style="width:100%;aspect-ratio:3/4;object-fit:cover;border:1px solid var(--cream-dark)" loading="lazy">
        </div>
      </div>
    </div>
  </div>`;

  // ── Chapter 7: The Proposal (full-bleed) ──
  h += `<div class="sc sc-bleed reveal" style="align-items:stretch">
    <div class="sc-bleed-bg"><img src="Pictures/great-wall.jpg" alt="Great Wall of China" loading="lazy"></div>
    <div class="sc-bleed-overlay" style="background:linear-gradient(180deg,rgba(44,36,32,.78) 0%,rgba(44,36,32,.08) 38%,rgba(44,36,32,.08) 62%,rgba(44,36,32,.88) 100%)"></div>
    <div class="sc-bleed-content" style="display:flex;flex-direction:column;justify-content:space-between;min-height:85vh;padding:24px 24px 48px">
      <div>
        <p class="script" style="font-size:clamp(40px,7vw,68px);color:rgba(232,217,160,.95);margin-bottom:16px;line-height:1.2;text-shadow:0 2px 12px rgba(0,0,0,.5)">She said yes.</p>
        <span style="font-family:'Jost',sans-serif;font-size:11px;letter-spacing:4px;color:rgba(255,255,255,.85);text-transform:uppercase;font-weight:300;display:block;margin-bottom:28px;text-shadow:0 1px 6px rgba(0,0,0,.6)">China · March 2025</span>
        <h2 class="serif" style="font-size:clamp(26px,4.5vw,42px);font-weight:300;color:var(--cream);letter-spacing:2px;text-transform:uppercase;margin-bottom:0;text-shadow:0 2px 8px rgba(0,0,0,.5)">The Proposal</h2>
        ${orn(true)}
      </div>
      <div style="padding-top:16px">
        <p class="sans" style="font-size:16px;color:rgba(255,255,255,.92);line-height:1.9;font-weight:300;text-shadow:0 1px 6px rgba(0,0,0,.6)">I decided I had spent enough time in the gray and chose a ring. I flew to China to visit Jennifer, where she had planned a beautiful trip for me—introducing me to the elegance of her culture and, of course, the incredible food. One cozy evening, surrounded by serene views and after perhaps a little too much wine, I launched into a ten-minute improvised speech that left Jennifer slightly confused—until I finally pulled out the ring. In that moment, she leaped into my arms with tears of joy.</p>
      </div>
    </div>
  </div>`;

  // ── Chapter 8: Kasauli, June 2026 ──
  h += `<div class="sc"><div style="background:linear-gradient(135deg,var(--burgundy-dark) 0%,var(--burgundy) 100%);padding:100px 24px;text-align:center;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;opacity:.04;background-image:radial-gradient(var(--gold) 1px,transparent 1px);background-size:32px 32px"></div>
    <div class="reveal" style="max-width:600px;margin:0 auto;position:relative;z-index:1">
      <div style="width:180px;margin:0 auto 40px;border-radius:4px;overflow:hidden"><img src="Pictures/wedding-logo.jpeg" alt="Ananmay & Jennifer" style="width:100%" loading="lazy"></div>
      <p class="script" style="font-size:clamp(28px,4vw,44px);color:var(--gold-light);margin-bottom:24px;line-height:1.3">Kasauli, India · June 2026</p>
      ${orn(true)}
      <p class="sans" style="font-size:16px;color:rgba(255,255,255,.7);line-height:1.9;font-weight:300;margin-bottom:40px">And now, we invite you to join us in celebrating the next chapter of this incredible story.</p>
      <button class="btn" onclick="goTo('rsvp')" style="border-color:var(--gold);color:var(--gold)">RSVP Now</button>
    </div>
  </div></div>`;

  c.innerHTML = h;
  setTimeout(initReveals, 50);
}