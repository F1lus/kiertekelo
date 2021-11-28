export default function Checkbox({ handleChange, name, current }) {

    function handleClick(event) {
        event.preventDefault()
        event.target.classList.toggle("check-bg")
        event.target.firstChild.checked = !event.target.firstChild.checked

        handleChange(event.target.firstChild.checked, current)
    }


    return (
        <div className="checker" id="this" onClick={handleClick}>
            <input type="checkbox" id="check" />
            {name}
        </div>
    )

}