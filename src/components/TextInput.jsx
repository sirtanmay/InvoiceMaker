const TextInput = (props) => {
    return (
        <input {...props}
            id={props.id}
            type={props.type || "text"}
            placeholder={props.placeholder}
            value={props.value}
            ref={props.ref}
            className={`${props.className || ""}`}
            onChange={(event) => props.onChange(event)} />
    )
}

export default TextInput;