import { Routes, Route } from "react-router-dom";
import SurahList from "../pages/SurahList";
import SurahRead from "../pages/SurahRead";

export default function RoutesContainer() {
  return (
    <Routes>
      <Route path="/" element={<SurahList />} />
      <Route path="/baca/:no" element={<SurahRead />} />
    </Routes>
  );
}
