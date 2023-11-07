/* Juyeon Nam 114580388 */

import React from "react";

function Modal (props) {
    const info = props.info;
    const img = props.img
    const addImg = props.addImg;
    const {setModal, setInfo, setImg, setAddImg, setColor} = props;

    const modalDisappear = () => {
      setModal(false);
    };

    const addImage = (e) => {
      const fr = new FileReader();
      if (e.target.files[0]) {
        fr.readAsDataURL(e.target.files[0]);
        fr.onload = () => {
          setAddImg(fr.result);
        };
      }
    };

    const changeColor = (e) => {
      if (info.colorScheme === "Dark") {
        setColor("false");
      } else if (info.colorScheme === "Light") {
        setColor("true");
      }
    };  

    const save = (e) => {
      setInfo((elem) => {
        const newObj = { ...elem };
        newObj[e.target.name] = e.target.value;
        return newObj;
      });
    };

    const ssave = () => {
      var userid = 1;
  
      fetch(`http://localhost:4000/users/${userid}`, {
        method: "PUT",
        body: JSON.stringify({
          name: info.name,
          email: info.email,
          colorScheme: info.colorScheme,
          image: addImg,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setInfo(() => {
            const updateObj = { ...data };
            return updateObj;
          });
          setImg(addImg);
        });
    };

    
  const logout = () => {
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
          setImg(data.data[0].image ? `${data.data[0].image}` : "");
        }
      });
  };

    return (
      <> 
        <div id="modal" className="modal-style">
          <div className="modal-window">
            <div className="title">
              <h2
                style={{
                  fontSize: "medium",
                  fontWeight: "bolder",
                  margin: "5px",
                }}
              >
                Edit Profile
              </h2>
              <div
                className="close-area"
                style={{ color: "black" }}
                onClick={() => {modalDisappear(); logout()}}
              >
                x
              </div>
            </div>
            <div className="options">
              <button>
                {img ? (
                  <img
                    src={img}
                    alt="profile_img"
                    className="profile-modal-image"
                  ></img>
                ) : (
                  <div
                    style={{
                      height: "40px",
                      width: "40px",
                      backgroundColor: "#555",
                    }}
                  ></div>
                )}
              </button>
              <label
                  htmlFor="file"
                  style={{
                    border: "2px solid	rgb(64,64,64)",
                    padding: "1px 6px",
                    fontWeight: "lighter"
                  }}
                >
                  Add New Image
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={addImage}
                  style={{ height: "fit-content", display: "none" }}
                ></input>
              <button style={{ height: "fit-content" }}>Remove Image</button>
            </div>
            <div className="change" style={{ padding: "10px" }}>
              <p style={{ fontWeight: "bolder" }}>Name</p>
              <input
                name="name"
                style={{ width: "100%" }}
                onChange={(e) => {
                  save(e);
                }}
                defaultValue={info.name}
              ></input>
              <p style={{ fontWeight: "bolder" }}>Email</p>
              <input
                name="email"
                style={{ width: "100%" }}
                onChange={(e) => {
                  save(e);
                }}
                defaultValue={info.email}
              ></input>
              <p style={{ fontWeight: "bolder" }}>Color Scheme</p>
              <select
                name="colorScheme"
                style={{ width: "100%" }}
                onChange={(e) => {
                  save(e);
                }}
                defaultValue={info.colorScheme}
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
              </select>
            </div>
            <div className="button-save-logout">
              <button
                id="save"
                onClick={() => {
                  ssave();
                  modalDisappear();
                  changeColor();
                }}
              >
                Save
              </button>
              <button onClick={() => {modalDisappear(); logout()}}>Logout</button>
            </div>
          </div>
          <div className="modal-layer" onClick={() => {modalDisappear(); logout()}}></div>
        </div>
      </>
  
    );
}

export default Modal;