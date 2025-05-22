import React, { useEffect } from 'react';
import { Form, Input, Select, Modal, message } from 'antd';
import traderApi from '../../services/traderApi';

const { Option } = Select;

const EditPaymentDetail = ({ detail, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (detail) {
      form.setFieldsValue({
        type: detail.type,
        paymentSystem: detail.paymentSystem,
        details: detail.details,
        maxAmount: detail.maxAmount,
        comment: detail.comment
      });
    }
  }, [detail, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await traderApi.updatePaymentDetail(detail.id, values);
      onSuccess();
    } catch (err) {
      message.error('Ошибка при обновлении реквизита');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Редактировать реквизит"
      visible={!!detail}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="Тип реквизита"
          rules={[{ required: true, message: 'Выберите тип реквизита' }]}
        >
          <Select placeholder="Выберите тип" disabled>
            <Option value="bank_account">Банковский счет</Option>
            <Option value="card">Банковская карта</Option>
            <Option value="ewallet">Электронный кошелек</Option>
            <Option value="crypto">Криптовалютный кошелек</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="paymentSystem"
          label="Платежная система"
          rules={[{ required: true, message: 'Укажите платежную систему' }]}
        >
          <Select placeholder="Выберите систему">
            <Option value="sberbank">Сбербанк</Option>
            <Option value="tinkoff">Тинькофф</Option>
            <Option value="qiwi">QIWI</Option>
            <Option value="yoomoney">ЮMoney</Option>
            <Option value="btc">Bitcoin</Option>
            <Option value="usdt">USDT</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="details"
          label="Реквизиты"
          rules={[{ required: true, message: 'Введите реквизиты' }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Номер счета/карты/кошелька и другие данные" 
          />
        </Form.Item>

        <Form.Item
          name="maxAmount"
          label="Максимальная сумма (необязательно)"
        >
          <Input type="number" placeholder="В рублях" />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Комментарий (необязательно)"
        >
          <Input.TextArea rows={2} placeholder="Примечание для себя" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPaymentDetail;
