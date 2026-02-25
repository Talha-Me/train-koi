import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Search, ChevronDown, ChevronUp, 
  Train, MessageSquare, AlertCircle, HelpCircle, 
  MapPin, Clock, CreditCard, ShieldCheck, Zap, 
  Phone, Mail, Sparkles, ExternalLink, Ticket // Ticket added to import
} from 'lucide-react';

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Database optimized for Search & SEO
  const faqData = useMemo(() => [
  {
    "category": "Live Status & Tracking",
    "questions": [
      {"id":1,"q":"Rangpur Express এখন কোথায় আছে?","a":"Trainkoi.com এর Live Tracking অপশনে ট্রেনের নাম লিখে বর্তমান অবস্থান দেখুন।"},
      {"id":2,"q":"Where is Rangpur Express now?","a":"Search Rangpur Express on Trainkoi.com to see real-time location."},
      {"id":3,"q":"Upaban Express akhon koi ase?","a":"Live Tracker এ সার্চ করলে বর্তমান লোকেশন দেখা যাবে।"},
      {"id":4,"q":"Dhaka to Sylhet train live location?","a":"Train name লিখে লাইভ স্ট্যাটাস দেখুন।"},
      {"id":5,"q":"Train live tracking কিভাবে কাজ করে?","a":"Schedule ও আপডেটেড ডাটার ভিত্তিতে সম্ভাব্য অবস্থান দেখায়।"},
      {"id":6,"q":"আজ ট্রেন লেট নাকি?","a":"Live status পেজে Delay দেখুন।"},
      {"id":7,"q":"Silk City Express live?","a":"Trainkoi tracking এ সার্চ করুন।"},
      {"id":8,"q":"Suborno Express এখন কোথায়?","a":"Live search করুন।"},
      {"id":9,"q":"Khulna train live tracking?","a":"ট্রেন নাম লিখে সার্চ করুন।"},
      {"id":10,"q":"Rajshahi train koi ase?","a":"Live location পেজে দেখুন।"},
      {"id":11,"q":"BD train live map আছে?","a":"হ্যাঁ, ম্যাপ ভিউ সাপোর্ট করে।"},
      {"id":12,"q":"Train delay কত?","a":"Expected vs actual সময় তুলনা দেখুন।"},
      {"id":13,"q":"Sylhet train live status?","a":"Tracking page চেক করুন।"},
      {"id":14,"q":"Airport station এ ট্রেন পৌঁছেছে?","a":"Live update দেখুন।"},
      {"id":15,"q":"Rangpur Express delay?","a":"বর্তমান আপডেট দেখুন।"},
      {"id":16,"q":"Intercity train live tracking BD?","a":"Trainkoi.com ব্যবহার করুন।"},
      {"id":17,"q":"Dhaka station live train list?","a":"স্টেশন সার্চ অপশন ব্যবহার করুন।"},
      {"id":18,"q":"Ajker train live status?","a":"আজকের তারিখ অনুযায়ী দেখাবে।"},
      {"id":19,"q":"Night train live কোথায় দেখবো?","a":"Live tracking section এ।"},
      {"id":20,"q":"Kishoreganj train akhon kothay?","a":"ট্রেন নাম সার্চ করুন।"},
      {"id":21,"q":"Parabat Express live location?","a":"Trainkoi live page এ দেখুন।"},
      {"id":22,"q":"Sundarban Express এখন কোথায়?","a":"লাইভ ট্র্যাকিং সার্চ করুন।"},
      {"id":23,"q":"Padma Express live?","a":"Trainkoi তে সার্চ করুন।"},
      {"id":24,"q":"Agnibina Express akhon koi?","a":"লাইভ স্ট্যাটাস দেখুন।"},
      {"id":25,"q":"Egarosindhur Provati live?","a":"Tracking পেজে দেখুন।"},
      {"id":26,"q":"Lalmoni Express live status?","a":"লাইভ সার্চ করুন।"},
      {"id":27,"q":"Drutojan Express এখন কোথায়?","a":"Trainkoi তে চেক করুন।"},
      {"id":28,"q":"Chattogram train live?","a":"ট্রেন নাম লিখে দেখুন।"},
      {"id":29,"q":"Dinajpur train live tracking?","a":"লাইভ পেজে দেখুন।"},
      {"id":30,"q":"Rajshahi night train live?","a":"Tracking অপশনে সার্চ করুন।"},
      {"id":31,"q":"Sylhet to Dhaka live?","a":"Train name দিয়ে সার্চ করুন।"},
      {"id":32,"q":"Khulna to Dhaka live?","a":"লাইভ ট্র্যাকিং এ দেখুন।"},
      {"id":33,"q":"বরিশাল ট্রেন লাইভ?","a":"লাইভ স্ট্যাটাস দেখুন।"},
      {"id":34,"q":"Metro rail live?","a":"Trainkoi বর্তমানে আন্তঃনগর ট্রেন কভার করে।"},
      {"id":35,"q":"Train location 100% accurate?","a":"প্রায় সঠিক, লাইভ ডাটার উপর নির্ভরশীল।"},
      {"id":36,"q":"Live ETA কী?","a":"Estimated Time of Arrival।"},
      {"id":37,"q":"Next station কিভাবে দেখবো?","a":"লাইভ পেজে পরবর্তী স্টেশন দেখায়।"},
      {"id":38,"q":"Train এখন কোন স্টেশনে?","a":"লাইভ লোকেশন চেক করুন।"},
      {"id":39,"q":"BD railway tracking app আছে?","a":"Trainkoi mobile friendly।"},
      {"id":40,"q":"Trainkoi live কতক্ষণ পর আপডেট হয়?","a":"নিয়মিত আপডেট হয়।"}
    ]
  },
  {
    "category": "Train Time & Schedule",
    "questions": [
      {"id":41,"q":"Dhaka to Sylhet train time?","a":"সকাল ও রাতের আন্তঃনগর ট্রেন আছে।"},
      {"id":42,"q":"Dhaka to Chattogram train কয়টা?","a":"প্রতিদিন একাধিক ট্রেন।"},
      {"id":43,"q":"Rangpur Express সময়সূচি?","a":"নির্ধারিত সময় অনুযায়ী চলে।"},
      {"id":44,"q":"Upaban Express কয়টায় ছাড়ে?","a":"রাত ১০টার পর ঢাকা থেকে।"},
      {"id":45,"q":"Silk City Express সময়?","a":"সকালবেলা ঢাকা ছাড়ে।"},
      {"id":46,"q":"Rajshahi train night কয়টায়?","a":"সন্ধ্যা ও রাতের ট্রেন আছে।"},
      {"id":47,"q":"Sylhet train morning কয়টায়?","a":"সকালবেলার আন্তঃনগর রয়েছে।"},
      {"id":48,"q":"Train off day কী?","a":"সপ্তাহে নির্দিষ্ট ছুটির দিন।"},
      {"id":49,"q":"BD train schedule today?","a":"Updated schedule দেখুন।"},
      {"id":50,"q":"Dhaka airport station train time?","a":"মূল রুটের ট্রেন থামে।"},
      {"id":51,"q":"Dhaka–Khulna train time?","a":"দৈনিক নির্ধারিত সময় আছে।"},
      {"id":52,"q":"Dhaka–Rajshahi schedule?","a":"একাধিক আন্তঃনগর চলে।"},
      {"id":53,"q":"Dhaka–Rangpur সময়?","a":"দৈনিক সার্ভিস।"},
      {"id":54,"q":"Sylhet–Dhaka time?","a":"সকাল ও রাতের ট্রেন।"},
      {"id":55,"q":"Chattogram–Dhaka সময়?","a":"একাধিক ট্রেন।"},
      {"id":56,"q":"Rajshahi off day?","a":"নির্দিষ্ট দিন বন্ধ।"},
      {"id":57,"q":"Khulna night train?","a":"রাতের সার্ভিস আছে।"},
      {"id":58,"q":"Dinajpur train time?","a":"Schedule পেজে দেখুন।"},
      {"id":59,"q":"Lalmonirhat train সময়?","a":"নির্ধারিত সময়সূচি রয়েছে।"},
      {"id":60,"q":"Padma Express time?","a":"দৈনিক নির্ধারিত।"},
      {"id":61,"q":"Parabat Express সময়?","a":"সকালবেলা ছাড়ে।"},
      {"id":62,"q":"Sundarban Express সময়?","a":"সকালে ঢাকা ছাড়ে।"},
      {"id":63,"q":"Suborno Express সময়?","a":"সকাল ও বিকাল সার্ভিস।"},
      {"id":64,"q":"Agnibina Express সময়?","a":"সন্ধ্যার ট্রেন।"},
      {"id":65,"q":"Drutojan Express সময়?","a":"রাতের ট্রেন।"},
      {"id":66,"q":"Egarosindhur Provati সময়?","a":"সকাল সার্ভিস।"},
      {"id":67,"q":"Kishoreganj train সময়?","a":"দৈনিক চলাচল।"},
      {"id":68,"q":"Airport থেকে Rajshahi সময়?","a":"রুটভেদে নির্ধারিত।"},
      {"id":69,"q":"আজকের Rangpur সময়?","a":"আজকের শিডিউল দেখুন।"},
      {"id":70,"q":"আজকের Sylhet সময়?","a":"Schedule section দেখুন।"},
      {"id":71,"q":"আজকের Khulna সময়?","a":"আজকের তালিকা দেখুন।"},
      {"id":72,"q":"আজকের Chattogram সময়?","a":"Updated সময়সূচি।"},
      {"id":73,"q":"Intercity কয়টা?","a":"প্রতিদিন একাধিক।"},
      {"id":74,"q":"Mail train সময়?","a":"লোকাল স্টপেজ বেশি।"},
      {"id":75,"q":"Local train time?","a":"স্টেশনভেদে আলাদা।"},
      {"id":76,"q":"Weekend train সময়?","a":"সাধারণ সময়সূচি প্রযোজ্য।"},
      {"id":77,"q":"Holiday train schedule?","a":"ঘোষণা অনুযায়ী।"},
      {"id":78,"q":"Eid train সময়?","a":"বিশেষ শিডিউল।"},
      {"id":79,"q":"Metro rail সময়?","a":"আলাদা সময়সূচি।"},
      {"id":80,"q":"Dhaka main station time?","a":"কমলাপুর তালিকা দেখুন।"},
      {"id":81,"q":"কমলাপুর থেকে Rangpur সময়?","a":"সকাল সার্ভিস।"},
      {"id":82,"q":"কমলাপুর থেকে Sylhet সময়?","a":"সকাল ও রাত।"},
      {"id":83,"q":"কমলাপুর থেকে Rajshahi সময়?","a":"একাধিক ট্রেন।"},
      {"id":84,"q":"কমলাপুর থেকে Khulna সময়?","a":"সকাল ট্রেন।"},
      {"id":85,"q":"কমলাপুর থেকে Chattogram সময়?","a":"একাধিক সার্ভিস।"},
      {"id":86,"q":"Train early হলে?","a":"লাইভ স্ট্যাটাসে দেখাবে।"},
      {"id":87,"q":"Train reschedule হলে?","a":"আপডেট দেখুন।"},
      {"id":88,"q":"Station wise schedule?","a":"স্টেশন সার্চ করুন।"},
      {"id":89,"q":"Full BD train list?","a":"Schedule section এ।"},
      {"id":90,"q":"Train time ajker?","a":"আজকের সময়সূচি দেখুন।"}
    ]
  },
  {
    "category": "Ticket & Fare",
    "questions": [
      {"id":91,"q":"Train ticket কিভাবে কাটবো?","a":"অনলাইন বা কাউন্টার থেকে।"},
      {"id":92,"q":"Online train ticket BD?","a":"অফিসিয়াল ই-টিকিটিং সাইট ব্যবহার করুন।"},
      {"id":93,"q":"Ticket cancel করা যায়?","a":"হ্যাঁ, নির্ধারিত চার্জে।"},
      {"id":94,"q":"Train ticket refund rule?","a":"সময়ের উপর নির্ভর করে।"},
      {"id":95,"q":"Shovon chair ভাড়া কত?","a":"রুটভেদে নির্ধারিত।"},
      {"id":96,"q":"AC seat price BD?","a":"শোভনের চেয়ে বেশি।"},
      {"id":97,"q":"Cabin ticket price?","a":"সর্বোচ্চ ভাড়া শ্রেণি।"},
      {"id":98,"q":"Child ticket rule?","a":"নির্দিষ্ট বয়সের নিচে ফ্রি/হাফ।"},
      {"id":99,"q":"Eid advance ticket কবে?","a":"ঘোষণা অনুযায়ী।"},
      {"id":100,"q":"Train ticket booking time কয়টা?","a":"নির্দিষ্ট সময় থেকে শুরু।"},
      {"id":101,"q":"Digital ticket কি বৈধ?","a":"হ্যাঁ।"},
      {"id":102,"q":"NID লাগবে?","a":"অনলাইন টিকিটে প্রয়োজন।"},
      {"id":103,"q":"Counter time?","a":"স্টেশনভেদে আলাদা।"},
      {"id":104,"q":"Refund কত কাটে?","a":"নিয়ম অনুযায়ী শতাংশ।"},
      {"id":105,"q":"Ticket print দরকার?","a":"ডিজিটাল কপি চলবে।"},
      {"id":106,"q":"Group ticket?","a":"কাউন্টারে আবেদন।"},
      {"id":107,"q":"Student discount?","a":"নিয়ম অনুযায়ী।"},
      {"id":108,"q":"Senior citizen discount?","a":"নির্দিষ্ট শর্তে।"},
      {"id":109,"q":"Tatkal ticket আছে?","a":"বিশেষ কোটায়।"},
      {"id":110,"q":"Seat availability?","a":"সার্চ করলে দেখাবে।"},
      {"id":111,"q":"Waiting list?","a":"অনলাইন দেখাবে।"},
      {"id":112,"q":"Ticket transfer করা যায়?","a":"সাধারণত না।"},
      {"id":113,"q":"Lost ticket?","a":"নিয়ম অনুযায়ী ব্যবস্থা।"},
      {"id":114,"q":"SMS ticket valid?","a":"ডিজিটাল কপি গ্রহণযোগ্য।"},
      {"id":115,"q":"Payment method?","a":"কার্ড/মোবাইল ব্যাংকিং।"},
      {"id":116,"q":"Bkash accepted?","a":"হ্যাঁ।"},
      {"id":117,"q":"Nagad accepted?","a":"হ্যাঁ।"},
      {"id":118,"q":"Rocket accepted?","a":"হ্যাঁ।"},
      {"id":119,"q":"Refund time কতদিন?","a":"নির্ধারিত সময়।"},
      {"id":120,"q":"Counter refund?","a":"কাউন্টারে আবেদন।"},
      {"id":121,"q":"Online refund?","a":"অনলাইনে আবেদন।"},
      {"id":122,"q":"Partial refund?","a":"নিয়ম অনুযায়ী।"},
      {"id":123,"q":"Missed train refund?","a":"সাধারণত নয়।"},
      {"id":124,"q":"Platform ticket price?","a":"নির্ধারিত কম ভাড়া।"},
      {"id":125,"q":"Luggage charge?","a":"ওজনভেদে।"},
      {"id":126,"q":"Bike parcel?","a":"পার্সেল সার্ভিসে।"},
      {"id":127,"q":"Train food charge?","a":"আলাদা মূল্য।"},
      {"id":128,"q":"AC cabin সুবিধা?","a":"আরামদায়ক সিট/কেবিন।"},
      {"id":129,"q":"Seat class কয়টি?","a":"শোভন, স্নিগ্ধা, এসি ইত্যাদি।"},
      {"id":130,"q":"Train ভাড়া তালিকা?","a":"রুট সার্চ করলে দেখাবে।"}
    ]
  },
  {
    "category": "Popular Train Information",
    "questions": [
      {"id":131,"q":"Rangpur Express কোন রুটে?","a":"ঢাকা–রংপুর।"},
      {"id":132,"q":"Silk City Express কোন রুটে?","a":"ঢাকা–রাজশাহী।"},
      {"id":133,"q":"Suborno Express?","a":"ঢাকা–চট্টগ্রাম।"},
      {"id":134,"q":"Sundarban Express?","a":"ঢাকা–খুলনা।"},
      {"id":135,"q":"Parabat Express?","a":"ঢাকা–সিলেট।"},
      {"id":136,"q":"Agnibina Express?","a":"ঢাকা–তারাকান্দি।"},
      {"id":137,"q":"Egarosindhur Provati?","a":"ঢাকা–কিশোরগঞ্জ।"},
      {"id":138,"q":"Padma Express?","a":"ঢাকা–রাজশাহী।"},
      {"id":139,"q":"Lalmoni Express?","a":"ঢাকা–লালমনিরহাট।"},
      {"id":140,"q":"Drutojan Express?","a":"ঢাকা–দিনাজপুর।"},
      {"id":141,"q":"Upaban Express?","a":"ঢাকা–সিলেট।"},
      {"id":142,"q":"Tista Express?","a":"ঢাকা–দেওয়ানগঞ্জ।"},
      {"id":143,"q":"Jamuna Express?","a":"ঢাকা–তারাকান্দি।"},
      {"id":144,"q":"Kalni Express?","a":"ঢাকা–সিলেট।"},
      {"id":145,"q":"Mohanagar Express?","a":"ঢাকা–চট্টগ্রাম।"},
      {"id":146,"q":"Turna Express?","a":"ঢাকা–চট্টগ্রাম।"},
      {"id":147,"q":"Chitra Express?","a":"ঢাকা–খুলনা।"},
      {"id":148,"q":"Benapole Express?","a":"ঢাকা–বেনাপোল।"},
      {"id":149,"q":"Sonar Bangla Express?","a":"ঢাকা–চট্টগ্রাম।"},
      {"id":150,"q":"Panchagarh Express?","a":"ঢাকা–পঞ্চগড়।"},
      {"id":151,"q":"Haor Express?","a":"ঢাকা–মোহনগঞ্জ।"},
      {"id":152,"q":"Dolonchapa Express?","a":"সান্তাহার–দিনাজপুর।"},
      {"id":153,"q":"Sagardari Express?","a":"খুলনা–রাজশাহী।"},
      {"id":154,"q":"Kapotaksha Express?","a":"খুলনা–রাজশাহী।"},
      {"id":155,"q":"Rupsha Express?","a":"খুলনা–চিলাহাটি।"},
      {"id":156,"q":"Barendra Express?","a":"রাজশাহী–চিলাহাটি।"},
      {"id":157,"q":"Simanta Express?","a":"খুলনা–চিলাহাটি।"},
      {"id":158,"q":"Udayan Express?","a":"চট্টগ্রাম–সিলেট।"},
      {"id":159,"q":"Bijoy Express?","a":"চট্টগ্রাম–ময়মনসিংহ।"},
      {"id":160,"q":"Maitree Express?","a":"ঢাকা–কলকাতা।"},
      {"id":161,"q":"Bandhan Express?","a":"খুলনা–কলকাতা।"},
      {"id":162,"q":"Mitali Express?","a":"ঢাকা–নিউ জলপাইগুড়ি।"},
      {"id":163,"q":"Kurigram Express?","a":"ঢাকা–কুড়িগ্রাম।"},
      {"id":164,"q":"Brahmaputra Express?","a":"ঢাকা–দেওয়ানগঞ্জ।"},
      {"id":165,"q":"Surma Mail?","a":"ঢাকা–সিলেট।"},
      {"id":166,"q":"Karnafuli Express?","a":"ঢাকা–চট্টগ্রাম।"},
      {"id":167,"q":"Meghna Express?","a":"চট্টগ্রাম–চাঁদপুর।"},
      {"id":168,"q":"Rajshahi Express?","a":"ঢাকা–রাজশাহী।"},
      {"id":169,"q":"Commuter train?","a":"লোকাল রুটে চলে।"},
      {"id":170,"q":"All popular train list?","a":"উপরের তালিকা দেখুন।"}
    ]
  },
  {
    "category": "Railway General Knowledge",
    "questions": [
      {"id":171,"q":"বাংলাদেশে কয়টি রেল জোন?","a":"২টি।"},
      {"id":172,"q":"Broad gauge কী?","a":"বড় প্রস্থের রেললাইন।"},
      {"id":173,"q":"Meter gauge কী?","a":"ছোট প্রস্থের লাইন।"},
      {"id":174,"q":"Dual gauge কী?","a":"দুই ধরনের ট্রেন চলতে পারে।"},
      {"id":175,"q":"Intercity train কী?","a":"দ্রুতগামী ট্রেন।"},
      {"id":176,"q":"Mail train কী?","a":"লোকাল স্টপেজ বেশি।"},
      {"id":177,"q":"Train নম্বর কেন আলাদা?","a":"আপ ও ডাউন আলাদা করতে।"},
      {"id":178,"q":"Railway helpline নম্বর?","a":"163"},
      {"id":179,"q":"সবচেয়ে ব্যস্ত রুট?","a":"ঢাকা–চট্টগ্রাম।"},
      {"id":180,"q":"Padma Bridge দিয়ে ট্রেন চলে?","a":"হ্যাঁ।"},
      {"id":181,"q":"Dhaka main station?","a":"ঢাকা কমলাপুর।"},
      {"id":182,"q":"Train সর্বোচ্চ গতি?","a":"১০০–১২০ কিমি/ঘণ্টা।"},
      {"id":183,"q":"Train কয় ধরনের?","a":"আন্তঃনগর, মেইল, লোকাল।"},
      {"id":184,"q":"Railway police কাজ?","a":"নিরাপত্তা নিশ্চিত।"},
      {"id":185,"q":"Train late হওয়ার কারণ?","a":"সিগন্যাল, আবহাওয়া।"},
      {"id":186,"q":"Ticket black কেন হয়?","a":"চাহিদা বেশি হলে।"},
      {"id":187,"q":"Online ticket সুবিধা?","a":"ঘরে বসে বুকিং।"},
      {"id":188,"q":"Tracking 100% সঠিক?","a":"প্রায় সঠিক।"},
      {"id":189,"q":"Official authority?","a":"বাংলাদেশ রেলওয়ে।"},
      {"id":190,"q":"Trainkoi কী?","a":"BD train tracking প্ল্যাটফর্ম।"},
      {"id":191,"q":"Trainkoi ফ্রি?","a":"হ্যাঁ।"},
      {"id":192,"q":"Trainkoi mobile friendly?","a":"হ্যাঁ।"},
      {"id":193,"q":"সব ট্রেন কভার করে?","a":"অধিকাংশ আন্তঃনগর।"},
      {"id":194,"q":"Trainkoi blog?","a":"ট্রেন নিউজ ও আপডেট।"},
      {"id":195,"q":"SEO সুবিধা?","a":"দ্রুত সার্চ রেজাল্ট।"},
      {"id":196,"q":"Live update frequency?","a":"নিয়মিত আপডেট।"},
      {"id":197,"q":"Rangpur express akhon kothay ase?","a":"Live page এ দেখুন।"},
      {"id":198,"q":"Train time ajker?","a":"আজকের শিডিউল দেখুন।"},
      {"id":199,"q":"BD train schedule full list?","a":"Schedule section এ।"},
      {"id":200,"q":"Best train tracking site BD?","a":"Trainkoi.com"}
    ]
  }
], []);

  // Filtering Logic
  const filteredData = useMemo(() => {
    return faqData.map(section => ({
      ...section,
      questions: section.questions.filter(item => {
        const searchContent = (item.q + item.a + (item.tags ? item.tags.join(" ") : "")).toLowerCase();
        const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === "All" || section.category === activeTab;
        return matchesSearch && matchesTab;
      })
    })).filter(section => section.questions.length > 0);
  }, [searchTerm, activeTab, faqData]);

  const toggleFaq = (id) => setOpenIndex(openIndex === id ? null : id);

  return (
    <div style={{ backgroundColor: '#f0f4f3', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#006a4e', padding: '15px 20px', color: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
              <ChevronLeft size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Help & Center</h2>
          </div>
          <Sparkles size={20} />
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
        
        {/* Search Bar Section */}
        <div style={{ textAlign: 'center', padding: '40px 10px' }}>
          <h1 style={{ color: '#006a4e', fontSize: '28px', fontWeight: '900', marginBottom: '15px' }}>
            আমরা কিভাবে সাহায্য করতে পারি?
          </h1>
          
<div style={{ 
  position: 'relative', 
  maxWidth: '750px', 
  margin: '0 auto',
  padding: '0 10px' // মোবাইলে দুই পাশে সামান্য গ্যাপ রাখার জন্য
}}>
  {/* সার্চ আইকন */}
  <Search 
    style={{ 
      position: 'absolute', 
      left: '30px', // বাম থেকে দূরত্ব একটু বাড়ানো হয়েছে
      top: '50%', 
      transform: 'translateY(-50%)', 
      color: '#006a4e',
      zIndex: 10
    }} 
    size={20} 
  />
  
  <input 
    type="text" 
    placeholder="ট্রেন বা ভাড়া লিখে সার্চ করুন..." 
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ 
      width: '100%', 
      padding: '15px 20px 15px 55px', // বামে স্পেসিং আইকনের জন্য
      borderRadius: '50px', 
      border: '1px solid #e0e0e0', // হালকা বর্ডার যোগ করা হয়েছে
      outline: 'none', 
      fontSize: '15px', // মোবাইলের জন্য স্ট্যান্ডার্ড সাইজ
      boxShadow: '0 8px 25px rgba(0,106,78,0.08)',
      backgroundColor: 'white',
      boxSizing: 'border-box', // এটি খুবই গুরুত্বপূর্ণ যেন প্যাডিং উইডথকে নষ্ট না করে
      appearance: 'none', // আইফোনে ডিফল্ট স্টাইল দূর করার জন্য
      WebkitAppearance: 'none'
    }} 
  />
</div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '20px', scrollbarWidth: 'none' }}>
          {["All", ...faqData.map(d => d.category)].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                borderRadius: '50px',
                border: 'none',
                backgroundColor: activeTab === tab ? '#006a4e' : 'white',
                color: activeTab === tab ? 'white' : '#555',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                transition: '0.3s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div style={{ display: 'grid', gap: '30px' }}>
          {filteredData.length > 0 ? (
            filteredData.map((section, sIndex) => (
              <div key={sIndex}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#006a4e' }}>
                  {section.icon}
                  <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '800' }}>{section.category}</h3>
                </div>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {section.questions.map((item, qIndex) => {
                    const id = `${sIndex}-${qIndex}`;
                    const isOpen = openIndex === id;
                    return (
                      <div 
                        key={qIndex} 
                        style={{ 
                          backgroundColor: 'white', 
                          borderRadius: '20px', 
                          border: isOpen ? '2px solid #006a4e' : '1px solid #e0e0e0',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div 
                          onClick={() => toggleFaq(id)}
                          style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                        >
                          <span style={{ fontWeight: '700', color: isOpen ? '#006a4e' : '#333', fontSize: '15px', lineHeight: '1.4' }}>
                            {item.q}
                          </span>
                          <div style={{ backgroundColor: isOpen ? '#e8f5e9' : '#f5f5f5', padding: '5px', borderRadius: '50%', color: isOpen ? '#006a4e' : '#888' }}>
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                        {isOpen && (
                          <div style={{ padding: '0 20px 20px', color: '#555', fontSize: '14px', lineHeight: '1.7', borderTop: '1px solid #f5f5f5', paddingTop: '15px' }}>
                            {item.a}
                            {item.tags && (
                              <div style={{ display: 'flex', gap: '8px', marginTop: '15px', flexWrap: 'wrap' }}>
                                {item.tags.map(tag => (
                                  <span key={tag} style={{ fontSize: '10px', backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', color: '#888' }}>#{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '30px' }}>
              <AlertCircle size={50} color="#ffab00" style={{ margin: '0 auto 15px' }} />
              <h3 style={{ color: '#333' }}>কোনো ফলাফল পাওয়া যায়নি!</h3>
              <p style={{ color: '#777' }}>অন্য কোনো কি-ওয়ার্ড দিয়ে চেষ্টা করুন।</p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#006a4e', padding: '30px', borderRadius: '25px', color: 'white', textAlign: 'center' }}>
            <Phone size={30} style={{ marginBottom: '15px' }} />
            <h4 style={{ margin: '0 0 10px' }}>জরুরী কল করুন</h4>
            <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '15px' }}>রেলওয়ে হটলাইন ১৬১৩১</p>
            <a href="tel:16131" style={{ display: 'block', backgroundColor: 'white', color: '#006a4e', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}>কল করুন ১৬১৩১</a>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '25px', border: '2px solid #006a4e', textAlign: 'center' }}>
            <Mail size={30} color="#006a4e" style={{ marginBottom: '15px' }} />
            <h4 style={{ margin: '0 0 10px', color: '#006a4e' }}>মেসেজ পাঠান</h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>সহায়তার জন্য যোগাযোগ করুন</p>
            <button onClick={() => navigate('/contact')} style={{ width: '100%', backgroundColor: '#006a4e', color: 'white', padding: '12px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>যোগাযোগ ফরম</button>
          </div>
        </div>

        {/* Links */}
        <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px' }}>
          <p style={{ color: '#888', fontSize: '14px' }}>অফিসিয়াল রিসোর্স:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <a href="https://eticket.railway.gov.bd" target="_blank" rel="noreferrer" style={{ color: '#006a4e', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              রেলওয়ে ই-টিকিট <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;