import "./App.css";
import { useState, useEffect } from "react";
import { readAllDocs, addOneDoc, deleteOneDoc, modifyOneDoc } from "./firebase";

let allNotes;

function App() {
  const [notes, setNotes] = useState();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    readAllDocs().then((data) => {
      // console.log(data);
      allNotes = data;
      setNotes(data);
    });
  }, []);

  // get all docs from firebase,set the state variable notes and reset all other state variables
  function getDocsFromFB() {
    readAllDocs().then((data) => {
      console.log(data);
      allNotes = data;
      setNotes(data);
      setTitle("");
      setText("");
      setId("");
    });
  }

  function handleNoteEdit(e) {
    console.log(parseInt(e.currentTarget.dataset.id));
    setShowModal(true);
    let foundNote = notes.find(
      (item) => item.id === parseInt(e.currentTarget.dataset.id)
    );
    console.log(foundNote);
    if (foundNote) {
      setTitle(foundNote.title);
      setText(foundNote.text);
      setId(foundNote.id);
    }
  }

  function deleteNote(e) {
    const id = e.currentTarget.dataset.id;
    deleteOneDoc(id).then(() => {
      getDocsFromFB();
    });
  }

  function editNote() {
    modifyOneDoc(id, title, text).then(() => {
      getDocsFromFB();
    });
  }

  function addNewNote() {
    console.log(parseInt(notes[notes.length - 1].id) + 1);
    let newNote = {
      id: Date.now(),
      title,
      text,
      tags: ["inbox"],
    };

    addOneDoc(newNote)
      .then((ref) => {
        console.log("data written", ref);
        getDocsFromFB();
      })
      .catch((error) => console.log(error));
  }

  function filterTag(e) {
    // console.log(allNotes)
    const tag = e.target.dataset.tag;
    const filteredNotes =
      tag === "all"
        ? allNotes
        : allNotes.filter((note) => note.tags.includes(tag));
    // console.log(filteredNotes)
    setNotes(filteredNotes);
  }

  function handleFormSubmit(e) {
    setShowModal(false);
    e.preventDefault();
    console.log({ title, text, id });
    //Edit button set the id state. So if no id present its a new note.
    if (id) {
      editNote();
    } else {
      addNewNote();
    }
  }

  return (
    <>
      <div className="container">
        <h1>Notepad</h1>
        <button className="create-note" onClick={(e) => setShowModal(true)}>
          Create New Note
        </button>
        {showModal && (
          <div className="modal" onClick={(e) => setShowModal(false)}>
            <div
              className="form-container"
              onClick={(e) => e.stopPropagation()}
            >
              <form className="form" onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  value={title}
                  placeholder="Note Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  value={text}
                  placeholder="Enter your note"
                  onChange={(e) => setText(e.target.value)}
                />
                {/* <input
                  type="text"
                  value={title}
                  placeholder="inbox,home"
                  onChange={(e) => console.log(e.target.value)}
                /> */}
                <button type="submit">Save</button>
                <button type="button" onClick={(e) => setShowModal(false)}>
                  {" "}
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="tags-notes-grid">
          <div className="tag-list">
            <button className="tag" onClick={filterTag} data-tag="all">
              All
            </button>
            <button className="tag" onClick={filterTag} data-tag="inbox">
              Inbox
            </button>
            <button className="tag" onClick={filterTag} data-tag="archive">
              Archive
            </button>
          </div>

          <div className="grid">
            {notes &&
              notes.map((item) => {
                return (
                  <div className="note">
                    <div>
                      <h3 className="note-title">{item.title}</h3>
                      <p>{item.text} </p>
                      <span className="note-label">{item.tags}</span>
                    </div>

                    <div className="note-buttons">
                      <button
                        aria-label="delete"
                        className="deleteBtn"
                        data-id={item.id}
                        onClick={deleteNote}
                        title="delete"
                      >
                        {" "}
                        delete
                      </button>
                      <button
                        aria-label="edit"
                        className="editBtn"
                        data-id={item.id}
                        onClick={handleNoteEdit}
                        title="edit"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

// function createTags(e) {
//   const tagArray = tags.value.split(",");
//   const cleanedTagArray = tagArray.map((item) => item.trim());
//   console.log(tagArray);
//   console.log(cleanedTagArray);
// }
