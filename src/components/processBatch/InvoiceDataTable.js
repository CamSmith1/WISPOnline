import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Button } from "@material-ui/core";
import axios from "axios";
import  { useState } from 'react';
import { render } from 'nprogress';


const columns = [
  { field: 'PropertyAddress', headerName: 'Property Address', width: 200 },
  { field: 'WastewaterFixedCharge', headerName: 'Wastewater Fixed Charge', width: 200 },
  { field: 'TotalDue', headerName: 'Total Due', width: 200 },
  { field: 'AccountNumber', headerName: 'Account Number', width: 200 },
  { field: 'TransactionStatus', headerName: 'Transaction Status', width: 200 },
 

];

;const rows = [];









export default function DataTable() {
  const [rowsArr, setRowsArr] = useState([]);



  
const handleFileUpload = (event) => {
  let QuinovicID = 'ID12345'; 
  let files = event.target.files;
  //console.log(JSON.stringify(files));
  handleSubmit(files, QuinovicID); //Used to upload files to lambda
  
};

const handleReload = (event) =>{
  let QuinovicID = 'ID12345'; 
  let JSONBody = buildGetTransactionDataPayload(QuinovicID);
  getTransactionData(JSONBody);
}

  //Promise function to read files with file reader
  function readFiletoB64(item)
  {
    return new Promise((resolve, reject) => {
      var reader = new FileReader()
      reader.readAsDataURL(item);
      reader.onload = function () {
        //Successfully converted the pdf to b64
         let b64PDFObj = {base64: reader.result.split(',')[1]};
          
        resolve(b64PDFObj)
      };
    });
  };


async function handleSubmit(files, QuinovicID){
    let arr = [];
    for(var i = 0; i < files.length; i++){
       let fileData = await readFiletoB64(files[i]); //Base64 data of the file
      arr.push(fileData)
    } 
    var jsonBody = buildocrPayload(arr, QuinovicID);
    queryOCRLambda(jsonBody)
}



  //Builds a JSON structure for the payload to send to Lambda for OCR
  function buildocrPayload (filesArr, QuinovicID) {
    let labels = getLabels();
    var JSONBody = {
      "QuinovicID": QuinovicID,
      "template":{
        "labels": labels
      },
      "pdffiles": {
        "files": filesArr
      }
    };
    return JSONBody;
  }

    //Builds JSON payload for getting transactionData
    function buildGetTransactionDataPayload (QuinovicID) {
      var JSONBody = {
        "QuinovicID": QuinovicID,
        "GetType": "TransactionData"
      };
      return JSONBody;
    }

  //Below is the template field mappings for a standard watercare bill
  function getLabels(){
    var labels =[
      {
        "width": 174,
        "y": 557,
        "label": "TotalDue",
        "x": 1272,
        "height": 55
      },
      {
        "label": "WastewaterFixedCharge",
        "y": 1214,
        "width": 144,
        "x": 1389,
        "height": 40
      },
      {
        "x": 909,
        "y": 722,
        "width": 393,
        "height": 109,
        "label": "PropertyAddress"
      },
      {
        "label": "AccountNumber",
        "height": 52,
        "x": 1265,
        "width": 256,
        "y": 177
      },
      {
        "y": 461,
        "label": "DueDate",
        "width": 225,
        "x": 1269,
        "height": 58
      }
    ];
   return labels;
  }

//This function queries the aws api gate way to invoke the Lambda function
async function queryOCRLambda(JSONBody) {
 
  // POST request using axios with async/await
  console.log('STARTING queryOCRLambda') 
  const response = await axios.post('https://w5mkt2xqgf.execute-api.us-east-1.amazonaws.com/prod', JSONBody, {
    headers: {
      "Content-Type" : "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers" : "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
     
    }
  }).then((resp) => {
    //console.log('RESPONSE FROM API '+ JSON.stringify(resp))
    console.log('Successfully uploaded file');
    handleReload();
  })
  .catch((error) => {
    console.error(error);
  });
}

//Get data from DynamoDB
async function getTransactionData(JSONBody) {
 
  // POST request using axios with async/await
  console.log('MAKING POST!');
  const response = await axios.post('https://5xwj12ymf7.execute-api.us-east-1.amazonaws.com/prod', JSONBody, {
    headers: {
      "Content-Type" : "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers" : "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
     
    }
  }).then((resp) => {
    var invoiceArr = resp.data.body["Data"]
    var invoiceRows = [];
    var x = 1;
    invoiceArr.forEach((invoice) => {
      var row = {
        "id":x,
        "PropertyAddress": invoice["PropertyAddress"],
        "WastewaterFixedCharge": invoice["WastewaterFixedCharge"],
        "TotalDue": invoice["TotalDue"],
        "AccountNumber": invoice["AccountNumber"],
        "TransactionStatus": "NOT POSTED"  
      };
      invoiceRows.push(row);
      x++;
      console.log('Added Row ' + row);
    })
    setRowsArr(invoiceRows);
    console.log('Value of rows '+ rowsArr);
    console.log(rowsArr.length)
  
  })
  .catch((error) => {
    console.error(error);
  });
}





































  
 render();
  return (
    <div style={{ height: '50%', width: '100%' }}>
      <DataGrid rows={rowsArr} columns={columns} checkboxSelection  />
      <Button color="primary" variant="contained" component="label" onClick={handleReload}>
      Reload
    </Button> 
    <Button color="primary" variant="contained" component="label">
      Upload Invoices
    <input type="file" hidden multiple accept="application/pdf" onChange={handleFileUpload}/>
    </Button> 
    <Button color="primary" variant="contained" component="label">
      Process
    </Button>
    </div>
   
  );
}