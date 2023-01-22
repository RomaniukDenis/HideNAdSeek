function Player(props){
    const {position, type, model, getObj} = props;

    if(model == "Cube"){
        return(
            <mesh position={props.position}>
                <boxGeometry args = {[1, 1, 1]} />
                <meshStandardMaterial color='hotpink' />
            </mesh>
        )
    }
    else{
        return <primitive object={getObj(model)} position={position} scale={[0.1, 0.1, 0.1]}/>
    }

}

export default Player;