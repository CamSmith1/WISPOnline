import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Button } from "@material-ui/core";
import axios from "axios";



const columns = [
  { field: 'id', headerName: 'TransactionID', width: 200 },
  { field: 'DateProcessed', headerName: 'Date Processed', width: 200 },
  { field: 'TransactionStatus', headerName: 'Transaction Status', width: 200 },
  {field: 'BatchTotal', headerName: 'Batch Total', type: 'number', width: 200},

];

const rows = [

  //{ id: 1, DateProcessed: '31/03/21', TransactionStatus: 'POSTED', BatchTotal: 500 },

];


const handleFileUpload = (event) => {
    
  let files = event.target.files;
  console.log(JSON.stringify(files));
  handleSubmit(files); //Used to upload files to lambda
};

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


async function handleSubmit(files){
    let arr = [];
    for(var i = 0; i < files.length; i++){
       let fileData = await readFiletoB64(files[i]); //Base64 data of the file
      arr.push(fileData)
    }
    
    var jsonBody = buildocrPayload(arr);
   // console.log('Attempting first api');
 // console.log('Stufff '+ jsonBody)
 
    queryOCRLambda(jsonBody)
}



  //Builds a JSON structure for the payload to send to Lambda for OCR
  function buildocrPayload (filesArr) {
    let labels = getLabels();
    var JSONBody = {
      "template":{
        "labels": labels
      },
      "pdffiles": {
        "files": filesArr
      }
    };
  //console.log('payload: ' +JSON.stringify(JSONBody))
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
  //const apiKey = "JBGWI8rKz330EznOqbfT39UmolMIcPD5tBiPVh77";
  
  const response = await axios.post('https://w5mkt2xqgf.execute-api.us-east-1.amazonaws.com/prod', JSONBody, {
    headers: {
      "Content-Type" : "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers" : "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
     
    }
  }).then((resp) => {console.log('RESPONSE FROM API '+ JSON.stringify(resp))})
  .catch((error) => {
    console.error(error);
  });
  //this.setState({ articleId: response.data.id });
}





















export default function DataTable() {
  return (
    <div style={{ height: '50%', width: '100%' }}>
      <DataGrid rows={rows} columns={columns} checkboxSelection  />
      <Button color="primary" variant="contained" component="label">
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