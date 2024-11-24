import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt' 

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.render("registerPage", { error: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user if email does not exist
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Redirect to the success page with a message
    req.flash("message", "Account Created Successfully");
    return res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).render("registerPage", { error: "Registration failed. Please try again." });
  }
};

// userController.js
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Only set error message, not success message
      req.flash('error', 'Invalid email or password');
      return res.render('loginPage', { error: req.flash('error')[0] });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.render('loginPage', { error: req.flash('error')[0] });
    }

    // Store user details in the session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // Only set success message, not error message
    req.flash('message', 'Login successful!');
    return res.redirect('/launch');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.render('loginPage', { error: req.flash('error')[0] });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      req.flash('error', 'Error logging out');
      return res.redirect('/desktop');
    }
    // Clear session cookie and only set success message
    res.clearCookie('connect.sid');
    req.flash('message', 'Logged out successfully!');
    res.redirect('/login');
  });
};