import React, { useEffect, useState } from "react";
import axios from "axios";
import { convertToArabicNumbers } from "../helpers";

export default function SurahList() {
  const [loading, setLoading] = useState(false);
  const [surahList, setSurahList] = useState([]);

  const getSurahList = async () => {
    setLoading(true);
    await axios
      .get(`https://equran.id/api/surat`)
      .then(async (res) => {
        console.log("works");
        setSurahList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    getSurahList();
  }, []);

  return (
    <section className="max-w-12xl px-4 sm:px-6 lg:px-24 py-12 bg-gray-100">
      <div className="w-full text-center pb-8">
        <div className="grid justify-items-stretch">
          <img
            className="justify-self-center"
            src="https://cdn-icons-png.flaticon.com/512/2230/2230267.png"
            alt="Flaticon"
            width="48"
            height="48"
          />
        </div>

        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900 pb-2">
          Al-Qur'an Indonesia
        </h1>
        <p className="text-gray-400 font-normal text-base">
          Baca Al-Qur'an Secara Online dan Mudah, Dengan Terjemahan Bahasa
          Indonesia
        </p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <div className="h-36 py-4 px-8 bg-white shadow-lg rounded-lg my-10 bg-blue-50 w-full animate-pulse"></div>
            <div className="h-36 py-4 px-8 bg-white shadow-lg rounded-lg my-10 bg-blue-50 w-full animate-pulse"></div>
            <div className="h-36 py-4 px-8 bg-white shadow-lg rounded-lg my-10 bg-blue-50 w-full animate-pulse"></div>
          </>
        ) : (
          surahList.map((item, index) => {
            return (
              <div
                key={index}
                className="py-4 px-8 bg-white shadow-lg rounded-lg my-10 hover:bg-blue-50"
              >
                <a href={`/baca/${item.nomor}`}>
                  <div className="flex justify-center md:justify-end -mt-16">
                    <div className="h-20 w-20  rounded-full bg-gray-100 vertical-text-center text-center place-items-center flex justify-center shadow">
                      <h1 className="text-3xl text-gray-800 uppercase tracking-wide text-center">
                        {convertToArabicNumbers(item.nomor)}
                      </h1>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-gray-800 text-3xl font-semibold">
                      {item.nama}
                    </h2>
                    <p className="mt-2 text-gray-600">{item.nama_latin}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <p className="text-xl font-medium text-blue-300">
                      {item.arti}
                    </p>
                  </div>
                </a>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
