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
    

  return (
    <div className="app-container">
      {/* 
      // set up a submission form for notes 
      */}
      <form className="note-form">
        {/* 
        // set up form's title and content area
        */}
        <input placeholder="Title" required />
        <textarea placeholder="Content" rows={10} required />

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