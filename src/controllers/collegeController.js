
const collegeModel = require("../models/collegeModel");
const InternModel = require("../models/InternModel");

//***************************************CREATE COLLEGE API************************************************************* */


const createcollege = async function (req, res) {
    try {

        let data = req.body;
        //---------------------- Destructure of request body------------------------------------/

        let { name, fullName, logoLink } = data
        
        if (!name && !fullName && !logoLink) return res.status(400).send({ status: false, message: "Please provide your details" })
        if (!name)
        return res.status(400).send({ status: false, message: "Please enter your name" })
      name = name.toLowerCase()

     
        if (!fullName)
            return res.status(400).send({ status: false, message: "Please enter your fullname" })

        //-------- validations only alphabet name and fullname -----------//

        if (!/^[a-z]+$/.test(name)) return res.status(400).send({ status: false, message: "Please enter only alphabet & lower case (name)." })

        if (!/^[A-Z, a-z]+$/.test(fullName)) return res.status(400).send({ status: false, message: "Please enter only alphabet (fullName)." })


        ///------------------LOGO LINK VALIDATION------------------------------------------/


        if (!logoLink)
            return res.status(400).send({ status: false, message: "Please enter LogoLink" })
        logoLink = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(logoLink)

        if (!logoLink)
            return res.status(400).send({ status: false, message: "Please ensure that you have entered correct url link" })

        //------------validations for duplicate field---------------------------------------/

        let isDuplicetName = await collegeModel.findOne({ name:name })
        if (isDuplicetName) return res.status(400).send({ status: false, message: "college with this name already exist" })

        let isDuplicetFullName = await collegeModel.findOne({ fullName })
        if (isDuplicetFullName) return res.status(400).send({ status: false, message: "college with this FullName already exist" })
        

        ////          ^^^^^^^^^^^^^^^ validation process finished     ^^^^^^^^^^^^^^^^            /////

        if (Object.keys(data).length != 0) {

            let savedData = await collegeModel.create(data)

            ///       we are destructuring fields of data, because we need only 4 fields to be in send in response after creation of document      //

            let { name, fullName, logoLink, isDeleted } = savedData;
            //    created a new object to be send in response (only four field)   //
            let answer = {};
            answer.name = name;
            answer.fullName = fullName;
            answer.logoLink = logoLink;
            answer.isDeleted = isDeleted

            return res.status(201).send({ status: true, data: answer })
        }
        else return res.status(400).send({ status: false, message: "Provide  your details" }) ///if request body is empty
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
//********************************************************************************************************************************* */

//   GET COLLEGE DETAILS API  // 
// _------------_________________---------------------------_____________________----------------------____________________-----/


const getCollegeDetails = async (req, res) => {
    try {


        let collegeName = req.query.collegeName;
        if (!collegeName) { return res.status(400).send({ status: false, message: "please enter something in query params" }) }
        collegeName= collegeName.toLowerCase()
        // ------------------- empty field validation---------------------------//

       

        //--------------------validation for college name --------------------//

        let collegeDetails = await collegeModel.findOne({ name: collegeName })
        if (!collegeDetails) return res.status(404).send({ status: false, message: "college not found" })

        //----------------destructure of object of college details------------//
        let { name, fullName, logoLink, _id } = collegeDetails

        //-------------------searching intern from this college-------------//

        let interns = await InternModel.find({ collegeId: _id }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        if (!interns || interns.length == 0) return res.status(404).send({ status: false, message: "no intern from this college" })

        //----------------------creating object to be send in response-------------//
        let data = {};
        data.name = name;
        data.fullName = fullName;
        data.logoLink = logoLink;
        data.interns = interns;
        res.status(200).send({ status: true, Data:data })
    }


    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

   
}
//********************************************************************************************************************************** */

module.exports.createcollege = createcollege
module.exports.getCollegeDetails = getCollegeDetails











