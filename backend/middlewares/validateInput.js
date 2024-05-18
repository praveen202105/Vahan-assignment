const validateInput = (req, res, next) => {
    const { name, mobile, dob } = req.body;
  
    // Name should not contain numbers
    if (/\d/.test(name)) {
      return res.status(400).json({ error: 'Enter a valid Name' });
    }
  
    // Mobile number should be exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: 'Mobile number must be exactly 10 digits' });
    }
  
    // Calculate age from date of birth and ensure it's at least 18
    const dateOfBirth = new Date(dob);
    const ageDiffMs = Date.now() - dateOfBirth.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  
    if (age < 18) {
      return res.status(400).json({ error: 'Employee must be at least 18 years old' });
    }
  
    next();
  };

  module.exports = validateInput;