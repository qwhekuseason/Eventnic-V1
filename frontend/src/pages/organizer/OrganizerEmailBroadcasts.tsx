import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function OrganizerEmailBroadcasts() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all_attendees');
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<null | 'success'>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      setSentStatus('success');
      setSubject('');
      setMessage('');
      setTimeout(() => setSentStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-[100px] pb-xl px-margin">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <Link to="/dashboard" className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <h1 className="font-display text-[36px] text-on-surface leading-tight">Email Broadcasts</h1>
            </div>
            <p className="text-secondary font-body-lg">Send updates, announcements, or reminders to your attendees.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-lg md:p-xl">
              {sentStatus === 'success' && (
                <div className="mb-lg p-md bg-green-50 text-green-800 rounded-xl border border-green-200 flex items-center gap-sm">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  <span className="font-bold">Broadcast sent successfully!</span>
                </div>
              )}

              <form onSubmit={handleSend} className="space-y-lg">
                <div>
                  <label className="block text-on-surface font-bold font-label-md mb-xs">Target Audience</label>
                  <select 
                    value={targetAudience} 
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="all_attendees">All Registered Attendees</option>
                    <option value="vip_only">VIP Ticket Holders Only</option>
                    <option value="general_only">General Admission Only</option>
                    <option value="checked_in">Checked-In Attendees</option>
                    <option value="not_checked_in">Not Yet Checked-In</option>
                  </select>
                </div>

                <div>
                  <label className="block text-on-surface font-bold font-label-md mb-xs">Subject Line</label>
                  <input 
                    type="text" 
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Important update about tomorrow's event!"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-bold font-label-md mb-xs">Message</label>
                  <textarea 
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[200px]"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-sm border-t border-outline-variant">
                  <button 
                    type="submit" 
                    disabled={isSending}
                    className="bg-primary text-white font-bold px-xl py-md rounded-full shadow-md hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                         <span className="material-symbols-outlined animate-spin">refresh</span>
                         Sending...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">send</span>
                        Send Broadcast
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-lg">
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-lg shadow-sm">
              <h3 className="font-bold text-lg mb-sm flex items-center gap-xs">
                <span className="material-symbols-outlined">lightbulb</span> Quick Tips
              </h3>
              <ul className="space-y-sm text-sm">
                <li className="flex gap-xs"><span className="material-symbols-outlined text-[16px] mt-[2px]">check</span> Keep subject lines short and engaging.</li>
                <li className="flex gap-xs"><span className="material-symbols-outlined text-[16px] mt-[2px]">check</span> Include clear call-to-actions.</li>
                <li className="flex gap-xs"><span className="material-symbols-outlined text-[16px] mt-[2px]">check</span> Double-check event dates and times.</li>
              </ul>
            </div>

            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-lg">
              <h3 className="font-bold text-on-surface mb-md">Recent Broadcasts</h3>
              <div className="space-y-md">
                <div className="border-b border-outline-variant pb-md last:border-0 last:pb-0">
                  <div className="font-bold text-sm text-on-surface">Welcome to the event!</div>
                  <div className="text-secondary text-xs mt-1">Sent to: All Attendees • 2 days ago</div>
                </div>
                <div className="border-b border-outline-variant pb-md last:border-0 last:pb-0">
                  <div className="font-bold text-sm text-on-surface">Parking instructions updated</div>
                  <div className="text-secondary text-xs mt-1">Sent to: VIP Only • 1 week ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
