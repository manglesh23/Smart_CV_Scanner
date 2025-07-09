export const uploadMultpleFile= async(req,res)=>{
    try{
    //   console.log(req.files);
      let length= req.files.length;

      console.log("Length:---",length);
      let getFile=[];
      for(let v of req.files){
        // console.log(v.buffer)
        getFile.push(v.originalname)
      }

      res.status(200).json({Files:getFile});
    }catch(e){
        res.status(500).json({Error:e});
    }
}