import React, { useEffect, useState } from 'react'
import api from '../api';
import Note from '../components/Note';
import '../Styles/Note.css';
import '../Styles/Home.css';


function Home() {

  const [notes,setNotes]=useState([]);
  const [content,setContent]=useState("");
  const [title,setTitle]=useState("");

  useEffect(()=>{
    getNotes()
  },[]);


  const getNotes=()=>{
    api.get("/api/notes").then((res)=>res.data).then((data)=>{setNotes(data);console.log(data)}).catch((err)=>alert(err));
  }

  const deleteNote=(id)=>{
    api.delete(`api/notes/delete/${id}`).then((res)=>{if(res.status===204) alert("Deleted"); else alert("Not Deleted")});
    getNotes()
  }

  const createNote= async (e)=>{
    e.preventDefault();
    await api.post("/api/notes/",{title,content})
    getNotes()

  }


  return (
    <div>
      <div>
          <h2>Notes</h2>
          {notes.map((note)=>(
              <Note note={note} onDelete={deleteNote} key={note.id}/>
          ))}
      </div>

      <h2>Create Note</h2>

      <form onSubmit={createNote}>
          <label htmlFor='title'>Title : </label>
          <input type="text" id="title" name="title" required onChange={(e)=>setTitle(e.target.value)} value={title}/>
          <br/>

          <label htmlFor='content'>Content : </label>
          <textarea  id="content" name="content" required onChange={(e)=>setContent(e.target.value)} value={content}></textarea>
          <br/>

          <input type="submit" value="SUBMIT"/>
      </form>


    </div>
  )
}

export default Home