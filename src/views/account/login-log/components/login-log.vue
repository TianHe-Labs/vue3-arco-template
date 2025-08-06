<script lang="ts" setup>
  import { ref, reactive, inject } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { pick } from 'lodash';
  import { Message, TableColumnData } from '@arco-design/web-vue';
  import useLoading from '@/composables/loading';
  import { dayjs } from '@/utils/format';
  import {
    QueryUserLoginLogReq,
    UserLoginLogModel,
    queryUserLoginLog,
  } from '@/api/account';

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const { loading, setLoading } = useLoading();

  // 响应式
  const breakpoints = inject('breakpoints') as any;
  const pagination = reactive({
    current: Number(route.query?.current || 1),
    pageSize: Number(route.query?.pageSize || 20),
    total: 0,
    size: 'small' as any,
    simple: breakpoints.smallerOrEqual('md').value,
    showPageSize: breakpoints.greater('md').value,
    showTotal: true,
    hideOnSinglePage: true,
    bufferSize: 1,
  });

  const queryModel = reactive<QueryUserLoginLogReq>({
    dateRange: undefined,
  });

  const renderData = ref<UserLoginLogModel[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cleanedParams = {
        ...pick(pagination, ['current', 'pageSize']),
        ...queryModel,
      };
      const { data } = await queryUserLoginLog(cleanedParams);
      renderData.value = data.list;
      pagination.total = data.total || 0;
    } catch (err: any) {
      Message.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  // 分页
  const onPageChange = (current: number) => {
    // v-model 双向绑定，则不需要手动绑定
    pagination.current = current;
    fetchData();

    const url = router.resolve({ query: { ...route.query, current } }).href;
    window.history.pushState({}, '', url);
  };
  const onPageSizeChange = async (pageSize: number) => {
    // v-model 双向绑定，则不需要手动绑定
    pagination.pageSize = pageSize;
    pagination.current = 1;
    fetchData();

    const url = router.resolve({
      query: { ...route.query, current: 1, pageSize },
    }).href;
    window.history.pushState({}, '', url);
  };

  const renderColumns: TableColumnData[] = [
    {
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      align: 'center',
      fixed: 'left',
      width: 50,
    },
    {
      title: '登录结果',
      dataIndex: 'result',
      slotName: 'result',
      cellClass: 'whitespace-nowrap',
    },
    {
      title: '生物验证',
      dataIndex: 'bioResult',
      slotName: 'bioResult',
      cellClass: 'whitespace-nowrap',
    },
    {
      title: '多因素验证',
      dataIndex: 'mfaResult',
      slotName: 'mfaResult',
      cellClass: 'whitespace-nowrap',
    },
    {
      title: '登录来源',
      dataIndex: 'sourceAgent',
      slotName: 'sourceAgent',
      cellClass: 'whitespace-nowrap',
    },
    {
      title: '登录时间',
      dataIndex: 'createdAt',
      slotName: 'createdAt',
      cellClass: 'whitespace-nowrap',
    },
  ];

  const rangeShortcuts = [7, 15, 30, 90, 180, 360].map((day: number) => ({
    label: t('dateRange.shortcuts', [day]),
    value: () => [dayjs().toDate(), dayjs().subtract(day, 'day').toDate()],
  }));
</script>

<template>
  <a-card
    title="登录日志"
    :bordered="false"
    :header-style="{
      height: 'auto',
      padding: '16px 16px 0',
      borderBottom: 'none',
    }"
  >
    <template #extra>
      <div class="flex items-center gap-2">
        <!-- 时间范围筛选 -->
        <a-range-picker
          v-model="queryModel.dateRange"
          size="small"
          :shortcuts="rangeShortcuts"
          class="!md:w-260px"
          @change="fetchData"
        />
      </div>
    </template>

    <a-table
      row-key="id"
      :bordered="false"
      :loading="loading"
      :columns="renderColumns"
      :data="renderData"
      :pagination="pagination"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <template #index="{ rowIndex }">
        <span font="number bold italic" opacity-40>
          {{ rowIndex + 1 }}
        </span>
      </template>
      <template #result="{ record }">
        <a-typography-text>
          {{ $t(`account.loginResult.text.${record.result}`) }}
        </a-typography-text>
      </template>
      <template #bioResult="{ record }">
        <div class="flex items-center gap-2">
          <a-tag
            size="small"
            :color="$t(`account.loginResult.color.${record.bioResult}`)"
          >
            {{ $t(`account.loginResult.text.${record.bioResult}`) }}
          </a-tag>
          <a-typography-text type="secondary">
            匹配度：{{ (record.bioConfidence || 0).toFixed(2) }}%
          </a-typography-text>
        </div>
      </template>
      <template #mfaResult="{ record }">
        <a-tag
          size="small"
          :color="$t(`account.loginResult.color.${record.mfaResult}`)"
        >
          {{ $t(`account.loginResult.text.${record.mfaResult}`) }}
        </a-tag>
      </template>
      <template #sourceAgent="{ record }">
        <div class="flex items-center gap-2">
          <a-tag
            bordered
            :color="$t(`sourceAgent.color.${record.sourceAgent}`)"
            class="!w-42px !justify-center"
          >
            {{ $t(`sourceAgent.text.${record.sourceAgent}`) }}
          </a-tag>
          <div class="flex flex-col">
            <a-typography-text type="secondary" class="text">{{
              record.sourceIp
            }}</a-typography-text>
            <!-- <a-typography-text type="secondary" class="text-xs">{{
            record.sourceFp
          }}</a-typography-text> -->
          </div>
        </div>
      </template>
      <template #createdAt="{ record }">
        <div class="flex flex-col">
          <a-typography-text type="secondary" class="text-sm">
            {{ dayjs(record.createdAt).fromNow() }}
          </a-typography-text>
          <a-typography-text type="secondary" class="text-xs">
            {{ dayjs(record.createdAt).format('L LTS') }}
          </a-typography-text>
        </div>
      </template>
    </a-table>
  </a-card>
</template>
