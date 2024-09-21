import bcrypt from "bcryptjs";
export const hashPassword = async (password) => {
  try {
    const saltNumber = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, saltNumber);
    return hashPassword;
  } catch (err) {
    console.log(err);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
