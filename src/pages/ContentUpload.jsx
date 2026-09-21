import React, { useState, useEffect } from 'react';
import { 
  Send, Lock, User, FileText, Tag, CheckCircle2, 
  AlertCircle, LogOut, Trash2, ListFilter, PlusCircle, 
  Calendar, RefreshCw 
} from 'lucide-react';

const ContentUpload = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Tabs: 'create' ba 'manage'
  const [activeTab, setActiveTab] = useState('create');

  // Form State
  const [type, setType] = useState('news');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  // Manage Data List State
  const [manageType, setManageType] = useState('news');
  const [contentList, setContentList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const API_BASE_URL = isLocal ? 'http://localhost:5001' : 'https://api.trainkoi.com';

  useEffect(() => {
    const savedToken = localStorage.getItem('trainkoi_admin_token');
    if (savedToken) {
      setIsLoggedIn(true);
    }
  }, []);

  // Manage Tab-e thakle list load hobe
  useEffect(() => {
    if (isLoggedIn && activeTab === 'manage') {
      fetchManageList();
    }
  }, [isLoggedIn, activeTab, manageType]);

  const fetchManageList = async () => {
    setListLoading(true);
    try {
      const endpoint = manageType === 'news' ? '/api/news' : '/api/blogs';
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!res.ok) throw new Error('Data load korte parini');
      const data = await res.json();
      setContentList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('List fetch error:', err);
      setContentList([]);
    } finally {
      setListLoading(false);
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('trainkoi_admin_token', data.token);
        setIsLoggedIn(true);
        setStatus({ type: 'success', text: 'স্বাগতম! অ্যাডমিন হিসেবে লগইন সফল হয়েছে।' });
        setUsername('');
        setPassword('');
      } else {
        setStatus({ type: 'error', text: data.error || 'লগইন ব্যর্থ হয়েছে!' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'সার্ভারে কানেক্ট করা যাচ্ছে না! ব্যাকএন্ড (port 5001) রানিং আছে কি না দেখুন।' });
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('trainkoi_admin_token');
    setIsLoggedIn(false);
    setStatus({ type: 'info', text: 'আপনি লগআউট করেছেন।' });
  };

  // Create Post Handler
  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', text: 'কন্টেন্ট আপলোড হচ্ছে...' });

    const token = localStorage.getItem('trainkoi_admin_token');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    try {
      const endpoint = type === 'news' ? '/api/news/create' : '/api/blogs/create';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: 'সফলভাবে ডাটাবেসে সেভ হয়েছে!' });
        setTitle('');
        setContent('');
      } else {
        if (res.status === 403 || res.status === 401) {
          localStorage.removeItem('trainkoi_admin_token');
          setIsLoggedIn(false);
        }
        setStatus({ type: 'error', text: data.error || 'পোস্ট ব্যর্থ হয়েছে' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'সার্ভার এরর! ব্যাকএন্ড সচল আছে কি না দেখুন।' });
    } finally {
      setLoading(false);
    }
  };

  // Safe Delete Handler
  const handleDelete = async (targetItem) => {
    const targetId = targetItem._id || targetItem.id;
    if (!targetId) {
      alert("পোস্টটির ডেটাবেস ID পাওয়া যায়নি!");
      return;
    }

    const confirmDelete = window.confirm(`আপনি কি নিশ্চিতভাবে এই পোস্টটি মুছে ফেলতে চান?\n\n"${targetItem.title}"`);
    if (!confirmDelete) return;

    setDeletingId(targetId);
    setStatus({ type: '', text: '' });
    const token = localStorage.getItem('trainkoi_admin_token');

    try {
      const endpoint = manageType === 'news' ? `/api/news/${targetId}` : `/api/blogs/${targetId}`;
      const url = `${API_BASE_URL}${endpoint}`;
      console.log("Requesting DELETE URL:", url);

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setContentList(prev => prev.filter(item => (item._id || item.id) !== targetId));
        setStatus({ type: 'success', text: 'আইটেমটি সফলভাবে ডাটাবেস থেকে মুছে ফেলা হয়েছে!' });
      } else {
        if (res.status === 403 || res.status === 401) {
          localStorage.removeItem('trainkoi_admin_token');
          setIsLoggedIn(false);
          setStatus({ type: 'error', text: 'সেশন শেষ হয়ে গেছে! অনুগ্রহ করে পুনরায় লগইন করুন।' });
        } else if (res.status === 404) {
          setStatus({ type: 'error', text: 'পোস্টটি সার্ভারে খুঁজে পাওয়া যায়নি (404)! ব্যাকএন্ড রিস্টার্ট করা হয়েছে কি না চেক করুন।' });
        } else {
          setStatus({ type: 'error', text: data.error || 'মুছে ফেলা সম্ভব হয়নি!' });
        }
      }
    } catch (err) {
      console.error("Delete request error:", err);
      setStatus({ type: 'error', text: 'ডিলিট করতে সমস্যা হয়েছে! সার্ভার সংযোগ পরীক্ষা করুন।' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '30px 15px', fontFamily: "'Hind Siliguri', sans-serif" }}>
      <div style={{ maxWidth: '750px', margin: '0 auto', background: '#ffffff', borderRadius: '24px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ color: '#006a4e', margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
              <FileText size={24} color="#006a4e" /> TrainKoi Admin Hub
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
              {isLoggedIn ? 'রেল সংবাদ ও ব্লগ প্রকাশ ও ব্যবস্থাপনা কন্ট্রোল' : 'অ্যাডমিন নিরাপত্তা পোর্টাল'}
            </p>
          </div>
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 14px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              <LogOut size={16} /> লগআউট
            </button>
          )}
        </div>

        {/* Status Box */}
        {status.text && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: status.type === 'success' ? '#ecfdf5' : status.type === 'error' ? '#fef2f2' : '#f0f9ff',
            color: status.type === 'success' ? '#065f46' : status.type === 'error' ? '#b91c1c' : '#0369a1',
            border: `1px solid ${status.type === 'success' ? '#a7f3d0' : status.type === 'error' ? '#fecaca' : '#bae6fd'}`
          }}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.text}</span>
          </div>
        )}

        {/* Login Form */}
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} color="#006a4e" /> ইউজারনেম:
              </label>
              <input 
                type="text" 
                required
                placeholder="অ্যাডমিন ইউজারনেম দিন..."
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={16} color="#006a4e" /> পাসওয়ার্ড:
              </label>
              <input 
                type="password" 
                required
                placeholder="অ্যাডমিন পাসওয়ার্ড দিন..."
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: '14px', 
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontWeight: 'bold',
                fontSize: '15px'
              }}
            >
              {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
            </button>
          </form>
        ) : (
          <div>
            {/* Action Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
              <button
                type="button"
                onClick={() => { setActiveTab('create'); setStatus({ type: '', text: '' }); }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: activeTab === 'create' ? '#006a4e' : '#f8fafc',
                  color: activeTab === 'create' ? '#ffffff' : '#64748b',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <PlusCircle size={17} /> নতুন পোস্ট তৈরি
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('manage'); setStatus({ type: '', text: '' }); }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: activeTab === 'manage' ? '#006a4e' : '#f8fafc',
                  color: activeTab === 'manage' ? '#ffffff' : '#64748b',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ListFilter size={17} /> পোস্ট তালিকা ও ডিলিট
              </button>
            </div>

            {/* TAB 1: CREATE POST */}
            {activeTab === 'create' && (
              <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={16} color="#006a4e" /> কন্টেন্টের ধরণ নির্বাচন:
                  </label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#f8fafc', cursor: 'pointer' }}
                  >
                    <option value="news">Rail News (রেল সংবাদ ও লাইভ নোটিশ)</option>
                    <option value="blogs">Train Blog (ভ্রমণ গাইড ও আর্টিকেল)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'block' }}>
                    শিরোনাম (Headline):
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="পোস্টের আকর্ষণীয় শিরোনাম লিখুন..."
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'block' }}>
                    বিস্তারিত বিষয়বস্তু (Content):
                  </label>
                  <textarea 
                    rows="9" 
                    required
                    placeholder="এখানে বিস্তারিত তথ্য বা সংবাদ লিখুন..."
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', lineHeight: '1.7', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    padding: '14px', 
                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '12px', 
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={18} /> {loading ? 'আপলোড হচ্ছে...' : 'পাবলিশ করুন'}
                </button>
              </form>
            )}

            {/* TAB 2: MANAGE & DELETE POSTS */}
            {activeTab === 'manage' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setManageType('news')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: manageType === 'news' ? '#006a4e' : '#fff',
                        color: manageType === 'news' ? '#fff' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      রেল সংবাদ
                    </button>
                    <button
                      type="button"
                      onClick={() => setManageType('blogs')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: manageType === 'blogs' ? '#006a4e' : '#fff',
                        color: manageType === 'blogs' ? '#fff' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      ট্রেন ব্লগ
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={fetchManageList}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#006a4e',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12.5px',
                      fontWeight: '700'
                    }}
                  >
                    <RefreshCw size={14} style={{ animation: listLoading ? 'spin 1s linear infinite' : 'none' }} /> রিফ্রেশ
                  </button>
                </div>

                {listLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                    <p style={{ margin: 0, fontSize: '14px' }}>তালিকা লোড হচ্ছে...</p>
                  </div>
                ) : contentList.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {contentList.map((item) => {
                      const itemId = item._id || item.id;
                      return (
                        <div
                          key={itemId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px',
                            borderRadius: '14px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            gap: '12px'
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', color: '#0f172a', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px', color: '#94a3b8' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} />
                                {new Date(item.createdAt || Date.now()).toLocaleDateString('bn-BD')}
                              </span>
                              <span>ID: {itemId ? String(itemId).slice(-6) : 'N/A'}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === itemId}
                            title="পোস্টটি ডিলিট করুন"
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              borderRadius: '10px',
                              padding: '8px 12px',
                              color: '#dc2626',
                              cursor: deletingId === itemId ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              flexShrink: 0
                            }}
                          >
                            <Trash2 size={15} />
                            {deletingId === itemId ? 'মুছছে...' : 'ডিলিট'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 10px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>ডাটাবেসে কোনো {manageType === 'news' ? 'সংবাদ' : 'ব্লগ'} পাওয়া যায়নি।</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ContentUpload;