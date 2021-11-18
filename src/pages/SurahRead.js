import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";

export default function SurahRead() {
  const b = {
    status: true,
    nomor: "110",
    nama: "النصر",
    nama_latin: "An-Nasr",
    jumlah_ayat: "3",
    tempat_turun: "madinah",
    arti: "Pertolongan",
    deskripsi:
      "Surat An Nashr terdiri atas 3 ayat, termasuk golongan surat-surat  Madaniyyah yang diturunkan di Mekah sesudah surat At Taubah.  Dinamai <i>An Nashr</i> (pertolongan) diambil dari perkataan <i>Nashr</i> yang  terdapat pada ayat pertama surat ini.",
    audio: "https://equran.id/content/audio/110.mp3",
    ayat: [
      {
        nomor: "1",
        ar: "اِذَا جَاۤءَ نَصْرُ اللّٰهِ وَالْفَتْحُۙ",
        tr: "i<u>dzaa</u> j<u>aa</u>-a na<u>sh</u>ru <strong>al</strong>l<u>aa</u>hi wa<strong>a</strong>lfat<u>h</u><strong>u</strong>",
        idn: "Apabila telah datang pertolongan Allah dan kemenangan,",
      },
      {
        nomor: "2",
        ar: "وَرَاَيْتَ النَّاسَ يَدْخُلُوْنَ فِيْ دِيْنِ اللّٰهِ اَفْوَاجًاۙ",
        tr: "wara-ayta <strong>al</strong>nn<u>aa</u>sa yadkhuluuna fii diini <strong>al</strong>l<u>aa</u>hi afw<u>aa</u>j<u>aa</u><strong>n</strong>",
        idn: "dan engkau melihat manusia berbondong-bondong masuk agama Allah,",
      },
      {
        nomor: "3",
        ar: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُۗ اِنَّهٗ كَانَ تَوَّابًا ࣖ",
        tr: "fasabbi<u>h</u> bi<u>h</u>amdi rabbika wa<strong>i</strong>staghfirhu innahu k<u>aa</u>na taww<u>aa</u>b<u>aa</u><strong>n</strong>",
        idn: "maka bertasbihlah dalam dengan Tuhanmu dan mohonlah ampunan kepada-Nya. Sungguh, Dia Maha Penerima tobat.",
      },
    ],
  };

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

  const RawHTML = ({ children, className = "" }) => (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: children.replace(/\n/g, "<br />"),
      }}
    />
  );

  const convertToArabicNumbers = (num) => {
    const arabicNumbers =
      "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";
    return new String(num).replace(/[0123456789]/g, (d) => {
      return arabicNumbers[d];
    });
  };

  return (
    <section dir="rtl" className="relative w-full bg-white">
      <div className="relative w-full px-4 pt-16 pb-16 mx-auto bg-top bg-cover max-w-6xl lg:py-24 lg:pb-32">
        {loading ? (
          "loading.."
        ) : (
          <div className="max-w-xl mb-10 ml-auto mr-auto bg-top bg-cover md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <p className="inline-block px-3 py-1 mb-4 text-xl font-semibold tracking-wider uppercase bg-blue-600 rounded-full text-purple-50">
              {surahData.nama}
            </p>
            <p className="my-2">{surahData.nama_latin}</p>
            {/* <p className="text-base text-gray-700 md:text-lg my-2">
              <RawHTML>{surahData.deskripsi}</RawHTML>
            </p> */}
            {surahRead.map((item, index) => {
              return (
                <div className="max-w-2xl mb-6 ml-auto mr-auto  tracking-tight text-gray-900 bg-top bg-cover sm:text-4xl md:mx-auto">
                  <p className="text-base text-gray-700 text-xl">
                    {item.ar} ({convertToArabicNumbers(item.nomor)})
                  </p>
                  {/* <p className="inline max-w-lg text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto"></p> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

{
  /* <div className="absolute inset-0 w-full h-full opacity-25 sm:opacity-50 overflow-hidden">
        <svg
          viewBox="0 0 150 350"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="absolute top-0 right-0 w-auto h-full opacity-75"
        >
          <defs>
            <path d="M0 0h50v50H0z" />
            <path d="M0 0h50v50H0z" />
            <path d="M0 0h150v150H0z" />
          </defs>
          <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
            <g>
              <g fill="#3B82F6" fillRule="nonzero">
                <path d="M25 25c13.807 0 25-11.193 25-25H0c0 13.807 11.193 25 25 25z" />
              </g>
              <g transform="translate(0 100)">
                <mask fill="#fff">
                  <use xlinkHref="#path-1" />
                </mask>
                <path
                  d="M25 0c13.807 0 25 11.193 25 25S38.807 50 25 50H0V0h25z"
                  fill="#F9C7FF"
                  mask="url(#mask-2)"
                />
              </g>
              <g transform="translate(100 100)">
                <mask fill="#fff">
                  <use xlinkHref="#path-3" />
                </mask>
                <path
                  d="M25 25c13.807 0 25-11.193 25-25H0c0 13.807 11.193 25 25 25z"
                  fill="#93FFFD"
                  fillRule="nonzero"
                  mask="url(#mask-4)"
                />
              </g>
              <g transform="translate(0 200)">
                <mask fill="#fff">
                  <use xlinkHref="#path-5" />
                </mask>
                <path
                  d="M75 75c0 41.421 33.579 75 75 75V0c-41.421 0-75 33.579-75 75z"
                  fill="#421984"
                  fillRule="nonzero"
                  mask="url(#mask-6)"
                />
              </g>
            </g>
          </g>
        </svg>
        <svg
          viewBox="0 0 150 150"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="absolute top-0 left-0 w-auto h-full opacity-30"
        >
          <defs>
            <path d="M0 0h50v50H0z" />
            <path d="M0 0h50v50H0z" />
          </defs>
          <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
            <g transform="matrix(-1 0 0 1 150 0)">
              <g transform="translate(0 25)" fill="#93FFFD" fillRule="nonzero">
                <path d="M25 0C11.193 0 0 11.193 0 25h50C50 11.193 38.807 0 25 0z" />
              </g>
              <path
                d="M25 50C11.193 50 0 38.807 0 25S11.193 0 25 0h25v50H25z"
                transform="translate(100)"
                fill="#FF642D"
              />
              <g transform="translate(0 100)">
                <mask fill="#fff">
                  <use xlinkHref="#path-1" />
                </mask>
                <path
                  d="M25 50C11.193 50 0 38.807 0 25S11.193 0 25 0h25v50H25z"
                  fill="#B3EBFF"
                  mask="url(#mask-2)"
                />
              </g>
              <g transform="translate(100 200)">
                <mask fill="#fff">
                  <use xlinkHref="#path-3" />
                </mask>
                <path
                  d="M25 50C11.193 50 0 38.807 0 25S11.193 0 25 0h25v50H25z"
                  fill="##7A8AF3"
                  mask="url(#mask-4)"
                />
              </g>
            </g>
          </g>
        </svg>
      </div> */
}
