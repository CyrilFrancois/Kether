import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import { User, Shield, Trash2, Save, Loader2 } from 'lucide-react';

const Settings = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token); // We need the token for the API call
  const setUser = useAuthStore((state) => state.setUser); // To update the UI after saving
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || user?.fullName || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  // --- ACTION: SAVE PROFILE ---
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ full_name: formData.full_name })
      });

      if (response.ok) {
        const updatedUser = await response.ok ? { ...user, full_name: formData.full_name } : user;
        // Update the global store so the Header name changes instantly
        setUser(updatedUser);
        alert("Identity profile updated in Kether core.");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION: DELETE ACCOUNT ---
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("CRITICAL: This will permanently delete your agents and data. Proceed?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Log out locally to clear storage and redirect to Login page
        logout();
      } else {
        alert("Authorization failed. Could not delete account.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h2>Account Settings</h2>
        <p>Manage your identity and security preferences.</p>
      </header>

      <section className="settings-section">
        <h3><User size={18} /> Public Profile</h3>
        <div className="input-field">
          <label>Full Name</label>
          <input 
            value={formData.full_name} 
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            placeholder="Your Name"
          />
        </div>
        <div className="input-field">
          <label>Email Address</label>
          <input value={formData.email} disabled className="disabled" />
          <span className="hint">Email cannot be changed currently.</span>
        </div>
        <button className="btn-save" onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
          Save Changes
        </button>
      </section>

      <section className="settings-section danger-zone">
        <h3><Shield size={18} /> Danger Zone</h3>
        <p>Deleting your account is permanent and will wipe all associated data.</p>
        <button className="btn-delete" onClick={handleDeleteAccount} disabled={loading}>
          <Trash2 size={16}/> Delete Account
        </button>
      </section>

      <style jsx>{`
        .settings-container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .settings-header { margin-bottom: 40px; }
        .settings-header h2 { font-size: 24px; color: #fff; margin: 0; }
        .settings-header p { color: #8b949e; margin-top: 8px; }
        
        .settings-section { 
          background: #161b22; border: 1px solid #30363d; 
          border-radius: 8px; padding: 24px; margin-bottom: 24px; 
        }
        .settings-section h3 { 
          display: flex; align-items: center; gap: 10px; margin-top: 0; 
          color: #fff; border-bottom: 1px solid #30363d; padding-bottom: 12px; font-size: 16px;
        }
        
        .input-field { margin: 20px 0; display: flex; flex-direction: column; gap: 8px; }
        .input-field label { font-size: 14px; font-weight: 600; color: #c9d1d9; }
        .input-field input { background: #0d1117; border: 1px solid #30363d; padding: 10px; border-radius: 6px; color: #fff; outline: none; }
        .input-field input:focus { border-color: #238636; }
        .input-field input.disabled { color: #484f58; cursor: not-allowed; }
        .hint { font-size: 12px; color: #8b949e; }

        .btn-save { 
          background: #238636; color: white; border: none; padding: 10px 20px; 
          border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; 
          font-weight: 600; transition: 0.2s;
        }
        .btn-save:hover { background: #2ea043; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .danger-zone { border-color: #f8514933; }
        .danger-zone h3 { color: #f85149; }
        .btn-delete { 
          background: none; border: 1px solid #f85149; color: #f85149; 
          padding: 10px 20px; border-radius: 6px; cursor: pointer; 
          display: flex; align-items: center; gap: 8px; font-weight: 600; transition: 0.2s;
        }
        .btn-delete:hover { background: #f85149; color: white; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Settings;