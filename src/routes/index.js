import { Routes, Route } from "react-router-dom";
import Footer from "@/components/Footer";
import SurahList from "@/pages/SurahList";
import SurahRead from "@/pages/SurahRead";
import SmartSearch from "@/pages/SmartSearch";
import Help from "@/pages/Help";

export default function RoutesContainer() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SurahList />} />
        <Route path="/baca/:no" element={<SurahRead />} />
        <Route path="/tanya-ai" element={<SmartSearch />} />
        <Route path="/bantuan" element={<Help />} />
      </Routes>
      <Footer />
    </>
  );
}
