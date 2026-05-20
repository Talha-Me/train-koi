import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { trains } from '../data/trainData'; 
import { 
  ChevronLeft, Search, MessageCircle, Users, ArrowRight, 
  MessagesSquare, Train, Hash, Star, Radio
} from 'lucide-react';

const TrainChatList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // সার্চ লজিক: নাম বা আইডি দিয়ে ট্রেন খোঁজা
  const filteredChatRooms = useMemo(() => {
    return trains.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.id.toString().includes(searchTerm)
    );
  }, [searchTerm]);

  const handleJoinChat = (train) => {
    // প্রতিটি ট্রেনের জন্য আলাদা ডাইনামিক চ্যাটরুম ইউআরএল
    navigate(`/chat/${train.id}`, { state: { trainName: train.name } });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', 
        padding: '30px 20px', 
        color: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div 
            onClick={() => navigate(-1)} 
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
          >
            <ChevronLeft size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>ট্রেন চ্যাটরুম</h3>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>যাত্রীদের সাথে লাইভ আপডেট শেয়ার করুন</p>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '12px 18px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <Search size={20} color="#64748b" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="আপনার ট্রেনের নাম বা কোড লিখুন..." 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              color: '#1e293b', 
              width: '100%',
              fontSize: '15px' 
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ padding: '25px 20px' }}>
        
        {/* Status Indicators */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '10px' }}>
          <div style={{ backgroundColor: '#dcfce7', padding: '10px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Radio size={16} color="#166534" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#166534' }}>লাইভ ট্র্যাকিং চ্যাট</span>
          </div>
          <div style={{ backgroundColor: '#fef3c7', padding: '10px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Users size={16} color="#92400e" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#92400e' }}>সক্রিয় যাত্রী</span>
          </div>
        </div>

        {/* Train Chat List */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {filteredChatRooms.length > 0 ? filteredChatRooms.map((train) => (
            <div 
              key={train.id} 
              onClick={() => handleJoinChat(train)}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '22px', 
                padding: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                border: '1px solid #f1f5f9',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Icon Section */}
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#eff6ff', 
                borderRadius: '18px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#2563eb',
                position: 'relative',
                border: '1px solid #dbeafe'
              }}>
                <Train size={30} />
                <div style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  right: '-4px', 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: '#22c55e', 
                  borderRadius: '50%', 
                  border: '3px solid white' 
                }}></div>
              </div>

              {/* Text Information */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '17px', color: '#0f172a', fontWeight: '800' }}>{train.name}</h4>
                  <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', color: '#64748b', fontWeight: '600' }}>ID: {train.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MessageCircle size={14} color="#3b82f6" />
                    <span>মেসেজ করুন</span>
                  </div>
                </div>
              </div>

              {/* Action Icon */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '50%' }}>
                <ArrowRight size={18} color="#94a3b8" />
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
               <MessagesSquare size={50} color="#cbd5e1" style={{ marginBottom: '15px' }} />
               <p style={{ color: '#64748b', fontSize: '15px' }}>দুঃখিত, কোনো চ্যাটরুম পাওয়া যায়নি!</p>
            </div>
          )}
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        div:hover {
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default TrainChatList;