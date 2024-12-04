import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {publicRoutes} from "./routes";
import './App.css'
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {publicRoutes.map((router, index) => {
            const Page = router.component;
            return (
              <Route
                key={index}
                path={router.path}
                element={<Page />}
            />
            );
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
