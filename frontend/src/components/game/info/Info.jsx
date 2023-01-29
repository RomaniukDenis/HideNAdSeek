import classes from './Info.module.css';

function Info(props){
    const {message, color} = props;
    
        return (
            <div className={classes.info} style = {{color}}>
                <p>{message}</p>
            </div>
        )
}

export default Info;