import classes from './Timer.module.css';

function Timer(props){
    const {gameStage, timer, color} = props;
    const tittle = gameStage == 'HIDING' ? 'Time to hide' : "Time to play";
    
        return (
            <div className={classes.timer} style = {{color}}>
                <p>{tittle}</p>
                <p>{millisToMinutesAndSeconds(timer)}</p>
            </div>
        )
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export default Timer;