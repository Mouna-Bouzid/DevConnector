const express= require('express')
const router=express.Router()
const request = require('request')
const config = require('config')
const auth=require('../../middleware/auth')
const {check, validationResult}=require('express-validator')

const Profile= require('../../Modals/Profile')
const User= require('../../Modals/User')

//@route   GET API/profile/me
//@desc    Get current users profile
//@access  Private
router.get('/me', auth, async (req,res)=>{
    try{
const profile= await Profile.findOne({user: req.user.id}).populate(
    'user', ['name', 'avatar']
)
if(!profile){
    return res.status(400).json({msg:'there is no profile for this user'})
}
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

//@route   POST API/profile
//@desc    create or update user profile
//@access  Private
router.post('/', [auth, [
    check('status', 'Status is required')
    .not().isEmpty(),
    check('skills', 'skills is required')
    .not().isEmpty()
]], async (req, res)=>{
 const errors=validationResult(req)   
 if(!errors.isEmpty()){
 return res.status(400).json({errors: errors.array()})
 }

 const {
    company,
    website,
    location,
    status,
    bio,
    githubusername,
    skills,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram
  } = req.body;

 // Get fields
 const profileFields = {};
 profileFields.user = req.user.id;
 if (req.body.handle) profileFields.handle = req.body.handle;
 if (req.body.company) profileFields.company = req.body.company;
 if (req.body.website) profileFields.website = req.body.website;
 if (req.body.location) profileFields.location = req.body.location;
 if (req.body.bio) profileFields.bio = req.body.bio;
 if (req.body.status) profileFields.status = req.body.status;
 if (req.body.githubusername)
   profileFields.githubusername = req.body.githubusername;
 // Skills - Spilt into array
 if(skills) 
//  (typeof req.body.skills !== 'undefined') 
{
   profileFields.skills = skills.split(',').map(skill => skill.trim());
 }

 // Social
 profileFields.social = {};
 if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
 if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
 if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
 if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
 if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

try{
let profile = await Profile.findOne({user: req.user.id})
if(profile){
    //update
    profile= await Profile.findOneAndUpdate({user: req.user.id}, { $set:
    profileFields}, {new: true})
    
return res.json(profile)
}


//create
profile= new Profile(profileFields)
await profile.save()
res.json(profile)

}catch(err){
    console.error(err.message)
    res.status(500).send('Server Error')
}


});

//@route   GET API/profile
//@desc    GET all profiles
//@access  Public
router.get('/',async(req,res)=>{
try {
    const profiles= await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
}
})

//@route   GET API/profile/user/:user_id
//@desc    GET profile by id
//@access  Public
router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile= await Profile.findOne({user: req.params.user_id }).populate('user', ['name', 'avatar'])
       if(!profile) return res.status(400).json({msg:'Profile not found'})
       
       
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'})
        }
        res.status(500).send('Server Error')
    }

})
//@route   DELETE API/profile
//@desc    DELETE profile, User & posts
//@access  Private
router.delete('/', auth, async(req,res)=>{
    try {
        //@todo - remove users posts
        //Remove profile
        await Profile.findOneAndRemove({ user: req.user.id})
        //Remove user
        await User.findOneAndRemove({ _id: req.user.id})
        
        res.json({msg: 'use deleted'})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    })

//@route   PUT API/profile/experience
//@desc    Add profile experience
//@access  Private
router.put('/experience', [auth,
check('title', 'Title is required').not().isEmpty(),
check('company', 'Company is required').not().isEmpty(),
check('from', 'From date is required').not().isEmpty()
], async (req,res)=>{
    const errors=validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

   const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
   }=req.body;
   const newEXP={
       title,
       company,
       location,
      from,
      to,
      current,
      description
   }

    try {
       const profile= await Profile.findOne({user: req.user.id})
    
      profile.experience.unshift(newEXP);

      await profile.save()
      res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route   DELETE API/profile/experienc/:exp_ide
//@desc    DELETE profile experience
//@access  Private
router.delete('/experience/:exp_id', auth, async (req,res)=>{
try {
    const profile=await Profile.findOne({user:req.user.id})
   //Get remove index
   const removeIndex=profile.experience
   .map(item=>item.id)
   .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
 await profile.save()
 res.json(profile)
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
}
})


//@route   PUT API/profile/education
//@desc    Add profile education
//@access  Private
router.put('/education', [auth,
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy date is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
    ], async (req,res)=>{
        const errors=validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
    
       const {
         school,
         degree,
         fieldofstudy,
         from,
         to,
         current,
         description
       }=req.body;
       const newEDC={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
       }
    
        try {
           const profile= await Profile.findOne({user: req.user.id})
        
          profile.education.unshift(newEDC);
    
          await profile.save()
          res.json(profile)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    })
    
    //@route   DELETE API/profile/education/:edc_id
    //@desc    DELETE profile education
    //@access  Private
    router.delete('/education/:edc_id', auth, async (req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.user.id})
       //Get remove index
       const removeIndex=profile.education
       .map(item=>item.id)
       .indexOf(req.params.edc_id);
    
        profile.education.splice(removeIndex, 1);
     await profile.save()
     res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    })
    //@route   GET API/profile/github/:username
    //@desc    GET user repos from github
    //@access  Public
    
    router.get('/github/:username',(req,res)=>{
try {
    const options={
     uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=create:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
    method:'GET',
    headers: {'user-agent':'node.js'}
    }

    request(options, (error,response,body)=>{
        if(error) return console.error(error);

        if(response.statusCode !== 200){
        return res.status(404).json({msg:"No github profile found"})
        }
        res.json(JSON.parse(body))
    })

} catch (err) {
    console.error(message.error)
    res.status(500).json('Server Error')
}
    })

module.exports = router;