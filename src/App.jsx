import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Context/ThemeContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import UserProfile from './Pages/UserProfile';
import Repositories from './Pages/Repositories';
import RepoSearch from './Pages/RepoSearch';
import Bookmarks from './Pages/Bookmarks';
import Compare from './Pages/Compare';
import './Styles/global.css';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user/:username" element={<UserProfile />} />
              <Route path="/user/:username/repos" element={<Repositories />} />
              <Route path="/search" element={<RepoSearch />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;