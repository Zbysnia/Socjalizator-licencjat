const cloudinary = require('cloudinary');
const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');


cloudinary.config( {
    cloud_name: 'socjalizator',
    api_key: '771757311547289',
    api_secret: 'rtmyCtcUNyfZJPuvjubjjumt7Yc'
}
)


module.exports = {
    UploadPhoto(req,res) {
        cloudinary.uploader.upload(req.body.photo, async (result) => {
            console.log(result);

            await User.update({
                _id: req.user._id
            }, {
                $push: {
                    photos: {
                        imgId: result.public_id,
                        imgVersion: result.version
                    }
                }
            }
            ).then(() => res.status(HttpStatus.OK).json({message: 'Pomyślnie wgrano zdjecie!'})
            ).catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Błąd wgrywania zdjecia.'})
            );
        });
    }
};