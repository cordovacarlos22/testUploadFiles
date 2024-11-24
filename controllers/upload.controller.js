import { console } from "inspector";


const upload = async (req, res) => {

  try {


    if (!req.files) {
      console.log("req", req)
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json("files  successfully uploaded ");
  } catch (error) {
    res.status(500).json('Error Uploading File:', error.message)
  }

}


export {
  upload,
}