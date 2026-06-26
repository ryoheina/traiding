"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Award, 
  Shield, 
  BookOpen, 
  Zap,
  ArrowRight,
  Menu,
  X,
  Twitter,
  Linkedin,
  Mail,
  CheckCircle2,
  Star,
  BarChart3,
  Target,
  Globe,
  Lock,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teamMembers = [
    {
      name: "Alexander Wolfe",
      role: "Chief Trading Strategist",
      experience: "8+ years",
      expertise: "Forex & Commodities",
      image: "👨‍💼"
    },
    {
      name: "Sarah Mitchell",
      role: "Technical Analyst",
      experience: "6+ years",
      expertise: "Cryptocurrency & Stocks",
      image: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "Risk Management Expert",
      experience: "7+ years",
      expertise: "Portfolio Optimization",
      image: "👨‍💻"
    }
  ];

  const achievements = [
    { value: "$50M+", label: "Trading Volume" },
    { value: "95%", label: "Success Rate" },
    { value: "500+", label: "Active Members" },
    { value: "24/7", label: "Market Coverage" }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Expert Analysis",
      description: "Access professional market analysis and trading strategies from our expert team."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Exclusive Community",
      description: "Join a network of like-minded traders and share insights with the best in the industry."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Educational Resources",
      description: "Comprehensive learning materials, webinars, and workshops to enhance your trading skills."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk Management",
      description: "Learn proven risk management strategies to protect and grow your investments."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Alerts",
      description: "Get instant notifications on market movements and trading opportunities."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Proven Track Record",
      description: "Our team has consistently delivered results across various market conditions."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-2xl font-bold text-white">Wolf</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#achievements" className="text-gray-400 hover:text-white transition-colors">Achievements</a>
              <a href="#benefits" className="text-gray-400 hover:text-white transition-colors">Benefits</a>
              <a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
              >
                Join Our Team
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0B1120]/95 backdrop-blur-xl border-t border-white/10 px-4 py-6 space-y-4"
          >
            <a href="#about" className="block text-gray-400 hover:text-white transition-colors py-2">About</a>
            <a href="#achievements" className="block text-gray-400 hover:text-white transition-colors py-2">Achievements</a>
            <a href="#benefits" className="block text-gray-400 hover:text-white transition-colors py-2">Benefits</a>
            <a href="#projects" className="block text-gray-400 hover:text-white transition-colors py-2">Projects</a>
            <Link
              href="/register"
              className="block w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl text-center"
            >
              Join Our Team
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 pt-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-gray-300">Premium Trading Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Trade with the
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  Wolf Pack
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
                Our team is a trading team composed of three trading experts. Each member possesses unique trading skills and has more than five years of professional experience. We are based in the United States and provide professional market analysis, trading strategies, and investment insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center space-x-2 group"
                >
                  <span>Join Our Team</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#about"
                  className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm"
                >
                  Learn More
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:scale-105">
                    <TrendingUp className="w-8 h-8 text-amber-400 mb-3" />
                    <p className="text-3xl font-bold text-white mb-1">+127%</p>
                    <p className="text-sm text-gray-400">Avg Returns</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:scale-105">
                    <Users className="w-8 h-8 text-amber-400 mb-3" />
                    <p className="text-3xl font-bold text-white mb-1">500+</p>
                    <p className="text-sm text-gray-400">Members</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:scale-105">
                    <Award className="w-8 h-8 text-amber-400 mb-3" />
                    <p className="text-3xl font-bold text-white mb-1">95%</p>
                    <p className="text-sm text-gray-400">Success Rate</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all hover:scale-105">
                    <Shield className="w-8 h-8 text-amber-400 mb-3" />
                    <p className="text-3xl font-bold text-white mb-1">24/7</p>
                    <p className="text-sm text-gray-400">Support</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <BarChart3 className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <Target className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our Experts
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our team of seasoned trading professionals brings decades of combined experience to help you succeed in the markets.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-amber-500/30 transition-all group"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-5xl mb-6 mx-auto shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
                  {member.image}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">
                  {member.name}
                </h3>
                <p className="text-amber-400 font-semibold mb-4 text-center">{member.role}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-sm"><span className="font-semibold text-white">Experience:</span> {member.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-sm"><span className="font-semibold text-white">Expertise:</span> {member.expertise}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Achievements
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Proven results that speak for themselves
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="w-28 h-28 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all">
                  <span className="text-3xl font-bold text-white">{achievement.value}</span>
                </div>
                <p className="text-white font-semibold text-lg">{achievement.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Join Us
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover the advantages of becoming part of our exclusive trading community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-amber-500/30 transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 group"
            >
              <span>Join Our Team Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f1c] border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="text-2xl font-bold text-white">Wolf</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Professional trading team providing expert market analysis, trading strategies, and investment insights.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:aivideo7775@gmail.com" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-amber-400 transition-colors">About</a></li>
                <li><a href="#achievements" className="text-gray-400 hover:text-amber-400 transition-colors">Achievements</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-amber-400 transition-colors">Benefits</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Terms of Service</a></li>
                <li><a href="mailto:aivideo7775@gmail.com" className="text-gray-400 hover:text-amber-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <div className="max-w-md mx-auto text-center">
              <h4 className="font-semibold text-white mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for trading insights</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 Wolf Trading. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
