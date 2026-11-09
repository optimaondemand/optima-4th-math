// Plays one G4 MATH VR page end to end and screenshots each part.
//   node playtest_vr.js <page.html> <width> <outdir>
// Prints one line: errors, steps, seal, help images, game, equation tries, paragraph checks, stamp, pdf gate, pdf, sideways.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const [file, width = '1150', outdir = 'out/pt'] = process.argv.slice(2);
  const W = +width; fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/youtube|net::|Failed to load resource/i.test(m.text())) errors.push(m.text()); });
  await page.goto('file://' + path.resolve(file));
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload();
  const shot = async (name, sel) => {
    const p = path.join(outdir, `${W}-${name}.png`);
    if (sel) { const el = await page.$(sel); if (el) { await el.screenshot({ path: p }); return; } }
    await page.screenshot({ path: p, fullPage: false });
  };
  await shot('01-top');
  await shot('02-hook', '.vr-letter');
  // VR path: required steps only, then Submitted -> seal; the optional Extra must not be needed
  const n = await page.$$eval('.vr-step', s => s.length);
  await shot('03-step1', '.vr-step[data-step="0"]');
  await shot('04-step3', '.vr-step[data-step="2"]');
  await shot('04b-step6', '.vr-step[data-step="5"]');
  const req = await page.$$eval('.vr-step:not([data-optional])', s => s.map(x => x.getAttribute('data-step')));
  for (const i of req) await page.click(`.vr-step[data-step="${i}"] .vr-chk`);
  const sealBefore = await page.$eval('#vr-badge', e => e.classList.contains('on'));
  await page.check('#vr-sent');
  const seal = await page.$eval('#vr-badge', e => e.classList.contains('on'));
  await shot('05-seal', '#vr-badge');
  // help drawer
  await page.click('#vr-help summary');
  await page.$$eval('#vr-help img', ims => ims.forEach(i => i.loading = 'eager'));
  await page.waitForTimeout(600);
  const helpImgs = await page.$$eval('#vr-help img', ims => ims.filter(i => i.complete && i.naturalWidth > 0).length + '/' + ims.length);
  await shot('06-help', '#vr-help');
  // Sketchbook Day
  await page.click('.vr-path[data-path="vr-post"]');
  await page.waitForTimeout(400);
  await shot('07-post', '#vr-post .wl-card');
  const pdfGateEarly = await page.$eval('#vr-pdf', b => b.disabled);
  const K = await page.evaluate(() => window.VR.game.sketch);
  let stage = 0;
  for (const P of [K.partA, K.partB]) {
    // first piece by drag, the rest by tap; on Part A overshoot once
    const s = await page.$('#pg-piece'), bd = await page.$('#sk-board');
    await page.$eval('#sk-board', e => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(200);
    const sb = await s.boundingBox(), bb = await bd.boundingBox();
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2); await page.mouse.down();
    await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 8 }); await page.mouse.up();
    for (let i = 1; i < P.count; i++) await page.click('#pg-piece');
    if (stage === 0) { await page.click('#pg-piece'); await shot('08-full', '#vr-game'); }
    if (stage === 1) await shot('09-partB', '#vr-game');
    await page.waitForTimeout(1400); stage++;
  }
  const tap = async str => { for (const ch of str) await page.click(`.pg-card[data-t="${ch}"]`); };
  const tries = [];
  // wrong: no plus
  await tap('140=140'); await page.click('#sk-check'); tries.push(await page.$eval('#vr-fb', e => e.textContent));
  await page.click('#sk-clear');
  // wrong: not true
  await tap('100+40=150'); await page.click('#sk-check'); tries.push(await page.$eval('#vr-fb', e => e.textContent));
  await shot('10-eq-miss', '#vr-game');
  await page.click('#sk-clear');
  // wrong parts but true
  await tap('70+70=140'); await page.click('#sk-check'); tries.push(await page.$eval('#vr-fb', e => e.textContent));
  await page.click('#sk-clear');
  // right, with one tile dragged
  await tap('100+40=14');
  await page.$eval('#sk-eq', e => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(200);
  const c = await page.$('.pg-card[data-t="0"]'), ln = await page.$('#sk-eq');
  const cb = await c.boundingBox(), lb = await ln.boundingBox();
  await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await page.mouse.down();
  await page.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2, { steps: 8 }); await page.mouse.up();
  await page.click('#sk-check'); tries.push(await page.$eval('#vr-fb', e => e.textContent));
  await shot('11-eq-ok', '#vr-game');
  await page.waitForTimeout(1900);
  const gameDone = await page.evaluate(() => window.VR_TEST.state.g.stage === 3);
  // paragraph: too short first, then a real one
  await page.fill('#vr-para', 'I built the floor. It is 140.');
  const gateShort = await page.$eval('#vr-pdf', b => b.disabled);
  await page.click('#vr-write .vr-chips button.st');
  await page.fill('#vr-para', 'I built an L-shaped floor, and the whole area is 140 square units. First I split the composite figure into two rectangles. Part A is one Flat, so it is 10 by 10, which is 100 small squares. Part B is 4 Rods, so 4 times 10 is 40. Then I added 100 and 40. I know it is right because I counted the squares in each part again.');
  const checks = await page.$$eval('#vr-checks li', l => l.filter(x => x.classList.contains('ok')).length + '/' + l.length);
  const stamp = await page.$eval('#vr-stamp', e => e.classList.contains('on'));
  const gateOpen = !(await page.$eval('#vr-pdf', b => b.disabled));
  await shot('12-write', '#vr-write');
  await page.fill('#vr-name', 'Ava');
  const [pop] = await Promise.all([page.waitForEvent('popup', { timeout: 4000 }).catch(() => null), page.click('#vr-pdf')]);
  let pdf = 'no popup';
  if (pop) { await pop.waitForLoadState(); const h = await pop.content(); pdf = h.includes('My equation') && h.includes('100 + 40 = 140') ? 'ok' : 'bad'; await pop.screenshot({ path: path.join(outdir, `${W}-13-pdf.png`), fullPage: true }); }
  const sideways = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  await page.screenshot({ path: path.join(outdir, `${W}-14-full.png`), fullPage: true });
  console.log(JSON.stringify({ width: W, errors, steps: n, sealBefore, seal, help: helpImgs, gameDone, tries, gate: { early: pdfGateEarly, short: gateShort, open: gateOpen }, checks, stamp, pdf, sideways }));
  await browser.close();
})();
