'use client';
import { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import SearchAndLeaderboard from './SearchAndLeaderboard';
import { saveProfile } from './utils/profileStorage';
import { SecurityManager } from './utils/security';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "FLOBBI",
    title: "MemeCoin on Solana",
    handle: "FlobbiMeme",
    avatarUrl: "/backgroundflobbi.ico",
    status: "Building the future of memes"
  });

  // Clear all saved data on mount - run only once
  useEffect(() => {
    const hasCleared = sessionStorage.getItem('dataCleared');
    if (!hasCleared) {
      localStorage.removeItem('profileData');
      localStorage.removeItem('profileSearchCounts');
      localStorage.removeItem('userProfiles');
      localStorage.removeItem('savedAvatars');
      localStorage.removeItem('profileSettings');
      sessionStorage.setItem('dataCleared', 'true');
    }
  }, []);

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize security
    if (typeof window !== 'undefined') {
      SecurityManager.getInstance();

      // Load saved profile data
      try {
        const savedProfileData = localStorage.getItem('currentProfileData');
        if (savedProfileData) {
          const parsed = JSON.parse(savedProfileData);
          setProfileData(parsed);
        }
      } catch (error) {
        console.warn('Failed to load saved profile data:', error);
      }
    }
  }, []);

  const handleProfileSelect = (profile: any) => {
    setProfileData({
      name: profile.name,
      title: profile.title,
      handle: profile.handle,
      status: profile.status || "Online",
      avatarUrl: profile.avatarUrl
    });
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    const newProfileData = {
      name: updatedProfile.name,
      title: updatedProfile.title,
      handle: updatedProfile.handle,
      status: updatedProfile.status || "Online",
      avatarUrl: updatedProfile.avatarUrl
    };

    setProfileData(newProfileData);

    try {
      // Get existing profiles to preserve search count
      const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
      const existingProfile = profiles.find((p: any) => p.handle === updatedProfile.handle);

      saveProfile({
        name: updatedProfile.name,
        title: updatedProfile.title,
        handle: updatedProfile.handle,
        avatarUrl: updatedProfile.avatarUrl,
        status: updatedProfile.status || "Online",
        searchCount: existingProfile ? existingProfile.searchCount : 0
      });

      // Also save the current profile data separately
      localStorage.setItem('currentProfileData', JSON.stringify(newProfileData));
    } catch (error) {
      console.warn('Failed to save profile:', error);
    }
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <main style={{ 
            background: '#000000',
            width: '100%',
            minHeight: '100vh',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '40px 20px',
            boxSizing: 'border-box'
          }}>

      {/* Large Background Monad Logo */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        opacity: 0.05, // Increased opacity for better visibility
        pointerEvents: 'none'
      }}>
        <img 
          src="/backgroundflobbi.ico" 
          alt="Background Flobbi Logo" 
          style={{
            width: '70vmin', // Slightly smaller for better balance
            height: '70vmin',
            objectFit: 'contain',
            filter: 'blur(1px)' // Reduced blur for clearer image
          }}
        />
      </div>

      {/* Search and Leaderboard - Fixed positioning */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000 
      }}>
        <SearchAndLeaderboard onProfileSelect={handleProfileSelect} />
      </div>

      {/* Floating Monad Logo - Centered above content */}
      <div style={{ 
        zIndex: 50,
        pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite, glow 4s ease-in-out infinite alternate',
        marginBottom: '30px'
      }}>
        <img 
          src="/floatingflobbi.ico" 
          alt="Flobbi Logo" 
          style={{
            width: '90px', // Slightly larger for better presence
            height: '90px',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
            borderRadius: '50%', // Added rounded effect
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)' // Enhanced glow
          }}
        />
      </div>

      {/* Main Heading - Centered */}
      <div style={{
        textAlign: 'center',
        zIndex: 49,
        width: '100%',
        maxWidth: '900px',
        marginBottom: '40px'
      }}>
        <h1 style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 4s ease-in-out infinite',
          textShadow: 'none', // Remove conflicting shadow
          lineHeight: '1.1',
          margin: 0,
          padding: 0,
          fontSize: 'clamp(1.8rem, 6vw, 3.2rem)', // Better scaling
          fontWeight: '900', // Bolder weight
          marginBottom: '1rem',
          letterSpacing: '0.08em',
          filter: 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.4))' // Better glow effect
        }}>
          FLOBBI PROFILE CARD
        </h1>
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          color: 'rgba(255, 255, 255, 0.7)',
          margin: 0,
          lineHeight: '1.4',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Create and customize your unique Flobbi profile card with holographic effects
        </p>
      </div>

      {/* Main Content - Centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
        zIndex: 10
      }}>
        <ProfileCard
          avatarUrl={profileData.avatarUrl}
          name={profileData.name}
          title={profileData.title}
          handle={profileData.handle}
          status={profileData.status}
          onProfileUpdate={handleProfileUpdate}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onContactClick={() => {
            window.open(`https://x.com/${profileData.handle}`, '_blank');
          }}
        />
      </div>
    </main>
  );
}