import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';
import { enum2Arr } from '@/utils/transform';
import { USERROLE } from '@/api/user';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { role } = userStore;

  // const { roles } = userStore;

  if (Array.isArray(value)) {
    if (value.length > 0) {
      const permissionValues = value;

      const hasPermission = permissionValues.includes(role);

      // 如果是roles
      // const hasPermission = roles?.some(
      //   (role: USERROLE) =>
      //     permissionValues.includes(role) || role === USERROLE.DEVELOPER,
      // );

      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="${enum2Arr(USERROLE)}"`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
