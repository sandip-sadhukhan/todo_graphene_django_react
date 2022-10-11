import { useState } from "react";
import LoginModal from "./components/login-modal";
import SignUpModal from "./components/signup-modal";
import Todo from "./components/todo";

function App() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <>
      <Todo token={token} />
      <div className="mt-4 d-flex justify-content-center">
        {token ? (
          <button className="btn btn-sm">Logout</button>
        ) : (
          <>
            <button
              className="btn btn-sm btn-success"
              data-bs-toggle="modal"
              data-bs-target="#signUpModal"
            >
              SignUp
            </button>
            <button
              className="btn btn-sm btn-outline-success ms-3"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              Login
            </button>
          </>
        )}
      </div>
      <LoginModal setToken={setToken} />
      <SignUpModal />
    </>
  );
}

export default App;
