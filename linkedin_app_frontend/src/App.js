import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import './index.css';
import './App.css';

/**
 * Simple in-memory auth context to simulate login/logout.
 * Replace with real API integration later.
 */
const AuthContext = React.createContext({ user: null, login: () => {}, logout: () => {} });

function useAuth() {
  const ctx = React.useContext(AuthContext);
  return ctx;
}

// PUBLIC_INTERFACE
export function AppProviders({ children }) {
  /** Wraps the application with providers like AuthContext. */
  const [user, setUser] = useState(null);
  const login = (email) => setUser({ id: 'u1', name: 'Alex Johnson', email });
  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ---------- Shared UI ---------- */

function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="topnav">
      <div className="container topnav-inner">
        <div className="brand" role="button" onClick={() => navigate('/')}>
          <span style={{display: 'inline-flex', width: 28, height: 28, borderRadius: 6, background: 'var(--color-primary)'}} />
          ProConnect
        </div>
        <div style={{flex: 1}}>
          <input className="input" placeholder="Search for jobs, people, posts..." aria-label="Global search" />
        </div>
        <div className="nav-actions">
          <NavLink to="/" className={({ isActive }) => `btn-secondary ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/jobs" className={({ isActive }) => `btn-secondary ${isActive ? 'active' : ''}`}>Jobs</NavLink>
          <NavLink to="/messaging" className={({ isActive }) => `btn-secondary ${isActive ? 'active' : ''}`}>Messaging</NavLink>
          <NavLink to="/notifications" className={({ isActive }) => `btn-secondary ${isActive ? 'active' : ''}`}>Notifications</NavLink>
          {user ? (
            <button className="btn" onClick={logout} aria-label="Log out">Logout</button>
          ) : (
            <NavLink to="/login" className="btn">Sign in</NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

function LeftSidebar() {
  const { user } = useAuth();
  return (
    <aside className="left-sidebar">
      <div className="card sidebar">
        <div className="nav-item" style={{gap:12}}>
          <div className="avatar">{user ? user.name[0] : 'P'}</div>
          <div>
            <div style={{fontWeight:700}}>{user ? user.name : 'ProConnect'}</div>
            <div style={{color:'var(--color-text-muted)', fontSize: 12}}>{user ? user.email : 'Your network hub'}</div>
          </div>
        </div>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Feed</NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Profile</NavLink>
        <NavLink to="/jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Jobs</NavLink>
        <NavLink to="/messaging" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Messaging</NavLink>
        <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Notifications</NavLink>
      </div>
    </aside>
  );
}

function RightSidebar() {
  return (
    <aside className="right-sidebar">
      <div className="card section">
        <h3 className="header-title">Who to follow</h3>
        <div className="nav-item">
          <div className="avatar">AJ</div>
          <div>
            <div style={{fontWeight:600}}>Alex Johnson</div>
            <div style={{color:'var(--color-text-muted)', fontSize: 12}}>Software Engineer</div>
          </div>
          <div style={{marginLeft:'auto'}}><button className="btn">Connect</button></div>
        </div>
        <div className="nav-item">
          <div className="avatar">MS</div>
          <div>
            <div style={{fontWeight:600}}>Maya Singh</div>
            <div style={{color:'var(--color-text-muted)', fontSize: 12}}>Product Manager</div>
          </div>
          <div style={{marginLeft:'auto'}}><button className="btn">Connect</button></div>
        </div>
      </div>
      <div className="card section">
        <h3 className="header-title">Trending</h3>
        <div className="nav-item">AI roles surge across industries</div>
        <div className="nav-item">Frontend performance best practices</div>
        <div className="nav-item">Hiring freezes easing in Q4</div>
      </div>
    </aside>
  );
}

function Layout({ children }) {
  return (
    <>
      <TopNav />
      <main className="app-shell">
        <LeftSidebar />
        <section>{children}</section>
        <RightSidebar />
      </main>
    </>
  );
}

/* ---------- Pages ---------- */

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function FeedPage() {
  return (
    <div className="page">
      <div className="card post-composer">
        <div className="avatar">AJ</div>
        <div>
          <input className="input" placeholder="Start a post" />
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button className="btn-secondary">Photo</button>
            <button className="btn-secondary">Video</button>
            <button className="btn-secondary">Event</button>
            <button className="btn">Post</button>
          </div>
        </div>
      </div>

      {[1,2,3].map(i => (
        <div key={i} className="card post">
          <div className="post-header">
            <div className="avatar">MS</div>
            <div>
              <div style={{fontWeight:700}}>Maya Singh</div>
              <div style={{color:'var(--color-text-muted)', fontSize: 12}}>1h • Product at Nova Labs</div>
            </div>
          </div>
          <div className="post-body">
            Sharing insights on building resilient product roadmaps. Here are three tips that helped our team...
          </div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button className="btn-secondary">Like</button>
            <button className="btn-secondary">Comment</button>
            <button className="btn-secondary">Share</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="page">
      <div className="card section" style={{display:'grid', gridTemplateColumns:'80px 1fr auto', gap:16}}>
        <div className="avatar" style={{width:64, height:64, fontSize:20}}>AJ</div>
        <div>
          <h2 className="header-title" style={{marginBottom:4}}>Alex Johnson</h2>
          <div style={{color:'var(--color-text-muted)'}}>Software Engineer • San Francisco Bay Area</div>
        </div>
        <div><button className="btn">Open to</button></div>
      </div>
      <div className="card section">
        <h3 className="header-title">About</h3>
        <p>Engineer passionate about building delightful user experiences and scalable systems.</p>
      </div>
      <div className="card section">
        <h3 className="header-title">Experience</h3>
        <div className="nav-item" style={{paddingLeft:0}}>
          <div className="avatar" style={{width:40, height:40}}>N</div>
          <div>
            <div style={{fontWeight:600}}>Senior Frontend Engineer</div>
            <div className="job-company">Nova Labs • 2022 — Present</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobsPage() {
  const jobs = [
    { id: 1, title: 'Frontend Engineer', company: 'Acme Corp', location: 'Remote', posted: '2d' },
    { id: 2, title: 'Product Designer', company: 'Designify', location: 'NYC', posted: '1d' },
    { id: 3, title: 'Data Scientist', company: 'Insight AI', location: 'Remote', posted: '5d' },
  ];
  return (
    <div className="page card section">
      <h2 className="header-title">Jobs For You</h2>
      {jobs.map(job => (
        <div key={job.id} className="job-item">
          <div className="avatar">J</div>
          <div>
            <div style={{fontWeight:700}}>{job.title}</div>
            <div className="job-company">{job.company} • {job.location}</div>
          </div>
          <div style={{color:'var(--color-text-muted)'}}>{job.posted}</div>
        </div>
      ))}
    </div>
  );
}

function MessagingPage() {
  const threads = [
    { id: 1, from: 'Priya Patel', last: 'Let’s catch up tomorrow!', time: '10:20' },
    { id: 2, from: 'Leo Wang', last: 'Sent the doc. Thoughts?', time: 'Yesterday' },
  ];
  return (
    <div className="page">
      <div className="card section">
        <h2 className="header-title">Messages</h2>
        {threads.map(t => (
          <div key={t.id} className="thread-item">
            <div className="avatar">{t.from.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
            <div>
              <div style={{fontWeight:600}}>{t.from}</div>
              <div style={{color:'var(--color-text-muted)'}}>{t.last}</div>
            </div>
            <div style={{color:'var(--color-text-muted)'}}>{t.time}</div>
          </div>
        ))}
      </div>
      <div className="card section">
        <div className="msg-bubble">Hey there! This is a sample conversation bubble.</div>
      </div>
    </div>
  );
}

function NotificationsPage() {
  const notifications = [
    { id: 1, who: 'Maya Singh', what: 'liked your post', when: '5m' },
    { id: 2, who: 'Acme Corp', what: 'viewed your profile', when: '1h' },
  ];
  return (
    <div className="page card section">
      <h2 className="header-title">Notifications</h2>
      {notifications.map(n => (
        <div key={n.id} className="notification-item">
          <div className="avatar">{n.who.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
          <div>
            <span style={{fontWeight:600}}>{n.who}</span> {n.what}
          </div>
          <div style={{color:'var(--color-text-muted)'}}>{n.when}</div>
        </div>
      ))}
    </div>
  );
}

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  if (user) return <Navigate to="/" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    login(email || 'user@example.com');
    navigate('/');
  }

  return (
    <div className="auth-card card">
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Sign in to continue to ProConnect</p>
      <form onSubmit={handleSubmit}>
        <div style={{display:'grid', gap:10}}>
          <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={pwd} onChange={e=>setPwd(e.target.value)} required />
          <button className="btn" type="submit">Sign in</button>
        </div>
      </form>
      <div style={{marginTop:12, fontSize:14}}>
        New here? <NavLink to="/signup">Create an account</NavLink>
      </div>
    </div>
  );
}

function SignupPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  if (user) return <Navigate to="/" replace />;
  function handleSubmit(e) {
    e.preventDefault();
    login(email || 'user@example.com');
    navigate('/profile');
  }
  return (
    <div className="auth-card card">
      <h2 className="auth-title">Create your account</h2>
      <p className="auth-subtitle">Join your professional community</p>
      <form onSubmit={handleSubmit}>
        <div style={{display:'grid', gap:10}}>
          <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <button className="btn" type="submit">Create account</button>
        </div>
      </form>
    </div>
  );
}

/* ---------- App Root ---------- */

// PUBLIC_INTERFACE
function App() {
  /** Application root: provides router, layout shell, and routes. */
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route element={<Layout><FeedPage /></Layout>} path="/" />
          <Route element={<Layout><ProfilePage /></Layout>} path="/profile" />
          <Route element={<Layout><JobsPage /></Layout>} path="/jobs" />
          <Route element={<Layout><MessagingPage /></Layout>} path="/messaging" />
          <Route element={<Layout><NotificationsPage /></Layout>} path="/notifications" />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <Layout><div className="card section">Protected content</div></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
