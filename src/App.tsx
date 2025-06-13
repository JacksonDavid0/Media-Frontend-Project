import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "./components/layout";
import "../css/index.css";
import Register from "./components/Register_Login/register";
import Login from "./components/Register_Login/login";
import HomePage from "./components/home/home";
import ProfilePage from "./components/Profile/profile";
import { MyContextProvider } from "./components/functions/logics";

function App() {
  return (
    <MyContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/home" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </MyContextProvider>
  );
}

export default App;
