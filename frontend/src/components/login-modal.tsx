import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_TODOS, LOGIN } from "../api";

interface LoginModalProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const LoginModal: React.FC<LoginModalProps> = (props: LoginModalProps) => {
  interface FormData {
    username: string;
    password: string;
  }

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const [login, { data }] = useMutation(LOGIN);

  useEffect(() => {
    if (data) {
      console.log({ data });
      props.setToken(data.tokenAuth.token);
    }
  }, [data, props]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    login({
      variables: { username: formData.username, password: formData.password },
    });
  };

  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Login
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Username"
              onChange={onChange}
              name="username"
              value={formData.username}
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              onChange={onChange}
              name="password"
              value={formData.password}
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSubmit}
              data-bs-dismiss="modal"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
