const SwipeError = require('../errors').SwipeError
const UserModel = new (require('../models/User'))().createModel()
const NameModel = new (require('../models/Name'))().createModel()

module.exports = () => {
  return {
    async registerUser (id) {
      let user
      try {
        user = await new UserModel({
          userId: id.sub,
          email: id.email
        }).save()
      } catch (err) {
        throw new SwipeError('Failed to create user', 500, err)
      }
    
      try {
        await NameModel.prepareRatingTodoTableForUser(user._id)
      } catch (err) {
        throw new Error('Failed to create rating pool for user', 500, err)
      }

      console.log(`Created user ${user._id} for ${id.email}`)
      
      return user
    }
  }
}