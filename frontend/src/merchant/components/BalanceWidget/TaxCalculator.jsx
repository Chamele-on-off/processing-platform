import React, { useState } from 'react';
import { Card, InputNumber, Button, Typography, Alert } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const TaxCalculator = () => {
  const [amount, setAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(6); // 6% по умолчанию
  const [result, setResult] = useState(null);

  const calculateTax = () => {
    const taxAmount = (amount * taxRate) / 100;
    const netAmount = amount - taxAmount;
    setResult({ taxAmount, netAmount });
  };

  return (
    <Card
      title={
        <>
          <CalculatorOutlined /> Калькулятор налогов
        </>
      }
      className="tax-calculator"
    >
      <div className="calculator-inputs">
        <div className="input-group">
          <Text strong>Сумма:</Text>
          <InputNumber
            value={amount}
            onChange={setAmount}
            min={0}
            step={100}
            style={{ width: '100%' }}
            addonAfter="₽"
          />
        </div>

        <div className="input-group">
          <Text strong>Ставка налога:</Text>
          <InputNumber
            value={taxRate}
            onChange={setTaxRate}
            min={0}
            max={100}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            style={{ width: '100%' }}
          />
        </div>

        <Button 
          type="primary" 
          onClick={calculateTax}
          block
        >
          Рассчитать
        </Button>
      </div>

      {result && (
        <div className="calculator-results">
          <Alert
            message={
              <>
                <Text strong>Налог:</Text> {result.taxAmount.toFixed(2)} ₽<br />
                <Text strong>К получению:</Text> {result.netAmount.toFixed(2)} ₽
              </>
            }
            type="info"
            showIcon
          />
        </div>
      )}
    </Card>
  );
};
