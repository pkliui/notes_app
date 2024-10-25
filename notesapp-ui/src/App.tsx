import { useState } from "react";
import "./App.css";

// give notes a type 
type Note = {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  //
  // set states
  //
  // store all notes inside a state and give note the Note type,you may initialize using a dummy array

  // set of dummy notes
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "test note 1",
      content: "content",
    },
    {
      id: 2,
      title: "test note 2",
      content: "content",
    },
    {
      id: 3,
      title: "test note 3",
      content: "content",
    },
    {
      id: 4,
      title: "test note 4",
      content: "content",
    }
    ]);
    

  // use state variables for form inputs
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");


  const handleAddNote = (event: React.FormEvent) => {
    // take in event as param, need to say this is of type FormEvent, otherwise TS will complain
    // add preventDefault to prevent from reloading the page upon submitting!
    event.preventDefault();

    // create a new note
    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content
    }
    // update the state with this note,
    // pass new array - the (1st) one we just created and the rest of the notes
    setNotes([newNote, ...notes]);
    // clean up the submission forms for a nice UI
    setTitle("");
    setContent("");


  };


  return (
    <div className="app-container">
      {/* 
      // set up a submission form for notes 
      */}
      <form className="note-form"
        onSubmit={handleAddNote}
      >
        {/* 
        // set up form's title and content area
        */}
        <input 
          // title input - binded to the title state variable = whatever title state variable is
          value={title}
          onChange={(event)=>
            setTitle(event.target.value)
          }
          placeholder="What do you want to note?" required
        />
        <textarea 
        // text area - binded to the content state variable
        value={content}
        onChange={(event)=>
          setContent(event.target.value)
        }
      placeholder="Anything else you forgot to add?" rows={10}
        />

        <button type="submit">Add Note</button>
      </form>
      
      {/* 
      Notes grid
      */}
      <div className="notes-grid">
        {notes.map((note) => (
          //Display all notes using the markup below by means of the map function
          <div className="note-item">
            <div className="notes-header">
              <button>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;