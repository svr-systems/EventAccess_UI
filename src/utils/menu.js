export const menuItems = Object.freeze([
  { title: "Inicio", icon: "mdi-home", route: "home" },

  //Comprador
  { title: "Eventos", icon: "mdi-calendar", route: "event_buyers" },
  { title: "Usuarios", icon: "mdi-account-group", route: "users_buyer" },
  { title: "Mi perfil", icon: "mdi-account", route: "buyer_information" },

  //Proveedor
  { title: "Eventos", icon: "mdi-calendar", route: "event_suppliers" },
  { title: "Usuarios", icon: "mdi-account-group", route: "users_supplier" },
  { title: "Mi perfil", icon: "mdi-account", route: "supplier_information" },

  // Cliente
  { title: "Eventos", icon: "mdi-calendar", route: "company_section_events" },
  { title: "Usuarios", icon: "mdi-account", route: "company_section_users" },

  // Admin
  { title: "Compañías", icon: "mdi-domain", route: "companies" },
  { title: "Certificaciones", icon: "mdi-certificate", route: "certifications" },
  { title: "Usuarios", icon: "mdi-account-group", route: "users" },
]);
