import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { convertToArabicNumbers, RawHTML } from "../helpers";

export default function SurahRead() {
  const { no } = useParams();
  const [loading, setLoading] = useState(false);
  const [surahData, setSurahData] = useState({});
  const [surahRead, setSurahRead] = useState([]);

  const getSurahData = async () => {
    setLoading(true);
    await axios
      .get(`https://equran.id/api/surat/${no}`)
      .then(async (res) => {
        console.log(res.data.ayat);
        setSurahData(res.data);
        setSurahRead(res.data.ayat);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    getSurahData();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 lg:px-16 py-20">
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen -mt-36">
          <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
            <svg
              fill="none"
              className="w-6 h-6 animate-spin"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
            <div>Memuat ...</div>
          </div>
        </div>
      ) : (
        <div className="relative  h-auto bg-blue-100 rounded-md pt-24 pb-8 lg:px-36 px-8 shadow-md hover:shadow-lg transition flex flex-col">
          <div className="absolute rounded-full bg-gray-100 w-28 h-28  z-10 -top-8 shadow-sm flex place-items-center justify-center self-end">
            <div className="h-20 w-20  rounded-full bg-gray-100 vertical-text-center text-center place-items-center flex justify-center ">
              <h1 className="text-3xl text-gray-800 uppercase tracking-wide text-center">
                {surahData.nama}
              </h1>
            </div>
          </div>
          <label className="font-bold text-gray-800 text-lg">
            {surahData.nama_latin}
          </label>
          {surahRead.map((item, index) => {
            return (
              <>
                <p className="text-right text-3xl text-gray-500 mt-2 leading-relaxed">
                  {item.ar} ({convertToArabicNumbers(item.nomor)})
                </p>
                <p className="text-left text-gray-500 mt-2 leading-relaxed">
                  <RawHTML>{item.tr}</RawHTML>
                </p>
                <p className="text-left text-gray-500 mt-2 leading-relaxed">
                  <i>{item.idn}</i>
                </p>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}
