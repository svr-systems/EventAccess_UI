import { useStore } from "@/store";

const allow = () => true;

const guard = (to, from, next) => {
  const store = useStore();
  const auth = store.getAuth;

  return auth?.token ? next({ name: "home", replace: true }) : next();
};

export default { allow, guard };
