
function Notification(props){
    let cssClass ="flex notification"
    if(props.className) cssClass = `${cssClass} ${props.className}`
    
    return (
        <div className={cssClass}>
            <a href="#dismiss" className="mr-1 bg-yellow-500 text-3xl">⚔</a> 
            <span>{props.children}</span>
        </div>
    );
}

export default Notification;