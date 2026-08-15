import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  const path = window.location.pathname;

  if (path === "/bior/admin" || path === "/admin") {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <Admin />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Home />
    </div>
  );
}

export default App;