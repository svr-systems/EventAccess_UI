import { useStore } from "@/store";

const allow = (store) => !!store.getAuth?.token;

const guard = (to, from, next) => {
  const store = useStore();
  return allow(store) ? next() : next({ name: "login", replace: true });
};

export default { allow, guard };
