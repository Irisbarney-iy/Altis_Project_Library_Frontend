export default {
  header: {
    settings: 'configuraciones',
    preferences: 'Preferencias',
    viewProfile: 'Ver Perfil',
    logout: 'Cerrar sesión',
    language: 'Idioma'
  },
  menu: {
    dashboard: 'Dashboard',
    loans: 'Préstamos',
    users: 'Usuarios',
    books: 'Libros',
    publishers: 'Editoriales'
  },
  auth: {
    welcomeBack: '¡Bienvenido de nuevo!',
    welcome: '¡Bienvenido!',
    recoverPasswordTitle: 'Recuperar contraseña',
    changePasswordTitle: 'Cambiar contraseña',
    email: 'Correo electrónico',
    emailPlaceholder: 'Ej: ejemplo{\'@\'}gmail.com',
    password: 'Contraseña',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar contraseña',
    passwordPlaceholder: 'Ingrese su contraseña',
    confirmPasswordPlaceholder: 'Confirme su contraseña',
    fullName: 'Nombre completo',
    fullNamePlaceholder: 'Ingrese su nombre',
    cpf: 'CPF',
    phone: 'Teléfono',
    birthDate: 'Fecha de Nacimiento',
    address: 'Dirección',
    addressPlaceholder: 'Calle, Nº - Ciudad, Estado',
    rememberMe: 'Recordarme',
    forgotPassword: '¿Olvidó su contraseña?',
    clear: 'Limpiar',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    cancel: 'Cancelar',
    validateData: 'Validar datos',
    saveChanges: 'Guardar cambios',
    noAccount: '¿No tiene una cuenta?',
    signUpHere: 'Regístrese aquí',
    hasAccount: '¿Ya tiene una cuenta?',
    loginHere: 'Inicie sesión aquí',
    validation: {
      nameRequired: '¡El nombre es obligatorio!',
      nameLength: 'El nombre debe tener entre 3 y 100 caracteres',
      emailRequired: '¡El correo electrónico es obligatorio!',
      emailPattern: '¡El correo debe terminar en {\'@\'}gmail.com!',
      cpfRequired: '¡El CPF es obligatorio!',
      cpfInvalid: '¡CPF inválido!',
      pastDate: '¡La fecha de nacimiento debe ser en el pasado!',
      minAge: '¡El arrendatario debe tener al menos 6 años!',
      phoneRequired: '¡El teléfono es obligatorio!',
      phoneInvalid: 'Teléfono inválido',
      birthDateRequired: '¡La fecha de nacimiento es obligatoria!',
      addressRequired: '¡La dirección es obligatoria!',
      addressMax: 'La dirección no puede tener más de 255 caracteres',
      passwordRequired: 'La contraseña es obligatoria',
      passwordRules: 'La contraseña debe contener entre 8 y 15 caracteres, letras, números y símbolos',
      confirmPasswordRequired: 'Confirme su contraseña',
      passwordMatch: 'Las contraseñas no coinciden'
    },
    notifications: {
      registerSuccess: '¡Registro realizado con éxito! Inicie sesión.',
      registerError: 'Fallo al realizar el registro. Verifique la información.'
    }
  },
  common: {
    filter: 'Filtrar',
    showingPagination: 'Mostrando de {from} a {to} de {total} editoriales',
    mostRecent: 'Más reciente',
    cancel: 'Cancelar',
    save: 'Guardar',
    confirm: 'Confirmar'
  },
  users: {
    title: 'USUARIOS',
    searchPlaceholder: 'Buscar usuarios...',
    name: 'Nombre',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    status: 'Estado',
    actions: 'Acciones',
    active: 'Activo',
    inactive: 'Inactivo',
    noUsersFound: 'No se encontraron usuarios.'
  },
  publishers: {
    title: 'EDITORIALES',
    searchPlaceholder: 'Buscar editoriales...',
    newPublisher: 'Nueva Editorial',
    name: 'Nombre de la Editorial',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    site: 'Sitio web',
    actions: 'Acciones',
    noPublishersFound: 'No se encontraron editoriales.',
    dialog: {
      createTitle: 'Nueva Editorial',
      editTitle: 'Editar Editorial',
      nameRequired: '¡El nombre de la editorial es obligatorio!',
      deleteConfirmTitle: 'Confirmar Eliminación',
      deleteConfirmMessage: '¿Está seguro de que desea eliminar la editorial "{name}"?'
    }
  }
}