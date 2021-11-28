import { useCallback, useState, useRef, useEffect } from "react"
import './App.css'
import Checkbox from "./components/Checkbox"

function App() {

  const [test, setTest] = useState([])
  const [showResult, setShowResult] = useState(false)

  const answers = useRef([])

  useEffect(() => {
    answers.current = []
  }, [test])


  const handleChange = useCallback(event => {
    event.preventDefault()

    if(event.target.files[0] || !event.target.files[0].name.endsWith('.txt')) return

    const reader = new FileReader()
    reader.onload = async e => {
      const filedata = e.target.result

      const helyesstring = "<helyes>";

      const splitted = filedata.split("EZATUTIELVALASZTO").map(x => x.split("\n").filter(x => x.length > 1));
      const feladatok = [];

      splitted.forEach(elem => {
        const temp = {}
        temp["Q"] = elem[0]
        temp["A"] = []
        elem.forEach((elem2, i) => {
          if(i === 0) return

          const helyes = elem2.endsWith(helyesstring)
          if (helyes) elem2 = elem2.substring(0, elem2.length - helyesstring.length)

          const valasz = {}
          valasz["nev"] = elem2
          valasz["helyes"] = helyes
          temp["A"].push(valasz)
        })
        feladatok.push(temp)
      })

      feladatok.sort(() => 0.5 - Math.random())
      feladatok.forEach(obj => {
        obj.A.sort(() => 0.5 - Math.random())
      })

      setTest(feladatok)
    }
    reader.readAsText(event.target.files[0])
  }, [])

  function handleAnswer(checked, obj) {
    if (checked) {
      answers.current.push(obj)
    } else {
      const index = answers.current.findIndex(o => o.qKey === obj.qKey && o.key === obj.key)
      if (index > -1) {
        answers.current.splice(index, 1)
      }
    }
  }

  const renderTest = useCallback(() => {
    if (test.length > 0) {

      return (<div>
        {
          test.map((obj, index) => {
            return (
              <div key={index}>
                <h3 className="center">{index + 1 + ". " + obj.Q}</h3>
                <ul className="position-relative">
                  {obj.A.map((answer, j) => {
                    return (
                      <li key={j} className="center-box">
                        <Checkbox name={answer.nev} handleChange={handleAnswer} current={{ qKey: index, key: j }} />
                      </li>
                    )
                  })}
                </ul>
              </div>)
          })
        }
        {
          !showResult ? (
            <div className="position-relative">
              <button className="center-button" onClick={handleSubmit}>Beadás</button>
            </div>) : null
        }
      </div>)
    } else {
      return <h1 className="center">Még nincs kiválasztott fájl!</h1>
    }
  }, [test, showResult])

  const handleSubmit = (e) => {
    setShowResult(true)
  }

  const renderResult = useCallback(() => {

    if (showResult) {
      let points = 0
      let maxPoints = 0

      answers.current.forEach(obj => {
        if (test[obj.qKey].A[obj.key].helyes) {
          points++
        } else {
          if (points > 0) {
            points--;
          }
        }
      })

      test.forEach(q => {
        q.A.forEach(answer => {
          if (answer.helyes) {
            maxPoints++
          }
        })
      })

      return (
        <div className="position-relative">
          <h5 className="center">Az eredmény: {points} / {maxPoints}</h5>

        </div>
      )
    }

  }, [showResult, test])

  return (
    <div>

      <div className="fileupload">
        <input type="file" onChange={handleChange} />
      </div>

      {renderTest()}
      {renderResult()}

    </div>
  );
}

export default App;
