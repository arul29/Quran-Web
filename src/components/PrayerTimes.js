import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Clock,
  MapPin,
  Wind,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Loader2,
  ChevronDown,
  Settings2,
  Navigation,
  Check,
  AlertCircle,
  Compass,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PrayerTimes() {
  const [timings, setTimings] = useState(null);
  const [dateInfo, setDateInfo] = useState({ gregorian: "", hijri: "" });
  const [location, setLocation] = useState({
    provinsi: "DKI Jakarta",
    kabkota: "Kota Jakarta Pusat",
  });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchProvinces = async () => {
    try {
      const res = await axios.get(
        "https://equran.id/api/v2/imsakiyah/provinsi",
      );
      if (res.data.code === 200) setProvinces(res.data.data);
    } catch (err) {
      console.error("Gagal ambil provinsi", err);
    }
  };

  const fetchCities = async (prov) => {
    if (!prov) return [];
    setLoadingCities(true);
    try {
      const res = await axios.post(
        "https://equran.id/api/v2/imsakiyah/kabkota",
        { provinsi: prov },
      );
      if (res.data.code === 200) {
        setCities(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.error("Gagal ambil kota", err);
    } finally {
      setLoadingCities(false);
    }
    return [];
  };

  const fetchImsakiyah = useCallback(async (prov, city) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("https://equran.id/api/v2/imsakiyah", {
        provinsi: prov,
        kabkota: city,
      });

      if (res.data.code === 200) {
        const data = res.data.data;
        // Today's Date Logic
        const today = new Date();

        // Get Hijri info dynamically
        const hijriFormatter = new Intl.DateTimeFormat(
          "en-u-ca-islamic-umalqura",
          {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          },
        );

        // --- HIJRI ADJUSTMENT FOR INDONESIA ---
        // Kalender Umalqura seringkali 1 hari lebih cepat dari Kemenag RI.
        // Kita kurangi 1 hari untuk sinkronisasi dengan Hilal Indonesia.
        const adjustedDate = new Date(today);
        adjustedDate.setDate(today.getDate() - 1);

        const parts = hijriFormatter.formatToParts(adjustedDate);
        const getPart = (type) => parts.find((p) => p.type === type)?.value;

        const hDay = getPart("day");
        const hMonth = getPart("month");
        const hYear = getPart("year");

        const isRamadhan = hMonth === "9";
        const hijriDay = parseInt(hDay);
        const hijriYear = hYear;

        // Jika hari ini (setelah dikoreksi) adalah Ramadhan, maka index = hijriDay - 1
        // Contoh: 1 Ramadhan -> index 0
        const dayIndex = isRamadhan ? Math.min(29, hijriDay - 1) : 0;
        const schedule = data.imsakiyah[dayIndex];

        const hMonthName = new Intl.DateTimeFormat(
          "id-ID-u-ca-islamic-umalqura",
          { month: "long" },
        ).format(adjustedDate);

        setTimings(schedule);
        setDateInfo({
          gregorian: today.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          hijri: `${hDay} ${hMonthName} ${hijriYear} H`,
        });
        setLocation({ provinsi: data.provinsi, kabkota: data.kabkota });
        localStorage.setItem(
          "user_location",
          JSON.stringify({ provinsi: data.provinsi, kabkota: data.kabkota }),
        );
      }
    } catch (err) {
      setError("Jadwal tidak tersedia untuk lokasi ini");
    } finally {
      setLoading(false);
    }
  }, []);

  const mapProvinceName = (name) => {
    if (!name) return "";
    const lower = name.toLowerCase();
    if (lower.includes("jakarta")) return "DKI Jakarta";
    if (lower.includes("yogyakarta")) return "DI Yogyakarta";
    if (lower.includes("jawa barat") || lower.includes("west java"))
      return "Jawa Barat";
    if (lower.includes("jawa tengah") || lower.includes("central java"))
      return "Jawa Tengah";
    if (lower.includes("jawa timur") || lower.includes("east java"))
      return "Jawa Timur";
    if (lower.includes("sumatera utara") || lower.includes("north sumatra"))
      return "Sumatera Utara";
    if (lower.includes("sumatera barat") || lower.includes("west sumatra"))
      return "Sumatera Barat";
    if (lower.includes("sumatera selatan") || lower.includes("south sumatra"))
      return "Sumatera Selatan";
    if (lower.includes("sulawesi selatan") || lower.includes("south sulawesi"))
      return "Sulawesi Selatan";
    if (lower.includes("sulawesi utara") || lower.includes("north sulawesi"))
      return "Sulawesi Utara";
    if (lower.includes("kalimantan timur") || lower.includes("east kalimantan"))
      return "Kalimantan Timur";
    if (lower.includes("kalimantan barat") || lower.includes("west kalimantan"))
      return "Kalimantan Barat";
    if (
      lower.includes("nusa tenggara barat") ||
      lower.includes("west nusa tenggara")
    )
      return "Nusa Tenggara Barat";
    if (
      lower.includes("nusa tenggara timur") ||
      lower.includes("east nusa tenggara")
    )
      return "Nusa Tenggara Timur";
    return name;
  };

  const findBestMatch = (list, target) => {
    if (!target || !list.length) return null;
    const normalizedTarget = mapProvinceName(target).toLowerCase();
    return list.find((item) => {
      const normalizedItem = item.toLowerCase();
      return (
        normalizedTarget.includes(normalizedItem) ||
        normalizedItem.includes(normalizedTarget)
      );
    });
  };

  // Initialize
  useEffect(() => {
    const init = async () => {
      let allProvinces = provinces;
      try {
        const res = await axios.get(
          "https://equran.id/api/v2/imsakiyah/provinsi",
        );
        if (res.data.code === 200) {
          allProvinces = res.data.data;
          setProvinces(allProvinces);
        }
      } catch (err) {
        console.error("Gagal ambil provinsi", err);
      }

      const saved = localStorage.getItem("user_location");
      if (saved) {
        try {
          const currentLoc = JSON.parse(saved);
          setLocation(currentLoc);
          await fetchCities(currentLoc.provinsi);
          await fetchImsakiyah(currentLoc.provinsi, currentLoc.kabkota);
          return;
        } catch (e) {
          console.error("Invalid saved location", e);
        }
      }

      if (navigator.geolocation) {
        setDetecting(true);
        // Tambahkan timeout 10 detik agar loading tidak stuck selamanya
        const geoTimeout = setTimeout(async () => {
          setDetecting(false);
          const fallback = {
            provinsi: "DKI Jakarta",
            kabkota: "Kota Jakarta Pusat",
          };
          await fetchCities(fallback.provinsi);
          await fetchImsakiyah(fallback.provinsi, fallback.kabkota);
        }, 10000);

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            clearTimeout(geoTimeout);
            try {
              const res = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
              );
              const addr = res.data.address;
              const city =
                addr.city || addr.town || addr.city_district || addr.county;
              const state = addr.state;

              const matchedProv = findBestMatch(allProvinces, state);
              if (matchedProv) {
                const fetchedCities = await fetchCities(matchedProv);
                const matchedCity = fetchedCities.find(
                  (c) =>
                    city.toLowerCase().includes(c.toLowerCase()) ||
                    c.toLowerCase().includes(city.toLowerCase()),
                );

                if (matchedCity) {
                  await fetchImsakiyah(matchedProv, matchedCity);
                  return;
                }
              }
              throw new Error("No match");
            } catch (err) {
              const fallback = {
                provinsi: "DKI Jakarta",
                kabkota: "Kota Jakarta Pusat",
              };
              await fetchCities(fallback.provinsi);
              await fetchImsakiyah(fallback.provinsi, fallback.kabkota);
            } finally {
              setDetecting(false);
            }
          },
          async () => {
            clearTimeout(geoTimeout);
            setDetecting(false);
            const fallback = {
              provinsi: "DKI Jakarta",
              kabkota: "Kota Jakarta Pusat",
            };
            await fetchCities(fallback.provinsi);
            await fetchImsakiyah(fallback.provinsi, fallback.kabkota);
          },
          { timeout: 10000 }, // Browser timeout juga 10 detik
        );
      } else {
        // Geolocation not supported
        const fallback = {
          provinsi: "DKI Jakarta",
          kabkota: "Kota Jakarta Pusat",
        };
        await fetchCities(fallback.provinsi);
        await fetchImsakiyah(fallback.provinsi, fallback.kabkota);
      }
    };
    init();
  }, [fetchImsakiyah]);

  const handleProvinceChange = async (e) => {
    const prov = e.target.value;
    setLocation((prev) => ({
      ...prev,
      provinsi: prov,
      kabkota: "Pilih Kab/Kota",
    }));
    const fetchedCities = await fetchCities(prov);
    if (fetchedCities.length > 0) {
      // Don't auto-fetch imsakiyah yet, wait for city selection
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setLocation((prev) => ({ ...prev, kabkota: city }));
    fetchImsakiyah(location.provinsi, city);
    setIsEditing(false);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      setDetecting(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
            );
            const state = res.data.address.state;
            const city =
              res.data.address.city ||
              res.data.address.town ||
              res.data.address.city_district ||
              res.data.address.county;

            const matchedProv = findBestMatch(provinces, state);
            if (matchedProv) {
              const fetchedCities = await fetchCities(matchedProv);
              const matchedCity = fetchedCities.find(
                (c) =>
                  city.toLowerCase().includes(c.toLowerCase()) ||
                  c.toLowerCase().includes(city.toLowerCase()),
              );

              if (matchedCity) {
                fetchImsakiyah(matchedProv, matchedCity);
                setIsEditing(false);
              } else {
                setLocation({
                  provinsi: matchedProv,
                  kabkota: "Pilih Kab/Kota",
                });
                setError(`Berada di ${state}, silakan pilih kota.`);
              }
            } else {
              setError(
                `Provinsi '${state}' tidak dikenali oleh sistem Kemenag.`,
              );
            }
          } catch (err) {
            setError("Gagal mendeteksi nama lokasi");
          } finally {
            setDetecting(false);
          }
        },
        (err) => {
          setDetecting(false);
          setError(
            err.code === 1 ? "Izin lokasi ditolak." : "Gagal mendapat lokasi.",
          );
        },
      );
    } else {
      setError("Geolocation tidak didukung oleh browser Anda.");
    }
  };

  if (loading && !timings) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-slate-700 animate-pulse flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="font-medium">Memuat Jadwal Imsakiyah...</p>
        </div>
      </div>
    );
  }

  const prayers = [
    { label: "Imsak", time: timings?.imsak, icon: Wind },
    { label: "Subuh", time: timings?.subuh, icon: Sunrise },
    { label: "Dzuhur", time: timings?.dzuhur, icon: Sun },
    { label: "Ashar", time: timings?.ashar, icon: Sun },
    { label: "Maghrib", time: timings?.maghrib, icon: Sunset },
    { label: "Isya", time: timings?.isya, icon: Moon },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-lg border border-gray-100 dark:border-slate-700 mb-8 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 relative z-20">
        <div className="flex-1">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 mb-4 md:mb-2 text-center md:text-left">
            <Clock className="text-emerald-500 w-8 h-8 md:w-6 md:h-6" />
            <span>Jadwal Imsakiyah 1447H</span>
          </h3>

          <div className="mt-2">
            {/* Desktop Layout - Exact original emerald style */}
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/5 dark:bg-emerald-500/10 px-3 py-1.5 rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all">
              <MapPin size={14} className="text-red-400 shrink-0" />
              <div className="relative flex items-center group/sel">
                <select
                  value={location.provinsi}
                  onChange={handleProvinceChange}
                  className="bg-transparent border-none p-0 pr-4 text-sm font-bold focus:ring-0 outline-none cursor-pointer appearance-none text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {provinces.map((p) => (
                    <option key={p} value={p} className="dark:bg-slate-800">
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={10}
                  className="absolute right-0 text-gray-400 group-hover/sel:text-emerald-500 pointer-events-none"
                />
              </div>

              <span className="text-gray-300 dark:text-gray-600 font-light mx-0.5">
                |
              </span>

              <div className="relative flex items-center group/sel">
                <select
                  value={location.kabkota}
                  onChange={handleCityChange}
                  disabled={loadingCities}
                  className="bg-transparent border-none p-0 pr-4 text-sm font-bold focus:ring-0 outline-none cursor-pointer appearance-none text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50"
                >
                  {cities.map((c) => (
                    <option key={c} value={c} className="dark:bg-slate-800">
                      {c}
                    </option>
                  ))}
                </select>
                {loadingCities ? (
                  <Loader2
                    size={10}
                    className="absolute right-0 animate-spin text-emerald-500"
                  />
                ) : (
                  <ChevronDown
                    size={10}
                    className="absolute right-0 text-gray-400 group-hover/sel:text-emerald-500 pointer-events-none"
                  />
                )}
              </div>

              <button
                onClick={detectLocation}
                disabled={detecting}
                title="Deteksi Lokasi Otomatis"
                className="p-1.5 hover:bg-emerald-500/20 rounded-lg transition-all text-emerald-600 dark:text-emerald-400 active:scale-95 disabled:opacity-50"
              >
                {detecting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Navigation size={14} />
                )}
              </button>
            </div>

            {/* Mobile Layout - Modern Location Card Style */}
            <div className="sm:hidden flex items-center bg-emerald-500/5 dark:bg-emerald-500/10 p-1 rounded-2xl border border-emerald-500/10 w-full shadow-sm">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-emerald-500/5 ml-0.5">
                <MapPin size={16} className="text-red-400" />
              </div>

              <div className="flex-1 flex flex-col justify-center px-4 min-w-0 text-left">
                <div className="relative w-full">
                  <select
                    value={location.provinsi}
                    onChange={handleProvinceChange}
                    className="w-full bg-transparent border-none p-0 pr-4 text-[10px] font-black uppercase tracking-widest text-emerald-600/60 focus:ring-0 outline-none appearance-none"
                  >
                    {provinces.map((p) => (
                      <option key={p} value={p} className="dark:bg-slate-800">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full -mt-0.5">
                  <select
                    value={location.kabkota}
                    onChange={handleCityChange}
                    disabled={loadingCities}
                    className="w-full bg-transparent border-none p-0 pr-4 text-sm font-bold text-gray-800 dark:text-white focus:ring-0 outline-none appearance-none disabled:opacity-50 truncate text-left"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c} className="dark:bg-slate-800">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={detectLocation}
                disabled={detecting}
                className="p-3.5 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all active:scale-90"
              >
                {detecting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Navigation size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-2xl flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold animate-shake">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-right w-full md:w-auto mt-4 md:mt-0">
          {/* Gregorian Date - Full Width */}
          <div className="w-full px-5 py-2.5 bg-white dark:bg-slate-700/50 text-gray-700 dark:text-emerald-400 rounded-2xl font-bold text-sm border border-gray-100 dark:border-white/5 shadow-sm text-center">
            {dateInfo.gregorian}
          </div>

          {/* Hijri Date & Time - Separate buttons with custom radius and gap */}
          <div className="flex gap-1 w-full">
            <div className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-black text-sm text-center flex items-center justify-center whitespace-nowrap rounded-l-2xl rounded-r-none shadow-xl shadow-emerald-600/20">
              {dateInfo.hijri}
            </div>
            <div className="px-4 py-2.5 bg-emerald-600 text-white font-black text-sm text-center flex items-center justify-center min-w-[70px] rounded-r-2xl rounded-l-none shadow-xl shadow-emerald-600/20">
              {currentTime}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10 animate-fade-in">
        {prayers.map((prayer, index) => {
          const Icon = prayer.icon;
          return (
            <div
              key={index}
              className="p-5 rounded-3xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all duration-300 flex flex-col items-center gap-3 group/item overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-emerald-500/0 group-hover/item:bg-emerald-500/5 transition-colors duration-300"></div>
              <div className="p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm relative z-10 group-hover/item:scale-110 transition-transform">
                <Icon size={20} className="text-emerald-500" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-400 dark:text-gray-500">
                  {prayer.label}
                </p>
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {prayer.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest order-2 sm:order-1">
          Sumber Data: equran.id (Bimas Islam Kemenag RI)
        </p>
        <Link
          to="/qiblat"
          className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
        >
          <Compass
            size={18}
            className="group-hover:rotate-12 transition-transform"
          />
          <span>Cek Arah Qiblat</span>
        </Link>
      </div>
    </div>
  );
}
