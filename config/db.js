const mongooseBaseName = "yoga-practice-builder"

const database = {
	development: `mongodb://localhost/${mongooseBaseName}-development`,
	test: `mongodb://localhost/${mongooseBaseName}-test`,
}

const localDb = process.env.TESTENV ? database.test : database.development

const currentDb = process.env.DATABASE_URL || localDb


//exporting a string db name
module.exports = currentDb