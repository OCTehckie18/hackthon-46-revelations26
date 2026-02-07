import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  Clock,
  Heart,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Browse Vendors", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "For Vendors", path: "/vendor/login" },
    { name: "Pricing", path: "/pricing" },
    { name: "Blog", path: "/blog" },
    { name: "Careers", path: "/careers" },
  ];

  const supportLinks = [
    { name: "Help Center", path: "/help" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Refund Policy", path: "/refund" },
    { name: "Contact Us", path: "/contact" },
    { name: "Sitemap", path: "/sitemap" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      url: "https://facebook.com/campuspreorder",
      label: "Facebook",
    },
    {
      icon: Twitter,
      url: "https://twitter.com/campuspreorder",
      label: "Twitter",
    },
    {
      icon: Instagram,
      url: "https://instagram.com/campuspreorder",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      url: "https://linkedin.com/company/campuspreorder",
      label: "LinkedIn",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "Real-time Predictions",
      desc: "Accurate wait time estimates",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      desc: "100% secure transactions",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      desc: "UPI, Cards, Net Banking",
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">CampusPreOrder</h2>
                <p className="text-sm text-gray-400">Skip the queue</p>
              </div>
            </Link>

            <p className="text-gray-400 mb-6">
              Revolutionizing campus dining with AI-powered predictions and
              seamless pre-ordering.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* App Download Badges */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-white">Download our app</p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="flex-1 bg-black hover:bg-gray-800 transition-colors rounded-lg p-3 flex items-center space-x-2"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.86-2.08.86-.49 0-1.04-.15-1.62-.3-1.21-.31-2.47-.63-4.05-.63-1.57 0-2.83.32-4.05.63-.58.15-1.13.3-1.62.3-.03 0-1.1.09-2.08-.86-1.42-1.38-1.42-3.59 0-5.17l8.23-8.23c.39-.39 1.02-.39 1.41 0l8.23 8.23c1.42 1.38 1.42 3.59 0 5.17z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex-1 bg-black hover:bg-gray-800 transition-colors rounded-lg p-3 flex items-center space-x-2"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 20.5v-17c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v17c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1zM8 5v14m8-14v14" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Features */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Contact Us
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <a
                    href="mailto:support@campuspreorder.com"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    support@campuspreorder.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <a
                    href="tel:+919876543210"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <p className="font-medium text-white">Address</p>
                  <p className="text-gray-400">
                    Campus Innovation Center
                    <br />
                    Tech Park, Bengaluru
                    <br />
                    Karnataka 560001
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h4 className="font-medium text-white mb-2">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-3">
                Subscribe to our newsletter for updates
              </p>
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center space-x-4 p-4 bg-gray-800 rounded-xl"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {currentYear} CampusPreOrder. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Made with <Heart className="w-4 h-4 text-red-500 inline" /> in
                India
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">We accept:</span>
              <div className="flex space-x-2">
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">VISA</span>
                </div>
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">MC</span>
                </div>
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">UPI</span>
                </div>
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">PP</span>
                </div>
              </div>
            </div>

            {/* Legal */}
            <div className="flex items-center space-x-6">
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
