import { Button } from "@material-ui/core";

  
  const upload = (props) => (
    <Button color="primary" variant="contained" component="label">
      Upload Invoices
    <input type="file" hidden onChange={handleFileUpload}/>
    </Button> 
    
 

      
    
  );


const handleFileUpload = () => {
 console.log("Test");
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



  export default upload;
  