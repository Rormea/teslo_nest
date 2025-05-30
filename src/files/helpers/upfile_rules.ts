



export const upfileRules = ( req: Express.Request, file: Express.Multer.File, cb: Function  )=> {

    if(!file) return cb(new Error('File is empty'), false); 

    const fileExtension = file.mimetype.split('/')[1];
    //por ejemplo 'jpg', 'jpeg', 'png', 'gif'
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    // Check if the file type is valid
    if (!validExtensions.includes(fileExtension || '')) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    
    if (file.size > 1024 * 1024 * 5) { // Limiting file size to 5MB
        return cb(new Error('File size exceeds the limit of 5MB!'), false);
    }

   

    console.log(file)

    cb(null, true); // Accept the file
};