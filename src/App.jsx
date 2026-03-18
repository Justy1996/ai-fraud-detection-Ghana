import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  Bell, 
  Database, 
  Brain,
  Eye,
  Lock,
  MessageSquare,
  BarChart3,
  Search,
  Settings,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileDown,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap
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

const GHANA_RED = '#D32F2F';
const GHANA_GOLD = '#FFD700';
const GHANA_GREEN = '#006B3F';

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
  const [toasts, setToasts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Toast Helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Simulate real-time transaction ingestion
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRefreshing) return;
      
      const isFraud = Math.random() > 0.94;
      const newTx = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        time: new Date().toLocaleTimeString(),
        amount: (Math.random() * 5000 + 50).toFixed(2),
        type: ['TRANSFER', 'CASH-OUT', 'PAYMENT', 'DEBIT'][Math.floor(Math.random() * 4)],
        status: isFraud ? 'FRAUD' : 'LEGIT',
        confidence: (Math.random() * 0.4 + 0.6).toFixed(2),
        isBlocked: false,
        isApproved: false
      };

      setTransactions(prev => [newTx, ...prev].slice(0, 10));
      
      if (isFraud) {
        setActiveAlert(newTx);
        setShowAlert(true);
        setStats(s => ({ ...s, total: s.total + 1, fraud: s.fraud + 1 }));
      } else {
        setStats(s => ({ ...s, total: s.total + 1 }));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isRefreshing]);

  // Handlers
  const handleBlock = (txId) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === txId ? { ...tx, isBlocked: true, status: 'BLOCKED' } : tx
    ));
    addToast(`Transaction ${txId} blocked successfully – Fraud score: 0.98`, 'danger');
    setShowAlert(false);
  };

  const handleApprove = (txId) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === txId ? { ...tx, isApproved: true, status: 'LEGIT' } : tx
    ));
    addToast(`Transaction ${txId} approved – Legitimate`, 'success');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    addToast('Refreshing dashboard data...', 'info');
    setTimeout(() => {
      setTransactions([]);
      setIsRefreshing(false);
      addToast('Model synchronized with Bank of Ghana data', 'success');
    }, 1500);
  };

  const handleExport = () => {
    addToast('Generating BoG Compliance Report (PDF)...', 'info');
    setTimeout(() => {
      addToast('Report saved: aifds_compliance_2026.pdf', 'success');
    }, 2000);
  };

  const chartData = {
    labels: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1'],
    datasets: [
      {
        label: 'Fraud Attempts Detected',
        data: [120, 190, 150, 280, 220, 310, 290, 450, 380],
        borderColor: GHANA_GOLD,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
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
      {/* Toast Notifier */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div 
              key={t.id} 
              initial={{ x: 100, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: 100, opacity: 0 }}
              className="toast"
              style={{ borderLeft: `4px solid ${t.type === 'danger' ? GHANA_RED : t.type === 'success' ? GHANA_GREEN : GHANA_GOLD}` }}
            >
              {t.type === 'danger' ? <XCircle color={GHANA_RED} size={20} /> : t.type === 'success' ? <CheckCircle2 color={GHANA_GREEN} size={20} /> : <Info color={GHANA_GOLD} size={20} />}
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
          <div className="nav-item" onClick={handleExport}><MessageSquare size={18} /> Compliance Report</div>
          <div className="nav-item" style={{ marginTop: 'auto' }}><Settings size={18} /> Settings</div>
        </nav>

        <div style={{ marginTop: '2rem', padding: '1.2rem', background: 'rgba(255,215,0,0.05)', borderRadius: '15px', border: '1px solid rgba(255,215,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: GHANA_GOLD }}>
            <Lock size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>SECURITY TIP</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#8b949e', margin: 0, lineHeight: '1.4' }}>
            "Ghana MoMo users: Never share your PIN with anyone, even telco staff."
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>AIFDS Monitoring</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Real-time Fraud Prevention • Ghana National Platform</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-ghost" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Syncing...' : 'Sync Data'}
            </button>
            <button className="btn btn-primary" onClick={handleExport}>
              <FileDown size={16} /> Export BoG Report
            </button>
            <div style={{ width: '40px', height: '40px', background: '#1c2128', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
              <Bell size={18} color={GHANA_GOLD} />
            </div>
            <img src="https://flagcdn.com/w80/gh.png" alt="Ghana Flag" style={{ width: '32px', borderRadius: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
          </div>
        </header>

        {/* Top Stats */}
        <section className="stats-grid">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            <div className="card-title">Transactions (24H)</div>
            <div className="card-value">{stats.total.toLocaleString()}</div>
            <div className="card-trend trend-up"><TrendingUp size={14} /> +12% growth</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ borderLeft: `4px solid ${GHANA_RED}` }}>
            <div className="card-title">Fraud Blocked</div>
            <div className="card-value" style={{ color: GHANA_RED }}>{stats.fraud}</div>
            <div className="card-trend">Est. Loss Preven: GHS 1.4M</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            <div className="card-title">Model Precision</div>
            <div className="card-value" style={{ color: GHANA_GREEN }}>{(stats.precision * 100).toFixed(1)}%</div>
            <div className="card-trend">BoG Standard: 90%</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
            <div className="card-title">Detection Rate (Recall)</div>
            <div className="card-value" style={{ color: GHANA_GOLD }}>{(stats.recall * 100).toFixed(1)}%</div>
            <div className="card-trend"><Activity size={14} /> Peak Performance</div>
          </motion.div>
        </section>

        {/* Middle Visualization */}
        <section className="live-feed-section">
          <div className="live-feed">
            <div className="feed-header">
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={20} color={GHANA_GOLD} /> LIVE STREAM ANALYSIS
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: GHANA_GREEN, fontWeight: 800 }}>● SECURE PIPELINE</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}> Latency: 34ms</span>
              </div>
            </div>
            
            <div className="transaction-list">
              <AnimatePresence mode="popLayout">
                {transactions.map(tx => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={tx.id} 
                    className={`tx-item ${tx.isBlocked ? 'blocked' : ''}`}
                    style={{ borderLeft: `4px solid ${tx.status === 'FRAUD' || tx.isBlocked ? GHANA_RED : GHANA_GREEN}` }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>TX-{tx.id}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tx.type} • {tx.time}</div>
                    </div>
                    
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>GHS {tx.amount}</div>
                    </div>

                    <div style={{ flex: 1.5, display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {!tx.isBlocked && !tx.isApproved ? (
                        <>
                          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => setSelectedTx(tx)}>
                            <Search size={14} />
                          </button>
                          <button 
                            className="btn btn-success" 
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                            onClick={() => handleApprove(tx.id)}
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                            onClick={() => handleBlock(tx.id)}
                          >
                            <ShieldAlert size={14} />
                          </button>
                        </>
                      ) : (
                        <div className={`status-badge ${tx.isBlocked ? 'status-blocked' : 'status-legit'}`}>
                          {tx.isBlocked ? 'BLOCKED' : 'VERIFIED SAFE'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI SMOTE-XGBoost Core</h3>
            <div className="brain-viz">
              <Brain size={65} color={GHANA_GOLD} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Neural Integrity: 99.8%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>Analyzing 42 high-variance features</div>
            </div>
            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.65rem', color: '#8b949e' }}>CPU LOAD</div>
                <div style={{ fontWeight: 800, color: GHANA_GREEN }}>14.2%</div>
              </div>
              <div style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.65rem', color: '#8b949e' }}>TPS RATE</div>
                <div style={{ fontWeight: 800, color: GHANA_GOLD }}>942/s</div>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Insight */}
        <section style={{ marginTop: '2.5rem' }} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Fraud Trend Analysis (National Scale 2023 - 2025)</h3>
            <button className="btn btn-ghost" style={{ fontSize: '0.7rem' }}>
              <BarChart3 size={14} /> Full Analytics View
            </button>
          </div>
          <div style={{ height: '320px' }}>
            <Line 
              data={chartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b949e' } },
                  x: { grid: { display: false }, ticks: { color: '#8b949e' } }
                },
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#8b949e', boxWidth: 10, padding: 20 } }
                }
              }} 
            />
          </div>
        </section>
      </main>

      {/* Fraud Alert Overlay - Perfectly Centered */}
      <AnimatePresence>
        {showAlert && (
          <div className="overlay" onClick={() => setShowAlert(false)}>
            <motion.div 
              className="alert-modal"
              onClick={e => e.stopPropagation()}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <AlertTriangle size={80} color={GHANA_RED} style={{ filter: 'drop-shadow(0 0 15px rgba(211,47,47,0.5))' }} />
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', color: GHANA_RED }}>FRAUD DETECTED</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                System high-confidence scan identified a potential fraudulent transaction: <strong>TX-{activeAlert?.id}</strong>.
              </p>
              
              <div style={{ background: 'rgba(211,47,47,0.08)', border: '1px solid rgba(211,47,47,0.2)', padding: '1.5rem', borderRadius: '15px', marginBottom: '2.5rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: GHANA_RED, fontWeight: 800, fontSize: '0.85rem', marginBottom: '10px' }}>
                  <Zap size={16} /> PRIMARY RISK FACTORS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ borderLeft: `2px solid ${GHANA_RED}`, paddingLeft: '8px' }}>
                    <div style={{ color: '#8b949e' }}>Frequency Bias</div>
                    <div style={{ fontWeight: 700 }}>+420% vs Baseline</div>
                  </div>
                  <div style={{ borderLeft: `2px solid ${GHANA_RED}`, paddingLeft: '8px' }}>
                    <div style={{ color: '#8b949e' }}>Location Delta</div>
                    <div style={{ fontWeight: 700 }}>Out-of-Region Hop</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
                <button className="btn btn-ghost" style={{ padding: '14px 30px' }} onClick={() => setShowAlert(false)}>DISMISS</button>
                <button className="btn btn-danger" style={{ padding: '14px 40px', fontWeight: 800 }} onClick={() => handleBlock(activeAlert.id)}>
                  BLOCK IMMEDIATELY
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="overlay" onClick={() => setSelectedTx(null)}>
            <motion.div className="card" style={{ maxWidth: '500px', width: '90%', padding: '2.5rem' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Transaction Audit</h2>
                <XCircle size={24} color="#444" style={{ cursor: 'pointer' }} onClick={() => setSelectedTx(null)} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Transaction ID</span>
                  <span style={{ fontWeight: 700 }}>TX-{selectedTx.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Amount</span>
                  <span style={{ fontWeight: 800, color: GHANA_GOLD }}>GHS {selectedTx.amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fraud Probability</span>
                  <span style={{ fontWeight: 700, color: selectedTx.status === 'FRAUD' ? GHANA_RED : GHANA_GREEN }}>
                    {(selectedTx.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-success" style={{ flex: 1 }} onClick={() => { handleApprove(selectedTx.id); setSelectedTx(null); }}>
                  APPROVE
                </button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => { handleBlock(selectedTx.id); setSelectedTx(null); }}>
                  BLOCK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Seal_of_the_President_of_the_Republic_of_Ghana.svg" alt="Seal" className="ghana-seal" />
    </div>
  );
};

export default App;
