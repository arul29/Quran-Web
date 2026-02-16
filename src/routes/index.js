import { Routes, Route } from "react-router-dom";
import Footer from "@/components/Footer";
import SurahList from "@/pages/SurahList";
import SurahRead from "@/pages/SurahRead";
import JuzList from "@/pages/JuzList";
import JuzRead from "@/pages/JuzRead";
import DoaList from "@/pages/DoaList";
import DoaRead from "@/pages/DoaRead";
import SmartSearch from "@/pages/SmartSearch";
import Help from "@/pages/Help";
import Qiblat from "@/pages/Qiblat";

export default function RoutesContainer() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SurahList />} />
        <Route path="/baca/:no" element={<SurahRead />} />
        <Route path="/juz" element={<JuzList />} />
        <Route path="/juz/:juzNumber" element={<JuzRead />} />
        <Route path="/doa" element={<DoaList />} />
        <Route path="/doa/:id" element={<DoaRead />} />
        <Route path="/tanya-ai" element={<SmartSearch />} />
        <Route path="/bantuan" element={<Help />} />
        <Route path="/qiblat" element={<Qiblat />} />
      </Routes>
      <Footer />
    </>
  );
}
