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
  Moon,
  Sun
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem("dark") === "true";
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("dark", String(newDark));
    document.documentElement.classList.toggle("dark");
  };

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
    <div className="min-h-screen bg-gradient-to-br from-wolf-50 via-white to-wolf-100 dark:from-wolf-950 dark:via-wolf-900 dark:to-wolf-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-wolf-950/80 backdrop-blur-lg border-b border-wolf-200 dark:border-wolf-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold texl-xl">W</span>
              </div>
              <span className="font-display text-2xl font-bold text-wolf-900 dark:text-white">Wolf</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white transition-colors">About</a>
              <a href="#achievements" className="text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white transition-colors">Achievements</a>
              <a href="#benefits" className="text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white transition-colors">Benefits</a>
              <a href="#projects" className="text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white transition-colors">Projects</a>
              <button
                onClick={toggleDark}
                className="p-2 rounded-lg bg-wolf-100 dark:bg-wolf-800 text-wolf-600 dark:text-wolf-400 hover:bg-wolf-200 dark:hover:bg-wolf-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg hover:shadow-xl"
              >
                Join Our Team
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleDark}
                className="p-2 rounded-lg bg-wolf-100 dark:bg-wolf-800 text-wolf-600 dark:text-wolf-400"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-wolf-100 dark:bg-wolf-800 text-wolf-600 dark:text-wolf-400"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white dark:bg-wolf-950 border-t border-wolf-200 dark:border-wolf-800 px-4 py-4 space-y-4"
          >
            <a href="#about" className="block text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white">About</a>
            <a href="#achievements" className="block text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white">Achievements</a>
            <a href="#benefits" className="block text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white">Benefits</a>
            <a href="#projects" className="block text-wolf-600 dark:text-wolf-400 hover:text-wolf-900 dark:hover:text-white">Projects</a>
            <Link
              href="/register"
              className="block w-full px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg text-center"
            >
              Join Our Team
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-wolf-900 dark:text-white mb-6 leading-tight">
                Trade with the
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">
                  Wolf Pack
                </span>
              </h1>
              <p className="text-lg md:text-xl text-wolf-600 dark:text-wolf-400 mb-8 leading-relaxed">
                Our team is a trading team composed of three trading experts. Each member possesses unique trading skills and has more than five years of professional experience. We are based in the United States and provide professional market analysis, trading strategies, and investment insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Join Our Team</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#about"
                  className="px-8 py-4 border-2 border-wolf-300 dark:border-wolf-700 text-wolf-700 dark:text-wolf-300 font-semibold rounded-lg hover:bg-wolf-100 dark:hover:bg-wolf-800 transition-all flex items-center justify-center"
                >
                  Learn More
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-gradient-to-br from-wolf-200 to-wolf-300 dark:from-wolf-800 dark:to-wolf-900 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-wolf-950 rounded-xl p-6 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-gold-500 mb-2" />
                    <p className="text-2xl font-bold text-wolf-900 dark:text-white">+127%</p>
                    <p className="text-sm text-wolf-600 dark:text-wolf-400">Avg Returns</p>
                  </div>
                  <div className="bg-white dark:bg-wolf-950 rounded-xl p-6 shadow-lg">
                    <Users className="w-8 h-8 text-gold-500 mb-2" />
                    <p className="text-2xl font-bold text-wolf-900 dark:text-white">500+</p>
                    <p className="text-sm text-wolf-600 dark:text-wolf-400">Members</p>
                  </div>
                  <div className="bg-white dark:bg-wolf-950 rounded-xl p-6 shadow-lg">
                    <Award className="w-8 h-8 text-gold-500 mb-2" />
                    <p className="text-2xl font-bold text-wolf-900 dark:text-white">95%</p>
                    <p className="text-sm text-wolf-600 dark:text-wolf-400">Success Rate</p>
                  </div>
                  <div className="bg-white dark:bg-wolf-950 rounded-xl p-6 shadow-lg">
                    <Shield className="w-8 h-8 text-gold-500 mb-2" />
                    <p className="text-2xl font-bold text-wolf-900 dark:text-white">24/7</p>
                    <p className="text-sm text-wolf-600 dark:text-wolf-400">Support</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-wolf-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-wolf-900 dark:text-white mb-4">
              Meet Our Experts
            </h2>
            <p className="text-lg text-wolf-600 dark:text-wolf-400 max-w-2xl mx-auto">
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
                className="bg-gradient-to-br from-wolf-50 to-wolf-100 dark:from-wolf-800 dark:to-wolf-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-wolf-200 dark:border-wolf-700"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center text-4xl mb-6">
                  {member.image}
                </div>
                <h3 className="font-display text-2xl font-bold text-wolf-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-gold-600 font-semibold mb-4">{member.role}</p>
                <div className="space-y-2">
                  <p className="text-wolf-600 dark:text-wolf-400">
                    <span className="font-semibold">Experience:</span> {member.experience}
                  </p>
                  <p className="text-wolf-600 dark:text-wolf-400">
                    <span className="font-semibold">Expertise:</span> {member.expertise}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-wolf-900 dark:text-white mb-4">
              Our Achievements
            </h2>
            <p className="text-lg text-wolf-600 dark:text-wolf-400 max-w-2xl mx-auto">
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
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">{achievement.value}</span>
                </div>
                <p className="text-wolf-900 dark:text-white font-semibold">{achievement.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-wolf-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-wolf-900 dark:text-white mb-4">
              Why Join Us
            </h2>
            <p className="text-lg text-wolf-600 dark:text-wolf-400 max-w-2xl mx-auto">
              Discover the advantages of becoming part of our exclusive trading community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-wolf-50 to-wolf-100 dark:from-wolf-800 dark:to-wolf-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-wolf-200 dark:border-wolf-700 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-wolf-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-wolf-600 dark:text-wolf-400 leading-relaxed">
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
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg hover:shadow-xl"
            >
              <span>Join Our Team Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wolf-900 dark:bg-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="font-display text-2xl font-bold text-white">Wolf</span>
              </div>
              <p className="text-wolf-400 mb-6 max-w-md">
                Professional trading team providing expert market analysis, trading strategies, and investment insights.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-wolf-800 rounded-lg flex items-center justify-center text-wolf-400 hover:bg-gold-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-wolf-800 rounded-lg flex items-center justify-center text-wolf-400 hover:bg-gold-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-wolf-400 hover:text-gold-500 transition-colors">Home</a></li>
                <li><a href="#about" className="text-wolf-400 hover:text-gold-500 transition-colors">About</a></li>
                <li><a href="#achievements" className="text-wolf-400 hover:text-gold-500 transition-colors">Achievements</a></li>
                <li><a href="#benefits" className="text-wolf-400 hover:text-gold-500 transition-colors">Benefits</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-wolf-400 hover:text-gold-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-wolf-400 hover:text-gold-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-wolf-400 hover:text-gold-500 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-wolf-800 pt-8 text-center">
            <p className="text-wolf-500">
              © 2024 Wolf Trading. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
