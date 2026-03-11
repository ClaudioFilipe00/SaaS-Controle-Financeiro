import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Auth/authPage";
import HomePage from "./pages/Home/HomePage";
import StatementPage from "./pages/Transactions/statementPage";
import PrivateRoute from "./components/privateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Pública */}
        <Route path="/" element={<AuthPage />} />

        {/*  Protegidas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/extrato"
          element={
            <PrivateRoute>
              <StatementPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;