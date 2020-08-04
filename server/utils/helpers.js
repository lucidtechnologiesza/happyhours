const db = require('../config/db');

const getApplicants = async () => {
	
	let info = {};
	info.users = await db.getData();
	info.docs = await db.getDocs();

	return info;
}

const storeDocDetails = async (applicat_id, docs) => {
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
