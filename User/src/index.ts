import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "3"
    user.lastName = ""
    user.age = 20
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with First Name: " + user.firstName)

    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

}).catch(error => console.log(error))
