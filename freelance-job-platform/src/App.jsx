import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import PostJob from "./pages/PostJob";
import JobDetails from "./pages/JobDetails";
import AdminPanel from "./pages/AdminPanel";
import Payment from "./pages/Payment";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Wallet from "./pages/Wallet";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import PageTransition from "./components/PageTransition";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/post-job" element={<PageTransition><PostJob /></PageTransition>} />
        <Route path="/job/:id" element={<PageTransition><JobDetails /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminPanel /></PageTransition>} />
        <Route path="/payment/:jobId" element={<PageTransition><Payment /></PageTransition>} />
        <Route path="/reviews/:userId" element={<PageTransition><Reviews /></PageTransition>} />
        <Route path="/profile/:id" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
        <Route path="/wallet" element={<PageTransition><Wallet /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Header />
        <main className="min-h-screen">
          <AnimatedRoutes />
        </main>
        <ChatBot />
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
