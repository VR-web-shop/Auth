import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import UserDTO from "../../dtos/User.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            UserDTO, 
            "User", 
            "UserDescription", 
            "UserRemoved"
        );
    }
}
