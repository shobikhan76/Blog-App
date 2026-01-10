import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);
    const token = authService.generateToken(user._id);

    res.status(201).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, token },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.findUserByEmail(email);

    if (!user || !(await authService.comparePassword(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = authService.generateToken(user._id);
    res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
