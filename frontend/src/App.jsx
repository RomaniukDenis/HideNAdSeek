import './App.css';
import io from 'socket.io-client';
import Game from "./components/game/Game";

let origin = undefined;
if(process.env.NODE_ENV == 'development'){
    origin = 'http://localhost:5001'
}
const socket = io.connect(origin);

function App() {
  return (
    <div>
      <Game socket={socket}></Game>
    </div>
  )
}

export default App;
