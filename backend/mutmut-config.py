def init():
    pass

def pre_mutation(context):
    if "test" in context.filename or "config" in context.filename:
        context.skip = True
