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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-wolf-900 dark:text-white mb-4">
            Registration Successful!
          </h1>

          <p className="text-lg text-wolf-600 dark:text-wolf-400 mb-8">
            Your account has been created. A welcome package has been downloaded to your device.
          </p>

          <div className="bg-wolf-50 dark:bg-wolf-800 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4 mb-4">
              <Clock className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-wolf-900 dark:text-white mb-1">
                  Pending Approval
                </h3>
                <p className="text-sm text-wolf-600 dark:text-wolf-400">
                  Your account is currently pending approval from our admin team. This typically takes 24-48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-wolf-900 dark:text-white mb-1">
                  Email Notification
                </h3>
                <p className="text-sm text-wolf-600 dark:text-wolf-400">
                  You will receive an email notification once your account is approved.
                </p>
              </div>
            </div>
          </div>

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
