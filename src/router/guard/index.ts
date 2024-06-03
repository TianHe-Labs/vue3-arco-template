import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/plugins/route-listener';
import setupLoginInfoGuard from './login-info';
import setupPermissionGuard from './permission';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change
    setRouteEmitter(to);
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupLoginInfoGuard(router);
  setupPermissionGuard(router);
}
