
// const cloudinary = require('../config/cloudinaryConfig'); 
// const multer = require('multer');
// const CoachProfile = require('../models/CoachProfile');
// const Review = require('../models/Review');

// const upload = multer({ storage: multer.memoryStorage() });

// const uploadToCloudinary = (buffer, folder) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload_stream({ resource_type: 'auto', folder: folder }, (error, result) => {
//       if (error) {
//         return reject(error); 
//       }
//       resolve(result); 
//     }).end(buffer); 
//   });
// };

// // Create a new coach profile
// exports.createCoachProfile = async (req, res) => {
//   try {
//     const { coachName, coachLevel, coachingSport, coachPrice, availableTimeSlots, experience, offerSessions, sessionDescription } = req.body;

//     if (req.user.role !== 'Coach') {
//       return res.status(403).json({ msg: 'Access denied. Only coaches can create a profile.' });
//     }

//     const today = new Date();
//     const sevenDaysFromNow = new Date(today);
//     sevenDaysFromNow.setDate(today.getDate() + 7);

//     const isValidSlots = availableTimeSlots.every(slot => {
//       const slotDate = new Date(slot.date);
//       return slotDate >= today && slotDate <= sevenDaysFromNow;
//     });

//     if (!isValidSlots) {
//       return res.status(400).json({ msg: 'All available time slots must be within the next 7 days.' });
//     }

//     const newCoachProfile = new CoachProfile({
//       userId: req.user.id,
//       coachName,
//       coachLevel,
//       coachingSport,
//       coachPrice: {
//         individualSessionPrice: coachPrice.individualSessionPrice,
//         groupSessionPrice: coachPrice.groupSessionPrice
//       },
//       availableTimeSlots,
//       experience,
//       offerSessions,
//       sessionDescription
//     });

//     await newCoachProfile.save();
//     res.json(newCoachProfile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// // Update an existing coach profile
// exports.updateCoachProfile = async (req, res) => {
//   try {
//     if (req.user.role !== 'Coach') {
//       return res.status(403).json({ msg: 'Access denied. Only coaches can update a profile.' });
//     }

//     const { coachName, coachLevel, coachingSport, coachPrice, availableTimeSlots, experience, offerSessions, sessionDescription } = req.body;

//     let coachProfile = await CoachProfile.findById(req.params.id);

//     if (!coachProfile) {
//       return res.status(404).json({ msg: 'Coach profile not found' });
//     }

//     if (availableTimeSlots) {
//       const today = new Date();
//       const sevenDaysFromNow = new Date(today);
//       sevenDaysFromNow.setDate(today.getDate() + 7);

//       const isValidSlots = availableTimeSlots.every(slot => {
//         const slotDate = new Date(slot.date);
//         return slotDate >= today && slotDate <= sevenDaysFromNow;
//       });

//       if (!isValidSlots) {
//         return res.status(400).json({ msg: 'All available time slots must be within the next 7 days.' });
//       }

//       coachProfile.availableTimeSlots = availableTimeSlots;
//     }

//     if (coachName) coachProfile.coachName = coachName;
//     if (coachLevel) coachProfile.coachLevel = coachLevel;
//     if (coachingSport) coachProfile.coachingSport = coachingSport;
//     if (coachPrice) {
//       coachProfile.coachPrice.individualSessionPrice = coachPrice.individualSessionPrice;
//       coachProfile.coachPrice.groupSessionPrice = coachPrice.groupSessionPrice;
//     }
//     if (experience) coachProfile.experience = experience;
//     if (offerSessions) coachProfile.offerSessions = offerSessions;
//     if (sessionDescription) coachProfile.sessionDescription = sessionDescription;

//     coachProfile.updatedAt = Date.now();

//     await coachProfile.save();
//     res.json(coachProfile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// // Upload a coach profile image using Cloudinary
// exports.uploadCoachProfileImage = [
//   upload.single('image'), 
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ msg: 'No file uploaded' });
//       }

//       let coachProfile = await CoachProfile.findOne({ userId: req.user.id });

//       if (!coachProfile) {
//         return res.status(404).json({ msg: 'Coach profile not found' });
//       }

//       // Upload image to Cloudinary
//       const imageResult = await uploadToCloudinary(req.file.buffer, 'coach_profiles');
//       const imageUrl = imageResult.secure_url; // Get Cloudinary URL

//       coachProfile.image = imageUrl; // Save Cloudinary image URL to profile
//       await coachProfile.save();

//       res.json(coachProfile);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// ];

// // Update a coach profile image using Cloudinary
// exports.updateCoachProfileImage = [
//   upload.single('image'), 
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ msg: 'No file uploaded' });
//       }

//       let coachProfile = await CoachProfile.findById(req.params.id);

//       if (!coachProfile) {
//         return res.status(404).json({ msg: 'Coach profile not found' });
//       }

//       // Upload new image to Cloudinary
//       const imageResult = await uploadToCloudinary(req.file.buffer, 'coach_profiles');
//       const imageUrl = imageResult.secure_url; // Get Cloudinary URL

//       coachProfile.image = imageUrl; // Save Cloudinary image URL to profile
//       await coachProfile.save();

//       res.json(coachProfile);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// ];


// // Get all coach profiles with average ratings
// exports.getAllCoachProfiles = async (req, res) => {
//   try {
//     const coachProfiles = await CoachProfile.find();

//     const profilesWithAvgRating = await Promise.all(coachProfiles.map(async profile => {
//       const reviews = await Review.find({ coachProfileId: profile._id });
//       const avgRating = reviews.length > 0 
//         ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
//         : null;

//       return {
//         ...profile.toObject(),
//         avgRating: avgRating ? avgRating.toFixed(2) : null 
//       };
//     }));

//     res.json(profilesWithAvgRating);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// // Get a specific coach profile by CoachProfile ID with average rating
// exports.getCoachProfileByCoachProfileId = async (req, res) => {
//   try {
//     const coachProfile = await CoachProfile.findById(req.params.id);

//     if (!coachProfile) {
//       return res.status(404).json({ msg: 'Coach profile not found' });
//     }

//     const reviews = await Review.find({ coachProfileId: req.params.id });

//     const avgRating = reviews.length > 0 
//       ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
//       : null;

//     res.json({
//       ...coachProfile.toObject(),
//       avgRating: avgRating ? avgRating.toFixed(2) : null 
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// // Get a specific coach profile by userId with average rating
// exports.getCoachProfileByUserId = async (req, res) => {
//   try {
//     const coachProfile = await CoachProfile.findOne({ userId: req.params.userId });

//     if (!coachProfile) {
//       return res.status(404).json({ msg: 'Coach profile not found' });
//     }

//     const reviews = await Review.find({ coachProfileId: coachProfile._id });

//     const avgRating = reviews.length > 0 
//       ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
//       : null;

//     res.json({
//       ...coachProfile.toObject(),
//       avgRating: avgRating ? avgRating.toFixed(2) : null 
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// // Toggle the status of a coach profile
// exports.toggleCoachProfileStatus = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const coachProfile = await CoachProfile.findOne({ userId });

//     if (!coachProfile) {
//       return res.status(404).json({ msg: 'Coach profile not found' });
//     }

//     coachProfile.isActive = !coachProfile.isActive;
//     await coachProfile.save();

//     res.json(coachProfile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };



// controllers/coachProfileController.js
const CoachProfile = require('../models/CoachProfile');
const Review = require('../models/Review'); // Assume Review model is also in 

// { CoachProfile, Review } = require('../models'); // Sequelize models
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'auto', folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }).end(buffer);
  });
};


// Create a new coach profile
exports.createCoachProfile = async (req, res) => {
  try {
    const { coachName, coachLevel, coachingSport, coachPrice, availableTimeSlots, experience, offerSessions, sessionDescription } = req.body;

    if (req.user.role !== 'Coach') {
      return res.status(403).json({ msg: 'Access denied. Only coaches can create a profile.' });
    }

    const newCoachProfile = await CoachProfile.create({
      userId: req.user.id,
      coachName,
      coachLevel,
      coachingSport,
      coachPrice,
      availableTimeSlots,
      experience,
      offerSessions,
      sessionDescription
    });

    res.json(newCoachProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateCoachProfile = async (req, res) => {
  try {
    if (req.user.role !== 'Coach') {
      return res.status(403).json({ msg: 'Access denied. Only coaches can update a profile.' });
    }

    const { coachName, coachLevel, coachingSport, coachPrice, availableTimeSlots, experience, offerSessions, sessionDescription } = req.body;

    const coachProfile = await CoachProfile.findByPk(req.params.id);

    if (!coachProfile) {
      return res.status(404).json({ msg: 'Coach profile not found' });
    }

    // Validate time slots before updating
    if (availableTimeSlots) {
      const today = new Date();
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);

      const isValidSlots = availableTimeSlots.every(slot => {
        const slotDate = new Date(slot.date);
        return slotDate >= today && slotDate <= sevenDaysFromNow;
      });

      if (!isValidSlots) {
        return res.status(400).json({ msg: 'All available time slots must be within the next 7 days.' });
      }
    }

    await coachProfile.update({
      coachName,
      coachLevel,
      coachingSport,
      coachPrice,
      availableTimeSlots, // pass as JSON, not JSON.stringify(availableTimeSlots)
      experience,
      offerSessions, // pass as JSON, not JSON.stringify(offerSessions)
      sessionDescription
    });

    res.json(coachProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Upload a new profile image
exports.uploadCoachProfileImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      const coachProfile = await CoachProfile.findOne({ where: { userId: req.user.id } });

      if (!coachProfile) {
        return res.status(404).json({ msg: 'Coach profile not found' });
      }

      const imageResult = await uploadToCloudinary(req.file.buffer, 'coach_profiles');
      const imageUrl = imageResult.secure_url;

      await coachProfile.update({ image: imageUrl });

      res.json(coachProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];

// Update existing profile image
exports.updateCoachProfileImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      const coachProfile = await CoachProfile.findByPk(req.params.id);

      if (!coachProfile || coachProfile.userId !== req.user.id) {
        return res.status(404).json({ msg: 'Coach profile not found or unauthorized access' });
      }

      // Delete existing image from Cloudinary if it exists
      if (coachProfile.image) {
        const publicId = coachProfile.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const imageResult = await uploadToCloudinary(req.file.buffer, 'coach_profiles');
      const imageUrl = imageResult.secure_url;

      await coachProfile.update({ image: imageUrl });

      res.json(coachProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];


// exports.uploadCoachProfileImage = [
//   upload.single('image'), 
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ msg: 'No file uploaded' });
//       }

//       const coachProfile = await CoachProfile.findOne({ where: { userId: req.user.id } });

//       if (!coachProfile) {
//         return res.status(404).json({ msg: 'Coach profile not found' });
//       }

//       const imageResult = await uploadToCloudinary(req.file.buffer, 'coach_profiles');
//       const imageUrl = imageResult.secure_url;

//       await coachProfile.update({ image: imageUrl });

//       res.json(coachProfile);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// ];


exports.toggleCoachProfileStatus = async (req, res) => {
  try {
    const coachProfile = await CoachProfile.findOne({ where: { userId: req.params.id } });

    if (!coachProfile) {
      return res.status(404).json({ msg: 'Coach profile not found' });
    }

    await coachProfile.update({ isActive: !coachProfile.isActive });
    res.json(coachProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllCoachProfiles = async (req, res) => {
  try {
    const coachProfiles = await CoachProfile.findAll();

    const profilesWithAvgRating = await Promise.all(coachProfiles.map(async profile => {
      const reviews = await Review.findAll({ where: { coachProfileId: profile.id } });
      const avgRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : null;

      return {
        ...profile.toJSON(),
        avgRating: avgRating ? avgRating.toFixed(2) : null
      };
    }));

    res.json(profilesWithAvgRating);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getCoachProfileByCoachProfileId = async (req, res) => {
  try {
    const coachProfile = await CoachProfile.findByPk(req.params.id);

    if (!coachProfile) {
      return res.status(404).json({ msg: 'Coach profile not found' });
    }

    //const reviews = await Review.findAll({ where: { coachProfileId: req.params.id } });
    //const avgRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : null;

    //res.json({ ...coachProfile.toJSON(), avgRating: avgRating ? avgRating.toFixed(2) : null });
    res.json({ ...coachProfile.toJSON() });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getCoachProfileByUserId = async (req, res) => {
  try {
    const coachProfile = await CoachProfile.findOne({ where: { userId: req.params.userId } });

    if (!coachProfile) {
      return res.status(404).json({ msg: 'Coach profile not found' });
    }

    //const reviews = await Review.findAll({ where: { coachProfileId: coachProfile.id } });
    //const avgRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : null;

    //res.json({ ...coachProfile.toJSON(), avgRating: avgRating ? avgRating.toFixed(2) : null });
    res.json({ ...coachProfile.toJSON() });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Get all coach profiles with average ratings
exports.getAllCoachProfiles = async (req, res) => {
  try {
    const coachProfiles = await CoachProfile.findAll();

    const profilesWithAvgRating = await Promise.all(coachProfiles.map(async profile => {
      const reviews = await Review.findAll({ where: { coachProfileId: profile.id } });
      const avgRating = reviews.length > 0 
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
        : null;

      return {
        ...profile.toJSON(),
        avgRating: avgRating ? avgRating.toFixed(2) : null 
      };
    }));

    res.json(profilesWithAvgRating);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Toggle the status of a coach profile
exports.toggleCoachProfileStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const coachProfile = await CoachProfile.findOne({ where: { userId: id } });
    if (!coachProfile) return res.status(404).json({ msg: 'Coach profile not found' });

    coachProfile.isActive = !coachProfile.isActive;
    await coachProfile.save();

    res.json(coachProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
