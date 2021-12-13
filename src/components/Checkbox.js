export default function Checkbox({ handleChange, name, current, isCorrect, reveal }) {

    function handleClick(event) {
        event.preventDefault()
        event.target.classList.toggle("check-bg")
        event.target.firstChild.checked = !event.target.firstChild.checked

        handleChange(event.target.firstChild.checked, current)
    }


    return (
        <div className="checker" onClick={handleClick}>
            <input type="checkbox" id="check" />
            {name}
        </div>
    )

}