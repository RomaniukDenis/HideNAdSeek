import classes from "./RoomFrom.module.css";

const RoomForm = (props) => {

    const socket = props.socket;
   
    const onSubmit = (event) => {
        event.preventDefault();
        const room = event.target?.room?.value;
        console.log("Entering room " + room);
        socket.emit("join_room", room);
        event.target.reset();
        alert('You joined room "'+room+'"')
    }

    return(
        <form className={classes.roomform} onSubmit={onSubmit}>
            <input type="text" placeholder="Room" name="room"/>
            <button>Join</button>
        </form>
    )
}

export default RoomForm;