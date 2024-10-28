const PharmacistModel = require('../models/pharmacist');

class MobileViewModel {
    static async login(username, password) {
        const user = await PharmacistModel.findByUsername(username);
        if (user && user.password === password) {
            return { success: true, userId: user.id };
        }
        return { success: false, message: 'Invalid username or password' };
    }
}

module.exports = MobileViewModel;
