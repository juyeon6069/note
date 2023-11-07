// Juyeon Nam 114580388

import Modal from "./components/Modal.jsx";
import Note from "./components/Note.jsx";
import "./App.css";
import { useState, useEffect, useCallback, useMemo } from "react";

function App() {
  const [modal, setModal] = useState(false);

  const [index, setIndex] = useState(0);
  const [filteredIndex, setFilteredIndex] = useState(0);

  const [note, setNote] = useState([]);

  const [info, setInfo] = useState({
    name: "",
    email: "",
    colorScheme: "",
  });

  const [addImg, setAddImg] = useState("");
  const [img, setImg] = useState("");

  const [color, setColor] = useState("true");

  const [searchInput, setSearchInput] = useState("");

  const modalAppear = () => {
    setModal(true);
  };

  // get notes
  useEffect(() => {
    fetch("http://localhost:4000/notes")
      .then((response) => response.json())
      .then((data) =>
        setNote((elem) => {
          const addArr = [...data.data];
          return addArr;
        })
      );
  }, []);

  // get users
  useEffect(() => {
    fetch("http://localhost:4000/users")
      .then((response) => response.json())
      .then((data) => {
        setInfo((elem) => {
          const addArr = { ...data.data[0] };
          return addArr;
        });
        if (data.data[0]) {
          setColor(
            data.data[0].colorScheme === "Light" ||
              data.data[0].colorScheme === null
              ? "true"
              : "false"
          );
          setAddImg(data.data[0].image ? `${data.data[0].image}` : "");
          setImg(data.data[0].image ? `${data.data[0].image}` : "");
        }
      });
  }, []);

  const addNote = () => {
    setSearchInput("");
    fetch("http://localhost:4000/notes", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setNote((elem) => {
          var newNote = {
            noteId: data.id,
            text: data.text,
            lastUpdatedDate: data.date,
          };
          const addArr = [newNote, ...elem];
          return addArr;
        });
      });
    setIndex(0);
    setFilteredIndex(0);
  };

  const removeNote = () => {
    var noteid;
    if (filteredSearch[filteredIndex]) {
      noteid = filteredSearch[filteredIndex].noteId;
    } else {
      return;
    }
    fetch(`http://localhost:4000/notes/${noteid}`, {
      method: "DELETE",
    }).then(() =>
      setNote((elem) => {
        const removeArr = [...elem];
        removeArr.splice(index, 1);
        return removeArr;
      })
    );

    setFilteredIndex(0);
  };

  const searchIndex = () => {
    if (filteredSearch !== []) {
      setFilteredIndex(0);
    } else {
      setFilteredIndex(-1);
    }
  };

  //*************change text*************/
  function debounce(func, timeout = 1000) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const change = (val, noteId) => {
    fetch(`http://localhost:4000/notes/${noteId}`, {
      method: "PUT",
      body: JSON.stringify({ text: val }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const processChanges = useCallback(
    debounce((val, noteId) => {
      change(val, noteId);
    }),
    []
  );

  const cchange = (e) => {
    setSearchInput("");
    const val = e.target.value;
    const noteId = filteredSearch[filteredIndex].noteId;

    const date = String(new Date());
    processChanges(val, noteId);
    setNote((elem) => {
      const arr = [...elem];
      var tmp = arr[index];
      arr[index] = arr[0];
      arr[0] = tmp;
      arr[0].text = val;
      arr[0].lastUpdatedDate = date;
      arr.sort((a, b) => {
        return new Date(b.lastUpdatedDate) - new Date(a.lastUpdatedDate);
      });
      return arr;
    });
    setIndex(0);
    setFilteredIndex(0);
  };

  const up = () => {
    if (filteredSearch.length !== 0) {
      setFilteredIndex(
        (filteredIndex - 1 + filteredSearch.length) % filteredSearch.length
      );
      setIndex((index - 1 + note.length) % note.length);
    }
  };

  const down = () => {
    if (filteredSearch.length !== 0) {
      setFilteredIndex(
        (filteredIndex + 1 + filteredSearch.length) % filteredSearch.length
      );
      setIndex((index + 1 + note.length) % note.length);
    }
  };

  const filteredSearch = useMemo(() => {
    setFilteredIndex(0);
    var filteredItem = note.filter((item) =>
      item.text.toLowerCase().includes(searchInput.toLowerCase())
    );
    setIndex(
      note.findIndex((elem, idx) => {
        return elem.noteId === filteredItem[0]?.noteId;
      })
    );
    return searchInput === "" ? note : filteredItem;
  }, [note, searchInput]);

  return (
    <>
      <div className={color === "true" ? "light" : "dark"}>
        <div className="side-bar">
          <div
            className={
              color === "true" ? "notes-list-title" : "notes-list-title-d"
            }
          >
            <button id="photo-frame" onClick={modalAppear}>
              {img ? (
                <img
                  src={img}
                  alt="profile_img"
                  className="profile-image"
                ></img>
              ) : (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#555",
                  }}
                ></div>
              )}
            </button>
            <p
              className="my-notes"
              style={{
                marginBottom: "0",
                color: color === "true" ? "" : "white",
              }}
            >
              My notes
            </p>
            <button
              className="glyphicon glyphicon-plus-sign"
              onClick={addNote}
            ></button>
          </div>
          <div className={color === "true" ? "edit-text" : "edit-text-d"}>
            <button
              className="glyphicon glyphicon-circle-arrow-left"
              onClick={up}
            ></button>
            <button
              className="glyphicon glyphicon-circle-arrow-right"
              onClick={down}
            ></button>
            <button
              className="glyphicon glyphicon-trash"
              onClick={removeNote}
              {...(note.length === 0 ? { disabled: true } : {})}
            ></button>
          </div>
        </div>
        <div className="small-form">
          <div className="small-form-side-bar">
            <button id="photo-frame" onClick={modalAppear}>
              {addImg ? (
                <img
                  src={addImg}
                  alt="profile_img"
                  className="profile-image"
                ></img>
              ) : (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#555",
                  }}
                ></div>
              )}
            </button>
            <button
              className="glyphicon glyphicon-circle-arrow-left"
              onClick={up}
              style={{ height: "85%" }}
            ></button>
            <button
              className="glyphicon glyphicon-plus-sign"
              onClick={addNote}
              style={{ height: "85%" }}
            ></button>
            <button
              className="glyphicon glyphicon-circle-arrow-right"
              onClick={down}
              style={{ height: "85%" }}
            ></button>
            <button
              className="glyphicon glyphicon-trash"
              onClick={removeNote}
              style={{ height: "85%" }}
            ></button>
          </div>
        </div>
        <div className="notes">
          <div className="search">
            <div className="search-panel">
              <span
                className="glyphicon glyphicon-search"
                style={{ color: color === "true" ? "" : "white" }}
              ></span>
              <textarea
                className="search-term"
                type="text"
                name="search"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  searchIndex();
                }}
              ></textarea>
            </div>
            <Note
              note={searchInput.length === 0 ? note : filteredSearch}
              color={color}
              setIndex={setIndex}
              filteredIndex={filteredIndex}
              setFilteredIndex={setFilteredIndex}
              filteredSearch={filteredSearch}
            />
          </div>
          <div className="edit-text-zone">
            <textarea
              id="id-edit-text"
              className="edit-text-bar"
              padding="20px"
              value={
                filteredSearch.length > 0
                  ? filteredSearch[filteredIndex].text
                  : ""
              }
              onChange={(e) => {
                cchange(e);
              }}
              disabled={filteredSearch.length > 0 ? false : true}
            ></textarea>
          </div>
        </div>{" "}
      </div>
      {modal && (
        <Modal
          img={img}
          info={info}
          addImg={addImg}
          setModal={setModal}
          setAddImg={setAddImg}
          setInfo={setInfo}
          setImg={setImg}
          setColor={setColor}
        />
      )}
    </>
  );
}

export default App;
