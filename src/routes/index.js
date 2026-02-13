import { Routes, Route } from "react-router-dom";
import Footer from "@/components/Footer";
import SurahList from "@/pages/SurahList";
import SurahRead from "@/pages/SurahRead";
import JuzList from "@/pages/JuzList";
import JuzRead from "@/pages/JuzRead";
import SmartSearch from "@/pages/SmartSearch";
import Help from "@/pages/Help";

export default function RoutesContainer() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SurahList />} />
        <Route path="/baca/:no" element={<SurahRead />} />
        <Route path="/juz" element={<JuzList />} />
        <Route path="/juz/:juzNumber" element={<JuzRead />} />
        <Route path="/tanya-ai" element={<SmartSearch />} />
        <Route path="/bantuan" element={<Help />} />
      </Routes>
      <Footer />
    </>
  );
}
