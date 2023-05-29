import React, { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import Navigation from "./components/Navigation";
import API_Testing from "./components/API_Testing";
import Speech from "./components/Speech";
import MovieDetail from "./components/MovieDetail";

const MainComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  return <>{isLogin ? <MovieDetail /> : <LoginScreen />}</>;
};

export default MainComponent;
