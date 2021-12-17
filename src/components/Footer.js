import React from "react";

export default function Footer() {
  return (
    <footer className="footer bg-white relative pt-1 border-b-2">
      <div className="container mx-auto px-6">
        <div className="mt-16 border-t-2 border-gray-300 flex flex-col items-center">
          <div className="sm:w-2/3 text-center py-6">
            <p className="text-sm text-gray-500 font-bold mb-2">
              {new Date().getFullYear() + " "}© Al-Quran Indonesia Made by
              <a
                className="text-blue-300"
                href="https://darul.id"
                target="_blank"
              >
                {" "}
                Darul.Id
              </a>
            </p>
            <p className="text-sm text-gray-500 font-bold mb-2">
              Api Quran by
              <a
                className="text-blue-300"
                href="https://equran.id/apidev"
                target="_blank"
              >
                {" "}
                Equran.Id
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
