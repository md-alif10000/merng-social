module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
    const errors = {}
    if (username.trim() === '') {
        errors.username='Username can\'t be empty'
    }
    if (email.trim() === '') {
        errors.email="Email can not be empty"
        
    } else {
        const regex =
            /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regex)) {
            errors.email="Email must be a valid email address"
        }
    }
    if (password === '') {
        errors.password="Passsword can not empty"
        
    } else if (password !== confirmPassword) {
        errors.confirmPassword="Password doesn\'t match"
        
    }

    return {
        errors,
        valid:Object.keys(errors).length < 1
    }
    
}

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};