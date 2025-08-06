// 统一管理 需要多处复用 根据 枚举值
// 或者 查询数据接口 生成 select 等组件的 option 选项及查询函数

import { provide, inject, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { enum2Arr } from '@/utils/transform';
import { dayjs } from '@/utils/format';
import useLoading from '@/composables/loading';
import { USERROLE, USERSTATUS } from '@/api/user';
import { SelectOption } from '@arco-design/web-vue';
import { queryOrgList } from '@/api/org';

const symbol = Symbol('ENUM-OPTIONS');

export function provideEnumOptions() {
  const { t } = useI18n();

  // 通用 loading 状态，查询函数不会同时执行，可以复用
  const { loading, setLoading } = useLoading();

  // 角色选项
  const roleOptions = enum2Arr(USERROLE).map((value) => ({
    label: t(`user.role.text.${value}`),
    value,
  }));

  // 状态选项
  const statusOptions = enum2Arr(USERSTATUS).map((value) => ({
    label: t(`user.status.text.${value.toLowerCase()}`),
    value,
  }));

  const rangeShortcuts = [1, 3, 7, 15, 30].map((day: number) => ({
    label: t('dateRange.shortcuts', [day]),
    value: () => [dayjs().toDate(), dayjs().subtract(day, 'day').toDate()],
  }));

  // 部门选项，实时搜索
  const orgOptions = shallowRef<SelectOption[]>([]);

  const handleLoadOrgOptions = async (inputValue?: string) => {
    setLoading(true);
    try {
      const { data } = await queryOrgList({
        orgName: inputValue || undefined,
        current: 1,
        pageSize: 100, // 此处为显示选项，不分页
      });
      orgOptions.value = data.list.map((item) => ({
        label: item.orgName,
        value: item.id,
      }));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const returnState = {
    loading,

    roleOptions,
    statusOptions,
    rangeShortcuts,

    orgOptions,
    // 暴露出函数调用时执行
    handleLoadOrgOptions,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useEnumOptions() {
  return inject(symbol) as ReturnType<typeof provideEnumOptions>;
}
