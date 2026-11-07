import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const TARGET_URL = 'https://trainkothai.com/track/794';
const SYNC_API_URL = process.env.SYNC_API_URL || 'http://localhost:5001/api/cookie/sync';
const ADMIN_SECRET = process.env.ADMIN_SECRET_TOKEN || 'trainkoi_super_secret_token_2026';
const IS_LOOP_MODE = process.argv.includes('--loop');

function getExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

// ক্লাউডফ্লেয়ার চেকবক্স ও আইফ্রেম অটো-ডিটেকশন ও ক্লিক হেল্পার
async function solveTurnstileIfPresent(page) {
  try {
    for (let attempt = 0; attempt < 8; attempt++) {
      const frames = page.frames();
      const cfFrame = frames.find(f => f.url().includes('challenges.cloudflare.com') || f.url().includes('turnstile'));
      
      if (cfFrame) {
        console.log('Turnstile challenge frame detected, attempting human-like interaction...');
        const checkbox = await cfFrame.$('input[type="checkbox"], .ctp-checkbox-label, #cf-stage, [role="checkbox"], body');
        if (checkbox) {
          const box = await checkbox.boundingBox();
          if (box) {
            const targetX = box.x + box.width / 2;
            const targetY = box.y + box.height / 2;
            await page.mouse.move(targetX, targetY, { steps: 15 });
            await new Promise(r => setTimeout(r, 200));
            await page.mouse.click(targetX, targetY);
            console.log('✅ Clicked challenge verification element.');
            await new Promise(r => setTimeout(r, 3000));
            return true;
          }
        }
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  } catch (err) {
    console.log('Turnstile interaction notice:', err.message);
  }
  return false;
}

async function refreshAndSync() {
  console.log(`\n[${new Date().toLocaleTimeString()}] 🚀 Launching Browser to fetch fresh cookie...`);
  
  const executablePath = getExecutablePath();
  const launchOptions = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--window-size=1280,800'
    ]
  };

  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1280, height: 800 });

    console.log(`Navigating to ${TARGET_URL}...`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 35000 });

    // প্রাথমিক অপেক্ষা ও চেকবক্স থাকলে অটো-ক্লিক
    await new Promise(r => setTimeout(r, 3000));
    await solveTurnstileIfPresent(page);

    // কুকি চেক লুপ
    let finalCookies = [];
    for (let cCheck = 0; cCheck < 6; cCheck++) {
      finalCookies = await page.cookies();
      const tk_s = finalCookies.find(c => c.name === 'tk_s');
      if (tk_s) break;
      await new Promise(r => setTimeout(r, 2000));
    }

    const captured_s = finalCookies.find(c => c.name === 'tk_s');
    if (!captured_s) {
      throw new Error('tk_s cookie not found after challenge execution');
    }

    const cookieHeader = finalCookies.map(c => `${c.name}=${c.value}`).join('; ');
    console.log('✅ Successfully captured cookies from browser!');

    // ব্যাকএন্ডে সিঙ্ক পাঠানো
    const syncRes = await fetch(SYNC_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: ADMIN_SECRET,
        cookie: cookieHeader,
        userAgent: userAgent
      })
    });

    const syncJson = await syncRes.json();
    console.log('🎉 Sync Response:', syncJson);
    console.log(`[SUCCESS] Cookie active! Next refresh in 10 minutes.`);
  } catch (err) {
    console.error('❌ Refresher Error:', err.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed cleanly. Memory freed.');
    }
  }
}

async function main() {
  await refreshAndSync();

  if (IS_LOOP_MODE) {
    console.log('\n🔄 Loop mode active: Running refresh every 10 minutes. Press Ctrl+C to stop.\n');
    setInterval(refreshAndSync, 10 * 60 * 1000);
  }
}

main();
