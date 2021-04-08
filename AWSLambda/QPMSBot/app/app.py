
def handler(event, context):
    output = "HELLO"

    body = {
        "text": output
    }

    response = {
        "statusCode": 200,
        "body": body
    }

    return response