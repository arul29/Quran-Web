import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Navigation,
  MapPin,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Info,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import SEO from "@/components/SEO";
import {
  calculateQiblatDirection,
  calculateDistanceToKaaba,
  getCardinalDirection,
  formatDistance,
} from "@/helpers/qiblatCalculator";

export default function Qiblat() {
  const [userLocation, setUserLocation] = useState(null);
  const [qiblatDirection, setQiblatDirection] = useState(null);
  const [distance, setDistance] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState("prompt");
  const [compassSupported, setCompassSupported] = useState(true);
  const [locationName, setLocationName] = useState("");
  const [compassAccuracy, setCompassAccuracy] = useState(null);
  const [showCalibration, setShowCalibration] = useState(false);
  const compassRef = useRef(null);
  const lastHeadingRef = useRef(0);
  const animationFrameRef = useRef(null);
  const smoothingFactor = 0.15; // Lower = smoother but slower response

  // Request location permission and get user's coordinates
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser Anda.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        // Calculate qiblat direction
        const direction = calculateQiblatDirection(latitude, longitude);
        setQiblatDirection(direction);

        // Calculate distance to Ka'bah
        const dist = calculateDistanceToKaaba(latitude, longitude);
        setDistance(dist);

        // Get location name using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "id",
              },
            },
          );
          const data = await response.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "Lokasi Anda";
          const country = data.address.country || "";
          setLocationName(`${city}, ${country}`);
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setLocationName("Lokasi Anda");
        }

        setLoading(false);
        setPermissionState("granted");
      },
      (err) => {
        console.error("Geolocation error:", err);
        let errorMessage = "Tidak dapat mengakses lokasi Anda.";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "Izin lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser Anda.";
            setPermissionState("denied");
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Informasi lokasi tidak tersedia.";
            break;
          case err.TIMEOUT:
            errorMessage = "Permintaan lokasi timeout.";
            break;
          default:
            errorMessage = "Terjadi kesalahan saat mengakses lokasi.";
        }

        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Smooth heading transition to avoid jumps
  const smoothHeading = (newHeading, lastHeading) => {
    let diff = newHeading - lastHeading;

    // Handle 360/0 degree crossing
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const smoothed = lastHeading + diff * smoothingFactor;
    return (smoothed + 360) % 360;
  };

  // Handle device orientation for compass - REAL-TIME with smoothing
  const handleOrientation = (event) => {
    let heading = null;

    if (event.webkitCompassHeading !== undefined) {
      // iOS Safari - provides true heading
      heading = event.webkitCompassHeading;

      // Get accuracy if available
      if (
        event.webkitCompassAccuracy !== undefined &&
        event.webkitCompassAccuracy >= 0
      ) {
        setCompassAccuracy(event.webkitCompassAccuracy);
      }
    } else if (event.alpha !== null) {
      // Android Chrome - provides magnetic heading
      // Alpha gives rotation around z-axis (0-360)
      heading = 360 - event.alpha;
    }

    if (heading !== null) {
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth updates
      animationFrameRef.current = requestAnimationFrame(() => {
        const smoothedHeading = smoothHeading(heading, lastHeadingRef.current);
        lastHeadingRef.current = smoothedHeading;
        setDeviceHeading(smoothedHeading);
      });
    }
  };

  const [compassStarted, setCompassStarted] = useState(false);

  // Request device orientation permission (REQUIRED to be triggered by user action)
  const startCompass = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+ logic
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
          setCompassSupported(true);
          setCompassStarted(true);
          setShowCalibration(true);
        } else {
          alert(
            "Izin kompas ditolak. Anda perlu mengizinkan akses sensor untuk menggunakan fitur ini.",
          );
          setCompassSupported(false);
        }
      } catch (err) {
        console.error("Orientation permission error:", err);
        setCompassSupported(false);
      }
    } else if (typeof DeviceOrientationEvent !== "undefined") {
      // Android and older iOS
      if ("ondeviceorientationabsolute" in window) {
        window.addEventListener(
          "deviceorientationabsolute",
          handleOrientation,
          true,
        );
      } else {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
      setCompassSupported(true);
      setCompassStarted(true);
      setShowCalibration(true);
    } else {
      setCompassSupported(false);
      alert("Perangkat Anda tidak mendukung sensor kompas.");
    }
  };

  useEffect(() => {
    getUserLocation();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true,
      );
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Calculate the rotation for the compass needle
  const getCompassRotation = () => {
    if (qiblatDirection === null) return 0;
    return qiblatDirection - deviceHeading;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <SEO
        title="Arah Qiblat - Kompas Digital"
        description="Temukan arah qiblat dengan akurat menggunakan kompas digital. Menampilkan jarak ke Ka'bah dan arah kiblat dari lokasi Anda."
      />

      {/* Header */}
      <div className="relative overflow-hidden bg-[#0a2e26] dark:bg-slate-950 pt-20 pb-16 sm:py-24 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/50 to-[#0a2e26] dark:to-slate-950"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md text-white transition-all active:scale-95 group border border-white/10 mb-6"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Kembali</span>
          </Link>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Kompas Digital
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Arah <span className="text-emerald-400">Qiblat</span>
            </h1>

            <p className="text-lg text-emerald-100/60 max-w-xl mx-auto leading-relaxed">
              Temukan arah kiblat dengan akurat dari lokasi Anda menggunakan
              kompas digital
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          // Loading State
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-12 text-center border border-gray-100 dark:border-slate-800">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Mengakses lokasi Anda...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pastikan Anda mengizinkan akses lokasi
              </p>
            </div>
          </div>
        ) : error ? (
          // Error State
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-slate-800">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Tidak Dapat Mengakses Lokasi
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              </div>

              {permissionState === "denied" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-left">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-300">
                      <p className="font-semibold mb-2">
                        Cara mengaktifkan izin lokasi:
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-400">
                        <li>Klik ikon gembok/info di address bar</li>
                        <li>Pilih "Pengaturan Situs" atau "Site Settings"</li>
                        <li>Ubah izin "Lokasi" menjadi "Izinkan"</li>
                        <li>Muat ulang halaman ini</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={getUserLocation}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                Coba Lagi
              </button>
            </div>
          </div>
        ) : (
          // Success State - Show Compass
          <div className="space-y-6">
            {/* Location Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
                  <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Lokasi Anda
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {locationName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Latitude
                  </p>
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {userLocation?.latitude.toFixed(6)}°
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Longitude
                  </p>
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {userLocation?.longitude.toFixed(6)}°
                  </p>
                </div>
              </div>
            </div>

            {/* Compass Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-slate-800 relative overflow-hidden">
              {/* HTTPS Warning */}
              {!window.isSecureContext && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800 dark:text-red-300">
                    <p className="font-bold">Koneksi Tidak Aman (HTTP)</p>
                    <p>
                      Sensor kompas hanya berfungsi pada koneksi **HTTPS**. Jika
                      Anda mencoba di HP lewat IP lokal (192.168.x.x), gunakan
                      **HTTPS** atau tunnel seperti ngrok.
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center space-y-6">
                {/* Compass Visual */}
                <div className="relative mx-auto w-full max-w-sm aspect-square">
                  {!compassStarted && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/10 dark:bg-slate-900/10 backdrop-blur-[2px] rounded-full">
                      <button
                        onClick={startCompass}
                        className="flex flex-col items-center gap-3 p-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl shadow-emerald-600/40 transform transition-all active:scale-95 animate-pulse"
                      >
                        <Compass size={48} />
                        <span className="font-bold">Aktifkan Kompas</span>
                      </button>
                    </div>
                  )}

                  {/* Compass Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-full shadow-inner"></div>

                  {/* Compass Rings */}
                  <div className="absolute inset-4 border-4 border-gray-200 dark:border-slate-700 rounded-full"></div>
                  <div className="absolute inset-8 border-2 border-gray-100 dark:border-slate-800 rounded-full"></div>

                  {/* Rotating Rose Container - This makes U always point North */}
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: `rotate(${-deviceHeading}deg)`,
                      transition: "transform 0.1s linear",
                    }}
                  >
                    {/* Cardinal Directions */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {/* North */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2">
                          <span className="text-lg font-black text-red-600 dark:text-red-400">
                            U
                          </span>
                        </div>
                        {/* East */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                            T
                          </span>
                        </div>
                        {/* South */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                            S
                          </span>
                        </div>
                        {/* West */}
                        <div className="absolute left-2 top-1/2 -translate-y-1/2">
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                            B
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Qiblat Needle - Fixed angle relative to the Rose */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transform: `rotate(${qiblatDirection}deg)`,
                      }}
                    >
                      <div className="relative">
                        {/* Needle pointing to Qiblat */}
                        <div className="w-2.5 h-36 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-full shadow-lg relative -top-18">
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-emerald-400"></div>
                        </div>
                        {/* Needle pointing opposite */}
                        <div className="w-2 h-36 bg-gradient-to-b from-gray-400 to-gray-200 opacity-20 rounded-full relative -top-36"></div>
                      </div>
                    </div>

                    {/* Ka'bah Icon Layer */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${qiblatDirection}deg) translateY(-145px)`,
                      }}
                    >
                      <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-500 rounded-lg flex items-center justify-center shadow-xl">
                        <span className="text-white text-2xl">🕋</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Dot - Stays fixed in the middle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-900 border-4 border-emerald-600 rounded-full shadow-lg z-10"></div>
                </div>

                {/* Direction Info */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                      {!compassStarted
                        ? "Klik tombol di tengah untuk mulai"
                        : "Arahkan perangkat ke arah panah hijau"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Compass className="w-5 h-5" />
                        <p className="text-xs font-semibold opacity-90">
                          Arah Qiblat
                        </p>
                      </div>
                      <p className="text-2xl font-black">
                        {qiblatDirection?.toFixed(1)}°
                      </p>
                      <p className="text-xs opacity-75 mt-1">
                        {getCardinalDirection(qiblatDirection)}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5" />
                        <p className="text-xs font-semibold opacity-90">
                          Jarak ke Ka'bah
                        </p>
                      </div>
                      <p className="text-2xl font-black">
                        {formatDistance(distance)}
                      </p>
                      <p className="text-xs opacity-75 mt-1">Garis lurus</p>
                    </div>
                  </div>

                  {compassStarted && compassSupported && (
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Arah Perangkat
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-gray-900 dark:text-white">
                            {deviceHeading.toFixed(1)}°
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {getCardinalDirection(deviceHeading)}
                          </p>
                        </div>
                      </div>
                      {compassAccuracy !== null && compassAccuracy > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Akurasi: ±{compassAccuracy.toFixed(0)}°
                            {compassAccuracy > 20 && " (Perlu kalibrasi)"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!compassSupported && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-900 dark:text-amber-300 text-left">
                        <p className="font-semibold mb-1">
                          Kompas digital tidak tersedia
                        </p>
                        <p className="text-amber-800 dark:text-amber-400">
                          Gunakan sudut {qiblatDirection?.toFixed(1)}° dari arah
                          Utara dengan kompas manual untuk menemukan arah
                          qiblat.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-300">
                      <p className="font-semibold mb-2">Tips Penggunaan:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-400">
                        <li>Pastikan perangkat Anda dalam posisi datar</li>
                        <li>Jauhkan dari benda magnetik (speaker, magnet)</li>
                        <li>Jarum hijau menunjuk arah Ka'bah</li>
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCalibration(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold transition-all text-sm border border-blue-600/20"
                  >
                    <Smartphone className="w-4 h-4 animate-bounce" />
                    Bantuan Kalibrasi Kompas
                  </button>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={getUserLocation}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-2xl font-bold transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              Perbarui Lokasi
            </button>
          </div>
        )}
      </div>

      {/* Calibration Guide Modal */}
      {showCalibration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-[#0a2e26]/80 backdrop-blur-sm"
            onClick={() => setShowCalibration(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 sm:p-10 text-center animate-scale-in overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
            </div>

            <div className="relative space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  Kalibrasi Kompas
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Gerakkan ponsel Anda seperti pada animasi di bawah ini
                </p>
              </div>

              {/* Infinity Animation Container */}
              <div className="relative h-48 flex items-center justify-center">
                <div className="absolute w-32 h-16 border-4 border-dashed border-emerald-500/20 rounded-full rotate-[-45deg] translate-x-[-20px]"></div>
                <div className="absolute w-32 h-16 border-4 border-dashed border-emerald-500/20 rounded-full rotate-[45deg] translate-x-[20px]"></div>

                <div className="calibration-animation relative z-10 p-4 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/30">
                  <Smartphone className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                  Lakukan gerakan angka 8 (∞) di udara beberapa kali hingga
                  kompas terasa lebih akurat.
                </p>
                <button
                  onClick={() => setShowCalibration(false)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                >
                  Selesai Kalibrasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes infinity-loop {
          0% {
            transform: translate(-40px, 0) rotate(-30deg);
          }
          25% {
            transform: translate(0, -20px) rotate(0deg);
          }
          50% {
            transform: translate(40px, 0) rotate(30deg);
          }
          75% {
            transform: translate(0, 20px) rotate(0deg);
          }
          100% {
            transform: translate(-40px, 0) rotate(-30deg);
          }
        }
        
        .calibration-animation {
          animation: infinity-loop 3s ease-in-out infinite;
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
