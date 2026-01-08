import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaRocket } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="w-full px-4 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <FaRocket size={18} />
            </div>
            <span className="font-black text-2xl tracking-tight text-white uppercase">Dev<span className="text-purple-600">Lance</span></span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            The world's leading marketplace for technical talent and creative solutions. We connect ambitious clients with elite developers and designers globally.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-purple-600 transition-all text-gray-400 hover:text-white"><FaFacebook /></a>
            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-purple-600 transition-all text-gray-400 hover:text-white"><FaTwitter /></a>
            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-purple-600 transition-all text-gray-400 hover:text-white"><FaLinkedin /></a>
            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-purple-600 transition-all text-gray-400 hover:text-white"><FaGithub /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">For Clients</h4>
          <ul className="space-y-4 text-gray-400 text-sm font-medium">
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Find Freelancers</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Post a Project</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Enterprise Solutions</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Safety & Security</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">For Freelancers</h4>
          <ul className="space-y-4 text-gray-400 text-sm font-medium">
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Find Work</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Get Paid</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Professional Growth</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Community Hub</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Resources</h4>
          <ul className="space-y-4 text-gray-400 text-sm font-medium">
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Help & Support</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Trust & Safety</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Project Management</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Guides</Link></li>
          </ul>
        </div>
      </div>

      <div className="w-full px-4 md:px-10 pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
        <p>© 2025 Dev Lance Global Inc. Built with Passion</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
