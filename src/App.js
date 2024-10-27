import System from "./Components/System";
import LoadingScreen from "./Components/LoadingScreen";
import { useEffect, useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Add this useEffect at the beginning of the System component
  useEffect(() => {
    // Simulate loading of assets
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(loadingTimer);
  }, []);
  return (
    <div className="App">
      {isLoading ? <LoadingScreen /> : <System></System>}
    </div>
  );
}

export default App;
