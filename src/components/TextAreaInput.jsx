const TextAreaInput = (props) => {
    return (
        <textarea 
            id={props.id} 
            ref={props.ref}
            className={`${props.className || ""}`} 
            value={props.value}
            onChange={(event)=> props.onChange(event) } />
    )
}

export default TextAreaInput;