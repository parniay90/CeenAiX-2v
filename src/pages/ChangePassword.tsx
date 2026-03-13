import { useState } from 'react';
import { Lock, Eye, EyeOff, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { PatientLayout } from '../components/PatientLayout';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../Router';

export default function ChangePassword() {
  const { updatePassword, user } = useAuth();
  const { navigateToPatientPortal } = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
    { label: 'Contains number', met: /[0-9]/.test(newPassword) },
    { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!user) {
      setError('You must be logged in to change your password');
      return;
    }

    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(newPassword);
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigateToPatientPortal();
      }, 2000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout activeNav="profile">
      <div
        style={{
          minHeight: '100%',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          padding: '32px 24px',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Back Button */}
          <button
            onClick={() => navigateToPatientPortal()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              color: '#475569',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: 24,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#1A1A2E',
                marginBottom: 8,
              }}
            >
              Change Password
            </h1>
            <p style={{ fontSize: 15, color: '#64748B' }}>
              Update your password to keep your account secure
            </p>
          </div>

          <div style={{ display: 'grid', gap: 24 }}>
            {/* Password Change Form */}
            <div
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 32,
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lock size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>
                    Update Your Password
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748B' }}>
                    Choose a strong password to protect your account
                  </p>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    borderRadius: 12,
                    padding: '12px 16px',
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <AlertCircle size={18} color="#EF4444" />
                  <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>{error}</span>
                </div>
              )}

              {success && (
                <div
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: 12,
                    padding: '12px 16px',
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Check size={18} color="#22C55E" />
                  <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 500 }}>
                    Password updated successfully! Redirecting...
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: 20 }}>
                  {/* New Password */}
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#475569',
                        display: 'block',
                        marginBottom: 8,
                      }}
                    >
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 44px 12px 14px',
                          border: '1px solid #E2E8F0',
                          borderRadius: 10,
                          fontSize: 14,
                          color: '#1A1A2E',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#0D7377')}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94A3B8',
                          padding: 4,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#475569',
                        display: 'block',
                        marginBottom: 8,
                      }}
                    >
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 44px 12px 14px',
                          border: `1px solid ${
                            confirmPassword && !passwordsMatch ? '#FCA5A5' : '#E2E8F0'
                          }`,
                          borderRadius: 10,
                          fontSize: 14,
                          color: '#1A1A2E',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#0D7377')}
                        onBlur={(e) =>
                          (e.target.style.borderColor =
                            confirmPassword && !passwordsMatch ? '#FCA5A5' : '#E2E8F0')
                        }
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94A3B8',
                          padding: 4,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <p style={{ fontSize: 12, color: '#EF4444', marginTop: 6 }}>
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !allRequirementsMet || !passwordsMatch}
                    style={{
                      padding: '14px',
                      background:
                        loading || !allRequirementsMet || !passwordsMatch
                          ? '#CBD5E1'
                          : 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: loading || !allRequirementsMet || !passwordsMatch ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      marginTop: 8,
                    }}
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Requirements */}
            <div
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>
                Password Requirements
              </h4>
              <div style={{ display: 'grid', gap: 10 }}>
                {passwordRequirements.map((req, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: req.met ? '#22C55E' : '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      {req.met && <Check size={12} color="white" strokeWidth={3} />}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        color: req.met ? '#16A34A' : '#64748B',
                        fontWeight: req.met ? 600 : 500,
                        transition: 'all 0.2s',
                      }}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Tips */}
            <div
              style={{
                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #BFDBFE',
              }}
            >
              <h4
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#1E40AF',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Lock size={18} />
                Security Tips
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
                <li style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
                  Use a unique password that you don't use for other accounts
                </li>
                <li style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
                  Consider using a password manager to generate and store strong passwords
                </li>
                <li style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
                  Change your password regularly, especially if you suspect unauthorized access
                </li>
                <li style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
                  Never share your password with anyone, including CeenAiX staff
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
