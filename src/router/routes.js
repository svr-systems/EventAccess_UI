import Public from "./middleware/Public";
import Auth from "./middleware/Auth";
import { Roles } from "./middleware/Roles";

const routes = [
  /**
   * ===========================================
   * USERS (Admin)
   * ===========================================
   */
  {
    path: "/usuarios",
    name: "users",
    component: () => import("@/views/users/List.vue"),
    meta: {
      title: "Usuarios",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/usuarios/agregar",
    name: "users/store",
    component: () => import("@/views/users/Form.vue"),
    meta: {
      title: "Usuario | Agregar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/usuarios/:id",
    name: "users/show",
    component: () => import("@/views/users/Show.vue"),
    props: true,
    meta: {
      title: "Usuario",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/usuarios/:id/editar",
    name: "users/update",
    component: () => import("@/views/users/Form.vue"),
    props: true,
    meta: {
      title: "Usuario | Editar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([1])],
    },
  },
  /**
   * ===========================================
   * COMPANIES (Admin)
   * ===========================================
   */
  {
    path: "/companias",
    name: "companies",
    component: () => import("@/views/companies/List.vue"),
    meta: {
      title: "Compañías",
      icon: "mdi-domain",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/companias/agregar",
    name: "companies/store",
    component: () => import("@/views/companies/Form.vue"),
    meta: {
      title: "Compañía | Agregar",
      icon: "mdi-domain",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/companias/:id",
    name: "companies/show",
    component: () => import("@/views/companies/Show.vue"),
    props: true,
    meta: {
      title: "Compañía",
      icon: "mdi-domain",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/companias/:id/editar",
    name: "companies/update",
    component: () => import("@/views/companies/Form.vue"),
    props: true,
    meta: {
      title: "Compañía | Editar",
      icon: "mdi-domain",
      middleware: [Auth, Roles([1])],
    },
  },

  /**
 * ===========================================
 * COMPANY_USERS (Admin)
 * ===========================================
 */
  {
    path: "/administracion/usuarios_compania/:id",
    name: "company_users",
    component: () => import("@/views/company_users/List.vue"),
    props: true,
    meta: {
      title: "Usuarios de compañía",
      icon: "mdi-account",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/administracion/usuarios_compania/:company/agregar",
    name: "company_users/store",
    component: () => import("@/views/company_users/Form.vue"),
    props: true,
    meta: {
      title: "Usuario de compañía | Agregar",
      icon: "mdi-account",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/administracion/usuarios_compania/:company/:id",
    name: "company_users/show",
    component: () => import("@/views/company_users/Show.vue"),
    props: true,
    meta: {
      title: "Usuario de compañía",
      icon: "mdi-account",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/administracion/usuarios_compania/:company/:id/editar",
    name: "company_users/update",
    component: () => import("@/views/company_users/Form.vue"),
    props: true,
    meta: {
      title: "Usuario de compañía | Editar",
      icon: "mdi-account",
      middleware: [Auth, Roles([1])],
    },
  },

  /**
 * ===========================================
 * EVENTS (Admin)
 * ===========================================
 */
  {
    path: "/administracion/eventos/:id",
    name: "events",
    component: () => import("@/views/events/List.vue"),
    props: true,
    meta: {
      title: "Eventos",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([1])],
    },
  },
  {
    path: "/administracion/eventos/:company/:id",
    name: "events/show",
    component: () => import("@/views/events/Show.vue"),
    props: true,
    meta: {
      title: "Evento",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([1])],
    },
  },

  /**
 * ===========================================
 * COMPANY_USERS (COMPANY)
 * ===========================================
 */
  {
    path: "/usuarios_compania",
    name: "company_section_users",
    component: () => import("@/views/company_section/company_users/List.vue"),
    meta: {
      title: "Usuarios de compañía",
      icon: "mdi-account",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/usuarios_compania/:company/agregar",
    name: "company_section_users/store",
    component: () => import("@/views/company_section/company_users/Form.vue"),
    props: true,
    meta: {
      title: "Usuario de compañía | Agregar",
      icon: "mdi-account",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/usuarios_compania/:company/:id",
    name: "company_section_users/show",
    component: () => import("@/views/company_section/company_users/Show.vue"),
    props: true,
    meta: {
      title: "Usuario de compañía",
      icon: "mdi-account",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/usuarios_compania/:company/:id/editar",
    name: "company_section_users/update",
    component: () => import("@/views/company_section/company_users/Form.vue"),
    props: true,
    meta: {
      title: "Usuario de compañía | Editar",
      icon: "mdi-account",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
 * ===========================================
 * EVENTS (COMPANY)
 * ===========================================
 */
  {
    path: "/compania/eventos",
    name: "company_section_events",
    component: () => import("@/views/company_section/events/List.vue"),
    meta: {
      title: "Eventos",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/compania/eventos/:company/agregar",
    name: "company_section_events/store",
    component: () => import("@/views/company_section/events/Form.vue"),
    props: true,
    meta: {
      title: "Evento | Agregar",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/compania/eventos/:company/:id",
    name: "company_section_events/show",
    component: () => import("@/views/company_section/events/Show.vue"),
    props: true,
    meta: {
      title: "Evento",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/compania/eventos/:company/:id/editar",
    name: "company_section_events/update",
    component: () => import("@/views/company_section/events/Form.vue"),
    props: true,
    meta: {
      title: "Evento | Editar",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([3])],
    },
  },
  /**
 * ===========================================
 * PRESENTATION_DATES (COMPANY)
 * ===========================================
 */
  {
    path: "/fechas_presentacion/:event",
    name: "presentation_dates",
    component: () => import("@/views/company_section/presentation_dates/List.vue"),
    props: true,
    meta: {
      title: "Fechas de presentación",
      icon: "mdi-calendar-range",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/fechas_presentacion/:event/agregar",
    name: "presentation_dates/store",
    component: () => import("@/views/company_section/presentation_dates/Form.vue"),
    props: true,
    meta: {
      title: "Fecha de presentación | Agregar",
      icon: "mdi-calendar-range",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/fechas_presentacion/:event/:id",
    name: "presentation_dates/show",
    component: () => import("@/views/company_section/presentation_dates/Show.vue"),
    props: true,
    meta: {
      title: "Fecha de presentación",
      icon: "mdi-calendar-range",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/fechas_presentacion/:event/:id/editar",
    name: "presentation_dates/update",
    component: () => import("@/views/company_section/presentation_dates/Form.vue"),
    props: true,
    meta: {
      title: "Fecha de presentación | Editar",
      icon: "mdi-calendar-range",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
 * ===========================================
 * TICKET_TYPES (COMPANY)
 * ===========================================
 */
  {
    path: "/tipos_ticket/:event",
    name: "ticket_types",
    component: () => import("@/views/company_section/ticket_types/List.vue"),
    meta: {
      title: "Tipos de ticket",
      icon: "mdi-ticket-confirmation",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_ticket/:event/agregar",
    name: "ticket_types/store",
    component: () => import("@/views/company_section/ticket_types/Form.vue"),
    meta: {
      title: "Tipo de ticket | Agregar",
      icon: "mdi-ticket-confirmation",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_ticket/:event/:id",
    name: "ticket_types/show",
    component: () => import("@/views/company_section/ticket_types/Show.vue"),
    props: true,
    meta: {
      title: "Tipo de ticket",
      icon: "mdi-ticket-confirmation",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_ticket/:event/:id/editar",
    name: "ticket_types/update",
    component: () => import("@/views/company_section/ticket_types/Form.vue"),
    props: true,
    meta: {
      title: "Tipo de ticket | Editar",
      icon: "mdi-ticket-confirmation",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
 * ===========================================
 * PRESENTATION_TICKETS (COMPANY)
 * ===========================================
 */
  {
    path: "/tipos_boletos_presentacion/:event/:presentation_dates",
    name: "presentation_tickets",
    component: () => import("@/views/company_section/presentation_tickets/List.vue"),
    props: true,
    meta: {
      title: "Tipos de boletos de presentación",
      icon: "mdi-ticket",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_boletos_presentacion/:event/:presentation_dates/agregar",
    name: "presentation_tickets/store",
    component: () => import("@/views/company_section/presentation_tickets/Form.vue"),
    props: true,
    meta: {
      title: "Tipo de boleto de presentación | Agregar",
      icon: "mdi-ticket",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_boletos_presentacion/:event/:presentation_dates/:id",
    name: "presentation_tickets/show",
    component: () => import("@/views/company_section/presentation_tickets/Show.vue"),
    props: true,
    meta: {
      title: "Tipo de boleto de presentación",
      icon: "mdi-ticket",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_boletos_presentacion/:event/:presentation_dates/:id/editar",
    name: "presentation_tickets/update",
    component: () => import("@/views/company_section/presentation_tickets/Form.vue"),
    props: true,
    meta: {
      title: "Tipo de boleto de presentación | Editar",
      icon: "mdi-ticket",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
 * ===========================================
 * STAND_TYPES (COMPANY)
 * ===========================================
 */
  {
    path: "/tipos_estantes/:event",
    name: "stand_types",
    component: () => import("@/views/company_section/stand_types/List.vue"),
    meta: {
      title: "Tipos de estantes",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_estantes/:event/agregar",
    name: "stand_types/store",
    component: () => import("@/views/company_section/stand_types/Form.vue"),
    meta: {
      title: "Tipo de estante | Agregar",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_estantes/:event/:id",
    name: "stand_types/show",
    component: () => import("@/views/company_section/stand_types/Show.vue"),
    props: true,
    meta: {
      title: "Tipo de estante",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_estantes/:event/:id/editar",
    name: "stand_types/update",
    component: () => import("@/views/company_section/stand_types/Form.vue"),
    props: true,
    meta: {
      title: "Tipo de estante | Editar",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
 * ===========================================
 * EVENT_STAND_CONFIG (COMPANY)
 * ===========================================
 */
  {
    path: "/estantes_configuraciones/:event/:stand_type",
    name: "event_stand_configs",
    component: () => import("@/views/company_section/event_stand_configs/List.vue"),
    props: true,
    meta: {
      title: "Configuraciones de estantes",
      icon: "mdi-fireplace",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/estantes_configuraciones/:event/:stand_type/agregar",
    name: "event_stand_configs/store",
    component: () => import("@/views/company_section/event_stand_configs/Form.vue"),
    props: true,
    meta: {
      title: "Configuración de estantes | Agregar",
      icon: "mdi-fireplace",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/estantes_configuraciones/:event/:stand_type/:id",
    name: "event_stand_configs/show",
    component: () => import("@/views/company_section/event_stand_configs/Show.vue"),
    props: true,
    meta: {
      title: "Configuración de estantes",
      icon: "mdi-fireplace",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/estantes_configuraciones/:event/:stand_type/:id/editar",
    name: "event_stand_configs/update",
    component: () => import("@/views/company_section/event_stand_configs/Form.vue"),
    props: true,
    meta: {
      title: "Configuración de estantes | Editar",
      icon: "mdi-fireplace",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
 * ===========================================
 * SUPPLIERS (SUPPLIER)
 * ===========================================
 */
  {
    path: "/proveedores",
    name: "suppliers",
    component: () => import("@/views/suppliers_section/supplier/List.vue"),
    meta: {
      title: "Proveedores",
      icon: "mdi-handshake",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/proveedores/agregar",
    name: "suppliers/store",
    component: () => import("@/views/suppliers_section/supplier/Form.vue"),
    meta: {
      title: "Proveedor | Agregar",
      icon: "mdi-handshake",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/proveedores/:id",
    name: "suppliers/show",
    component: () => import("@/views/suppliers_section/supplier/Show.vue"),
    props: true,
    meta: {
      title: "Proveedor",
      icon: "mdi-handshake",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/proveedores/:id/editar",
    name: "suppliers/update",
    component: () => import("@/views/suppliers_section/supplier/Form.vue"),
    props: true,
    meta: {
      title: "Proveedor | Editar",
      icon: "mdi-handshake",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * SUPPLIER_USERS (SUPPLIER)
 * ===========================================
 */
  {
    path: "/eventos/:supplier",
    name: "event_suppliers",
    component: () => import("@/views/suppliers_section/event_suppliers/List.vue"),
    props: true,
    meta: {
      title: "Proveedor | Eventos",
      icon: "mdi-account",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * OFFERS (SUPPLIER)
 * ===========================================
 */
  {
    path: "/ofertas/:supplier/:event",
    name: "offers",
    component: () => import("@/views/suppliers_section/offers/List.vue"),
    props: true,
    meta: {
      title: "Ofertas",
      icon: "mdi-tag",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/ofertas/:supplier/:event/agregar",
    name: "offers/store",
    component: () => import("@/views/suppliers_section/offers/Form.vue"),
    props: true,
    meta: {
      title: "Oferta | Agregar",
      icon: "mdi-tag",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/ofertas/:supplier/:event/:id",
    name: "offers/show",
    component: () => import("@/views/suppliers_section/offers/Show.vue"),
    props: true,
    meta: {
      title: "Oferta",
      icon: "mdi-tag",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/ofertas/:supplier/:event/:id/editar",
    name: "offers/update",
    component: () => import("@/views/suppliers_section/offers/Form.vue"),
    props: true,
    meta: {
      title: "Oferta | Editar",
      icon: "mdi-tag",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * BUYERS (BUYER)
 * ===========================================
 */
  {
    path: "/compradores",
    name: "buyers",
    component: () => import("@/views/buyers_section/buyer/List.vue"),
    meta: {
      title: "Compradores",
      icon: "mdi-account-cash",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/compradores/agregar",
    name: "buyers/store",
    component: () => import("@/views/buyers_section/buyer/Form.vue"),
    props: true,
    meta: {
      title: "Comprador | Agregar",
      icon: "mdi-account-cash",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/compradores/:id",
    name: "buyers/show",
    component: () => import("@/views/buyers_section/buyer/Show.vue"),
    props: true,
    meta: {
      title: "Comprador",
      icon: "mdi-account-cash",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/compradores/:id/editar",
    name: "buyers/update",
    component: () => import("@/views/buyers_section/buyer/Form.vue"),
    props: true,
    meta: {
      title: "Comprador | Editar",
      icon: "mdi-account-cashs",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
   * ===========================================
   * GENERAL
   * ===========================================
   */
  {
    path: "/inicio",
    name: "home",
    component: () => import("@/views/general/Home.vue"),
    meta: {
      title: "Inicio",
      middleware: [Auth],
    },
  },
  {
    path: "/no_autorizado",
    name: "unauthorized",
    component: () => import("@/views/general/Unauthorized.vue"),
    meta: {
      title: "Acceso Denegado",
      middleware: [Auth],
    },
  },

  /**
   * ===========================================
   * PUBLIC
   * ===========================================
   */
  {
    path: "/iniciar_sesion",
    name: "login",
    component: () => import("@/views/public/UserLogin.vue"),
    meta: {
      title: "Iniciar sesión",
      middleware: [Public],
    },
  },
  {
    path: "/",
    name: "main",
    component: () => import("@/views/public/Main.vue"),
    meta: {
      title: "EventAccess",
      middleware: [Public],
    },
  },
  {
    path: "/recuperar_contrasena",
    name: "user_password_recover",
    component: () => import("@/views/public/UserPasswordRecover.vue"),
    meta: {
      title: "Recuperar contraseña",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/restablecer_contrasena/:id",
    name: "user_password_reset",
    component: () => import("@/views/public/UserPasswordReset.vue"),
    props: true,
    meta: {
      title: "Restablecer contraseña",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/confirmar_cuenta/:id",
    name: "user_account_confirm",
    component: () => import("@/views/public/UserAccountConfirm.vue"),
    props: true,
    meta: {
      title: "Confirmar cuenta",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/eventos",
    name: "public_events",
    component: () => import("@/views/public/Events.vue"),
    meta: {
      title: "Eventos",
      middleware: [Public],
    },
  },
  {
    path: "/fechas_presentacion/:id",
    name: "public_presentation_dates",
    component: () => import("@/views/public/Presentation_dates.vue"),
    props: true,
    meta: {
      title: "Fechas de presentación",
      middleware: [Public],
    },
  },
  {
    path: "/tipos_boletos_presentacion/:id",
    name: "public_presentation_tickets",
    component: () => import("@/views/public/Presentation_tickets.vue"),
    props: true,
    meta: {
      title: "Tipos de boletos de presentación",
      middleware: [Public],
    },
  },

  /**
   * ===========================================
   * NOT FOUND
   * ===========================================
   */
  {
    path: "/:pathMatch(.*)*",
    name: "not_found",
    component: () => import("@/views/public/NotFound.vue"),
    meta: {
      title: "No encontrado",
      middleware: [Public],
    },
  },
];

export default routes;
