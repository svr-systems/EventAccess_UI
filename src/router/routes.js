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
      title: "Usuarios",
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
      title: "Usuario | Agregar",
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
      title: "Usuario",
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
      title: "Usuario | Editar",
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
    path: "/fechas_presentacion/:company/:event",
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
    path: "/fechas_presentacion/:company/:event/agregar",
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
    path: "/fechas_presentacion/:company/:event/:id",
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
    path: "/fechas_presentacion/:company/:event/:id/editar",
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
    path: "/tipos_ticket/:company/:event",
    name: "ticket_types",
    component: () => import("@/views/company_section/ticket_types/List.vue"),
    meta: {
      title: "Tipos de ticket",
      icon: "mdi-ticket-confirmation",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_ticket/:company/:event/agregar",
    name: "ticket_types/store",
    component: () => import("@/views/company_section/ticket_types/Form.vue"),
    meta: {
      title: "Tipo de ticket | Agregar",
      icon: "mdi-ticket-confirmation",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_ticket/:company/:event/:id",
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
    path: "/tipos_ticket/:company/:event/:id/editar",
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
    path: "/tipos_boletos_presentacion/:company/:event/:presentation_dates",
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
    path: "/tipos_boletos_presentacion/:company/:event/:presentation_dates/agregar",
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
    path: "/tipos_boletos_presentacion/:company/:event/:presentation_dates/:id",
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
    path: "/tipos_boletos_presentacion/:company/:event/:presentation_dates/:id/editar",
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
    path: "/tipos_stands/:company/:event",
    name: "stand_types",
    component: () => import("@/views/company_section/stand_types/List.vue"),
    meta: {
      title: "Tipos de stands",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_stands/:company/:event/agregar",
    name: "stand_types/store",
    component: () => import("@/views/company_section/stand_types/Form.vue"),
    meta: {
      title: "Tipo de stand | Agregar",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_stands/:company/:event/:id",
    name: "stand_types/show",
    component: () => import("@/views/company_section/stand_types/Show.vue"),
    props: true,
    meta: {
      title: "Tipo de stand",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/tipos_stands/:company/:event/:id/editar",
    name: "stand_types/update",
    component: () => import("@/views/company_section/stand_types/Form.vue"),
    props: true,
    meta: {
      title: "Tipo de stand | Editar",
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
    path: "/stands_configuraciones/:company/:event/:stand_type",
    name: "event_stand_configs",
    component: () => import("@/views/company_section/event_stand_configs/List.vue"),
    props: true,
    meta: {
      title: "Configuraciones de stands",
      icon: "mdi-fireplace",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/stands_configuraciones/:company/:event/:stand_type/agregar",
    name: "event_stand_configs/store",
    component: () => import("@/views/company_section/event_stand_configs/Form.vue"),
    props: true,
    meta: {
      title: "Configuración de stands | Agregar",
      icon: "mdi-fireplace",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/stands_configuraciones/:company/:event/:stand_type/:id",
    name: "event_stand_configs/show",
    component: () => import("@/views/company_section/event_stand_configs/Show.vue"),
    props: true,
    meta: {
      title: "Configuración de stands",
      icon: "mdi-fireplace",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/stands_configuraciones/:company/:event/:stand_type/:id/editar",
    name: "event_stand_configs/update",
    component: () => import("@/views/company_section/event_stand_configs/Form.vue"),
    props: true,
    meta: {
      title: "Configuración de stands | Editar",
      icon: "mdi-fireplace",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
 * ===========================================
 * STAND_REQUEST (COMPANY)
 * ===========================================
 */
  {
    path: "/peticiones_stands/:company/:event",
    name: "company_stand_requests",
    component: () => import("@/views/company_section/stand_requests/List.vue"),
    props: true,
    meta: {
      title: "Peticiones de stands",
      icon: "mdi-chat-question-outline",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/peticiones_stands/:company/:event/:id",
    name: "company_stand_requests/show",
    component: () => import("@/views/company_section/stand_requests/Show.vue"),
    props: true,
    meta: {
      title: "Petición de stand",
      icon: "mdi-chat-question-outline",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
 * ===========================================
 * STAND_ALLOCATIONS (COMPANY)
 * ===========================================
 */
  {
    path: "/asignaciones_stands/:company/:event",
    name: "company_stand_allocations",
    component: () => import("@/views/company_section/stand_allocations/List.vue"),
    props: true,
    meta: {
      title: "Asignaciones de stands",
      icon: "mdi-selection-marker",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/asignaciones_stands/:company/:event/:id",
    name: "company_stand_allocations/show",
    component: () => import("@/views/company_section/stand_allocations/Show.vue"),
    props: true,
    meta: {
      title: "Asignación de stand",
      icon: "mdi-selection-marker",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
 * ===========================================
 * EVENT_MEETING_WINDOWS (COMPANY)
 * ===========================================
 */
  {
    path: "/horarios_reuniones/:company/:event",
    name: "event_meeting_windows",
    component: () => import("@/views/company_section/event_meeting_windows/List.vue"),
    meta: {
      title: "Ventanas de horarios para reuniones",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/horarios_reuniones/:company/:event/agregar",
    name: "event_meeting_windows/store",
    component: () => import("@/views/company_section/event_meeting_windows/Form.vue"),
    meta: {
      title: "Ventana de horario para reunión | Agregar",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/horarios_reuniones/:company/:event/:id",
    name: "event_meeting_windows/show",
    component: () => import("@/views/company_section/event_meeting_windows/Show.vue"),
    props: true,
    meta: {
      title: "Ventana de horario para reunión ",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([3])],
    },
  },
  {
    path: "/horarios_reuniones/:company/:event/:id/editar",
    name: "event_meeting_windows/update",
    component: () => import("@/views/company_section/event_meeting_windows/Form.vue"),
    props: true,
    meta: {
      title: "Ventana de horario para reunión  | Editar",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([3])],
    },
  },

  /**
   * ===========================================
   * USERS (SUPPLIER)
   * ===========================================
   */
  {
    path: "/usuarios_proveedor",
    name: "users_supplier",
    component: () => import("@/views/suppliers_section/users_supplier/List.vue"),
    meta: {
      title: "Usuarios",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/usuarios_proveedor/agregar",
    name: "users_supplier/store",
    component: () => import("@/views/suppliers_section/users_supplier/Form.vue"),
    meta: {
      title: "Usuario | Agregar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/usuarios_proveedor/:id",
    name: "users_supplier/show",
    component: () => import("@/views/suppliers_section/users_supplier/Show.vue"),
    props: true,
    meta: {
      title: "Usuario",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/usuarios_proveedor/:id/editar",
    name: "users_supplier/update",
    component: () => import("@/views/suppliers_section/users_supplier/Form.vue"),
    props: true,
    meta: {
      title: "Usuario | Editar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * EVENT_SUPPLIERS (SUPPLIER)
 * ===========================================
 */
  {
    path: "/eventos_proveedor",
    name: "event_suppliers",
    component: () => import("@/views/suppliers_section/event_suppliers/List.vue"),
    meta: {
      title: "Eventos",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/eventos_proveedor/:id",
    name: "event_suppliers/show",
    component: () => import("@/views/suppliers_section/event_suppliers/Show.vue"),
    props: true,
    meta: {
      title: "Detalles del evento",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * SEARCH_BUYER (SUPPLIER)
 * ===========================================
 */
  {
    path: "/buscar_comprador/:event",
    name: "search_buyer",
    component: () => import("@/views/suppliers_section/search_buyer/List.vue"),
    props: true,
    meta: {
      title: "Citas B2B",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * MEETINGS (SUPPLIER)
 * ===========================================
 */
  {
    path: "/citas/:event",
    name: "meetings_supplier",
    component: () => import("@/views/suppliers_section/meetings/List.vue"),
    props: true,
    meta: {
      title: "Mis citas",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * MEETINGS_REQUESTS (SUPPLIER)
 * ===========================================
 */
  {
    path: "/citas_pendientes/:event",
    name: "meetings_requests_supplier",
    component: () => import("@/views/suppliers_section/meetings_requests/List.vue"),
    props: true,
    meta: {
      title: "Mis citas pendientes",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * EVENT_AREAS (SUPPLIER)
 * ===========================================
 */
  {
    path: "/ofrecer_servicios/:event",
    name: "event_areas_supplier",
    component: () => import("@/views/suppliers_section/event_areas/List.vue"),
    props: true,
    meta: {
      title: "Evento | Ofrecer servicios",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * OFFERS (SUPPLIER)
 * ===========================================
 */
  {
    path: "/ofertas/:event",
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
    path: "/ofertas/:event/agregar",
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
    path: "/ofertas/:event/:id",
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
    path: "/ofertas/:event/:id/editar",
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
* EVENT_STAND_CONFIG (SUPPLIER)
* ===========================================
*/
  {
    path: "/stands_configuracion/:event/:supplier/:offer",
    name: "event_stand_config",
    component: () => import("@/views/suppliers_section/event_stand_config/List.vue"),
    props: true,
    meta: {
      title: "Configuración de stands",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * STAND_REQUEST (SUPPLIER)
 * ===========================================
 */
  {
    path: "/stands_solicitudes/:event/:supplier/:offer/:event_stand_config",
    name: "stand_requests",
    component: () => import("@/views/suppliers_section/stand_requests/List.vue"),
    props: true,
    meta: {
      title: "Solicitudes de stands",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/stands_solicitudes/:event/:supplier/:offer/:event_stand_config/:id",
    name: "stand_requests/show",
    component: () => import("@/views/suppliers_section/stand_requests/Show.vue"),
    props: true,
    meta: {
      title: "Solicitud de stand",
      icon: "mdi-fireplace-off",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * STAND_ALLOCATIONS (SUPPLIER)
 * ===========================================
 */
  {
    path: "/asignaciones_stands/:event/:supplier/:offer/:event_stand_config",
    name: "stand_allocations",
    component: () => import("@/views/suppliers_section/stand_allocations/List.vue"),
    props: true,
    meta: {
      title: "Asignaciones de stands",
      icon: "mdi-selection-marker",
      middleware: [Auth, Roles([6])],
    },
  },
  {
    path: "/asignaciones_stands/:event/:supplier/:offer/:event_stand_config/:id",
    name: "stand_allocations/show",
    component: () => import("@/views/suppliers_section/stand_allocations/Show.vue"),
    props: true,
    meta: {
      title: "Asignación de stand",
      icon: "mdi-selection-marker",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
 * ===========================================
 * SUPPLIER_INFORMATION (SUPPLIER)
 * ===========================================
 */
  {
    path: "/informacion_proveedor",
    name: "supplier_information",
    component: () => import("@/views/suppliers_section/Supplier_information.vue"),
    meta: {
      title: "Información requerida",
      icon: "mdi-account-edit",
      middleware: [Auth, Roles([6])],
    },
  },

  /**
* ===========================================
* EVENT_BUYERS (BUYERS)
* ===========================================
*/
  {
    path: "/eventos_comprador",
    name: "event_buyers",
    component: () => import("@/views/buyers_section/event_buyers/List.vue"),
    meta: {
      title: "Eventos",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/eventos_comprador/:id",
    name: "event_buyers/show",
    component: () => import("@/views/buyers_section/event_buyers/Show.vue"),
    props: true,
    meta: {
      title: "Detalles del evento",
      icon: "mdi-calendar",
      middleware: [Auth, Roles([8])],
    },
  },

  /**
   * ===========================================
   * USERS (BUYER)
   * ===========================================
   */
  {
    path: "/usuarios_comprador",
    name: "users_buyer",
    component: () => import("@/views/buyers_section/users_buyer/List.vue"),
    props: true,
    meta: {
      title: "Usuarios",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/usuarios_comprador/agregar",
    name: "users_buyer/store",
    component: () => import("@/views/buyers_section/users_buyer/Form.vue"),
    props: true,
    meta: {
      title: "Usuario | Agregar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/usuarios_comprador/:id",
    name: "users_buyer/show",
    component: () => import("@/views/buyers_section/users_buyer/Show.vue"),
    props: true,
    meta: {
      title: "Usuario",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/usuarios_comprador/:id/editar",
    name: "users_buyer/update",
    component: () => import("@/views/buyers_section/users_buyer/Form.vue"),
    props: true,
    meta: {
      title: "Usuario | Editar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles([8])],
    },
  },

  /**
 * ===========================================
 * BUYER_OFFERS_AREAS (BUYER)
 * ===========================================
 */
  {
    path: "/areas_ofertas/:event",
    name: "buyer_offers_areas",
    component: () => import("@/views/buyers_section/buyer_offers_areas/List.vue"),
    props: true,
    meta: {
      title: "Citas B2B | Ofertas",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/areas_ofertas/:event/agregar",
    name: "buyer_offers_areas/store",
    component: () => import("@/views/buyers_section/buyer_offers_areas/Form.vue"),
    props: true,
    meta: {
      title: "Citas B2B | Crear oferta",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/areas_ofertas/:event/:id",
    name: "buyer_offers_areas/show",
    component: () => import("@/views/buyers_section/buyer_offers_areas/Show.vue"),
    props: true,
    meta: {
      title: "Citas B2B | Ver oferta",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/areas_ofertas/:event/:id/editar",
    name: "buyer_offers_areas/update",
    component: () => import("@/views/buyers_section/buyer_offers_areas/Form.vue"),
    props: true,
    meta: {
      title: "Citas B2B | Editar oferta",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([8])],
    },
  },

  /**
 * ===========================================
 * SEARCH_SUPPLIERS (BUYER)
 * ===========================================
 */
  {
    path: "/buscar_proveedor/:event",
    name: "search_suppliers",
    component: () => import("@/views/buyers_section/search_suppliers/List.vue"),
    props: true,
    meta: {
      title: "Citas B2B | Ofertas Proveedores",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([8])],
    },
  },

  /**
 * ===========================================
 * MEETINGS (BUYER)
 * ===========================================
 */
  {
    path: "/agenda/:event",
    name: "meetings",
    component: () => import("@/views/buyers_section/meetings/List.vue"),
    props: true,
    meta: {
      title: "Mi agenda",
      icon: "mdi-book",
      middleware: [Auth, Roles([8])],
    },
  },

  /**
 * ===========================================
 * MEETINGS_REQUESTS (BUYER)
 * ===========================================
 */
  {
    path: "/peticiones_pendientes/:event",
    name: "meetings_requests",
    component: () => import("@/views/buyers_section/meetings_requests/List.vue"),
    props: true,
    meta: {
      title: "Citas B2B | Mis solicitudes pendientes",
      icon: "mdi-book",
      middleware: [Auth, Roles([8])],
    },
  },

  /**
 * ===========================================
 * BUYER_USER_SCHEDULE (BUYER)
 * ===========================================
 */
  {
    path: "/horario_atencion/:event",
    name: "buyer_user_schedule",
    component: () => import("@/views/buyers_section/buyer_user_schedule/List.vue"),
    props: true,
    meta: {
      title: "Horarios de atención",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/horario_atencion/:event/agregar",
    name: "buyer_user_schedule/store",
    component: () => import("@/views/buyers_section/buyer_user_schedule/Form.vue"),
    props: true,
    meta: {
      title: "Horario de atención | Agregar",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/horario_atencion/:event/:id",
    name: "buyer_user_schedule/show",
    component: () => import("@/views/buyers_section/buyer_user_schedule/Show.vue"),
    props: true,
    meta: {
      title: "Horario de atención",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([8])],
    },
  },
  {
    path: "/horario_atencion/:event/:id/editar",
    name: "buyer_user_schedule/update",
    component: () => import("@/views/buyers_section/buyer_user_schedule/Form.vue"),
    props: true,
    meta: {
      title: "Horario de atención | Editar",
      icon: "mdi-book-clock",
      middleware: [Auth, Roles([8])],
    },
  },

  /**
* ===========================================
* BUYER_INFORMATION (BUYER)
* ===========================================
*/
  {
    path: "/informacion_comprador",
    name: "buyer_information",
    component: () => import("@/views/buyers_section/Buyer_information.vue"),
    meta: {
      title: "Información requerida",
      icon: "mdi-account-edit",
      middleware: [Auth, Roles([8])],
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
      showPublicHeaderFooter: true,
    },
  },
  {
    path: "/detalles_evento/:id",
    name: "event_details",
    component: () => import("@/views/public/Event_details.vue"),
    props: true,
    meta: {
      title: "Fechas de presentación",
      middleware: [Public],
      showPublicHeaderFooter: true,
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
      showPublicHeaderFooter: true,
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
