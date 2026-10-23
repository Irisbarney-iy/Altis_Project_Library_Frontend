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
    birthDate: 'Birth Date',
    address: 'Address',
    addressPlaceholder: 'Street, No. - City, State',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    clear: 'Clear',
    login: 'Login',
    register: 'Sign Up',
    cancel: 'Cancel',
    validateData: 'Validate data',
    saveChanges: 'Save changes',
    noAccount: 'Don\'t have an account?',
    signUpHere: 'Sign up here',
    hasAccount: 'Already have an account?',
    loginHere: 'Login here',
    validation: {
      nameRequired: 'Name is required!',
      nameLength: 'Name must be between 3 and 100 characters',
      emailRequired: 'Email is required!',
      emailPattern: 'Email must end with {\'@\'}gmail.com!',
      cpfRequired: 'CPF is required!',
      cpfInvalid: 'Invalid CPF!',
      pastDate: 'Birth date must be in the past!',
      minAge: 'Renter must be at least 6 years old!',
      phoneRequired: 'Phone is required!',
      phoneInvalid: 'Invalid phone',
      birthDateRequired: 'Birth date is required!',
      addressRequired: 'Address is required!',
      addressMax: 'Address cannot exceed 255 characters',
      passwordRequired: 'Password is required',
      passwordRules: 'Password must contain 8 to 15 characters, letters, numbers, and symbols',
      confirmPasswordRequired: 'Confirm your password',
      passwordMatch: 'Passwords do not match'
    },
    notifications: {
      registerSuccess: 'Registration successful! Please log in.',
      registerError: 'Registration failed. Check your information.'
    }
  },
  common: {
    filter: 'Filter',
    showingPagination: 'Showing {from} to {to} of {total} publishers',
    mostRecent: 'Most recent',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm'
  },
  users: {
    title: 'USERS',
    searchPlaceholder: 'Search users...',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    status: 'Status',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    noUsersFound: 'No users found.'
  },
  publishers: {
    title: 'PUBLISHERS',
    searchPlaceholder: 'Search publishers...',
    newPublisher: 'New Publisher',
    name: 'Publisher Name',
    email: 'Email',
    phone: 'Phone',
    site: 'Website',
    actions: 'Actions',
    noPublishersFound: 'No publishers found.',
    dialog: {
      createTitle: 'New Publisher',
      editTitle: 'Edit Publisher',
      nameRequired: 'Publisher name is required!',
      deleteConfirmTitle: 'Confirm Deletion',
      deleteConfirmMessage: 'Are you sure you want to delete publisher "{name}"?'
    }
  }
}