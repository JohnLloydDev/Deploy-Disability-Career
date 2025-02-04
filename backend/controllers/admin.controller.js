import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    const employers = users.filter(user => user.role === "Employer");
    const applicants = users.filter(user => user.role === "Applicant");

    res.status(200).json({
      employers,
      applicants
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};


export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error during user deletion: ${error.message}`);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user." });
  }
};

export const banUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.banned) {
      return res.status(400).json({ message: "User is already banned" });
    }

    user.banned = true;
    await user.save();

    res.status(200).json({ message: "User has been banned successfully" });
  } catch (error) {
    console.error(`Error during user banning: ${error.message}`);
    res
      .status(500)
      .json({ message: "An error occurred while banning the user." });
  }
};

export const unbanUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.banned) {
      return res.status(400).json({ message: "User is not banned" });
    }

    user.banned = false;
    await user.save();

    res.status(200).json({ message: "User has been unbanned successfully" });
  } catch (error) {
    console.error(`Error during user unbanning: ${error.message}`);
    res
      .status(500)
      .json({ message: "An error occurred while unbanning the user." });
  }
};

export const getUsersInfo = async (req, res) => {
  try {
    const users = await User.find({});

    const employers = users.filter(user => user.role === "Employer").map(user => ({
      userId: user._id,
      fullName: user.fullName,
      contact: user.contact,
      employerInformation: {
        companyName: user.employerInformation.companyName,
        companyAddress: user.employerInformation.companyAddress,
        verificationId: user.employerInformation.verificationId || "No verification ID",
        isIdVerified: user.employerInformation.isIdVerified
      },
      banned: user.banned
    }));

    const applicants = users.filter(user => user.role === "Applicant").map(user => ({
      userId: user._id,
      fullName: user.fullName,
      contact: user.contact,
      disabilityInformation: {
        verificationId: user.disabilityInformation.verificationId || "No verification ID",
        disabilityType: user.disabilityInformation.disabilityType,
        isIdVerified: user.disabilityInformation.isIdVerified
      },
      banned: user.banned
    }));

    res.status(200).json({
      employers,
      applicants
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

export const updateVerificationStatus = async (req, res) => {
  try {
    const { userId, role, isVerified } = req.body; 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role === "Employer") {
      if (!user.employerInformation || !user.employerInformation.verificationId) {
        return res.status(400).json({ message: "Employer verification ID not found" });
      }
      user.employerInformation.isIdVerified = isVerified;
    } else if (role === "Applicant") {
      if (!user.disabilityInformation || !user.disabilityInformation.verificationId) {
        return res.status(400).json({ message: "Applicant verification ID not found" });
      }
      user.disabilityInformation.isIdVerified = isVerified;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await user.save();

    return res.status(200).json({
      message: `${role} verification status updated successfully`,
      user,
    });
  } catch (error) {
    console.error("Error updating verification status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (updateData.email) user.email = updateData.email;
    if (updateData.password) user.password = updateData.password;
    if (updateData.isVerified !== undefined) user.isVerified = updateData.isVerified;

    if (updateData.fullName) user.fullName = updateData.fullName;
    if (updateData.contact) user.contact = updateData.contact;

    if (user.role === "Employer" && updateData.employerInformation) {
      user.employerInformation = {
        ...user.employerInformation,
        ...updateData.employerInformation,
      };
    }

    if (user.role === "Applicant" && updateData.disabilityInformation) {
      user.disabilityInformation = {
        ...user.disabilityInformation,
        ...updateData.disabilityInformation,
      };
    }

    if (user.role === "Applicant") {
      if (updateData.address) user.address = updateData.address;
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "An error occurred while updating the user." });
  }
};


export const getTotalUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const totalUsers = users.length;

    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ error: "An error occurred while fetching total users." });
  }
};


export const getTotalEmployers = async (req, res) => {
  try {
    const users = await User.find({});
    const totalEmployers = users.filter(user => user.role === "Employer").length;

    res.status(200).json({ totalEmployers });
  } catch (error) {
    console.error("Error fetching total employers:", error);
    res.status(500).json({ error: "An error occurred while fetching total employers." });
  }
};


export const getTotalApplicants = async (req, res) => {
  try {
    const users = await User.find({});
    const totalApplicants = users.filter(user => user.role === "Applicant").length;

    res.status(200).json({ totalApplicants });
  } catch (error) {
    console.error("Error fetching total applicants:", error);
    res.status(500).json({ error: "An error occurred while fetching total applicants." });
  }
};

export const getTotalUser = async (req, res) => {

  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(400).json({ message: "No users found" });
    }

    const totalUsers = await User.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalUsers: totalUsers[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ message: "An error occurred while fetching total users." });
  }
};

export const getUserPercentage = async (req, res) => {
  try {
    const totalApplicants = await User.countDocuments({ role: "Applicant" });

    const totalEmployers = await User.countDocuments({ role: "Employer" });

    const totalUsers = totalApplicants + totalEmployers;

    if (totalUsers === 0) {
      return res.status(400).json({ message: "No users found" });
    }
    const applicantPercentage = ((totalApplicants / totalUsers) * 100).toFixed(2);
    const employerPercentage = ((totalEmployers / totalUsers) * 100).toFixed(2);

    res.status(200).json({
      totalUsers,
      applicantPercentage,
      employerPercentage,
    });
  } catch (error) {
    console.error("Error fetching user percentages:", error);
    res.status(500).json({ message: "An error occurred while fetching percentages." });
  }
};
