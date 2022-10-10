from django.shortcuts import get_object_or_404

import graphene
from graphene_django import DjangoObjectType
import graphql_jwt
from graphql_jwt.decorators import login_required

from todo.models import Todo


class TodoType(DjangoObjectType):
    class Meta:
        model = Todo
        fields = "__all__"


class CreateTodoMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)

    todo = graphene.Field(TodoType)

    @classmethod
    @login_required
    def mutate(cls, root, info, title):
        todo = Todo.objects.create(title=title, user=info.context.user)
        return CreateTodoMutation(todo=todo)


class UpdateTodoMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        is_completed = graphene.Boolean()

    todo = graphene.Field(TodoType)

    @classmethod
    @login_required
    def mutate(cls, root, info, id, **kwargs):
        todo = get_object_or_404(Todo, pk=id, user=info.context.user)

        if kwargs.get("title"):
            todo.title = kwargs["title"]

        if kwargs.get("is_completed") is not None:
            todo.is_completed = kwargs["is_completed"]

        todo.save()

        return UpdateTodoMutation(todo=todo)


class DeleteTodoMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    @login_required
    def mutate(cls, root, info, id):
        success = True
        try:
            Todo.objects.get(pk=id, user=info.context.user).delete()
        except Todo.DoesNotExist:
            success = False

        return DeleteTodoMutation(success=success)


class Query(graphene.ObjectType):
    todos = graphene.List(TodoType)

    @login_required
    def resolve_todos(root, info):
        return Todo.objects.filter(user=info.context.user)


class Mutation(graphene.ObjectType):
    create_todo = CreateTodoMutation.Field()
    update_todo = UpdateTodoMutation.Field()
    delete_todo = DeleteTodoMutation.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
