"use client";

import { motion } from "framer-motion";
import { CheckCircle, Mail, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wolf-50 via-white to-wolf-100 dark:from-wolf-950 dark:via-wolf-900 dark:to-wolf-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-wolf-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-wolf-200 dark:border-wolf-800 text-center"
        >
          <div className="space-y-4">
            <Link
              href="/team"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg hover:shadow-xl"
            >
              <span>TEAM PAGE</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="flex justify-center space-x-4">
              <Link
                href="/login"
                className="text-wolf-600 dark:text-wolf-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
              >
                Go to Login
              </Link>
              <span className="text-wolf-300 dark:text-wolf-600">|</span>
              <Link
                href="/"
                className="text-wolf-600 dark:text-wolf-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
              >
                Return to Home
              </Link>
            </div>

            <p className="text-sm text-wolf-500 dark:text-wolf-500">
              Need help? Contact us at{" "}
              <a href="mailto:support@wolftrading.com" className="text-gold-600 hover:text-gold-700">
                support@wolftrading.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
