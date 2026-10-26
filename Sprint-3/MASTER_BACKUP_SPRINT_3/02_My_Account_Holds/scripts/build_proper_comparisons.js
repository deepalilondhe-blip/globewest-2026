const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const COMP_DIR = path.resolve(__dirname, '../comparison');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent('<!DOCTYPE html><html><body><canvas id="c"></canvas></body></html>');

  const figmaBase64 = fs.readFileSync('Sprint-3/Ticket_41794528_My_Account_Holds/figma/01_FIGMA_DESKTOP_HOLDS_ARTBOARD.png').toString('base64');
  const liveVpBase64 = fs.readFileSync('Sprint-3/Ticket_41794528_My_Account_Holds/screenshots/desktop/02_MY_HOLDS_DESKTOP_VIEWPORT.png').toString('base64');
  const liveTableBase64 = fs.readFileSync('Sprint-3/Ticket_41794528_My_Account_Holds/comparison/exact_live_table.png').toString('base64');
  const liveSupportBase64 = fs.readFileSync('Sprint-3/Ticket_41794528_My_Account_Holds/comparison/exact_live_support.png').toString('base64');

  // Helper to compose side-by-side with borders
  async function composePair(expImgBase64, expCrop, actImgBase64, actCrop, outFilename) {
    const resBase64 = await page.evaluate(async ({ expData, eC, actData, aC }) => {
      const loadImg = (d) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = 'data:image/png;base64,' + d;
      });

      const eImg = await loadImg(expData);
      const aImg = await loadImg(actData);

      const eCropW = eC ? eC.w : eImg.width;
      const eCropH = eC ? eC.h : eImg.height;
      const eCropX = eC ? eC.x : 0;
      const eCropY = eC ? eC.y : 0;

      const aCropW = aC ? aC.w : aImg.width;
      const aCropH = aC ? aC.h : aImg.height;
      const aCropX = aC ? aC.x : 0;
      const aCropY = aC ? aC.y : 0;

      const targetH = Math.max(eCropH, aCropH);
      const eScale = targetH / eCropH;
      const aScale = targetH / aCropH;

      const eW = Math.round(eCropW * eScale);
      const aW = Math.round(aCropW * aScale);
      const gap = 20;

      const canvas = document.getElementById('c');
      canvas.width = eW + aW + gap;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Expected (Green border #2E7D32)
      ctx.drawImage(eImg, eCropX, eCropY, eCropW, eCropH, 0, 0, eW, targetH);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#2E7D32';
      ctx.strokeRect(3, 3, eW - 6, targetH - 6);

      // Actual (Red border #FF0000)
      const aX = eW + gap;
      ctx.drawImage(aImg, aCropX, aCropY, aCropW, aCropH, aX, 0, aW, targetH);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#FF0000';
      ctx.strokeRect(aX + 3, 3, aW - 6, targetH - 6);

      return canvas.toDataURL('image/png').split(',')[1];
    }, {
      expData: expImgBase64,
      eC: expCrop,
      actData: actImgBase64,
      aC: actCrop
    });

    const outPath = path.join(COMP_DIR, outFilename);
    fs.writeFileSync(outPath, Buffer.from(resBase64, 'base64'));
    console.log('Saved comparison:', outFilename);
  }

  // PASS 01: Table Columns & Actions (Figma 7 cols vs Live 8 cols)
  await composePair(
    figmaBase64, { x: 825, y: 230, w: 520, h: 30 },
    liveTableBase64, null,
    'COMPARISON_PASS_01_TABLE_COLUMNS_AND_ACTIONS.png'
  );

  // PASS 02: Subtitle Spelling (Figma vs Live 'favourite')
  await composePair(
    figmaBase64, { x: 746, y: 168, w: 540, h: 26 },
    liveVpBase64, { x: 370, y: 268, w: 540, h: 26 },
    'COMPARISON_PASS_02_SUBTITLE_SPELLING.png'
  );

  // PASS 03: Support Block Australian Phone (+613 9518 1600)
  await composePair(
    figmaBase64, { x: 746, y: 760, w: 380, h: 90 },
    liveSupportBase64, null,
    'COMPARISON_PASS_03_SUPPORT_BLOCK_PHONE.png'
  );

  await browser.close();
  console.log('Finished building clean comparisons!');
})();
