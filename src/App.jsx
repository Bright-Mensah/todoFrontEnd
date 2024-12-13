import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TaskC from "./components/TaskC";
import ActionBtn from "./components/ActionBtn";
import Modal from "./components/Modal";
import helper from "./helper";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("not started");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todoData, setTodoData] = useState({
    title: "",
    details: "",
  });
  const [addTodo, setAddTodo] = useState(null);
  const [editTodo, setEditTodo] = useState({
    data: null,
    selector: false,
  });
  const [deletedTodo, setDeletedTodo] = useState({
    data: null,
    selector: false,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(""); // For debouncing

  useEffect(() => {
    // Update debouncedSearch after a delay
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      clearTimeout(handler); // Cleanup the timeout
    };
  }, [search]);

  useEffect(() => {
    fetchTodos();
  }, [filter, debouncedSearch, sortBy, sortDirection]);

  useEffect(() => {
    const sendz = {
      url: "api/todos/deleted",
      methodType: "GET",
    };
    helper.sendData(sendz).then((response) => {
      if (response.data.length > 0) {
        switch (response.status) {
          case "success":
            setDeletedTodo((prev) => ({
              ...prev,
              data: response.data,
            }));

            break;

          default:
            break;
        }
      } else {
      }
    });
  }, []);

  const fetchTodos = async () => {
    try {
      const params = new URLSearchParams({
        status: filter,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_direction: sortDirection,
      }).toString();
      // const response = await fetch(`http://127.0.0.1:8000/api/todos?${params}`);
      const response = await fetch(
        `https://todobackend-production-0720.up.railway.app/api/todos?${params}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();

      setTodos(data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
    }
  };
  const handleViewDetails = (todo) => {
    setSelectedTodo(todo);
  };

  const closeDetails = () => {
    setSelectedTodo(null);
  };

  const filterType = (filterProp) => {
    setFilter(filterProp);
  };

  const sortByType = (sort) => {
    setSortBy(sort);
  };

  const sortDir = (direction) => {
    setSortDirection(direction);
  };

  const handleSearch = () => {
    fetchTodos();
  };

  const handleAddTodo = async function () {
    if (!helper.validateField(todoData.title)) {
      return helper.showAlert("Attention!", "Title is required");
    }
    if (!helper.validateField(todoData.details)) {
      return helper.showAlert("Attention!", "Details is required");
    }

    helper
      .showPrompt("Attention!", "Are you sure you want to add todo?")
      .then((response) => {
        switch (response) {
          case true:
            submitTodo();
            break;

          default:
            break;
        }
      });
  };

  const submitTodo = () => {
    const sendz = {
      title: todoData.title,
      details: todoData.details,
      status: "not started",
      url: "api/todos",
      methodType: "POST",
    };
    helper
      .sendData(sendz)
      .then((response) => {
        switch (response.status) {
          case "success":
            setAddTodo(false);

            setTodoData({
              title: "",
              details: "",
            });

            setTimeout(() => {
              helper
                .showAlert("Success", response.message, "success")
                .then((response) => {
                  if (response) {
                    window.location.reload();
                  }
                });
            }, 300);
            break;

          case "error":
            setTimeout(() => {
              helper.showAlert("error", response.message, "error");
            }, 300);
            break;

          default:
            setTimeout(() => {
              helper.showAlert("Error", response.error, "error");
            }, 300);
            break;
        }
      })
      .catch((error) => {
        setTimeout(() => {
          helper.showAlert("Error", error.message, "error");
        }, 300);
      });
  };

  const handleEditTodo = () => {
    if (!helper.validateField(editTodo.data.title)) {
      return helper.showAlert("Attention!", "Title is required");
    }

    if (!helper.validateField(editTodo.data.details)) {
      return helper.showAlert("Attention!", "Details is required");
    }

    helper
      .showPrompt("Attention!", "Are you sure you want to update todo?")
      .then((response) => {
        switch (response) {
          case true:
            updateTodo();
            break;

          default:
            break;
        }
      });
  };

  const updateTodo = () => {
    const sendz = {
      title: editTodo.data.title,
      details: editTodo.data.details,
      status: editTodo.data.status,
      url: `api/todos/${editTodo.data.id}`,
      methodType: "PUT",
    };

    helper
      .sendData(sendz)
      .then((response) => {
        switch (response.status) {
          case "success":
            setEditTodo((prev) => ({ ...prev, selector: false }));
            setTimeout(() => {
              helper
                .showAlert("Success", response.message, "success")
                .then((response) => {
                  if (response) {
                    window.location.reload();
                  }
                });
            }, 300);
            break;

          case "error":
            setTimeout(() => {
              helper.showAlert("error", response.message, "error");
            }, 300);
            break;

          default:
            break;
        }
      })
      .catch(() => {
        setTimeout(() => {
          helper.showAlert("error", "An error occured", "error");
        }, 300);
      });
  };

  const handleDeleteTodo = function (todo) {
    helper
      .showPrompt("Attention!", "Are you sure you want to delete todo?")
      .then((response) => {
        if (response) {
          const sendz = {
            url: `api/todos/${todo.id}`,
            methodType: "DELETE",
          };

          helper
            .sendData(sendz)
            .then((response) => {
              switch (response.status) {
                case "success":
                  setTimeout(() => {
                    helper
                      .showAlert("Success", response.message, "success")
                      .then((response) => {
                        if (response) {
                          window.location.reload();
                        }
                      });
                  }, 300);
                  break;

                case "error":
                  setTimeout(() => {
                    helper.showAlert("error", response.message, "error");
                  }, 300);
                  break;

                default:
                  break;
              }
            })
            .catch(() => {
              setTimeout(() => {
                helper.showAlert(
                  "error",
                  "An error occured whiles deleting todo",
                  "error"
                );
              }, 300);
            });
        }
      });
  };

  const fetchDeletedTodos = () => {
    const sendz = {
      url: "api/todos/deleted",
      methodType: "GET",
    };
    helper.sendData(sendz).then((response) => {
      if (response.data.length > 0) {
        switch (response.status) {
          case "success":
            setDeletedTodo((prev) => ({
              ...prev,
              selector: true,
              data: response.data,
            }));

            break;

          case "error":
            setTimeout(() => {
              helper.showAlert("error", response.message, "error");
            }, 300);
            break;

          default:
            break;
        }
      } else {
        helper.showAlert("Attention!", "There are no deleted todos");
      }
    });
  };

  const handleRestoreTodo = (todo) => {
    const sendz = {
      url: `api/todos/restore/${todo.id}`,
      methodType: "GET",
    };

    helper
      .showPrompt("Attention!", "Are you sure you want to restore todo?")
      .then((response) => {
        if (response) {
          helper
            .sendData(sendz)
            .then((response) => {
              switch (response.status) {
                case "success":
                  setTimeout(() => {
                    helper
                      .showAlert("Success", response.message, "success")
                      .then((response) => {
                        if (response) {
                          window.location.reload();
                        }
                      });
                  }, 300);
                  break;

                case "error":
                  setTimeout(() => {
                    helper.showAlert("error", response.message, "error");
                  }, 300);
                  break;

                default:
                  break;
              }
            })
            .catch(() => {
              setTimeout(() => {
                helper.showAlert(
                  "error",
                  "An error occured whiles restoring todo",
                  "error"
                );
              }, 300);
            });
        }
      });
  };

  const deleteTodoPermanently = (todo) => {
    const sendz = {
      url: `api/todos/delete-perm/${todo.id}`,
      methodType: "DELETE",
    };

    helper
      .showPrompt(
        "Attention!",
        "Are you sure you want to delete todo permanently?"
      )
      .then((response) => {
        if (response) {
          helper
            .sendData(sendz)
            .then((response) => {
              switch (response.status) {
                case "success":
                  setTimeout(() => {
                    helper
                      .showAlert("Success", response.message, "success")
                      .then((response) => {
                        if (response) {
                          window.location.reload();
                        }
                      });
                  }, 300);
                  break;

                case "error":
                  setTimeout(() => {
                    helper.showAlert("error", response.message, "error");
                  }, 300);
                  break;

                default:
                  break;
              }
            })
            .catch(() => {
              setTimeout(() => {
                helper.showAlert(
                  "error",
                  "An error occured whiles deleting todo",
                  "error"
                );
              }, 300);
            });
        }
      });
  };

  return (
    <>
      <div className=" d-flex container">
        <div
          className="border  shadow-sm"
          style={{
            width: "100%",
            backgroundColor: "#f8f9fa",
          }}
        >
          {/* Header Section */}
          <div
            // className="text-center py-3 mb-4"
            className="py-3"
            style={{ backgroundColor: "#d9f3fa", borderRadius: "5px" }}
          >
            <h6
              className="ms-3"
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "start",
              }}
            >
              TODO LIST
            </h6>
          </div>

          {/* Instruction Section */}

          {/* Proceed Button */}
          <div className="d-flex mb-3 mt-3">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search note ...."
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                style={{ color: "gray" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span
                className="input-group-text"
                id="basic-addon2"
                onClick={handleSearch}
              >
                <i className="fa fa-search"></i>
              </span>

              <div className="dropdown ms-3">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Filter by Status: {filter}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      onClick={() => filterType("completed")}
                      className="dropdown-item"
                      href="#"
                    >
                      completed
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => filterType("in progress")}
                      className="dropdown-item"
                    >
                      in progress
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => filterType("not started")}
                      className="dropdown-item"
                    >
                      not started
                    </button>
                  </li>
                </ul>
              </div>
              {/* sorting */}
              <div className="dropdown ms-3">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Sort By: {sortBy}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      onClick={() => sortByType("title")}
                      className="dropdown-item"
                      href="#"
                    >
                      Title
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => sortByType("status")}
                      className="dropdown-item"
                    >
                      Status
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => sortByType("created_at")}
                      className="dropdown-item"
                    >
                      Created At
                    </button>
                  </li>
                </ul>
              </div>
              <div className="dropdown ms-3">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Sort Direction: {sortDirection}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      onClick={() => sortDir("asc")}
                      className="dropdown-item"
                      href="#"
                    >
                      Ascending
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => sortDir("desc")}
                      className="dropdown-item"
                    >
                      Descending
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <TaskC
                key={index}
                label={todo.title}
                title={todo.title}
                desc={todo.details}
                viewDetails={() => handleViewDetails(todo)}
                editTodo={() => {
                  setEditTodo((prev) => ({
                    ...prev,
                    data: todo,
                    selector: true,
                  }));
                }}
                deleteTodo={() => handleDeleteTodo(todo)}
              />
            ))
          ) : (
            <p className="text-muted">Todo list is empty</p>
          )}

          <div className="float-end mb-3 me-5" style={{ marginTop: 100 }}>
            <div className="d-flex">
              <div className="me-3">
                <ActionBtn
                  label={
                    <i className="fa fa-plus">
                      <span className="ms-2">Add Todo</span>
                    </i>
                  }
                  Action={() => setAddTodo(true)}
                  title={"Add Todo"}
                />
              </div>
              {deletedTodo.data != null && (
                <ActionBtn
                  label={
                    <i className="fa fa-trash text-danger">
                      <span className="ms-2">Bin</span>
                    </i>
                  }
                  Action={() => fetchDeletedTodos()}
                  title={"Bin"}
                />
              )}
            </div>
          </div>

          {selectedTodo && (
            <>
              <Modal
                header={selectedTodo.title}
                body={
                  <>
                    <p>{selectedTodo.details}</p>
                  </>
                }
                closeDetails={closeDetails}
              />
            </>
          )}

          {addTodo && (
            <>
              <Modal
                header={"Add Todo"}
                body={
                  <>
                    <div className="form-group mb-5">
                      <label htmlFor="">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={todoData.title}
                        onChange={(e) =>
                          setTodoData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="">
                        Details <span className="text-danger">*</span>{" "}
                      </label>
                      <textarea
                        name=""
                        className="form-control"
                        id=""
                        onChange={(e) =>
                          setTodoData((prev) => ({
                            ...prev,
                            details: e.target.value,
                          }))
                        }
                        value={todoData.details}
                      ></textarea>
                    </div>
                  </>
                }
                closeDetails={() => setAddTodo(false)}
                proceedText={"Submit"}
                proceedBtn={handleAddTodo}
              />
            </>
          )}

          {/* edit todo */}

          {editTodo.selector && (
            <>
              <Modal
                header={"Edit Todo"}
                body={
                  <>
                    <div className="form-group mb-3">
                      <label htmlFor="">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editTodo.data?.title}
                        onChange={(e) =>
                          setEditTodo((prev) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              title: e.target.value, // Update title inside data
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="">
                        Details <span className="text-danger">*</span>{" "}
                      </label>
                      <textarea
                        name=""
                        className="form-control"
                        id=""
                        onChange={(e) =>
                          setEditTodo((prev) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              details: e.target.value,
                            },
                          }))
                        }
                        value={editTodo.data.details}
                      ></textarea>
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={editTodo.data?.status}
                        onChange={(e) =>
                          setEditTodo((prev) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              status: e.target.value, //// Update status inside data
                            },
                          }))
                        }
                      >
                        <option value="not started">Not Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>{" "}
                      </select>
                    </div>
                  </>
                }
                closeDetails={() => setEditTodo(false)}
                proceedText={"Update"}
                proceedBtn={handleEditTodo}
              />
            </>
          )}
          {/* edit todo ends here */}

          {/* deleted todos */}
          {deletedTodo.selector && (
            <>
              <Modal
                header={"Deleted Todo's"}
                body={
                  <>
                    {deletedTodo.data.map((todo, index) => (
                      <TaskC
                        key={index}
                        label={todo.title}
                        title={todo.title}
                        desc={todo.details}
                        deleteTodo={() => deleteTodoPermanently(todo)}
                        restore={true}
                        restoreTodo={() => handleRestoreTodo(todo)}
                      />
                    ))}
                  </>
                }
                closeDetails={() =>
                  setDeletedTodo((prev) => ({ ...prev, selector: false }))
                }
              />
            </>
          )}
          {/* deleted todos ends here */}
        </div>
      </div>
    </>
  );
}

export default App;
