import React, { Fragment, useEffect, useState } from "react"
import { requestConfluence } from "@forge/bridge"

async function fetchUser() {
  const res = await requestConfluence("/wiki/rest/api/user/current")
  if (!res.ok) {
    throw new Exception("Could not fetch current username")
  }
  return await res.json()
}

function Location({ officeLocation }) {
  if (officeLocation === "mainz") {
    return (
      <div id="location">
        Rheinstraße 4 C<br/>
        55116 Mainz, Germany
      </div>
    )
  }
  return (
    <div id="location">
      Aschauer Straße 32<br/>
      81549 München, Germany
    </div>
  )
}

function Signature(props) {
  return (
    <div id="signature">
      <hr
        size="1"
        width="100%"
        align="center"
        style={{ height: "1px", backgroundColor: "#ccc", border: "none" }}
      />

      <div style={{ fontSize: "8pt", fontFamily: "sans-serif" }}>
        <p style={{ margin: "0pt 1pt 0pt" }}>
          <b>Beste Arbeitgeber ITK 2022 - 1. Platz für QAware</b>
          <br />
          ausgezeichnet von&nbsp;
          <a href="https://www.qaware.de/news/great-place-to-work-triple-fuer-qaware">
            Great Place to Work
          </a>
        </p>
        <hr
          size="1"
          width="100%"
          align="center"
          style={{ height: "1px", backgroundColor: "#ccc", border: "none" }}
        />
        <p style={{ margin: "0pt 1pt 8pt" }}>
          {props.title} {props.name}
          <br/>
          {props.roles.split("\n").map(role => <Fragment>{role}<br/></Fragment>)}
        </p>
        <p style={{ margin: "0pt 1pt 0pt" }}>
          QAware GmbH
          <br />
          <Location officeLocation={props.officeLocation} />
          {props.phone !== "" ? (<div>Mobil {props.phone}</div>) : null}
          <a href={`mailto:${props.email}`}>{props.email}</a>
          <br />
          <a href="https://www.qaware.de">www.qaware.de</a>
          <br />
        </p>
      </div>
      <hr
        size="1"
        width="100%"
        align="center"
        style={{ height: "1px", backgroundColor: "#ccc", border: "none" }}
      />

      <div style={{ fontSize: "7pt", fontFamily: "sans-serif" }}>
        <p style={{ margin: "0pt 1pt 14pt" }}>
          Geschäftsführer: Christian Kamm, Dr. Josef Adersberger
          <br />
          Registergericht: München
          <br />
          Handelsregisternummer: HRB 163761
          <br />
        </p>
      </div>
    </div>
  )
}

function copyDataToClipboard(data, formats = ["text/plain"]) {
  function listener(e) {
    for (const format of formats) {
      e.clipboardData.setData(format, data)
    }
    e.preventDefault()
  }
  document.addEventListener("copy", listener)
  document.execCommand("copy")
  document.removeEventListener("copy", listener)
}

function App() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState("")
  const [roles, setRoles] = useState("")
  const [location, setLocation] = useState("munich")
  const [phone, setPhone] = useState("")
  const [hasBeenCopied, setHasBeenCopied]  = useState(false)
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(async () => {
    const user = await fetchUser("fetchUser")
    setUser(user)
    setEmail(user.email)
    setUserName(user.displayName)
  }, [])

  function copySignature() {
    copyDataToClipboard(
      document.getElementById("signature").innerHTML,
      ["text/html", "text/plain"]
    )
    setHasBeenCopied(true)
    setTimeout(() => setHasBeenCopied(false), 2000)
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div id="signature-input" style={{ border: "1px solid #fec900", borderRadius: "3px" }}>
          <div style={{ backgroundColor: "#fec900", color: "#333", padding: "8px", fontWeight: "bold" }}>
            Deine Angaben
          </div>
          <div style={{ padding: "8px" }}>
            <p>
              <label for="user-title" style={{ marginRight: "1em" }}>Dein akademischer Titel:</label>
              <select
                name="user-title"
                id="user-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                style={{ float: "right" }}
              >
                <option value="">Keiner</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof. Dr.">Prof. Dr.</option>
              </select>
            </p>
            <p>
              <input
                type="text"
                id="user-name"
                name="user-name"
                placeholder="Dein Name"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </p>
            <p>
              <textarea
                cols="30"
                rows="5"
                id="user-roles"
                name="user-roles"
                placeholder="Deine Rollen (eine pro Zeile)"
                value={roles}
                onChange={(event) => setRoles(event.target.value)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </p>
            <p>
              <label for="user-location" style={{ marginRight: "1em" }}>Dein Standort:</label>
              <select
                name="user-location"
                id="user-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                style={{ float: "right" }}
              >
                <option value="munich">München/Rosenheim</option>
                <option value="mainz">Mainz</option>
              </select>
            </p>
            <p>
              <input
                type="text"
                id="user-phone"
                name="user-phone"
                placeholder="Deine Telefonnummer"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </p>
            <p>
              <input
                type="text"
                id="user-email"
                name="user-email"
                placeholder="Deine E-Mail-Adresse"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </p>
          </div>
        </div>
        <div id="signature-output" style={{ marginLeft: "2em", border: "1px solid #0593d8", borderRadius: "3px" }}>
          <div style={{ backgroundColor: "#0593d8", color: "white", padding: "8px", fontWeight: "bold" }}>
            Deine generierte QAmail-Signatur 🙂
          </div>
          <div style={{ padding: "8px" }}>
            <Signature
              title={title}
              name={userName}
              roles={roles}
              officeLocation={location}
              phone={phone}
              email={email}
            />
            <button
              type="button"
              onClick={() => copySignature()}
              style={{
                backgroundColor: hasBeenCopied ? "green" : "#0593d8",
                borderRadius: "8px",
                border: "none",
                color: "white",
                fontSize: "12px",
                padding: "5px 10px",
                cursor: "pointer",
                transition: "transform 1s",
                transform: hasBeenCopied ? "rotate(360deg)" : null,
              }}
              id="copy-html-button"
            >
              {hasBeenCopied ? "✔ Kopiert" : "Kopieren"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
