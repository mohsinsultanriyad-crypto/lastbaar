
import React, { useState, useEffect, useRef } from 'react';
import { User, Shift, Leave, SitePost, AdvanceRequest, Announcement } from './types';
import { MOCK_WORKERS, MOCK_ADMIN } from './constants';
import WorkerApp from './components/WorkerApp';
import AdminApp from './components/AdminApp';
import Login from './components/Login';
import { Language } from './translations';
import { db } from './db';
import { Loader2, Cloud } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const didRestoreSession = useRef(false); // Prevent infinite restore
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [posts, setPosts] = useState<SitePost[]>([]);
  const [workers, setWorkers] = useState<User[]>(MOCK_WORKERS);
  const [advanceRequests, setAdvanceRequests] = useState<AdvanceRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

    // Manual refresh handler
    const onManualRefresh = async () => {
      setIsSyncing(true);
      await refreshCloudData();
      setIsSyncing(false);
    };

  // Reusable function to fetch all cloud data and update state
  const refreshCloudData = async () => {
    try {
      const [dbShifts, dbLeaves, dbPosts, dbWorkers, dbAdvances, dbAnnounce] = await Promise.all([
        db.getAll('shifts'),
        db.getAll('leaves'),
        db.getAll('posts'),
        db.getAll('workers'),
        db.getAll('advanceRequests'),
        db.getAll('announcements'),
      ]);
      setShifts(dbShifts);
      setLeaves(dbLeaves);
      setPosts(dbPosts);
      setWorkers(dbWorkers);
      setAdvanceRequests(dbAdvances);
      setAnnouncements(dbAnnounce);
    } catch (e) {
      console.error("Cloud fetch failed", e);
    }
  };

  // 1. Initial Data Fetch from MongoDB + Session Restoration
  useEffect(() => {
    const initData = async () => {
      let didTimeout = false;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          didTimeout = true;
          reject(new Error('Cloud fetch timeout'));
        }, 12000);
      });
      try {
        await Promise.race([
          (async () => {
            await refreshCloudData();
            // Language Persistence
            const savedLang = localStorage.getItem('fw_lang');
            if (savedLang) setLanguage(savedLang as Language);
          })(),
          timeoutPromise
        ]);
      } catch (e) {
        console.error("Cloud fetch failed or timed out", e);
        // Clear invalid session keys and force login
        localStorage.removeItem('fw_session_id');
        localStorage.removeItem('fw_session_role');
        localStorage.removeItem('token');
        setCurrentUser(null);
      } finally {
        setIsLoaded(true);
      }
    };
    initData();
  }, []);

  // 1b. Restore session from localStorage after data is loaded
  useEffect(() => {
    if (!isLoaded || didRestoreSession.current) return;
    didRestoreSession.current = true;
    const sessionUserId = localStorage.getItem('fw_session_id');
    const sessionRole = localStorage.getItem('fw_session_role');
    if (sessionUserId && sessionRole) {
      if (sessionRole === 'admin' && sessionUserId === MOCK_ADMIN.email) {
        setCurrentUser({ ...MOCK_ADMIN, role: 'admin' });
      } else if (sessionRole === 'worker') {
        // Only restore from cloud workers
        const allWorkers = workers;
        const foundUser = allWorkers.find(w => w.id === sessionUserId || w.workerId === sessionUserId);
        if (foundUser) {
          setCurrentUser({ ...foundUser, role: 'worker' });
        }
      }
    }
    // If no session, currentUser remains null (login shown)
  }, [isLoaded, workers]);

  // 2. State-to-MongoDB Sync Wrappers

  const updateShifts: React.Dispatch<React.SetStateAction<Shift[]>> = (val) => {
    setShifts(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      setIsSyncing(true);
      db.saveBatch('shifts', next)
        .then(refreshCloudData)
        .finally(() => setIsSyncing(false));
      return next;
    });
  };

  const updateLeaves: React.Dispatch<React.SetStateAction<Leave[]>> = (val) => {
    setLeaves(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      setIsSyncing(true);
      db.saveBatch('leaves', next)
        .then(refreshCloudData)
        .finally(() => setIsSyncing(false));
      return next;
    });
  };

  const updateWorkers: React.Dispatch<React.SetStateAction<User[]>> = (val) => {
    setWorkers(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      setIsSyncing(true);
      db.saveBatch('workers', next)
        .then(refreshCloudData)
        .finally(() => setIsSyncing(false));
      return next;
    });
  };

  const updatePosts: React.Dispatch<React.SetStateAction<SitePost[]>> = (val) => {
    setPosts(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      setIsSyncing(true);
      db.saveBatch('posts', next)
        .then(refreshCloudData)
        .finally(() => setIsSyncing(false));
      return next;
    });
  };

  const updateAdvanceRequests: React.Dispatch<React.SetStateAction<AdvanceRequest[]>> = (val) => {
    setAdvanceRequests(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      setIsSyncing(true);
      db.saveBatch('advanceRequests', next)
        .then(refreshCloudData)
        .finally(() => setIsSyncing(false));
      return next;
    });
  };

  const updateAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>> = (val) => {
    setAnnouncements(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      setIsSyncing(true);
      db.saveBatch('announcements', next)
        .then(refreshCloudData)
        .finally(() => setIsSyncing(false));
      return next;
    });
  };

  const handleLogin = (user: User) => {
    // Save minimal session info to localStorage for refresh persistence
    localStorage.setItem('fw_session_id', user.role === 'admin' ? (user.email || '') : (user.workerId || user.id));
    localStorage.setItem('fw_session_role', user.role);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    // Clear session info
    localStorage.removeItem('fw_session_id');
    localStorage.removeItem('fw_session_role');
    localStorage.removeItem('token'); // If token is used
    setCurrentUser(null);
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('fw_lang', lang);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Cloud Data...</p>
      </div>
    );
  }

  // Show loader while data is loading or session is restoring
  if (!isLoaded || (currentUser === null && (localStorage.getItem('fw_session_id') && localStorage.getItem('fw_session_role')))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} workers={workers} />;
  }

  return (
    <div 
      className={`min-h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden flex flex-col`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Cloud Sync Status Overlay with Refresh button */}
      <div className="fixed top-4 right-4 z-[200]">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all duration-500 shadow-sm ${isSyncing ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-green-100 text-green-600'}`}> 
            <Cloud size={10} className={isSyncing ? 'animate-bounce' : ''} />
            {isSyncing ? 'Syncing...' : 'MongoDB Live'}
          </div>
          <button
            onClick={onManualRefresh}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSyncing}
          >
            Refresh
          </button>
        </div>
      </div>

      {currentUser.role === 'admin' ? (
        <AdminApp 
          user={currentUser} 
          shifts={shifts} 
          setShifts={updateShifts} 
          leaves={leaves} 
          setLeaves={updateLeaves}
          workers={workers}
          setWorkers={updateWorkers}
          posts={posts}
          setPosts={updatePosts}
          advanceRequests={advanceRequests}
          setAdvanceRequests={updateAdvanceRequests}
          announcements={announcements}
          setAnnouncements={updateAnnouncements}
          onLogout={handleLogout}
          language={language}
          setLanguage={handleSetLanguage}
            onRefresh={onManualRefresh}
            isSyncing={isSyncing}
        />
      ) : (
        <WorkerApp 
          user={currentUser} 
          shifts={shifts} 
          setShifts={updateShifts} 
          leaves={leaves} 
          setLeaves={updateLeaves}
          posts={posts}
          setPosts={updatePosts}
          advanceRequests={advanceRequests}
          setAdvanceRequests={updateAdvanceRequests}
          announcements={announcements}
          workers={workers}
          onLogout={handleLogout}
          language={language}
          setLanguage={handleSetLanguage}
            onRefresh={onManualRefresh}
            isSyncing={isSyncing}
        />
      )}
    </div>
  );
};

export default App;
