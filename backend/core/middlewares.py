from promise import is_thenable


class DebugMiddleware(object):
    def on_error(self, error):
        print(error)

    def resolve(self, next, root, info, **args):
        result = next(root, info, **args)
        if is_thenable(result):
            result.catch(self.on_error)

        return result