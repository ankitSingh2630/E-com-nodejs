
// const storage = multer.memoryStorage()
// const singleUpload = multer({storage:storage}).single("file");


// const multer = require('multer');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const singleUpload = (req, res, next) => {
    //     upload.single('file')(req, res, function (err) {
        //         if (err instanceof multer.MulterError) {
            //             console.log('Multer error:', err);
            //             return res.status(400).json({ message: 'File upload error' });
            //         } else if (err) {
                //             console.log('Server error:', err);
//             return res.status(500).json({ message: 'Server error' });
//         }
//         next();
//     });
// };

// module.exports = singleUpload;

// const multer = require('multer');
// const path = require('path');

// // Multer storage configuration
// const storage = multer.diskStorage({
    //   destination: function (req, file, cb) {
        //     cb(null, './uploads/'); // Destination folder for uploaded files
        //   },
        //   filename: function (req, file, cb) {
            //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            //     cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
            //   }
            // });
            
            // // File filter to accept only images
            // const fileFilter = (req, file, cb) => {
                //   if (file.mimetype.startsWith('image/')) {
                    //     cb(null, true);
                    //   } else {
                        //     cb(new Error('Only images are allowed!'), false);
                        //   }
                        // };
                        
                        // // Initialize multer instance with configuration
                        // const upload = multer({
                            //   storage: storage,
                            //   fileFilter: fileFilter,
                            //   limits: {
                                //     fileSize: 1024 * 1024 * 5 // 5MB file size limit
                                //   }
                                // });

                                // module.exports = upload;
                                
                                
                                // multer.js
                                // const storage = multer.diskStorage({});
                                
                                // const singleUpload = multer({ storage:storage }).single("file");
                                
                                // module.exports = singleUpload;
const multer = require("multer");
                                
const storage = multer.memoryStorage();
const singleUpload = multer({ storage }).single("file");
                                
module.exports = singleUpload;
                                
                                
                                
                                
                                
