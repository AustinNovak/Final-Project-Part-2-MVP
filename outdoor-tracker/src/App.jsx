import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LogTrip from "./pages/LogTrip";
import MyTrips from "./pages/MyTrips";
import TripDetails from "./pages/TripDetails";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { TripProvider } from "./context/TripContext";

function App() {
  return (
    <BrowserRouter>
      <TripProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log" element={<LogTrip />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </TripProvider>
    </BrowserRouter>
  );
}

export default App;