import {Canvas} from "@react-three/fiber";
import classes from "./Game.module.css"
import Player from "./player/Player"
import Plane from "./plane/Plane";
import RoomForm from "./room-from/RoomForm";
import {OrbitControls, Stars} from "@react-three/drei"
import { useEffect, useRef, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { RepeatWrapping, TextureLoader } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Timer from "./timer/Timer";

const playerMovement = {
    up: false,
    down: false,
    right: false,
    left: false
}

const STAGE_PREPARATION = 'REPARATION';
const STAGE_HIDING = 'HIDING';
const STAGE_PLAYING = 'PLAYING';
const STAGE_HIDERS_WIN = 'STAGE_HIDERS_WIN';
const STAGE_SEEKER_WIN = 'STAGE_SEEKER_WIN';
const TYPE_HIDER = 'HIDER';
const TYPE_SEEKER = 'SEEKER';
const TYPE_SPECTATOR = "SPECTATOR";


function Game(props){
    const socket = props.socket;
    const [room, setRoom] =  useState({players:[], world:[]});
    const [cameraPos, setCameraPos] =  useState([0, 0, 0]);
    const [currentPlayer, setCurrentPlayer] =  useState({});
    const orbitControlRef = useRef();

    const models = new Map();
    models.set('Mushroom_1', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Mushroom_1.fbx"))
    models.set('Mushroom_2', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Mushroom_2.fbx"))
    models.set('Mushroom_3', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Mushroom_3.fbx"))
    models.set('Mushroom_4', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Mushroom_4.fbx"))
    models.set('Wheat_1', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Wheat_1.fbx"))
    models.set('Wheat_2', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Wheat_2.fbx"))
    models.set('Wheat_3', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Wheat_3.fbx"))
    models.set('Wheat_4', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Wheat_4.fbx"))
    models.set('Mushroom_4', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Mushroom_4.fbx"))
    models.set('Pumpkin_1', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Pumpkin_1.fbx"))
    models.set('Pumpkin_2', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Pumpkin_2.fbx"))
    models.set('Pumpkin_3', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Pumpkin_3.fbx"))
    models.set('Pumpkin_4', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Pumpkin_4.fbx"))
    models.set('Mushroom_4', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/Mushroom_4.fbx"))
    models.set('PalmTree_1', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/PalmTree_1.fbx"))
    models.set('PalmTree_2', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/PalmTree_2.fbx"))
    models.set('PalmTree_3', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/PalmTree_3.fbx"))
    models.set('PalmTree_4', useLoader(FBXLoader, process.env.PUBLIC_URL + "models/PalmTree_4.fbx"))
    
    const getObj = (name) => {
        const object = models.get(name);
        return object.clone()
    }

    useEffect(()=>{
        socket.on("server_tick", room => {
            setRoom(room);
            const cp = room.players.find(p => p.id === socket.id);
            setCurrentPlayer(cp);
            setCameraPos(cp.position);
        });
        socket.on("error", error => alert(error));
    }, [socket])

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        window.addEventListener("keypress", pressHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
            window.removeEventListener("keypress", pressHandler);
        }
    }, []);

    const downHandler = (event) => {
        console.log(event.keyCode);
        switch(event.keyCode){
            case 87: playerMovement.up = true; break;
            case 68: playerMovement.right = true; break;
            case 65: playerMovement.left = true; break;
            case 83: playerMovement.down = true; break;
            default: return;
        }
        const rotation = orbitControlRef.current.getAzimuthalAngle();
        socket.emit("player_move", {playerMovement, rotation})
    }
    const upHandler = (event) => {
        console.log(event.keyCode);
        switch(event.keyCode){
            case 87: playerMovement.up = false; break;
            case 68: playerMovement.right = false; break;
            case 65: playerMovement.left = false; break;
            case 83: playerMovement.down = false; break;
            default: return;     
        }
        const rotation = orbitControlRef.current.getAzimuthalAngle();
        socket.emit("player_move", {playerMovement, rotation})
    }
    const pressHandler = (event) => {
        if(event.keyCode == 101){
            socket.emit('catch_spell');
        }
    }

    if(room.gameStage == STAGE_HIDING && currentPlayer.type == TYPE_SEEKER){
        return(
            <div className={classes.blackScreen}>
                <Timer gameStage={room.gameStage} timer={room.hidingTime} color = "white"/>
                <h1 className={classes.redtittle}>YOU ARE SEEKER</h1>
            </div>
        )
    }
    if(room.gameStage == STAGE_HIDERS_WIN){
        return(
            <div className={classes.blackScreen}>
                <h1 className={classes.greentittle}>HIDERS WIN!</h1>
            </div>
        )
    }
    if(room.gameStage == STAGE_SEEKER_WIN){
        return(
            <div className={classes.blackScreen}>
                <h1 className={classes.redtittle}>SEEKERS WIN!</h1>
            </div>
        )
    }

    return(
        <div className={classes.canvasContainer}>
            {!room.name ? <RoomForm socket={socket}/> : null}
            {
            room.gameStage === STAGE_HIDING ?
            <Timer gameStage = {room.gameStage} timer = {room.hidingTime} color = "black"/> : null
            }
            {
            room.gameStage === STAGE_PLAYING ?
            <Timer gameStage = {room.gameStage} timer = {room.playingTime} color = "black"/> : null
            }
            <Canvas>
                <color attach="background" args={['lightblue']}/>
                <OrbitControls 
                    target={cameraPos} 
                    position = {cameraPos} 
                    ref = {orbitControlRef}
                    maxPolarAngle = {1.3}
                    minPolarAngle = {0.5}
                    minDistance = {0}
                    maxDistance = {10}
                />
                <Stars/>
                <ambientLight intensity={0.9}/>
                <pointLight position={[0, 100, 0]} />
                {room.players.map(p => <Player position={p.position} key={p.id} model={p.model} type={p.type} getObj={getObj}/>)}
                <Plane world = {room.world} getObj={getObj}/>
            </Canvas>
        </div>
    )
}

export default Game;