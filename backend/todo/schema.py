import graphene
from graphene_django import DjangoObjectType
from todo.models import Todo
from django.shortcuts import get_object_or_404


class TodoType(DjangoObjectType):
    class Meta:
        model = Todo
        fields = "__all__"


class CreateTodoMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)

    todo = graphene.Field(TodoType)

    @classmethod
    def mutate(cls, root, info, title):
        todo = Todo.objects.create(title=title)
        return CreateTodoMutation(todo=todo)


class UpdateTodoMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        is_completed = graphene.Boolean()

    todo = graphene.Field(TodoType)

    @classmethod
    def mutate(cls, root, info, id, **kwargs):
        todo = get_object_or_404(Todo, pk=id)

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
    def mutate(cls, root, info, id):
        success = True
        try:
            Todo.objects.get(pk=id).delete()
        except Todo.DoesNotExist:
            success = False

        return DeleteTodoMutation(success=success)


class Query(graphene.ObjectType):
    todos = graphene.List(TodoType)

    def resolve_todos(root, info):
        return Todo.objects.all()


class Mutation(graphene.ObjectType):
    create_todo = CreateTodoMutation.Field()
    update_todo = UpdateTodoMutation.Field()
    delete_todo = DeleteTodoMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
