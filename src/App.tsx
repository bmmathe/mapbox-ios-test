import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const showMap = (map: number) => {
    navigate(`/map/${map}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold underline text-center">Hello world!</h1>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
        onClick={() => showMap(1)}
      >
        Dirty Sheets
      </button>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
        onClick={() => showMap(2)}
      >
        Peachtree Road Race
      </button>
    </div>
  );
}

export default App;
