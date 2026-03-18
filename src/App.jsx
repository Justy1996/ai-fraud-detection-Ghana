import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  Bell, 
  Database, 
  Cpu, 
  Brain,
  Eye,
  Lock,
  MessageSquare,
  BarChart3,
  Search,
  Settings,
  XCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GHANA_RED = '#d40000';
const GHANA_GOLD = '#fcd116';
const GHANA_GREEN = '#006b3f';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    total: 125432,
    fraud: 842,
    precision: 0.94,
    recall: 0.98
  });
  const [showAlert, setShowAlert] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);

  // Simulate real-time transaction ingestion
  useEffect(() => {
    const interval = setInterval(() => {
      const isFraud = Math.random() > 0.92;
      const newTx = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        time: new Date().toLocaleTimeString(),
        amount: (Math.random() * 5000).toFixed(2),
        type: ['TRANSFER', 'CASH-OUT', 'PAYMENT', 'DEBIT'][Math.floor(Math.random() * 4)],
        status: isFraud ? 'FRAUD' : 'LEGIT',
        confidence: (Math.random() * 0.4 + 0.6).toFixed(2)
      };

      setTransactions(prev => [newTx, ...prev].slice(0, 10));
      
      if (isFraud) {
        setActiveAlert(newTx);
        setShowAlert(true);
        setStats(s => ({ ...s, total: s.total + 1, fraud: s.fraud + 1 }));
      } else {
        setStats(s => ({ ...s, total: s.total + 1 }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1'],
    datasets: [
      {
        label: 'Fraud Attempts Detected',
        data: [120, 190, 150, 280, 220, 310, 290, 450, 380],
        borderColor: GHANA_GOLD,
        backgroundColor: 'rgba(252, 209, 22, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Prevented Losses (GHS)',
        data: [450, 620, 580, 890, 750, 1100, 950, 1400, 1200],
        borderColor: GHANA_GREEN,
        backgroundColor: 'rgba(0, 107, 63, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          AIFDS<span>-MM</span>
        </div>
        
        <nav className="nav-links">
          <div className="nav-item active"><Activity size={18} /> Dashboard</div>
          <div className="nav-item"><Database size={18} /> Transactions</div>
          <div className="nav-item"><BarChart3 size={18} /> Model Analytics</div>
          <div className="nav-item"><ShieldAlert size={18} /> Fraud Alerts</div>
          <div className="nav-item"><MessageSquare size={18} /> Compliance Reports</div>
          <div className="nav-item" style={{ marginTop: 'auto' }}><Settings size={18} /> System Settings</div>
        </nav>

        {/* Security Tip Box (Visual reference to "Think Before You Click") */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(252,209,22,0.05)', borderRadius: '12px', border: '1px dashed var(--color-gh-gold)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: 'var(--color-gh-gold)' }}>
            <Lock size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>SECURITY TIP</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
            Educate customers: "Never share your Mobile Money PIN with anyone."
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>National Monitoring Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Real-time Fraud Prevention for Ghana</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="card" style={{ padding: '8px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <CheckCircle2 color={GHANA_GREEN} size={20} />
              <span style={{ fontSize: '0.8rem' }}>SMOTE-XGBoost Active</span>
            </div>
            <Search color="#444" size={20} style={{ cursor: 'pointer' }} />
            <Bell color="#444" size={20} style={{ cursor: 'pointer' }} />
            <img src="https://flagcdn.com/w40/gh.png" alt="Ghana Flag" style={{ width: '24px', borderRadius: '4px' }} />
          </div>
        </header>

        {/* Top Stats */}
        <section className="stats-grid">
          <div className="card">
            <div className="card-title">TOTAL TRANSACTIONS (24H)</div>
            <div className="card-value">{stats.total.toLocaleString()}</div>
            <div className="card-trend trend-up"><TrendingUp size={12} /> +12.5% from avg</div>
          </div>
          <div className="card" style={{ borderLeft: `4px solid ${GHANA_RED}` }}>
            <div className="card-title">FRAUD BLOCKED</div>
            <div className="card-value" style={{ color: GHANA_RED }}>{stats.fraud}</div>
            <div className="card-trend">Est. Saving: GHS 1.2M</div>
          </div>
          <div className="card">
            <div className="card-title">MODEL PRECISION</div>
            <div className="card-value" style={{ color: GHANA_GREEN }}>{(stats.precision * 100).toFixed(1)}%</div>
            <div className="card-trend">Bank of Ghana Standard: 90%</div>
          </div>
          <div className="card">
            <div className="card-title">RECALL (DETECTION RATE)</div>
            <div className="card-value" style={{ color: GHANA_GOLD }}>{(stats.recall * 100).toFixed(1)}%</div>
            <div className="card-trend">Target: 98%</div>
          </div>
        </section>

        {/* Middle Visuals */}
        <section className="live-feed-section">
          <div className="live-feed">
            <div className="feed-header">
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color={GHANA_GOLD} /> LIVE TRANSACTION INGESTION
              </h3>
              <span style={{ color: GHANA_GREEN, fontSize: '0.8rem', fontWeight: 700 }}>Latency: 42ms</span>
            </div>
            
            <div className="transaction-list">
              <AnimatePresence mode="popLayout">
                {transactions.map(tx => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={tx.id} 
                    className="tx-item"
                    style={{ borderLeft: `3px solid ${tx.status === 'FRAUD' ? GHANA_RED : GHANA_GREEN}` }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>TX-{tx.id}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tx.type} • {tx.time}</div>
                    </div>
                    <div style={{ fontWeight: 800 }}>GHS {tx.amount}</div>
                    <div className={`status-indicator ${tx.status === 'FRAUD' ? 'status-fraud' : 'status-legit'}`}>
                      {tx.status}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="card ai-engine-viz">
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>AI CORE ENGINE</h3>
            <div className="brain-pulse">
              <Brain size={60} color={GHANA_GOLD} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700 }}>XGBoost SMOTE Engine</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Analyzing 42 features/sec</div>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderTop: '1px solid #222', paddingTop: '1rem' }}>
              <span>CPU: 12%</span>
              <span>MEM: 1.4GB</span>
              <span>TPS: 852</span>
            </div>
          </div>
        </section>

        {/* Bottom Charts */}
        <section style={{ marginTop: '2rem' }} className="card">
          <h3 style={{ margin: '0 0 1.5rem 0' }}>Historical Fraud Trends (2023 - 2025)</h3>
          <div style={{ height: '300px' }}>
            <Line 
              data={chartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: { grid: { color: '#222' }, ticks: { color: '#666' } },
                  x: { grid: { display: false }, ticks: { color: '#666' } }
                },
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#aaa', boxWidth: 10 } }
                }
              }} 
            />
          </div>
        </section>
      </main>

      {/* Fraud Alert Modal - Visual reference to "Payment Was Denied" */}
      <AnimatePresence>
        {showAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999 }}
            onClick={() => setShowAlert(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="alert-modal"
              onClick={e => e.stopPropagation()}
            >
              <div className="alert-icon">
                <AlertTriangle size={64} />
              </div>
              <div className="alert-title">FRAUD DETECTED</div>
              <div className="alert-subtitle">Transaction <strong>TX-{activeAlert?.id}</strong> has been automatically blocked.</div>
              
              <div style={{ background: '#1a1212', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>REASON (TOP FEATURES):</div>
                <div style={{ color: GHANA_RED, fontSize: '0.9rem', marginTop: '4px' }}>
                  • Unusual Frequency (+400%)<br/>
                  • High Balance Delta<br/>
                  • Phishing Pattern Match
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => setShowAlert(false)}>ACKNOWLEDGE</button>
                <button className="btn btn-danger">INVESTIGATE</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Seal_of_the_President_of_the_Republic_of_Ghana.svg" alt="Seal" className="ghana-seal" />
    </div>
  );
};

export default App;
