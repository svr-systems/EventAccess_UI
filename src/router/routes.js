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
    path: "/eventos",
    name: "company_section_events",
    component: () => import("@/views/company_section/events/List.vue"),
    meta: {
      title: "Eventos",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/eventos/:company/agregar",
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
    path: "/eventos/:company/:id",
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
    path: "/eventos/:company/:id/editar",
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
