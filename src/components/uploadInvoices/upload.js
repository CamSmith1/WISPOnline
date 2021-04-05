import { Button } from "@material-ui/core";
import axios from "axios";



  const upload = (props) => (
    
    <Button color="primary" variant="contained" component="label">
      Upload Invoices
    <input type="file" hidden multiple accept="application/pdf" onChange={handleFileUpload}/>
    </Button> 
  );


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
           let b64PDFObj = {base64: reader.result};
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
     // queryOCRLambda(jsonBody)
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
    console.log('payload: ' +JSON.stringify(JSONBody))
      return JSONBody;
  
    }

    //Below is the template field mappings for a standard watercare bill
    function getLabels(){
      var labels = [
        {
           "width":68,
           "y":225.04166412353516,
           "label":"TotalDue",
           "x":516.9999847412109,
           "height":22
        },
        {
           "label":"WastewaterFixedCharge",
           "y":495.04166412353516,
           "width":50,
           "x":563.9999847412109,
           "height":16
        },
        {
           "x":375.99998474121094,
           "y":292.04166412353516,
           "width":159,
           "height":42,
           "label":"PropertyAddress"
        },
        {
           "label":"AccountNumber",
           "height":26,
           "x":522.9999847412109,
           "width":79,
           "y":71.04166412353516
        },
        {
           "y":188.04166412353516,
           "label":"DueDate",
           "width":92,
           "x":521.9999847412109,
           "height":19
        }
     ];
     return labels;
    }

  //This function queries the aws api gate way to invoke the Lambda function
  async function queryOCRLambda(JSONBody) {
    // POST request using axios with async/await
    console.log('STARTING queryOCRLambda')
    const apiKey = "GA6EROAZcC20kzulnmyxH75s4rqAAgpzi5nMHmde";
    
    const response = await axios.post('https://l8mdq4z58b.execute-api.us-east-1.amazonaws.com/default/OCRINVOICE', JSONBody, {
      headers: {
        "Content-Type" : "application/json",
        'x-api-key' : apiKey
      }
    }).then((resp) => {console.log('RESPONSE FROM API '+ resp)})
    .catch((error) => {
      console.error(error);
    });
    //this.setState({ articleId: response.data.id });
}


  export default upload;
  