import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

const target = `      </main>
    </div>`;

const replacement = `        <section style="background: #ffffff; padding: 20px; border-radius: 14px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #006a4e; font-size: 18px; margin-top: 0;">গুরুত্বপূর্ণ সেবা ও আইনি নির্দেশিকা</h2>
          <nav style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; font-size: 14px; line-height: 2;">
            <a href="/schedule" style="color: #006a4e; text-decoration: underline; font-weight: 600;">ট্রেন সময়সূচী</a> |
            <a href="/live-trains" style="color: #006a4e; text-decoration: underline; font-weight: 600;">লাইভ ট্রেন তালিকা</a> |
            <a href="/blogs" style="color: #006a4e; text-decoration: underline; font-weight: 600;">ভ্রমণ ব্লগ ও গাইড</a> |
            <a href="/rail-news" style="color: #006a4e; text-decoration: underline; font-weight: 600;">রেল বার্তা ও নোটিশ</a> |
            <a href="/metro-rail" style="color: #006a4e; text-decoration: underline; font-weight: 600;">মেট্রোরেল গাইড</a> |
            <a href="/about" style="color: #006a4e; text-decoration: underline; font-weight: 600;">আমাদের সম্পর্কে</a> |
            <a href="/contact" style="color: #006a4e; text-decoration: underline; font-weight: 600;">যোগাযোগ করুন</a> |
            <a href="/privacy" style="color: #006a4e; text-decoration: underline; font-weight: 600;">গোপনীয়তা নীতি (Privacy Policy)</a> |
            <a href="/terms" style="color: #006a4e; text-decoration: underline; font-weight: 600;">ব্যবহারের শর্তাবলী (Terms of Service)</a> |
            <a href="/disclaimer" style="color: #006a4e; text-decoration: underline; font-weight: 600;">দায়মুক্তি নোটিশ (Disclaimer)</a>
          </nav>
        </section>
      </main>

      <footer style="background: #006a4e; color: #ffffff; padding: 24px 16px; text-align: center; font-size: 13.5px; border-top: 1px solid rgba(255,255,255,0.2);">
        <p style="margin: 0;">© ২০২৬ ট্রেনকই (TrainKoi) - সর্বস্বত্ব সংরক্ষিত | বাংলাদেশ রেলওয়ে লাইভ ট্র্যাকিং ও সময়সূচী পোর্টাল</p>
        <p style="margin: 8px 0 0; opacity: 0.9;">
          <a href="/privacy" style="color: #ffffff; text-decoration: underline; margin: 0 6px;">Privacy Policy</a> | 
          <a href="/terms" style="color: #ffffff; text-decoration: underline; margin: 0 6px;">Terms of Service</a> | 
          <a href="/disclaimer" style="color: #ffffff; text-decoration: underline; margin: 0 6px;">Disclaimer</a> | 
          <a href="/contact" style="color: #ffffff; text-decoration: underline; margin: 0 6px;">Contact Us</a>
        </p>
      </footer>
    </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('index.html', content, 'utf8');
  console.log('✅ Successfully updated index.html with crawlable navigation and policy links!');
} else {
  // If CRLF vs LF
  const targetCRLF = target.replace(/\n/g, '\r\n');
  if (content.includes(targetCRLF)) {
    content = content.replace(targetCRLF, replacement.replace(/\n/g, '\r\n'));
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('✅ Successfully updated index.html with crawlable navigation and policy links (CRLF)!');
  } else {
    console.log('❌ Could not locate target in index.html');
  }
}
