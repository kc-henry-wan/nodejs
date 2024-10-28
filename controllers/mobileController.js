const MobileViewModel = require('../viewModels/mobileViewModel');

class MobileController {
    static async login(req, res) {
        const { username, password } = req.body;
        const result = await MobileViewModel.login(username, password);

        if (result.success) {
            req.session.userId = result.userId; // Store session data
            return res.json({ message: 'Login successful', userId: result.userId });
        }
        return res.status(401).json({ message: result.message });
    }

    static logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Could not log out, try again later' });
            }
            res.json({ message: 'Logout successful' });
        });
    }
}
