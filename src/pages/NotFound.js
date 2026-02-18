import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Search, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 flex flex-col justify-center items-center px-4">
      <SEO
        title="404 - Halaman Tidak Ditemukan"
        description="Maaf, halaman yang Anda cari tidak dapat ditemukan di Quran Web."
      />

      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
        </div>
      </div>

      <div className="relative max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full animate-ping"></div>
          <div className="relative flex items-center justify-center w-32 h-32 bg-white dark:bg-slate-900 rounded-full shadow-2xl border-4 border-emerald-500 dark:border-emerald-600">
            <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
              404
            </span>
          </div>
          <div className="absolute -bottom-2 -right-2 p-3 bg-amber-500 rounded-2xl shadow-lg border-4 border-white dark:border-slate-900">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
            Oops! Halaman Hilang
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Maaf, sepertinya halaman yang Anda cari telah berpindah ke dunianya
            sendiri atau tidak pernah ada.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Ke Beranda
          </Link>
          <Link
            to="/tanya-ai"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-2xl font-bold shadow-lg shadow-gray-200/20 dark:shadow-none transition-all active:scale-95 group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Cari Sesuatu
          </Link>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke sebelumnya
        </button>
      </div>

      {/* Quote/Ayat Placeholder - Optional for Aesthetic */}
      <div className="mt-16 text-center max-w-sm">
        <p className="text-xs italic text-gray-400 dark:text-gray-600">
          "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan
          memudahkan baginya jalan menuju surga." (HR. Muslim)
        </p>
      </div>
    </div>
  );
}
