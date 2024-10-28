const AdminViewModel = require('../viewModels/adminViewModel');

class AdminController {
    static async login(req, res) {
        const { username, password } = req.body;
        const result = await AdminViewModel.login(username, password);

        if (result.success) {
            return res.json({ message: 'Login successful', token: result.token });
        }
        return res.status(401).json({ message: result.message });
    }

    static logout(req, res) {
        // For JWT, just inform the user they should delete the token on the client-side.
        res.json({ message: 'Logout successful. Please remove your token from client storage.' });
    }
}
