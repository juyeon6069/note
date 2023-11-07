/* Juyeon Nam 114580388 */

import React, {useEffect} from "react";

function Note (props) {
    const note = props.note;
    const color = props.color;
    const filteredIndex = props.filteredIndex;
    const filteredSearch = props.filteredSearch;
    
    const {setIndex, setFilteredIndex} = props;

    useEffect(() => {
      return () => {
      }
    }, []);

    const dateForm = (a) => {
      var today = new Date(a);
      var year = today.getFullYear();
      var month = ("0" + (today.getMonth() + 1)).slice(-2);
      var day = ("0" + today.getDate()).slice(-2);
      var hours = ("0" + today.getHours()).slice(-2);
      var minutes = ("0" + today.getMinutes()).slice(-2);
      var dateTime = year + "/" + month + "/" + day + " " + hours + ":" + minutes;
      return dateTime;
    };

    // get index of note in general and when some notes are searched.
    const getFilteredIndex = (event) => {
      filteredSearch.forEach((e, index) => {
        if (Number(e.noteId) === Number(event.target.id)) {
          setFilteredIndex(index);
        }
      });
      note.forEach((e, index) => {
        if (Number(e.noteId) === Number(event.target.id)) {
          setIndex(index);
        }
      });
    };

    return (
      <> 
       <div id="memo" style={{ color: color === "true" ? "" : "white" }}>
              {filteredSearch.map((elem, idx) => {
                return (
                  <div
                    className={`notes-list ${filteredIndex === idx ? "cclick" : ""}`}
                    key={elem.noteId}
                    id={elem.noteId}
                    onClick={getFilteredIndex}
                  >
                    <p className="notes-word">{elem.text}</p>
                    <p className="time">{dateForm(elem.lastUpdatedDate)}</p>
                  </div>
                );
              })}
            </div>
      </>
  
    );
}

export default Note;