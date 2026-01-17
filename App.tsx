import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Create } from './pages/Create';
import { Gallery } from './pages/Gallery';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Header />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/gallery/:boardId" element={<Gallery />} />
            </Routes>
          </main>

          <BottomNav />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
