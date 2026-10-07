import axios from 'axios';

async function checkCookieHandshake() {
  console.log("🔍 Checking target site for automatic cookies...\n");

  try {
    const res = await axios.get('https://trainkothai.com/track/708', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Upgrade-Insecure-Requests': '1'
      },
      maxRedirects: 5,
      timeout: 8000
    });

    console.log(`Status Code: ${res.status}`);
    const setCookieHeaders = res.headers['set-cookie'];

    console.log("\n--- Set-Cookie Headers Received ---");
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      console.log(setCookieHeaders);

      const hasTkS = setCookieHeaders.some(c => c.includes('tk_s='));
      if (hasTkS) {
        console.log("\n🎉 SUCCESS: 'tk_s' cookie is delivered automatically via HTTP!");
      } else {
        console.log("\n⚠️ Cookies received, but 'tk_s' is missing.");
      }
    } else {
      console.log("❌ No set-cookie headers returned by the server.");
    }

  } catch (err) {
    console.error("❌ Request Failed:", err.response?.status || err.message);
  }
}

checkCookieHandshake();