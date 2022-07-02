const internModel = require("../models/InternModel")
const collegeModel = require("../models/collegeModel");

//****************************** CREATE INTERN API ************************************************/

const createInterns = async (req, res) => {

        try {

                let data = req.body;   // this is object will not be used at the time of creation as it has a field "collegeName" 

                // ______________________________________destructure of request body__________________________________//

                let { name, email, mobile, collegeName } = data;  //** college name' value will be used for db call to search document of this college */
                //______________________________________________ validation for required field________________________________//

                if (!name && !email && !mobile && !collegeName) return res.status(400).send({ status: false, message: "provide your details" })
                //_________________________________________validation for empty field___________________________________//


                if (!name) return res.status(400).send({ status: false, message: "Please enter your name" })

                //------------- validations only alphabet name and fullname -----------//

                if (!/^[A-Z a-z]+$/.test(name)) return res.status(400).send({ status: false, message: "Please enter only alphabet (name)." })

                //__________________________________________email validation_________________________________________//

                if (!email) return res.status(400).send({ status: false, message: "Please enter your emailId" })

                if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) return res.status(400).send({ status: false, message: "Please enter a valid email address " })

                //_______________________________________________ mobile validation____________________________________________//

                if (!mobile) return res.status(400).send({ status: false, message: "Please provide mobile number" })
                if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(mobile)) return res.status(400).send({ status: false, message: "Please provide valid mobile number" })

                //_______________________________________validations for duplicate value____________________________//

                const isPresentMobile = await internModel.findOne({ mobile });
                if (isPresentMobile) return res.status(400).send({ status: false, message: " Mobile Number already in use" })

                const isPresentEmail = await internModel.findOne({ email });
                if (isPresentEmail) return res.status(400).send({ status: false, message: " EmailId already in use" })

                //^^^^^^^^^^^^^^^^^^^^^^^^^^validation finished^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//

                ///_______________________________searching details of college using collegeName provided in request body______________//

                let college = await collegeModel.findOne({ isDeleted: false, name: collegeName });


                if (!college) { return res.status(404).send({ status: false, message: "No such college exist" }) }

                //           ------------destructure of id field from the details of college found ----------------------//

                let collegeId = college._id   // will be used as a field to create intern document in internmodel //

                //---------------------------creating a new object that will be used for creating document--------------//

                const saveData = { name, email, mobile, collegeId }

                //_________________creating document______________________//

                await internModel.create(saveData)

                //-------------find itnern data ----------//

                let findInternData = await internModel.findOne({ name, email, mobile, collegeId }, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })

                ///******** 5 fields will be send in response */

                let internData = {

                        isDeleted: findInternData.isDeleted,
                        name: findInternData.name,
                        email: findInternData.email,
                        mobile: findInternData.mobile,
                        collegeId: findInternData.collegeId
                };

                return res.status(201).send({ status: true, data: internData })
        }
        catch (err) {
                return res.status(500).send({ status: false, message: err.message })
        }
}

module.exports.createInterns = createInterns
