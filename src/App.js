import "./App.css";
import RoutesContainer from "@/routes";
import OfflineNotice from "@/components/OfflineNotice";

function App() {
  return (
    <>
      <RoutesContainer />
      <OfflineNotice />
    </>
  );
}

export default App;
