import React from "react";

export default function Home() {
  return (
    <section className="max-w-12xl px-4 sm:px-6 lg:px-24 py-12 bg-gray-100">
      <div className="w-full text-center pb-8">
        <div class="grid justify-items-stretch">
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
          Baca Al-Qur'an Secara Online dan Mudah
        </p>
      </div>
      <div
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
        onClick={() => alert("OKOK")}
      >
        {[1, 2, 3, 4, 5].map((item, index) => {
          return (
            <div
              className="bg-white rounded-lg p-6 cursor-pointer hover:bg-blue-50"
              key={index}
            >
              <div className="flex items-center space-x-6 mb-4">
                <div className="h-20 w-20  rounded-full bg-gray-100 vertical-text-center text-center place-items-center flex justify-center">
                  <h1 className="text-3xl text-gray-800 uppercase tracking-wide text-center">
                    {item}
                  </h1>
                </div>
                <div>
                  <p className="text-xl text-gray-700 font-normal mb-1">
                    الفاتحة
                  </p>
                  <p className="text-base text-blue-600 font-normal">
                    Al-Fatihah
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 leading-loose font-normal text-base">
                  <i>Al Faatihah</i> (Pembukaan) yang diturunkan di Mekah dan
                  terdiri dari 7 ayat adalah surat yang pertama-tama diturunkan
                  dengan lengkap diantara surat-surat yang ada dalam Al Quran
                  dan termasuk golongan surat Makkiyyah. Surat ini disebut{" "}
                  <i>Al Faatihah</i> (Pembukaan), karena dengan surat inilah
                  dibuka dan dimulainya Al Quran. Dinamakan <i>Ummul Quran</i>{" "}
                  (induk Al Quran) atau <i>Ummul Kitaab</i> (induk Al Kitaab)
                  karena dia merupakan induk dari semua isi Al Quran, dan karena
                  itu diwajibkan membacanya pada tiap-tiap sembahyang.
                  <br /> Dinamakan pula <i>As Sab'ul matsaany</i> (tujuh yang
                  berulang-ulang) karena ayatnya tujuh dan dibaca berulang-ulang
                  dalam sholat.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
