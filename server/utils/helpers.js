const db = require('../config/db');

const getApplicants = async () => {
	
	let info = {};
	var data = await db.getData();
	info.users = data;

	return info;
}

const storeDocDetails = async (docs) => {
	try {
		await db.documents(applicat_id, docs.originalname, docs.fieldname, docs.path);
	} catch (error) {
		console.error("ERROR STORING DOCS : ", error);
		throw new Error(error);
	}
}

module.exports = {
	getApplicants,
	storeDocDetails
}
