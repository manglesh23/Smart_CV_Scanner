import { compareJDwithCVs } from "../helper/compareJDWithCVs.js";

export const uploadMultpleFile= async(req,res)=>{
    try{
    //   console.log(req.files);
      let length= req.files.length;

      // console.log("Length:---",length);
      let getFile=[];
      for(let v of req.files){
        // console.log(v.buffer)
        getFile.push(v.originalname)
      }

      const result = await Promise.all(
        req.files.map(async(file)=>{
            let getData= await compareJDwithCVs(file);

            return getData;
        })
      )
    //   console.log(result)

      res.status(200).json({Files:result});
    }catch(e){
        res.status(500).json({Error:e});
    }
}