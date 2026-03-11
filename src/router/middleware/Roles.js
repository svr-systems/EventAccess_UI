import { useStore } from "@/store";

export const Roles = (allowed = []) => {
  const allow = (store) => {
    const auth = store.getAuth;

    if (!auth?.token) return false;

    const role_id = auth?.user?.role_id;
    if (role_id == null) return false;

    return allowed.includes(Number(role_id));
  };

  const guard = (to, from, next) => {
    const store = useStore();
    return allow(store)
      ? next()
      : next({ name: "unauthorized", replace: true });
  };

  return { allow, guard };
};
