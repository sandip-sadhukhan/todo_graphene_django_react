import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query {
    todos {
      id
      title
    }
  }
`;

export const CREATE_TODO = gql`
  mutation ($title: String!) {
    createTodo(title: $title) {
      todo {
        id
        title
      }
    }
  }
`;

export const DELETE_TODO = gql`
  mutation ($id: ID!) {
    deleteTodo(id: $id) {
      success
    }
  }
`;
