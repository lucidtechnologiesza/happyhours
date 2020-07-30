const db = require('../config/db');

const getApplicants = async () => {
	
	let info = {};
	var data = await db.getData();
	info.users = data;

	return info;
}

module.exports = { getApplicants }
