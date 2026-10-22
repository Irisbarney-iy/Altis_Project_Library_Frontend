export default {
  header: {
    settings: 'settings',
    preferences: 'Preferences',
    viewProfile: 'View Profile',
    logout: 'Logout',
    language: 'Language'
  },
  menu: {
    dashboard: 'Dashboard',
    loans: 'Loans',
    users: 'Users',
    books: 'Books',
    publishers: 'Publishers'
  },
  auth: {
    welcomeBack: 'Welcome back!',
    welcome: 'Welcome!',
    recoverPasswordTitle: 'Recover password',
    changePasswordTitle: 'Change password',
    email: 'Email',
    emailPlaceholder: 'Ex: example{\'@\'}gmail.com',
    password: 'Password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    passwordPlaceholder: 'Enter your password',
    confirmPasswordPlaceholder: 'Confirm your password',
    fullName: 'Full name',
    fullNamePlaceholder: 'Enter your name',
    cpf: 'CPF',
    phone: 'Phone',
    birthDate: 'Birth date',
    address: 'Address',
    addressPlaceholder: 'Street, No. - City, State',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    clear: 'Clear',
    login: 'Login',
    register: 'Register',
    cancel: 'Cancel',
    validateData: 'Validate data',
    saveChanges: 'Save changes',
    noAccount: "Don't have an account?",
    signUpHere: 'Sign up here',
    hasAccount: 'Already have an account?',
    loginHere: 'Login here',

    validation: {
      nameRequired: 'Full name is required!',
      nameLength: 'Name must be between 3 and 100 characters',
      emailRequired: 'Email is required!',
      emailPattern: 'Email must end with {\'@\'}gmail.com!',
      cpfRequired: 'CPF is required!',
      cpfInvalid: 'Invalid CPF!',
      pastDate: 'Birth date must be in the past!',
      minAge: 'Renter must be at least 6 years old!',
      phoneRequired: 'Phone number is required!',
      phoneInvalid: 'Invalid phone number',
      birthDateRequired: 'Date of birth is required!',
      addressRequired: 'Address is required!',
      addressMax: 'Address cannot exceed 255 characters',
      passwordRequired: 'Password is required',
      passwordRules: 'Password must be 8-15 characters and include letters, numbers, and symbols',
      confirmPasswordRequired: 'Please confirm your password',
      passwordMatch: 'Passwords do not match'
    },
    notifications: {
      registerSuccess: 'Registration successful! Please log in.',
      registerError: 'Registration failed. Please check your information.'
    }
  }
}