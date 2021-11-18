import "./App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route exact path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/project" component={Projects} />
      <Route component={Error404} /> */}
    </Routes>
  );
}

export default App;
