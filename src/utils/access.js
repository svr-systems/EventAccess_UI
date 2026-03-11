import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";

const toArray = (mw) => (Array.isArray(mw) ? mw : mw ? [mw] : []);

const canByMiddleware = (mw, store) => {
  if (mw && typeof mw === "object" && typeof mw.allow === "function") {
    return !!mw.allow(store);
  }

  if (typeof mw === "function") {
    return true;
  }

  return true;
};

export const useAccess = () => {
  const router = useRouter();
  const store = useStore();

  const routeMap = computed(() => {
    const map = new Map();
    router.getRoutes().forEach((r) => map.set(r.name, r));
    return map;
  });

  const canAccessRoute = (routeName) => {
    if (!routeName) return false;

    const r = routeMap.value.get(routeName);
    if (!r) return false;

    const mws = toArray(r.meta?.middleware);
    if (mws.length === 0) return true;

    return mws.every((mw) => canByMiddleware(mw, store));
  };

  const filterMenuItemsByAccess = (items = []) =>
    items.filter((i) => canAccessRoute(i.route));

  return { canAccessRoute, filterMenuItemsByAccess };
};
