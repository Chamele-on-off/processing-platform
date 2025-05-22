import React from 'react';
import { Form, Input, Select, Modal, message } from 'antd';
import traderApi from '../../services/traderApi';

const { Option } = Select;

const AddPaymentDetail = ({ visible, onCancel, onSuccess, traderId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await traderApi.addPaymentDetail(traderId, values);
      onSuccess();
      form.resetFields();
    } catch (err) {
      message.error('Ошибка при добавлении реквизита');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Добавить реквизит"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Добавить"
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="Тип реквизита"
          rules={[{ required: true, message: 'Выберите тип реквизита' }]}
        >
          <Select placeholder="Выберите тип">
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

export default AddPaymentDetail;
