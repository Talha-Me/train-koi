import React from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { RefreshCw } from 'lucide-react';

const PullToRefreshLayout = ({ children }) => {
  const handleRefresh = async () => {
    // এটি পুরো উইন্ডো রিলোড করবে যা ক্রোমের মতো কাজ করে
    return new Promise((resolve) => {
      setTimeout(() => {
        window.location.reload();
        resolve();
      }, 1000);
    });
  };

  return (
    <PullToRefresh 
      onRefresh={handleRefresh}
      pullingContent={
        <div style={{ textAlign: 'center', padding: '10px', color: '#006a4e' }}>
          <RefreshCw size={24} className="animate-bounce" />
        </div>
      }
      refreshingContent={
        <div style={{ textAlign: 'center', padding: '10px', color: '#006a4e' }}>
          <RefreshCw size={24} className="animate-spin" />
        </div>
      }
    >
      {/* এখানে children মানে হলো আপনার অ্যাপের সব পেজ */}
      <div>
        {children}
      </div>
    </PullToRefresh>
  );
};

export default PullToRefreshLayout;