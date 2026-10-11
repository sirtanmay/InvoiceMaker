const Checkbox = (props) => {
    return (
        <input {...props}
            id={props.id}
            type="checkbox"
            value={props.value}
            checked={props.checked}
            className={`${props.className || ""}`}
            onChange={(event) => props.onChange(event)} />
    )
}

export default Checkbox;