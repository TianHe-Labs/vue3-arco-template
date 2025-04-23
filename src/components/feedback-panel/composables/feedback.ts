import { provide, inject, ref, Ref, shallowRef, reactive } from 'vue';
import { Message, type FormInstance } from '@arco-design/web-vue';
import axios from 'axios';

interface FeedbackModel {
  type: string;
  content: string;
}

interface FeedbackState {
  feedbackPanelVisible: Ref<boolean>;
  toggleFeedbackPanel: (visible?: boolean) => void;
  feedbackFormRef: Ref<FormInstance>;
  feedbackModel: FeedbackModel;
  handleSubmit: () => Promise<boolean>;
}

const symbol = Symbol('FEEDBACK');

export function provideFeedback(): FeedbackState {
  const feedbackPanelVisible = ref<boolean>(false);

  const toggleFeedbackPanel = (visible?: boolean) => {
    feedbackPanelVisible.value = visible ?? !feedbackPanelVisible.value;
  };

  // 表单绑定实例
  const feedbackFormRef = shallowRef<FormInstance>();

  // 表单绑定数据
  const feedbackModel = reactive({
    type: '',
    content: '',
  });

  const handleSubmit = async () => {
    const errors = await feedbackFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return false;
    }
    try {
      const resp = await axios.post('/api/feedback/create');
      if (resp.status >= 200 && resp.status < 300) {
        Message.success('反馈已提交');
      }
    } catch (err: any) {
      Message.error(err?.message);
    }
    // 不要主动关闭反馈窗口，有可能会反馈多个问题，用户可以不用重新打开窗口
    return false;
  };

  /* const beforeUpload = (file: File) => {
    console.log(file);
  }; */

  const returnState = {
    feedbackPanelVisible,
    toggleFeedbackPanel,
    feedbackFormRef,
    feedbackModel,
    handleSubmit,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useFeedback(): FeedbackState {
  return inject(symbol) as FeedbackState;
}
