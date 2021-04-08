import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

//add todos
//toggle tod

const GET_TODOS = gql`
  query getTodos {
    todos {
      done
      id
      text
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation addToDo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        id
        text
        done
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

export default function App() {
  const [todoText, setTodoText] = React.useState("");
  const stuff = useQuery(GET_TODOS);
  const { data, loading, error } = stuff;
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText(""),
  });
  const [deleteTodo] = useMutation(DELETE_TODO);

  async function handleToggleTodo({ id, done }) {
    const data = await toggleTodo({ variables: { id: id, done: !done } });
    console.log("toggled todo", data);
  }

  async function handleAddTodo(event) {
    event.preventDefault();
    if (!todoText.trim()) {
      return;
    }
    const data = await addTodo({
      variables: { text: todoText },
      refetchQueries: [{ query: GET_TODOS }],
    });
    console.log("added todo", data);
  }

  async function handleDeleteTodo({ id }) {
    if (window.confirm("are you sure you want to delete? ")) {
      const data = await deleteTodo({
        variables: { id: id },
        update: (cache) => {
          const prevData = cache.readQuery({ query: GET_TODOS });
          const newTodos = prevData.todos.filter((todo) => todo.id !== id);
          cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } });
        },
      });
      console.log("deleted", data);
    }
  }

  if (loading) {
    return <div> loading... </div>;
  }
  if (error) {
    return <div>error fetching todos</div>;
  }

  return (
    <div
      className="
  vh-100 code flex flex-column items-center bg-purple
  white pa3 fl-1
  "
    >
      <h1>
        GraphQL Checklist{" "}
        <span role="img" aria-label="Checkmark">
          ✅
        </span>
      </h1>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Add"
          onChange={(e) => setTodoText(e.target.value)}
          value={todoText}
        />
        <button>Create</button>
      </form>
      {/* toDO List */}
      <div>
        {data.todos.map((todo) => (
          <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa1 f3 ${todo.done && "strike"}`}>
              {todo.text}
            </span>
            <button onClick={() => handleDeleteTodo(todo)}>
              <span>&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}
