import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_TODO, DELETE_TODO, GET_TODOS } from "../api";

const Todo: React.FC = () => {
  const [todo, setTodo] = useState<string>("");

  interface Todo {
    id: number;
    title: string;
  }

  interface TodosData {
    todos: Todo[];
  }

  const { loading, error, data } = useQuery<TodosData>(GET_TODOS);
  const [addTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanTodo = todo.trim();

    addTodo({ variables: { title: cleanTodo } });
    setTodo("");
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6 col-sm-12 mx-auto">
          <h3 className="text-center text-primary mb-4">Todo</h3>
          <div className="card card-body bg-light">
            <form onSubmit={onSubmit}>
              <div className="d-flex align-items-center">
                <input
                  style={{ flex: 1 }}
                  type="text"
                  className="form-control"
                  placeholder="Enter Todo"
                  onChange={onChange}
                  value={todo}
                />
                <div>
                  <button
                    className="btn btn-sm btn-primary ms-2"
                    disabled={todo.trim().length === 0}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
            <hr />
            <h6 className="text-center text-primary mb-3">Your Todos</h6>
            <ul className="list-group">
              {error ? "Error..." : null}
              {loading ? "Loading..." : null}
              {data && data.todos.length === 0 ? (
                <div className="alert alert-danger">No Todos are present</div>
              ) : null}
              {data &&
                data.todos.map((todo) => (
                  <li className="list-group-item" key={todo.id}>
                    <div className="d-flex">
                      <span style={{ flex: 1 }}>{todo.title}</span>
                      <div className="d-flex ms-3">
                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() =>
                            deleteTodo({ variables: { id: todo.id } })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
