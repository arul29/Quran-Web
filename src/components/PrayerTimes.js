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
} from "lucide-react";

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
        const ramadhanStart = new Date("2026-02-18"); // Approx start for 1447H
        const diffTime = today - ramadhanStart;
        const diffDays = Math.max(
          0,
          Math.floor(diffTime / (1000 * 60 * 60 * 24)),
        );

        // Ensure index is within 0-29
        const dayIndex = Math.min(29, diffDays);
        const schedule = data.imsakiyah[dayIndex];

        setTimings(schedule);
        setDateInfo({
          gregorian: today.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          hijri: `${dayIndex + 1} Ramadhan 1447 H`,
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

  // Initialize
  useEffect(() => {
    const init = async () => {
      // 1. Fetch provinces first as they are needed for matching
      let allProvinces = provinces;
      if (provinces.length === 0) {
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
      }

      const saved = localStorage.getItem("user_location");
      if (saved) {
        try {
          const currentLoc = JSON.parse(saved);
          setLocation(currentLoc);
          await fetchCities(currentLoc.provinsi);
          await fetchImsakiyah(currentLoc.provinsi, currentLoc.kabkota);
          return; // Exit if loaded from saved
        } catch (e) {
          console.error("Invalid saved location", e);
        }
      }

      // 2. If no saved location, try auto-detect
      if (navigator.geolocation) {
        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const res = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
              );
              const addr = res.data.address;
              const city =
                addr.city || addr.town || addr.city_district || addr.county;
              const state = addr.state;

              if (state && city && allProvinces.length > 0) {
                const matchedProv = allProvinces.find(
                  (p) =>
                    state.toLowerCase().includes(p.toLowerCase()) ||
                    p.toLowerCase().includes(state.toLowerCase()),
                );

                if (matchedProv) {
                  const fetchedCities = await fetchCities(matchedProv);
                  const matchedCity = fetchedCities.find(
                    (c) =>
                      city.toLowerCase().includes(c.toLowerCase()) ||
                      c.toLowerCase().includes(city.toLowerCase()),
                  );

                  if (matchedCity) {
                    await fetchImsakiyah(matchedProv, matchedCity);
                    setDetecting(false);
                    return;
                  }
                }
              }
              // Fallback if no match found
              const fallback = {
                provinsi: "DKI Jakarta",
                kabkota: "Kota Jakarta Pusat",
              };
              await fetchCities(fallback.provinsi);
              await fetchImsakiyah(fallback.provinsi, fallback.kabkota);
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
            // Geolocation denied or failed
            setDetecting(false);
            const fallback = {
              provinsi: "DKI Jakarta",
              kabkota: "Kota Jakarta Pusat",
            };
            await fetchCities(fallback.provinsi);
            await fetchImsakiyah(fallback.provinsi, fallback.kabkota);
          },
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
            const addr = res.data.address;
            const city =
              addr.city || addr.town || addr.city_district || addr.county;
            const state = addr.state;

            if (state && city) {
              // Find closest match in our API list if possible
              // For now, try to find province prefix match
              const matchedProv = provinces.find(
                (p) =>
                  state.toLowerCase().includes(p.toLowerCase()) ||
                  p.toLowerCase().includes(state.toLowerCase()),
              );
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
                  setError(`Berada di ${state}, silakan pilih kota terdekat.`);
                }
              } else {
                setError("Provinsi tidak ditemukan.");
              }
            } else {
              setError("Gagal mendeteksi kota atau provinsi dari lokasi Anda.");
            }
          } catch (err) {
            setError("Gagal mendeteksi nama lokasi");
          } finally {
            setDetecting(false);
          }
        },
        (err) => {
          setDetecting(false);
          if (err.code === err.PERMISSION_DENIED) {
            setError(
              "Izin lokasi ditolak. Silakan izinkan di pengaturan browser Anda.",
            );
          } else {
            setError("Gagal mendapatkan lokasi Anda.");
          }
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
          <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <Clock className="text-emerald-500" />
            Jadwal Imsakiyah 1447H
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-500/5 dark:bg-emerald-500/10 px-3 py-1.5 rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all">
              <MapPin size={14} className="text-red-400 shrink-0" />

              {/* Province Selector */}
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

              <span className="text-gray-300 dark:text-gray-600 font-light">
                |
              </span>

              {/* City Selector */}
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

              {/* Detect Button Icon */}
              <button
                onClick={detectLocation}
                disabled={detecting}
                title="Deteksi Lokasi Otomatis"
                className="ml-1 p-1.5 hover:bg-emerald-500/20 rounded-lg transition-all text-emerald-600 dark:text-emerald-400 active:scale-95 disabled:opacity-50"
              >
                {detecting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Navigation size={14} />
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

        <div className="flex flex-col items-center md:items-end gap-2 text-right">
          <div className="px-5 py-2.5 bg-white dark:bg-slate-700/50 text-gray-700 dark:text-emerald-400 rounded-2xl font-bold text-sm border border-gray-100 dark:border-white/5 shadow-sm">
            {dateInfo.gregorian}
          </div>
          <div className="px-5 py-2.5 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20">
            {dateInfo.hijri}
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

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 flex flex-col items-center gap-2">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Sumber Data: equran.id (Bimas Islam Kemenag RI)
        </p>
      </div>
    </div>
  );
}
