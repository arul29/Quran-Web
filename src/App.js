import "./App.css";
import SurahList from "./pages/SurahList";
import { Routes, Route } from "react-router-dom";
import SurahRead from "./pages/SurahRead";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SurahList />} />
      <Route path="/baca/:no" element={<SurahRead />} />
      {/* <Route exact path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/project" component={Projects} />
      <Route component={Error404} /> */}
    </Routes>
  );
}

export default App;
