import base64
#from chalice import Chalice, Response
from io import BytesIO
import json
import os
import secrets 
import glob
import pytesseract
import pdf2image
import cv2
from PIL import Image
import boto3
import uuid


def handler(event, context):

    

    request_body = event
    
    template = request_body['template']
    pdfFilesArray = request_body['pdffiles']
    labelsArray = template['labels']

    #QuinovicId = "ID12345"
    client = boto3.resource('dynamodb')
    QuinovicId = str(request_body['QuinovicID'])
    TransactionTbl = QuinovicId + 'TransactionData' #TODO When user is created create the transacitonTable
    table = client.Table(TransactionTbl) 

    


    allExtractedInvoiceData = [] #Array to store all the extracted data from all invoices
    counter = 0 #Used for naming image files
    print('UPDATED FUNCTION')
    #Loop over each base64 format file and perform OCR
    #When the pdf is converted correctly to image format do stuff
    for file in pdfFilesArray['files']:
        counter += 1
       
        #note in production replace b64 value with file['base64']
        b64 = file['base64']
        bytes = base64.b64decode(b64, validate=True)
        if bytes[0:4] != b'%PDF':
            raise ValueError('Missing the PDF file signature')


        filename =  "/tmp/" + str(counter) + ".pdf"#Generate a random temp name for the pdf before its saved to file
        #image = pdf2image.convert_from_bytes(bytes)
        pdf = open(filename, 'wb')
        pdf.write(bytes)
        pdf.close() 

        pages = pdf2image.convert_from_path(filename, 500)
        for page in pages:
            page.save('/tmp/' +str(counter) + '.jpg', 'JPEG')
            print('/tmp/' +str(counter) + '.jpg')
            #This is really bad but using counter to create unique names TODO handle multi page pdf
            counter += 1
            #Break after retrieving the first page of the pdf
            break


            #File cleanup delete pdf
        if os.path.exists(filename):
            print('Deleting file' + filename)
            os.remove(filename)

    #Code below iterates over all the invoices that have been converted to jpg and dumps into tempFolderName directory
    images = glob.glob("/tmp/*.jpg") #Get a collection of all files in the temp folder
    for img in images: 
        extractedFileData = {} #A dict that will store all the data extracted from 1 file        
        invoice = cv2.imread(img)
        invoice = cv2.resize(invoice, (1653,2339), interpolation=cv2.INTER_AREA)

        for label in labelsArray:
            x = int(label['x'])
            y = int(label['y'])
            w = int(label['width'])
            h = int(label['height'])
            lblName = label['label']

            crop_img = invoice[y:y+h, x:x+w]
            gray = cv2.cvtColor(crop_img, cv2.COLOR_BGR2GRAY)
            #create a temp file from the extracted region
            filename = "/tmp/{}.jpg".format(secrets.token_urlsafe(8))
            cv2.imwrite(filename, gray)

            #extracted text from the specified region
            extractedText = pytesseract.image_to_string(Image.open(filename), lang='eng')
            print(extractedText)
            extractedFileData[lblName] = extractedText #Let the extracted next into the dict
            os.remove(filename)#Delete the temp file
            #Take all the data extracted from a single invoice and insert it as a record to allExtractedInvoiceData array

        invoiceID = str(uuid.uuid1())
        input = {'invoiceID':invoiceID , 'TotalDue':extractedFileData['TotalDue'],'WastewaterFixedCharge':extractedFileData['WastewaterFixedCharge'],'PropertyAddress':extractedFileData['PropertyAddress'],'AccountNumber':extractedFileData['AccountNumber'],'DueDate':extractedFileData['DueDate'], 'QuinovicID':QuinovicId}      
        table.put_item(Item=input)
        allExtractedInvoiceData.append(extractedFileData)
        
    #Outside of all the loops
    #sets the output to extracted data array
    output = allExtractedInvoiceData


    body = {
        "text": output
    }

    response = {
        "statusCode": 200,
        "body": body
    }

    return response