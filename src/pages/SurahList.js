import React, { useEffect, useState } from "react";
import axios from "axios";
import { convertToArabicNumbers } from "../helpers";

export default function SurahList() {
  const [loading, setLoading] = useState(false);
  const [surahList, setSurahList] = useState([]);
  const [surahAll, setSurahAll] = useState([]);
  const [bookmark, setBookmark] = useState([]);
  const [viewBookmark, setViewBookmark] = useState(false);

  const getSurahList = async () => {
    setLoading(true);
    await axios
      .get(`https://equran.id/api/surat`)
      .then(async (res) => {
        setSurahList(res.data);
        setSurahAll(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const searchSurah = (event) => {
    let updatedList = viewBookmark ? bookmark : surahAll;
    updatedList = updatedList.filter(function (item) {
      return (
        item.nama_latin
          .toLowerCase()
          .search(event.target.value.toLowerCase()) !== -1
      );
    });
    setSurahList(updatedList);
  };

  const getBookmark = () => {
    const bookmark = localStorage.getItem("bookmark");
    if (bookmark) {
      setBookmark(JSON.parse(bookmark));
    } else {
      setBookmark([]);
      console.log("No Bookmark");
    }
  };

  const addBookmark = (item) => {
    const oldBookmark = localStorage.getItem("bookmark");
    let newBookmark;
    if (oldBookmark == null) {
      newBookmark = [];
    } else {
      newBookmark = JSON.parse(oldBookmark);
    }
    localStorage.setItem("bookmark", JSON.stringify(newBookmark.concat(item)));
    getBookmark();
  };

  const removeBookmark = (item_id) => {
    let newBookmark = bookmark.filter(function (obj) {
      return obj.nomor !== item_id;
    });
    localStorage.setItem("bookmark", JSON.stringify(newBookmark));
    getBookmark();
  };

  const isBookmark = (item_id) => {
    return bookmark.filter((bookmark) => item_id === bookmark.nomor).length > 0;
  };

  useEffect(() => {
    getBookmark();
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
      {/* SEARCH */}
      <div className="mb-8 w-full grid grid-cols-1 md:grid-cols-3 gap-6 w-full ">
        <div></div>
        <input
          onChange={searchSurah}
          type="search"
          className="bg-purple-white shadow self-auto rounded border-0 p-3"
          placeholder="Cari berdasarkan nama Surah..."
        />
        <div></div>
      </div>
      {/* <div className="mb-100">
        <a onClick={() => alert("Dalam pengembangan")}>Lihat Bookmark</a>
      </div> */}
      {/* SEARCH */}
      {/* BOOKMARK */}
      <div className="w-full text-center pb-8">
        <button
          onClick={() => {
            setViewBookmark(!viewBookmark);
            viewBookmark ? setSurahList(surahAll) : setSurahList(bookmark);
          }}
        >
          <p className="text-gray-400 font-normal text-base">
            {viewBookmark ? "Lihat Semua" : "Lihat Bookmark"}
          </p>
        </button>
      </div>
      {/* BOOKMARK */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6">
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
                {/* <a href={`/baca/${item.nomor}`}> */}
                <a href={`/baca/${item.nomor}`}>
                  <div className="flex justify-center md:justify-end -mt-16">
                    <div className="h-20 w-20  rounded-full bg-gray-100 vertical-text-center text-center place-items-center flex justify-center shadow">
                      <h1 className="text-3xl text-gray-800 uppercase tracking-wide text-center">
                        {convertToArabicNumbers(item.nomor)}
                      </h1>
                    </div>
                  </div>
                </a>
                <div className="w-24">
                  <a href={`/baca/${item.nomor}`}>
                    <h2 className="text-gray-800 text-3xl font-semibold">
                      {item.nama}
                    </h2>
                    <p className="mt-2 text-gray-600">{item.nama_latin}</p>
                  </a>
                </div>
                {/* BOOKMARK BUTTON */}

                <div className="flex justify-between mt-4">
                  {!viewBookmark && (
                    <button
                      onClick={() => {
                        if (isBookmark(item.nomor)) removeBookmark(item.nomor);
                        else addBookmark(item);
                      }}
                    >
                      <svg
                        fill={`${isBookmark(item.nomor) ? "#000" : "#eee"} `}
                        width="24"
                        height="24"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 321.188 321.188"
                        style={{ enableBackground: "new 0 0 321.188 321.188" }}
                        xmlSpace="preserve"
                      >
                        <polygon points="61.129,0 61.129,321.188 160.585,250.657 260.059,321.188 260.059,0 " />
                      </svg>
                    </button>
                  )}
                  <p className="text-xl font-medium text-blue-300">
                    {item.arti}
                  </p>
                </div>
                {/* BOOKMARK BUTTON */}
                {/* </a> */}
              </div>
            );
          })
        )}
        {surahList.length === 0 && "Data tidak ditemukan"}
      </div>
    </section>
  );
}
