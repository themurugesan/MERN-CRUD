import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  // edit
  const [edittitle, setEditTitle] = useState("");
  const [editdescription, setEditDescription] = useState("");

  const [todos, setTodos] = useState([]);

  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    // check inputs
    setError("")
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            // Add item to list
            setTodos([...todos, { title, description }]);
            setMessage("Item Added Successfully");
            setTitle(""); // Clear the input field after successful submission
            setDescription("");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setTimeout(() => {
              setError("unable to create Todo item");
            }, 3000);
          }
        })
        .catch(() => {
          setTimeout(() => {
            setError("unable to create Todo Item");
          }, 3000);
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);




  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };




  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };



  const handleupdate = () => {
    setError("")
    if (edittitle.trim() !== "" && editdescription.trim() !== "") {
      fetch(apiUrl + "/todos/"+editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title:edittitle, description:editdescription }),
      })
        .then((res) => {
          if (res.ok) {
            // update item to list
            const updatedTodos=todos.map((item)=>{
              if(item._id === editId){
                item.title=edittitle;
                item.description=editdescription;
              }
              return item;
            })

            setTodos(updatedTodos);
            setMessage("Item Updated Successfully");
            setEditTitle(""); // Clear the input field after successful submission
            setEditDescription("");
            setTimeout(() => {
              setMessage("");
            }, 3000);

            setEditId(-1)
          } else {
            setTimeout(() => {
              setError("unable to create Todo item");
            }, 3000);
          }
        })
        .catch(() => {
          setTimeout(() => {
            setError("unable to create Todo item");
          }, 3000);
        });
    }

  };




  const handleEditCancel = () => {
    setEditId(-1);
  };





  const handleDelete=(id)=>{
    if(window.confirm('Are you sure want to delete')){
      fetch(apiUrl+"/todos/"+id,{
        method:"DELETE"
      })
      .then(()=>{
        const updatedTodos=todos.filter((item)=>item._id!==id)
        setTodos(updatedTodos)
      })
    }


  }


  
  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo Project with MERN Stack</h1>
      </div>

      <div>
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6 ">
           <ul className="list-group">
          {todos.map((item) => (
            <li className="list-group-item  bg-info d-flex justify-content-between align-items-center my-2">
              <div className="d-flex flex-column me-3">
                {editId === -1 || editId !== item._id ? (
                  <>
                    <sapn className="fw-bold">{item.title}</sapn>
                    <sapn className="">{item.description}</sapn>
                  </>
                ) : (
                  <>
                    <div className="form-group d-flex gap-2">
                      <input
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={edittitle}
                        className="form-control"
                        type="text"
                      />
                      <input
                        placeholder="Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editdescription}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="d-flex gap-2">
                {editId === -1 ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                ) : (
                  <button onClick={handleupdate}>Update</button>
                )}

                {editId === -1 ? (
                  <button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>
                ) : (
                  <button className="btn btn-danger" onClick={handleEditCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        </div>
       
      </div>
    </>
  );
}
