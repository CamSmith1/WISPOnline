#API that queries DynamoDB to return all records from the Transaction Data table when given a userID

import boto3
from boto3.dynamodb.conditions import Key
import json
def lambda_handler(event, context):

    QuinovicID = event['QuinovicID']
    getType = event['GetType']
    tableName = QuinovicID + getType 
    try:
        client = boto3.resource('dynamodb')
        table = client.Table(tableName)
        
        invoiceData = table.scan()
    
    
        body = {
            'Data': invoiceData['Items']
        }
    
        response = {
            "statusCode": 200,
            "body": body
        }
    except:
        response = {
            "statusCode": 200,
            "body": "Error Customer table could not be found"
        }
            
    return response    

