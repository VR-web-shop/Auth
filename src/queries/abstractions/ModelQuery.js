
export default  class ModelQuery {
    async execute(db) {
        throw new Error("Method not implemented");
    }

    /**
     * @function convertStringModelNamesToObjects
     * @description This function is used to convert the include model attributes
     * from strings to actual model objects. This is done to avoid the caller
     * of the query to have to know the actual model objects. 
     */
    static convertStringModelNamesToObjects = (include, db) => {
        if (include && include.model && typeof include.model === "string") {
            include.model = db[include.model];
        }

        if (include && include.include) {
            include.include.forEach(innerInclude => {
                ModelQuery.convertStringModelNamesToObjects(innerInclude, db);
            });
        }
    }
}
