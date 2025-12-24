import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ReportsPage from './pages/ReportsPage';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/informes" element={<ReportsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
