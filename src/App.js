import Home from "./pages/Home";
import {useMoralis} from 'react-moralis'
import { useEffect } from "react";
import {Route, Routes} from 'react-router-dom'
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";

function App() {
  const {isWeb3Enabled, enableWeb3} = useMoralis()

  useEffect(() => {
    if(!isWeb3Enabled){
      enableWeb3()
    }
  }, [])
  
  return (
    <div className="App">
    
     <Routes>
      <Route  path="/"  element={ <Home />}     />
      <Route  path="/upload" element={<CreatePost />}  />
     </Routes>
    </div>
  );
}

export default App;
